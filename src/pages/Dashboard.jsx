import React, { useState, useMemo, useEffect } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TASK_STATUSES } from '../constants';
import { useTasks } from '../hooks/useTasks';
import useFilterStore from '../store/useFilterStore';
import StatusColumn from '../components/StatusColumn';
import TaskDialog from '../components/TaskDialog';
import TaskCard from '../components/TaskCard';
import FilterControls from '../components/FilterControls';
import { Button } from '../components/ui/Button';
import { FiPlus } from 'react-icons/fi';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { tasks, loading } = useTasks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const { searchTerm, assigneeFilter, priorityFilter, statusFilter, clearFilters } = useFilterStore();

  // On mount, clear status filter if it was set by another page
  useEffect(() => {
    return () => {
      // When leaving the dashboard, we can decide if we want to clear filters.
      // For now, we'll leave them, but could call clearFilters() here.
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const searchMatch = task.name.toLowerCase().includes(searchTerm.toLowerCase());
      const assigneeMatch = assigneeFilter ? task.assignee?.uid === assigneeFilter : true;
      const priorityMatch = priorityFilter ? task.priority === priorityFilter : true;
      const statusMatch = statusFilter ? task.status === statusFilter : true;
      return searchMatch && assigneeMatch && priorityMatch && statusMatch;
    });
  }, [tasks, searchTerm, assigneeFilter, priorityFilter, statusFilter]);

  const getTasksByStatus = (status) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsDialogOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id;
    const currentTask = tasks.find(t => t.id === taskId);
    let newStatus = over.id;
    if (over.data.current?.sortable) {
      newStatus = over.data.current.sortable.containerId;
    }
    if (currentTask && currentTask.status !== newStatus) {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { status: newStatus });
    }
  };

  if (loading) {
    return <div className={styles.dashboard}><p>Loading tasks...</p></div>;
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <h1 className={styles.title}>Kanban Board</h1>
          <div className={styles.actions}>
            <FilterControls />
            <Button onClick={handleAddTask}>
              <FiPlus style={{ marginRight: '0.5rem' }} />
              Create Task
            </Button>
          </div>
        </header>
        <div className={styles.board}>
          {TASK_STATUSES.map(status => (
            <StatusColumn
              key={status}
              status={status}
              tasks={getTasksByStatus(status)}
              onEditTask={handleEditTask}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>

      <TaskDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={selectedTask}
      />
    </DndContext>
  );
};

export default Dashboard;