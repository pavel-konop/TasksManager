import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiClock, FiArrowUp, FiArrowRight, FiArrowDown } from 'react-icons/fi';
import { format } from 'date-fns'; // Import date-fns
import styles from './TaskCard.module.css';

const priorityIcons = {
  High: <FiArrowUp />,
  Medium: <FiArrowRight />,
  Low: <FiArrowDown />,
};

const TaskCard = ({ task, onEdit }) => {
  const { name, priority, dueDate, assignee, status } = task;

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
      className={styles.card}
      data-status={status.replace(/\s+/g, '-').toLowerCase()}
      onClick={() => onEdit(task)}
    >
      <div className={styles.cardContent}>
        <h3 className={styles.taskName}>{name}</h3>
        
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
              {/* CORRECTED: Format the date object */}
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