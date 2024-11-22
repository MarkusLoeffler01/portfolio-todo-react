// src/stores/sidePanelStore.ts
import { create } from 'zustand';
import type ToDo from '@type/todo';

type PanelType = 'edit' | 'tags' | 'settings' | null;

interface SidePanelState {
  activeRightPanel: PanelType;
  activeLeftPanel: PanelType;
  currentTodo: ToDo | null;
  setRightPanel: (panel: PanelType, todo?: ToDo | null) => void;
  setLeftPanel: (panel: PanelType) => void;
  closeRightPanel: () => void;
  closeLeftPanel: () => void;
}

const useSidePanelStore = create<SidePanelState>((set) => ({
  activeRightPanel: null,
  activeLeftPanel: null,
  currentTodo: null,
  setRightPanel: (panel, todo = null) => set({ 
    activeRightPanel: panel,
    currentTodo: todo 
  }),
  setLeftPanel: (panel) => set({ activeLeftPanel: panel }),
  closeRightPanel: () => set({ activeRightPanel: null, currentTodo: null }),
  closeLeftPanel: () => set({ activeLeftPanel: null })
}));

export default useSidePanelStore;