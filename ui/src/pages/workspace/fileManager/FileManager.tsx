// -Path: 'ui\src\pages\workspace\fileManager\FileManager.tsx'
import {
    VscAdd,
    VscNewFile,
    VscRefresh,
    VscEllipsis,
    VscNewFolder,
    VscCollapseAll,
    VscChevronDown,
    VscChevronRight,
} from 'react-icons/vsc';
import { useEffect } from 'react';
import InputModal from './components/InputModal';
import ContextMenu from './components/ContextMenu';
import FileTreeNode from './components/FileTreeNode';
import ToolbarButton from './components/ToolbarButton';
import { AnimatePresence, motion } from 'framer-motion';
import { useFileManagerStore } from '../../../stores/fileManagerStore';

/** File Explorer หลัก */
export default function FileManager() {
    const {
        addFile,
        moveNode,
        projects,
        addFolder,
        showModal,
        addProject,
        fetchFiles,
        selectedFile,
        toggleSection,
        setSelectedFile,
        collapseTrigger,
        showContextMenu,
        triggerCollapseAll,
    } = useFileManagerStore();

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const handleAddProject = () => {
        showModal({
            title: 'Add New Project',
            type: 'project',
            fields: [
                {
                    key: 'name',
                    label: 'Project Name',
                    placeholder: 'My Awesome Project',
                },
                {
                    key: 'path',
                    label: 'Root Path (Absolute)',
                    placeholder: 'C:\\path\\to\\project',
                },
            ],
            onSubmit: (values) => {
                if (values.name) addProject(values.name, values.path || '');
            },
        });
    };

    const handleAddFile = (projectId: string) => {
        const name = prompt('File Name:');
        if (name) addFile(projectId, name);
    };

    const handleAddFolder = (projectId: string) => {
        const name = prompt('Folder Name:');
        if (name) addFolder(projectId, name);
    };

    const handleDropToRoot = (event: React.DragEvent, projectId: string) => {
        event.preventDefault();
        const nodeId = event.dataTransfer.getData('nodeId');
        const draggedProjectId = event.dataTransfer.getData('projectId');
        if (draggedProjectId === projectId) moveNode(projectId, nodeId, null);
    };

    const handleProjectContextMenu = (
        event: React.MouseEvent,
        projectId: string,
    ) => {
        event.preventDefault();
        event.stopPropagation();
        showContextMenu(event.clientX, event.clientY, 'project', projectId);
    };

    const handleRootContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        showContextMenu(event.clientX, event.clientY, 'root');
    };

    return (
        <div
            onContextMenu={handleRootContextMenu}
            className="flex h-full w-full flex-col overflow-hidden bg-surface font-sans text-surface-foreground"
        >
            {/* Header: EXPLORER */}
            <div className="flex shrink-0 items-center justify-between border-b border-border px-3 py-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral">
                    Explorer
                </span>
                <div className="flex items-center gap-1">
                    <ToolbarButton
                        icon={<VscAdd />}
                        title="Add Project"
                        onClick={handleAddProject}
                    />
                    <ToolbarButton
                        icon={<VscEllipsis />}
                        title="More Actions"
                    />
                </div>
            </div>

            {/* Sections: Projects */}
            <div className="flex-1 overflow-y-auto">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        onDrop={(event) => handleDropToRoot(event, project.id)}
                        onDragOver={(event) => event.preventDefault()}
                        className="border-b border-border/30"
                    >
                        {/* Section header */}
                        <button
                            onClick={() => toggleSection(project.id)}
                            onContextMenu={(event) =>
                                handleProjectContextMenu(event, project.id)
                            }
                            className="group flex w-full cursor-pointer items-center gap-1 bg-surface-elevated px-2 py-1.25 text-left text-[11px] font-bold uppercase tracking-wider text-surface-foreground"
                        >
                            <span className="text-[10px]">
                                {project.isOpen ? (
                                    <VscChevronDown />
                                ) : (
                                    <VscChevronRight />
                                )}
                            </span>
                            <span className="flex-1 select-none truncate">
                                {project.name}
                            </span>

                            {/* Toolbar icons (visible on hover) */}
                            <span
                                onClick={(event) => event.stopPropagation()}
                                className="flex gap-0.5 opacity-0 transition-opacity overflow-hidden w-0 group-hover:w-auto group-hover:opacity-100"
                            >
                                <ToolbarButton
                                    icon={<VscNewFile />}
                                    title="New File"
                                    onClick={() => handleAddFile(project.id)}
                                />
                                <ToolbarButton
                                    icon={<VscNewFolder />}
                                    title="New Folder"
                                    onClick={() => handleAddFolder(project.id)}
                                />
                                <ToolbarButton
                                    icon={<VscRefresh />}
                                    title="Refresh"
                                />
                                <ToolbarButton
                                    icon={<VscCollapseAll />}
                                    title="Collapse All"
                                    onClick={triggerCollapseAll}
                                />
                            </span>
                        </button>

                        <AnimatePresence initial={false}>
                            {project.isOpen && (
                                <motion.div
                                    key={`tree-${project.id}`}
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    transition={{
                                        duration: 0.15,
                                        ease: 'easeInOut',
                                    }}
                                    className="overflow-hidden py-0.5"
                                >
                                    {project.files
                                        .sort((a, b) => {
                                            // โฟลเดอร์มาก่อนไฟล์เสมอ
                                            if (a.isFolder && !b.isFolder)
                                                return -1;
                                            if (!a.isFolder && b.isFolder)
                                                return 1;
                                            // ถ้าเป็นประเภทเดียวกัน เรียงตามชื่อ
                                            return a.name.localeCompare(b.name);
                                        })
                                        .map((node) => (
                                            <FileTreeNode
                                                key={node.id}
                                                node={node}
                                                projectId={project.id}
                                                selectedFile={selectedFile}
                                                onSelectFile={setSelectedFile}
                                                collapseTrigger={
                                                    collapseTrigger
                                                }
                                            />
                                        ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
            <ContextMenu />
            <InputModal />
        </div>
    );
}
