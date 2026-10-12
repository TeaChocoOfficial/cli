// -Path: 'ui\src\stores\fileManagerStore.ts'
import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, AnyNode } from '../pages/workspace/fileManager/type';

interface ModalState {
    title: string;
    isOpen: boolean;
    type: 'input' | 'project';
    description?: string;
    onSubmit: (values: Record<string, string>) => void;
    fields: {
        key: string;
        label: string;
        placeholder?: string;
        defaultValue?: string;
    }[];
}

interface ContextMenuState {
    x: number;
    y: number;
    type: 'file' | 'folder' | 'project' | 'root';
    isOpen: boolean;
    targetId?: string;
    projectId?: string;
}

interface FileManagerState {
    projects: Project[];
    modal: ModalState;
    collapseTrigger: number;
    selectedFile: string | null;
    contextMenu: ContextMenuState;
    fetchFiles: () => Promise<void>;
    hideModal: () => void;
    removeProject: (id: string) => void;
    toggleSection: (id: string) => void;
    triggerCollapseAll: () => void;
    hideContextMenu: () => void;
    addProject: (name: string, path?: string) => Promise<void>;
    setSelectedFile: (file: string | null) => void;
    showModal: (options: Omit<ModalState, 'isOpen'>) => void;
    moveNode: (
        projectId: string,
        nodeId: string,
        targetFolderId: string | null,
    ) => Promise<void>;
    addFile: (
        projectId: string,
        name: string,
        parentId?: string,
    ) => Promise<void>;
    addFolder: (
        projectId: string,
        name: string,
        parentId?: string,
    ) => Promise<void>;
    deleteNode: (projectId: string, nodeId: string) => Promise<void>;
    renameNode: (
        projectId: string,
        nodeId: string,
        newName: string,
    ) => Promise<void>;
    toggleFolder: (projectId: string, nodeId: string, isOpen?: boolean) => void;
    showContextMenu: (
        x: number,
        y: number,
        type: ContextMenuState['type'],
        projectId?: string,
        targetId?: string,
    ) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

/** Helper to recursively find and remove a node */
const findAndRemoveNode = (
    nodes: AnyNode[],
    nodeId: string,
): { nodes: AnyNode[]; removedNode: AnyNode | null } => {
    let removedNode: AnyNode | null = null;
    const newNodes = nodes.reduce((acc: AnyNode[], node) => {
        if (node.id === nodeId) {
            removedNode = node;
            return acc;
        }
        if ('children' in node && node.children) {
            const result = findAndRemoveNode(node.children, nodeId);
            if (result.removedNode) {
                removedNode = result.removedNode;
                acc.push({ ...node, children: result.nodes } as AnyNode);
                return acc;
            }
        }
        acc.push(node);
        return acc;
    }, []);

    return { nodes: newNodes, removedNode };
};

/** Helper to recursively add a node to a folder */
const addNodeToFolder = (
    nodes: AnyNode[],
    targetFolderId: string | null,
    newNode: AnyNode,
): AnyNode[] => {
    if (!targetFolderId) return [...nodes, newNode];
    return nodes.map((node) => {
        if (node.id === targetFolderId && 'children' in node)
            return {
                ...node,
                children: [...(node.children || []), newNode],
            } as AnyNode;
        if ('children' in node && node.children)
            return {
                ...node,
                children: addNodeToFolder(
                    node.children,
                    targetFolderId,
                    newNode,
                ),
            } as AnyNode;
        return node;
    });
};

/** Helper to recursively toggle a folder's isOpen state */
const setFolderOpenState = (
    nodes: AnyNode[],
    nodeId: string,
    isOpen?: boolean,
): AnyNode[] => {
    return nodes.map((node) => {
        if (node.id === nodeId && 'children' in node)
            return {
                ...node,
                isOpen: isOpen !== undefined ? isOpen : !node.isOpen,
            } as AnyNode;
        if ('children' in node && node.children)
            return {
                ...node,
                children: setFolderOpenState(node.children, nodeId, isOpen),
            } as AnyNode;
        return node;
    });
};

/** Helper to recursively collapse all folders */
const collapseAllRecursive = (nodes: AnyNode[]): AnyNode[] => {
    return nodes.map((node) => {
        if ('children' in node) {
            return {
                ...node,
                isOpen: false,
                children: node.children
                    ? collapseAllRecursive(node.children)
                    : [],
            } as AnyNode;
        }
        return node;
    });
};

export const useFileManagerStore = create<FileManagerState>()(
    persist(
        (set, get) => ({
            projects: [],
            selectedFile: null,
            collapseTrigger: 0,
            modal: {
                title: '',
                fields: [],
                isOpen: false,
                type: 'input',
                onSubmit: () => {},
            },
            contextMenu: { x: 0, y: 0, isOpen: false, type: 'root' },
            setSelectedFile: (file) => set({ selectedFile: file }),
            showModal: (options) =>
                set({ modal: { ...options, isOpen: true } }),
            hideModal: () =>
                set((state) => ({ modal: { ...state.modal, isOpen: false } })),
            fetchFiles: async () => {
                const state = get();
                // If no projects, initialize with CWD
                if (state.projects.length === 0) {
                    try {
                        const { data } = await axios.get('/api/fs');
                        set({
                            projects: [
                                {
                                    id: 'default',
                                    name: 'Local Machine',
                                    isOpen: true,
                                    files: data,
                                    rootPath: '', // empty means CWD
                                },
                            ],
                        });
                    } catch (error) {
                        console.error('Failed to fetch files:', error);
                    }
                    return;
                }

                // Refresh all projects
                const updatedProjects = await Promise.all(
                    state.projects.map(async (project) => {
                        try {
                            const url = `/api/fs${project.rootPath ? `?path=${encodeURIComponent(project.rootPath)}` : ''}`;
                            const { data } = await axios.get(url);
                            return { ...project, files: data };
                        } catch (error) {
                            console.error(
                                `Failed to refresh project ${project.name}:`,
                                error,
                            );
                            return project;
                        }
                    }),
                );
                set({ projects: updatedProjects });
            },
            hideContextMenu: () =>
                set((state) => ({
                    contextMenu: { ...state.contextMenu, isOpen: false },
                })),
            triggerCollapseAll: () =>
                set((state) => ({
                    collapseTrigger: state.collapseTrigger + 1,
                    projects: state.projects.map((project) => ({
                        ...project,
                        files: collapseAllRecursive(project.files),
                    })),
                })),
            addProject: async (name, path = '') => {
                try {
                    const url = `/api/fs${path ? `?path=${encodeURIComponent(path)}` : ''}`;
                    const { data } = await axios.get(url);
                    set((state) => ({
                        projects: [
                            ...state.projects,
                            {
                                id: generateId(),
                                name,
                                rootPath: path,
                                isOpen: true,
                                files: data,
                            },
                        ],
                    }));
                } catch (error) {
                    console.error('Failed to add project:', error);
                }
            },
            removeProject: (id) =>
                set((state) => ({
                    projects: state.projects.filter(
                        (project) => project.id !== id,
                    ),
                })),
            toggleSection: (id) =>
                set((state) => ({
                    projects: state.projects.map((project) =>
                        project.id === id
                            ? { ...project, isOpen: !project.isOpen }
                            : project,
                    ),
                })),
            toggleFolder: (projectId, nodeId, isOpen) =>
                set((state) => ({
                    projects: state.projects.map((project) =>
                        project.id === projectId
                            ? {
                                  ...project,
                                  files: setFolderOpenState(
                                      project.files,
                                      nodeId,
                                      isOpen,
                                  ),
                              }
                            : project,
                    ),
                })),
            addFile: async (projectId, name, parentId) => {
                try {
                    await axios.post('/api/create-file', {
                        name,
                        parentPath: parentId,
                    });
                    const fetchFiles = get().fetchFiles;
                    await fetchFiles();
                } catch (error) {
                    console.error('Failed to create file:', error);
                }
            },
            addFolder: async (projectId, name, parentId) => {
                try {
                    await axios.post('/api/create-folder', {
                        name,
                        parentPath: parentId,
                    });
                    const fetchFiles = get().fetchFiles;
                    await fetchFiles();
                } catch (error) {
                    console.error('Failed to create folder:', error);
                }
            },
            moveNode: async (projectId, nodeId, targetFolderId) => {
                try {
                    await axios.post('/api/move', { nodeId, targetFolderId });
                    const fetchFiles = get().fetchFiles;
                    await fetchFiles();
                } catch (error) {
                    console.error('Failed to move node:', error);
                }
            },
            deleteNode: async (projectId, nodeId) => {
                try {
                    await axios.post('/api/delete', { nodeId });
                    const fetchFiles = get().fetchFiles;
                    await fetchFiles();
                } catch (error) {
                    console.error('Failed to delete node:', error);
                }
            },
            renameNode: async (projectId, nodeId, newName) => {
                try {
                    await axios.post('/api/rename', { nodeId, newName });
                    const fetchFiles = get().fetchFiles;
                    await fetchFiles();
                } catch (error) {
                    console.error('Failed to rename node:', error);
                }
            },
            showContextMenu: (x, y, type, projectId, targetId) =>
                set({
                    contextMenu: {
                        x,
                        y,
                        type,
                        isOpen: true,
                        projectId,
                        targetId,
                    },
                }),
        }),
        {
            name: 'file-manager',
            partialize: (state) => ({
                selectedFile: state.selectedFile,
                collapseTrigger: state.collapseTrigger,
                projects: state.projects.map((project) => ({
                    id: project.id,
                    name: project.name,
                    isOpen: project.isOpen,
                    rootPath: project.rootPath,
                    files: [], // Don't persist files
                })),
            }),
        },
    ),
);
