// -Path: 'ui\src\pages\workspace\fileManager\components\FileTreeNode.tsx'
import { useState } from 'react';
import { AnyNode } from '../type';
import { getFileIcon } from '../getFileIcon';
import { AnimatePresence, motion } from 'framer-motion';
import { useFileManagerStore } from '../../../../stores/fileManagerStore';

import {
    VscFolder,
    VscChevronDown,
    VscChevronRight,
    VscFolderOpened,
} from 'react-icons/vsc';

interface FileTreeNodeProps {
    node: AnyNode;
    level?: number;
    projectId: string;
    selectedFile: string | null;
    collapseTrigger: number;
    onSelectFile: (name: string) => void;
}

export default function FileTreeNode({
    node,
    projectId,
    level = 0,
    selectedFile,
    onSelectFile,
    collapseTrigger,
}: FileTreeNodeProps) {
    const { moveNode, toggleFolder, showContextMenu } = useFileManagerStore();
    const [isOver, setIsOver] = useState(false);
    const isOpen = (node.isFolder ? node.isOpen : false) ?? level < 1;
    const isSelected = !node.isFolder && selectedFile === node.name;

    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (node.isFolder) toggleFolder(projectId, node.id);
        else onSelectFile(node.name);
    };

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        showContextMenu(
            event.clientX,
            event.clientY,
            node.isFolder ? 'folder' : 'file',
            projectId,
            node.id,
        );
    };

    const handleDragStart = (event: React.DragEvent) => {
        event.dataTransfer.setData('nodeId', node.id);
        event.dataTransfer.setData('projectId', projectId);
    };

    const handleDragOver = (event: React.DragEvent) => {
        if (node.isFolder) {
            event.preventDefault();
            setIsOver(true);
        }
    };

    const handleDrop = (event: React.DragEvent) => {
        if (node.isFolder) {
            event.preventDefault();
            event.stopPropagation();
            setIsOver(false);
            const nodeId = event.dataTransfer.getData('nodeId');
            const draggedProjectId = event.dataTransfer.getData('projectId');
            if (draggedProjectId === projectId && nodeId !== node.id)
                moveNode(projectId, nodeId, node.id);
        }
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={() => setIsOver(false)}
        >
            {/* Row */}
            <div
                draggable
                onClick={handleClick}
                onDragStart={handleDragStart}
                onContextMenu={handleContextMenu}
                className={[
                    'group relative flex cursor-pointer items-center gap-1 py-0.75 pr-2 text-[13px] leading-5.5',
                    'transition-colors duration-100',
                    isSelected
                        ? 'bg-primary/15 text-primary-emphasis'
                        : isOver
                          ? 'bg-primary/10'
                          : 'text-surface-foreground/80 hover:bg-surface-overlay',
                ].join(' ')}
                style={{ paddingLeft: `${level * 16 + 8}px` }}
            >
                {/* Indent guides */}
                {Array.from({ length: level }).map((_, index) => (
                    <span
                        key={index}
                        className="absolute top-0 bottom-0 w-px bg-border/50"
                        style={{ left: `${index * 16 + 16}px` }}
                    />
                ))}

                {/* Chevron */}
                <span className="flex w-4 shrink-0 items-center justify-center text-[10px] text-neutral">
                    {node.isFolder ? (
                        isOpen ? (
                            <VscChevronDown />
                        ) : (
                            <VscChevronRight />
                        )
                    ) : null}
                </span>

                {/* Icon */}
                <span className="flex shrink-0 items-center text-base">
                    {node.isFolder ? (
                        isOpen ? (
                            <VscFolderOpened className="text-[#dcb67a]" />
                        ) : (
                            <VscFolder className="text-[#dcb67a]" />
                        )
                    ) : (
                        getFileIcon(node.name)
                    )}
                </span>

                {/* Name */}
                <span className="min-w-0 flex-1 select-none truncate">
                    {node.name}
                </span>

                {/* Active indicator */}
                {isSelected && (
                    <span className="absolute top-0 bottom-0 left-0 w-0.5 bg-primary" />
                )}
            </div>

            {/* Children */}
            <AnimatePresence initial={false}>
                {node.isFolder && isOpen && node.children && (
                    <motion.div
                        key={`children-${node.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        {node.children.map((child) => (
                            <FileTreeNode
                                key={child.id}
                                node={child}
                                projectId={projectId}
                                level={level + 1}
                                selectedFile={selectedFile}
                                onSelectFile={onSelectFile}
                                collapseTrigger={collapseTrigger}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
