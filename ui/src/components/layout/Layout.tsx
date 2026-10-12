// -Path: 'ui\src\components\layout\Layout.tsx'
import Footer from './Footer';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import { ErrorBoundaryProvider } from '../custom/ErrorBound';

export default function Layout() {
    return (
        <div className="relative flex flex-col min-h-dvh overflow-auto">
            <ErrorBoundaryProvider />
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
