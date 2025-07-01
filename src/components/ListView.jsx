import React from 'react';
import { format } from 'date-fns';
import styles from './ListView.module.css';

const ListView = ({ tasks, onEditTask }) => {
  if (tasks.length === 0) {
    return <div className={styles.emptyState}>No tasks match the current filters.</div>;
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Assignee</th>
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
              <td data-label="Due Date">
                {/* CORRECTED: No longer need new Date() */}
                {task.dueDate ? format(task.dueDate, 'MMM d, yyyy') : 'N/A'}
              </td>
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