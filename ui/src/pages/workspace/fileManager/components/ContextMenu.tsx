// -Path: 'ui\src\pages\workspace\fileManager\components\ContextMenu.tsx'
import { motion, AnimatePresence } from 'framer-motion';
import { useFileManagerStore } from '../../../../stores/fileManagerStore';
import { VscEdit, VscTrash, VscNewFile, VscNewFolder } from 'react-icons/vsc';

export default function ContextMenu() {
    const {
        addFile,
        addFolder,
        showModal,
        deleteNode,
        renameNode,
        contextMenu,
        removeProject,
        hideContextMenu,
    } = useFileManagerStore();

    if (!contextMenu.isOpen) return null;

    const handleAction = (action: () => void) => {
        action();
        hideContextMenu();
    };

    const menuItems = [
        ...(contextMenu.type === 'folder' ||
        contextMenu.type === 'project' ||
        contextMenu.type === 'root'
            ? [
                  {
                      label: 'New File',
                      icon: <VscNewFile />,
                      onClick: () => {
                          showModal({
                              title: 'Create New File',
                              type: 'input',
                              fields: [
                                  {
                                      key: 'name',
                                      label: 'File Name',
                                      placeholder: 'index.ts',
                                  },
                              ],
                              onSubmit: (values) => {
                                  if (values.name && contextMenu.projectId)
                                      addFile(
                                          contextMenu.projectId,
                                          values.name,
                                          contextMenu.targetId,
                                      );
                              },
                          });
                      },
                  },
                  {
                      label: 'New Folder',
                      icon: <VscNewFolder />,
                      onClick: () => {
                          showModal({
                              title: 'Create New Folder',
                              type: 'input',
                              fields: [
                                  {
                                      key: 'name',
                                      label: 'Folder Name',
                                      placeholder: 'components',
                                  },
                              ],
                              onSubmit: (values) => {
                                  if (values.name && contextMenu.projectId)
                                      addFolder(
                                          contextMenu.projectId,
                                          values.name,
                                          contextMenu.targetId,
                                      );
                              },
                          });
                      },
                  },
              ]
            : []),
        {
            label: 'Rename',
            icon: <VscEdit />,
            onClick: () => {
                showModal({
                    title: 'Rename',
                    type: 'input',
                    fields: [
                        {
                            key: 'name',
                            label: 'New Name',
                            placeholder: 'Enter new name',
                        },
                    ],
                    onSubmit: (values) => {
                        if (
                            values.name &&
                            contextMenu.projectId &&
                            contextMenu.targetId
                        )
                            renameNode(
                                contextMenu.projectId,
                                contextMenu.targetId,
                                values.name,
                            );
                    },
                });
            },
        },
        ...(contextMenu.type === 'project'
            ? [
                  {
                      label: 'Remove Project',
                      icon: <VscTrash />,
                      onClick: () => {
                          if (contextMenu.projectId)
                              removeProject(contextMenu.projectId);
                      },
                  },
              ]
            : []),
        {
            label: 'Delete',
            icon: <VscTrash />,
            className: 'text-error',
            onClick: () => {
                showModal({
                    title: 'Confirm Delete',
                    description:
                        'Are you sure you want to delete this? This action cannot be undone.',
                    type: 'input',
                    fields: [], // No fields for confirmation
                    onSubmit: () => {
                        if (contextMenu.projectId && contextMenu.targetId)
                            deleteNode(
                                contextMenu.projectId,
                                contextMenu.targetId,
                            );
                    },
                });
            },
        },
    ];

    return (
        <>
            <div
                className="fixed inset-0 z-50"
                onClick={hideContextMenu}
                onContextMenu={(event) => {
                    event.preventDefault();
                    hideContextMenu();
                }}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed z-50 min-w-40 overflow-hidden rounded-md border border-border bg-surface-elevated py-1 shadow-xl"
                style={{ left: contextMenu.x, top: contextMenu.y }}
            >
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => handleAction(item.onClick)}
                        className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] hover:bg-primary/10 hover:text-primary-emphasis ${item.className || 'text-surface-foreground/90'}`}
                    >
                        <span className="text-base">{item.icon}</span>
                        <span className="flex-1">{item.label}</span>
                    </button>
                ))}
            </motion.div>
        </>
    );
}
