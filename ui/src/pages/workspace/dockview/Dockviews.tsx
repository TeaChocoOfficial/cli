// -Path: 'ui\src\pages\workspace\dockview\Dockviews.tsx'
import {
    DockviewApi,
    DockviewReact,
    DockviewReadyEvent,
    IDockviewPanelProps,
} from 'dockview-react';
import Editor from '../editor/Editor';
import Sidebar from '../sidebar/Sidebar';
import { dockviewThemes } from './theme';
import 'dockview/dist/styles/dockview.css';
import Setting from '../../setting/Settings';
import { useDockviewApiStore } from '../../../stores/dockviewApiStore';
import { useDockviewThemeStore } from '../../../stores/dockviewThemeStore';

export type DockComponentKey = 'editor' | 'settings' | 'sidebar';

export default function Dockviews() {
    const { setApi } = useDockviewApiStore();
    const { theme } = useDockviewThemeStore();

    const onReady = (event: DockviewReadyEvent) => {
        setApi(event.api);

        event.api.addPanel({
            id: 'editor_1',
            title: '✏️ Editor',
            component: 'editor',
            params: {
                title: 'World',
            },
        });

        event.api.addPanel({
            id: 'sidebar_1',
            title: '',
            component: 'sidebar',
            position: {
                direction: 'left',
            },
            initialWidth: 300,
        });
    };

    const components: Record<
        DockComponentKey,
        React.FunctionComponent<IDockviewPanelProps>
    > = {
        sidebar: () => {
            return (
                <div className="flex flex-col h-full w-full overflow-y-auto">
                    <Sidebar />
                </div>
            );
        },
        settings: () => {
            return (
                <div className="p-4 flex flex-col h-full w-full overflow-y-auto">
                    <Setting />
                </div>
            );
        },
        editor: (props) => {
            return (
                <Editor
                    editorId={props.api.id}
                    data={{ blocks: [] }}
                    onChange={(data) => {
                        console.log('Editor changed:', data);
                    }}
                />
            );
        },
    };

    return (
        <div className="flex h-full w-full">
            <div className="flex-1">
                <DockviewReact
                    onReady={onReady}
                    components={components}
                    theme={dockviewThemes[theme]}
                />
            </div>
        </div>
    );
}
