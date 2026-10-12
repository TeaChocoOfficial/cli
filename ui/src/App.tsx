// -Path: 'ui\src\App.tsx'
import HomePage from './pages/home/HomePage';
import Layout from './components/layout/Layout';
import NotfoundPage from './pages/NotfoundPage';
import SettingPage from './pages/setting/SettingPage';
import DevLayout from './components/layout/dev/DevLayout';
import { Route, Routes, Navigate } from 'react-router-dom';
import WorkspacePage from './pages/workspace/WorkspacePage';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="home" element={<HomePage />} />
                <Route path="setting" element={<SettingPage />} />
                <Route path="*" element={<NotfoundPage />} />
            </Route>
            <Route path="dev" element={<DevLayout />}>
                <Route path="workspace" element={<WorkspacePage />} />
                <Route index element={<Navigate to="workspace" replace />} />
                <Route path="*" element={<Navigate to="workspace" replace />} />
            </Route>
        </Routes>
    );
}
