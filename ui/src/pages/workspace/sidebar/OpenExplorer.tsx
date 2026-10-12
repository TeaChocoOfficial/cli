// -Path: 'ui\src\pages\workspace\sidebar\OpenExplorer.tsx'
import axios from 'axios';
import { VscFolderOpened } from 'react-icons/vsc';

export default function OpenExplorer() {
    const path = 'C:\\dev\\test';

    const handleOpenExplorer = async () => {
        try {
            const { data } = await axios.get(`/api/open-explore?path=${path}`);

            if (data.success) {
                console.log(' File Explorer opened successfully');
            } else {
                console.error(' Failed to open File Explorer:', data.error);
            }
        } catch (error) {
            console.error(' Error opening File Explorer:', error);
        }
    };

    return (
        <button
            onClick={handleOpenExplorer}
            className="flex items-center gap-2 px-3 py-2 text-sm text-surface-foreground hover:bg-surface-overlay rounded-lg transition-colors"
            title="เปิด Explorer"
        >
            <VscFolderOpened className="text-base" />
            <span>เปิด Explorer</span>
        </button>
    );
}
