import { create } from 'zustand';

interface SettingsPanelState {
  isOpen: boolean;
  togglePanel: () => void;
}

export const useSettingsPanelStore = create<SettingsPanelState>((set) => ({
  isOpen: false,
  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
}));