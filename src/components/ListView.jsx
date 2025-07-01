import React from 'react';
import { format } from 'date-fns';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import styles from './ListView.module.css';
import { cn } from '../lib/utils';

const SortableHeader = ({ children, sortKey, sortConfig, handleSort }) => {
  const isSorted = sortConfig.key === sortKey;
  const icon = isSorted ? (sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />) : null;
  
  return (
    <th onClick={() => handleSort(sortKey)}>
      <div className={styles.headerCell}>
        {children}
        <span className={cn(styles.sortIcon, isSorted && styles.visible)}>
          {icon}
        </span>
      </div>
    </th>
  );
};

const ListView = ({ tasks, onEditTask, sortConfig, handleSort }) => {
  if (tasks.length === 0) {
    return <div className={styles.emptyState}>No tasks match the current filters.</div>;
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <SortableHeader sortKey="name" sortConfig={sortConfig} handleSort={handleSort}>Task Name</SortableHeader>
            <SortableHeader sortKey="status" sortConfig={sortConfig} handleSort={handleSort}>Status</SortableHeader>
            <SortableHeader sortKey="priority" sortConfig={sortConfig} handleSort={handleSort}>Priority</SortableHeader>
            <SortableHeader sortKey="dueDate" sortConfig={sortConfig} handleSort={handleSort}>Due Date</SortableHeader>
            <SortableHeader sortKey="assignee" sortConfig={sortConfig} handleSort={handleSort}>Assignee</SortableHeader>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id} onClick={() => onEditTask(task)}>
              <td data-label="Task Name">{task.name}</td>
              <td data-label="Status">
                <span className={styles.status} data-status={task.status.replace(/\s+/g, '-').toLowerCase()}>
                  {task.status}
                </span>
              </td>
              <td data-label="Priority">{task.priority}</td>
              <td data-label="Due Date">{task.dueDate ? format(task.dueDate, 'MMM d, yyyy') : 'N/A'}</td>
              <td data-label="Assignee">
                {task.assignee ? (
                  <div className={styles.assignee}>
                    <img src={task.assignee.avatar} alt={task.assignee.name} />
                    <span>{task.assignee.name}</span>
                  </div>
                ) : 'Unassigned'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListView;