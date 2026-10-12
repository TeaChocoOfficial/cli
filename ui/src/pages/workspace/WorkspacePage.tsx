// -Path: 'ui\src\pages\workspace\WorkspacePage.tsx'
import Dockviews from './dockview/Dockviews';

export default function WorkspacePage() {
    return (
        <div className="flex flex-col h-[calc(100dvh-2.5rem)] w-full">
            <Dockviews />
        </div>
    );
}
