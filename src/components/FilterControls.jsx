import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import useFilterStore from '../store/useFilterStore';
import { TASK_PRIORITIES } from '../constants'; // Import priorities
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import styles from './FilterControls.module.css';

const FilterControls = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    assigneeFilter, 
    setAssigneeFilter, 
    priorityFilter,      // Get priority state and action
    setPriorityFilter,
    clearFilters 
  } = useFilterStore();
  
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await getDocs(collection(db, "users"));
      setUsers(usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
      <Input
        type="text"
        placeholder="Search by task name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      <select
        value={assigneeFilter}
        onChange={(e) => setAssigneeFilter(e.target.value)}
        className={styles.select}
      >
        <option value="">All Assignees</option>
        {users.map(user => (
          <option key={user.uid} value={user.uid}>{user.name}</option>
        ))}
      </select>
      {/* Priority Filter Dropdown */}
      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
        className={styles.select}
      >
        <option value="">All Priorities</option>
        {TASK_PRIORITIES.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
    </div>
  );
};

export default FilterControls;