// -Path: 'ui\src\components\layout\Setup.tsx'
import { useLayoutEffect } from 'react';
import { useThemeStore } from '../../stores/themeStore';

export default function Setup({ children }: { children: React.ReactNode }) {
    const { theme } = useThemeStore();

    useLayoutEffect(() => {
        const html = window.document.documentElement;
        if (theme === 'dark') html.classList.add('dark');
        else html.classList.remove('dark');
    }, [theme]);

    return <>{children}</>;
}
