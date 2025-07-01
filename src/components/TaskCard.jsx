import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiClock, FiArrowUp, FiArrowRight, FiArrowDown } from 'react-icons/fi';
import { format } from 'date-fns';
import { cn } from '../lib/utils'; // Import the cn utility
import styles from './TaskCard.module.css';

const priorityIcons = {
  High: <FiArrowUp />,
  Medium: <FiArrowRight />,
  Low: <FiArrowDown />,
};

const TaskCard = ({ task, onEdit }) => {
  const { name, priority, dueDate, assignee, status } = task;
  const isDone = status === 'Done'; // Check if the task is done

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      // Apply a "done" class to the entire card
      className={cn(styles.card, isDone && styles.doneCard)}
      data-status={status.replace(/\s+/g, '-').toLowerCase()}
      onClick={() => onEdit(task)}
    >
      <div className={styles.cardContent}>
        {/* Apply a "done" class to the task name for strikethrough */}
        <h3 className={cn(styles.taskName, isDone && styles.doneText)}>{name}</h3>
        
        <div className={styles.details}>
          <div className={styles.priority} data-priority={priority?.toLowerCase()}>
            {priorityIcons[priority]}
            <span>{priority}</span>
          </div>
        </div>

        <div className={styles.footer}>
          {dueDate && (
            <div className={styles.dueDate}>
              <FiClock />
              <span>{format(dueDate, 'MMM d')}</span>
            </div>
          )}
          {assignee?.avatar && (
            <img
              src={assignee.avatar}
              alt={assignee.name}
              className={styles.assigneeAvatar}
              title={assignee.name}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;