// -Path: 'ui\src\pages\workspace\fileManager\components\ToolbarButton.tsx'

interface ToolbarButtonProps {
    icon: React.ReactNode;
    title: string;
    onClick?: () => void;
}

export default function ToolbarButton({
    icon,
    title,
    onClick,
}: ToolbarButtonProps) {
    return (
        <button
            title={title}
            onClick={onClick}
            className="flex size-5.5 cursor-pointer items-center justify-center rounded-sm text-neutral opacity-70 transition-all hover:bg-surface-overlay hover:opacity-100"
        >
            {icon}
        </button>
    );
}
