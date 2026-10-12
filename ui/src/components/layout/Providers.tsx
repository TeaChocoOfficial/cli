// -Path: 'ui\src\components\layout\Providers.tsx'
import '../../i18n/i18n';
import Setup from './Setup';

export default function Providers({ children }: { children: React.ReactNode }) {
    return <Setup>{children}</Setup>;
}
