// -Path: 'ui\src\pages\workspace\sidebar\Sidebar.tsx'

import FileManager from '../fileManager/FileManager';

export default function Sidebar() {
    return (
        <div className="flex flex-col h-full w-full">
            <FileManager />
        </div>
    );
}
