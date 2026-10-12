// -Path: 'ui\src\components\layout\dev\DevLayout.tsx'
import DevNav from './DevNav';
import { Outlet } from 'react-router-dom';
import { ErrorBoundaryProvider } from '../../custom/ErrorBound';

export default function DevLayout() {
    return (
        <div className="flex flex-col min-h-dvh overflow-auto">
            <ErrorBoundaryProvider />
            <DevNav />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}
