import { create } from 'zustand';

// Since this store now handles more than filters, in a larger app
// you might rename it to useAppStore.js, but for now this is fine.
const useFilterStore = create((set) => ({
  // Filter State
  searchTerm: '',
  assigneeFilter: '',
  priorityFilter: '',
  statusFilter: '',
  viewMode: 'board',

  // Tour State
  isTourOpen: false,

  // Actions
  setSearchTerm: (term) => set({ searchTerm: term }),
  setAssigneeFilter: (uid) => set({ assigneeFilter: uid }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setTourOpen: (isOpen) => set({ isTourOpen: isOpen }),
  
  clearFilters: () => set({ 
    searchTerm: '', 
    assigneeFilter: '',
    priorityFilter: '', 
    statusFilter: '' 
  }),
}));

export default useFilterStore;