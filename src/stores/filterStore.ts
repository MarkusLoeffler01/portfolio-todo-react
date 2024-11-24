import { create } from "zustand";

interface FilterState {
    searchQuery: string;
    priorityFilter: ("low" | "medium" | "high" | null)[];
    dateRange: {start: Date | null, end: Date | null};
    setSearchQuery: (query: string) => void;
    setPriorityFilter: (priority: ("low" | "medium" | "high" | null)[]) => void;
    setDateRange: (range: {start: Date | null, end: Date | null}) => void;
};


export const useFilterStore = create<FilterState>((set) => ({
    searchQuery: '',
    priorityFilter: [],
    dateRange: { start: null, end: null },
    showCompleted: true,
    setSearchQuery: (query) => set({ searchQuery: query }),
    setPriorityFilter: (priorities) => set({ priorityFilter: priorities }),
    setDateRange: (range) => set({ dateRange: range })
  }));