import { create } from 'zustand';

const useFilterStore = create((set) => ({
  searchTerm: '',
  assigneeFilter: '',
  priorityFilter: '',
  statusFilter: '',
  viewMode: 'board', // 'board' or 'list'

  setSearchTerm: (term) => set({ searchTerm: term }),
  setAssigneeFilter: (uid) => set({ assigneeFilter: uid }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setViewMode: (mode) => set({ viewMode: mode }),
  
  clearFilters: () => set({ 
    searchTerm: '', 
    assigneeFilter: '',
    priorityFilter: '', 
    statusFilter: '' 
  }),
}));

export default useFilterStore;