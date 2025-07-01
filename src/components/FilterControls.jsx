import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import useFilterStore from '../store/useFilterStore';
import { TASK_PRIORITIES, TASK_STATUSES } from '../constants';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';
import { FiFilter } from 'react-icons/fi';
import styles from './FilterControls.module.css';

const FilterControls = () => {
  const { 
    searchTerm, setSearchTerm, 
    assigneeFilter, setAssigneeFilter, 
    priorityFilter, setPriorityFilter,
    statusFilter, setStatusFilter,
    clearFilters 
  } = useFilterStore();
  
  const [users, setUsers] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await getDocs(collection(db, "users"));
      setUsers(usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchUsers();
  }, []);

  // This JSX is now used ONLY for the mobile drawer
  const MobileFilterForm = (
    <div className={styles.mobileForm}>
      <div className={styles.formGroup}>
        <label htmlFor="m-search">Search</label>
        <Input id="m-search" type="text" placeholder="Task name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="m-status">Status</label>
        <select id="m-status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={styles.select}>
          <option value="">All Statuses</option>
          {TASK_STATUSES.map(s => (<option key={s} value={s}>{s}</option>))}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="m-assignee">Assignee</label>
        <select id="m-assignee" value={assigneeFilter} onChange={(e) => setAssigneeFilter(e.target.value)} className={styles.select}>
          <option value="">All Assignees</option>
          {users.map(user => (<option key={user.uid} value={user.uid}>{user.name}</option>))}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="m-priority">Priority</label>
        <select id="m-priority" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className={styles.select}>
          <option value="">All Priorities</option>
          {TASK_PRIORITIES.map(p => (<option key={p} value={p}>{p}</option>))}
        </select>
      </div>
      <Button variant="outline" onClick={() => { clearFilters(); setIsDrawerOpen(false); }}>Clear All Filters</Button>
    </div>
  );

  return (
    <>
      {/* Desktop View: A flat list of controls */}
      <div className={styles.desktopContainer}>
        <Input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={styles.searchInput}/>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={styles.select}>
          <option value="">All Statuses</option>
          {TASK_STATUSES.map(s => (<option key={s} value={s}>{s}</option>))}
        </select>
        <select value={assigneeFilter} onChange={(e) => setAssigneeFilter(e.target.value)} className={styles.select}>
          <option value="">All Assignees</option>
          {users.map(user => (<option key={user.uid} value={user.uid}>{user.name}</option>))}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className={styles.select}>
          <option value="">All Priorities</option>
          {TASK_PRIORITIES.map(p => (<option key={p} value={p}>{p}</option>))}
        </select>
        <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
      </div>

      {/* Mobile View: Button that opens a Drawer */}
      <div className={styles.mobileContainer}>
        <Button variant="outline" onClick={() => setIsDrawerOpen(true)}>
          <FiFilter style={{ marginRight: '0.5rem' }}/>
          Filters
        </Button>
        <Dialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DialogContent className={styles.drawerContent}>
                <DialogHeader>
                    <DialogTitle>Filter Tasks</DialogTitle>
                </DialogHeader>
                {MobileFilterForm}
            </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default FilterControls;