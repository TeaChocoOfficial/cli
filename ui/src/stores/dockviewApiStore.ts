// -Path: 'ui\src\stores\dockviewApiStore.ts'
import { create } from 'zustand';
import { DockviewApi } from 'dockview-react';

interface DockviewApiState {
    api: DockviewApi | null;
    setApi: (api: DockviewApi | null) => void;
}

export const useDockviewApiStore = create<DockviewApiState>()((set) => ({
    api: null,
    setApi: (api: DockviewApi | null) => set({ api }),
}));
