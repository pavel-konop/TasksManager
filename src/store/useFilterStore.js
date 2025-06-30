import { create } from 'zustand';

const useFilterStore = create((set) => ({
  // State
  searchTerm: '',
  assigneeFilter: '',
  priorityFilter: '', // Add priority state
  statusFilter: '',

  // Actions
  setSearchTerm: (term) => set({ searchTerm: term }),
  setAssigneeFilter: (uid) => set({ assigneeFilter: uid }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }), // Add priority action
  setStatusFilter: (status) => set({ statusFilter: status }),
  
  clearFilters: () => set({ 
    searchTerm: '', 
    assigneeFilter: '',
    priorityFilter: '', 
    statusFilter: '' 
  }),
}));

export default useFilterStore;