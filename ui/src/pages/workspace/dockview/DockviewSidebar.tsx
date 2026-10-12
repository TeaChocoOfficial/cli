// -Path: 'ui\src\pages\workspace\dockview\DockviewSidebar.tsx'
import { MutableRefObject } from 'react';
import { DockviewApi } from 'dockview-react';

interface DockviewSidebarProps {
    api: MutableRefObject<DockviewApi | null>;
}

export default function DockviewSidebar({ api }: DockviewSidebarProps) {
    const addEditor = () => {
        if (!api.current) return;

        const id = `editor_${Date.now()}`;
        api.current.addPanel({
            id,
            title: '✏️ New Editor',
            component: 'editor',
            params: {
                title: 'New File',
            },
        });
    };

    const addSettings = () => {
        if (!api.current) return;

        const id = `settings_${Date.now()}`;
        api.current.addPanel({
            id,
            title: '⚙️ Settings',
            component: 'settings',
            position: {
                direction: 'right',
            },
        });
    };

    const splitEditorDown = () => {
        if (!api.current) return;

        const id = `editor_${Date.now()}`;
        api.current.addPanel({
            id,
            title: '✏️ Split Editor',
            component: 'editor',
            position: {
                direction: 'below',
            },
        });
    };

    const splitEditorRight = () => {
        if (!api.current) return;

        const id = `editor_${Date.now()}`;
        api.current.addPanel({
            id,
            title: '✏️ Split Right',
            component: 'editor',
            position: {
                direction: 'right',
            },
        });
    };

    const resetLayout = () => {
        if (!api.current) return;

        // ✅ เคลียร์ panels ทั้งหมด
        api.current.clear();

        // ✅ สร้าง layout เริ่มต้นใหม่
        api.current.addPanel({
            id: 'editor_1',
            title: '✏️ Editor',
            component: 'editor',
            params: {
                title: 'Welcome',
            },
        });
    };

    const closeAllPanels = () => {
        if (!api.current) return;
        api.current.clear();
    };

    return (
        <div
            className="sidebar-container"
            style={{
                width: '250px',
                minWidth: '250px',
                height: '100%',
                backgroundColor: '#1e1e1e',
                borderRight: '1px solid #333',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            {/* Sidebar Header */}
            <div
                style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #333',
                    backgroundColor: '#252526',
                }}
            >
                <h3
                    style={{
                        color: '#ccc',
                        fontSize: '14px',
                        fontWeight: '600',
                        margin: 0,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    }}
                >
                    📁 Workspace
                </h3>
            </div>

            {/* Action Buttons */}
            <div
                style={{
                    flex: 1,
                    overflow: 'auto',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                }}
            >
                <Section title="Add Panels">
                    <SidebarButton
                        onClick={addEditor}
                        icon="📝"
                        label="New Editor"
                        color="#4ec9b0"
                    />
                    <SidebarButton
                        onClick={addSettings}
                        icon="⚙️"
                        label="Settings"
                        color="#dcdcaa"
                    />
                </Section>

                <Section title="Split Layout">
                    <SidebarButton
                        onClick={splitEditorDown}
                        icon="⬇️"
                        label="Split Down"
                        color="#569cd6"
                    />
                    <SidebarButton
                        onClick={splitEditorRight}
                        icon="➡️"
                        label="Split Right"
                        color="#569cd6"
                    />
                </Section>

                <Section title="Layout">
                    <SidebarButton
                        onClick={resetLayout}
                        icon="🔄"
                        label="Reset Layout"
                        color="#c586c0"
                    />
                    <SidebarButton
                        onClick={closeAllPanels}
                        icon="🗑️"
                        label="Close All"
                        color="#f44747"
                    />
                </Section>

                {/* Panel List */}
                <Section title="Active Panels">
                    <PanelList api={api} />
                </Section>
            </div>

            {/* Sidebar Footer */}
            <div
                style={{
                    padding: '8px 16px',
                    borderTop: '1px solid #333',
                    backgroundColor: '#252526',
                    color: '#999',
                    fontSize: '11px',
                }}
            >
                Total Panels: {api.current?.panels.length ?? 0}
            </div>
        </div>
    );
}

// ✅ Sub-components
function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div style={{ marginBottom: '16px' }}>
            <h4
                style={{
                    color: '#999',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                    paddingLeft: '4px',
                }}
            >
                {title}
            </h4>
            <div
                style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
                {children}
            </div>
        </div>
    );
}

function SidebarButton({
    onClick,
    icon,
    label,
    color,
}: {
    onClick: () => void;
    icon: string;
    label: string;
    color: string;
}) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '4px',
                color: '#ccc',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'background-color 0.2s',
                textAlign: 'left',
                width: '100%',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2a2d2e';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
            }}
        >
            <span style={{ fontSize: '14px' }}>{icon}</span>
            <span style={{ color }}>{label}</span>
        </button>
    );
}

function PanelList({ api }: { api: MutableRefObject<DockviewApi | null> }) {
    const panels = api.current?.panels ?? [];

    if (panels.length === 0) {
        return (
            <div style={{ color: '#666', fontSize: '12px', padding: '4px' }}>
                No panels active
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {panels.map((panel) => (
                <div
                    key={panel.id}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '4px 8px',
                        fontSize: '12px',
                        color: '#ccc',
                        borderRadius: '3px',
                        cursor: 'pointer',
                    }}
                    onClick={() => panel.api?.setActive()}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#2a2d2e';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                >
                    <span
                        style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1,
                        }}
                    >
                        {panel.title || panel.id}
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            panel.api.close();
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#999',
                            cursor: 'pointer',
                            fontSize: '14px',
                            padding: '0 4px',
                        }}
                        title="Close panel"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}
