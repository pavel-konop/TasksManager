import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import styles from './StatusColumn.module.css';
import { motion } from 'framer-motion';

const StatusColumn = ({ status, tasks, onEditTask }) => {
  const { setNodeRef } = useDroppable({ id: status });

  const taskIds = tasks.map(task => task.id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }} 
      className={styles.column}
    >
      <div className={styles.header} data-status={status}>
        <h2 className={styles.title}>{status}</h2>
        <span className={styles.taskCount}>{tasks.length}</span>
      </div>
      
      <SortableContext id={status} items={taskIds} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className={styles.tasks}>
          {tasks.length > 0 ? (
            tasks.map(task => (
              <TaskCard key={task.id} task={task} onEdit={onEditTask} />
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>No tasks here</p>
            </div>
          )}
        </div>
      </SortableContext>
    </motion.div>
  );
};

export default StatusColumn;