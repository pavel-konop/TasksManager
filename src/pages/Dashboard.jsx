import React, { useState, useMemo, useEffect } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TASK_STATUSES } from '../constants';
import { useTasks } from '../hooks/useTasks';
import useFilterStore from '../store/useFilterStore';
import { useAuth } from '../hooks/useAuth';
import StatusColumn from '../components/StatusColumn';
import TaskDialog from '../components/TaskDialog';
import TaskCard from '../components/TaskCard';
import FilterControls from '../components/FilterControls';
import ListView from '../components/ListView';
import Tour from '../components/Tour';
import { Button } from '../components/ui/Button';
import { FiPlus, FiGrid, FiList } from 'react-icons/fi';
import confetti from 'canvas-confetti';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { tasks, loading } = useTasks();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [runTour, setRunTour] = useState(false);

  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  const { searchTerm, assigneeFilter, priorityFilter, statusFilter, viewMode, setViewMode, isTourOpen, setTourOpen } = useFilterStore();
  
  useEffect(() => {
    if (!user || loading) return;
    const checkTutorialStatus = async () => {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().hasCompletedTutorial === false) {
        setTourOpen(true);
      }
    };
    checkTutorialStatus();
  }, [user, loading, setTourOpen]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const processedTasks = useMemo(() => {
    let sortableTasks = [...tasks];

    sortableTasks = sortableTasks.filter(task => {
      const searchMatch = task.name.toLowerCase().includes(searchTerm.toLowerCase());
      const assigneeMatch = assigneeFilter ? task.assignee?.uid === assigneeFilter : true;
      const priorityMatch = priorityFilter ? task.priority === priorityFilter : true;
      const statusMatch = statusFilter ? task.status === statusFilter : true;
      return searchMatch && assigneeMatch && priorityMatch && statusMatch;
    });

    if (sortConfig.key) {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      sortableTasks.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'assignee') {
          aValue = a.assignee?.name || '';
          bValue = b.assignee?.name || '';
        } else if (sortConfig.key === 'priority') {
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
        }

        if (aValue === null) return 1;
        if (bValue === null) return -1;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableTasks;
  }, [tasks, searchTerm, assigneeFilter, priorityFilter, statusFilter, sortConfig]);

  const getTasksByStatus = (status) => processedTasks.filter(task => task.status === status);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
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
    setActiveTask(tasks.find(t => t.id === event.active.id));
  };

  // In Dashboard.jsx, find the handleDragEnd function and replace it with this cleaned-up version.
// Also remove `import confetti from 'canvas-confetti';` from the top of the file.

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
    if (currentTask && currentTask.status !== newStatus && TASK_STATUSES.includes(newStatus)) {
      try {
        const taskRef = doc(db, 'tasks', taskId);
        await updateDoc(taskRef, { status: newStatus });
        // The confetti logic has been removed.
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    }
  };

  if (loading) return <div className={styles.dashboard}><p>Loading tasks...</p></div>;

  return (
    <>
      <Tour/>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className={styles.dashboard}>
          <header className={styles.header}>
            <h1 className={styles.title}>Dashboard</h1>
            <div id="tour-step-3" className={styles.actions}>
              <FilterControls />
              <div id="tour-step-4" className={styles.viewSwitcher}>
                <Button variant={viewMode === 'board' ? 'default' : 'ghost'} onClick={() => setViewMode('board')} size="small"><FiGrid /></Button>
                <Button variant={viewMode === 'list' ? 'default' : 'ghost'} onClick={() => setViewMode('list')} size="small"><FiList /></Button>
              </div>
              <Button onClick={handleAddTask}>
                <FiPlus style={{ marginRight: '0.5rem' }} /> Create Task
              </Button>
            </div>
          </header>
          {viewMode === 'board' ? (
            <div id="tour-step-1" className={styles.board}>
              {TASK_STATUSES.map(status => (
                <div id={status === 'To Do' ? 'tour-step-2' : undefined} key={status}>
                  <StatusColumn status={status} tasks={getTasksByStatus(status)} onEditTask={handleEditTask} />
                </div>
              ))}
            </div>
          ) : (
            <ListView 
              tasks={processedTasks} 
              onEditTask={handleEditTask} 
              sortConfig={sortConfig}
              handleSort={handleSort}
            />
          )}
        </div>
        <DragOverlay>{activeTask ? <TaskCard task={activeTask} /> : null}</DragOverlay>
        <TaskDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} task={selectedTask}/>
      </DndContext>
    </>
  );
};

export default Dashboard;