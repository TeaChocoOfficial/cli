// -Path: 'ui\src\stores\dockviewThemeStore.ts'
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DockviewThemeKeys } from '../pages/workspace/dockview/theme';

interface DockviewThemeState {
    theme: DockviewThemeKeys;
    setTheme: (theme: DockviewThemeKeys) => void;
}

export const useDockviewThemeStore = create<DockviewThemeState>()(
    persist(
        (set) => ({
            theme: 'VisualStudio',
            setTheme: (theme: DockviewThemeKeys) => {
                if (typeof document !== 'undefined')
                    document.cookie = `dockview-theme=${theme};path=/;max-age=31536000`;
                set({ theme });
            },
        }),
        { name: 'dockview-theme' },
    ),
);
