// -Path: 'ui\src\stores\themeStore.ts'
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'dark' | 'light';

interface ThemeState {
    theme: ThemeMode;
    toggleTheme: () => void;
    setTheme: (theme: ThemeMode) => void;
}

const getMediaTheme = (): ThemeMode => {
    if (typeof window !== 'undefined')
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    return 'dark';
};

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: getMediaTheme(),
            toggleTheme: () =>
                set((state) => {
                    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
                    if (typeof document !== 'undefined')
                        document.cookie = `theme=${newTheme};path=/;max-age=31536000`;
                    return { theme: newTheme };
                }),
            setTheme: (theme: ThemeMode) => {
                if (typeof document !== 'undefined')
                    document.cookie = `theme=${theme};path=/;max-age=31536000`;
                set({ theme });
            },
        }),
        { name: 'theme' },
    ),
);
