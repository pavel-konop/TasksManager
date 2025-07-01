import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { db, auth } from '../lib/firebase';
import { doc, addDoc, updateDoc, collection, serverTimestamp, getDocs, deleteDoc } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/Dialog';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Label } from './ui/Label';
import { TASK_STATUSES, TASK_PRIORITIES } from '../constants';
import Comments from './Comments';
import styles from './TaskDialog.module.css';

const taskSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  status: z.string(),
  priority: z.string(),
  dueDate: z.date().optional().nullable(),
  assigneeUid: z.string().optional(),
});

const TaskDialog = ({ isOpen, onOpenChange, task }) => {
  const [users, setUsers] = useState([]);
  const isEditMode = Boolean(task);

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(taskSchema),
  });

  const watchedStatus = watch("status");
  const watchedPriority = watch("priority");

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await getDocs(collection(db, "users"));
      setUsers(usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (isOpen && isEditMode && task) {
      reset({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        assigneeUid: task.assignee?.uid || '',
      });
    } else if (isOpen) {
      reset({
        name: '',
        description: '',
        status: 'To Do',
        priority: 'Medium',
        dueDate: null,
        assigneeUid: '',
      });
    }
  }, [isOpen, task, isEditMode, reset]);

  const handleDelete = async () => {
    if (!isEditMode || !window.confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'tasks', task.id));
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task.");
    }
  };

  const onSubmit = async (data) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    const selectedAssignee = users.find(u => u.uid === data.assigneeUid);
    const taskData = {
      ...data,
      assignee: selectedAssignee ? { uid: selectedAssignee.uid, name: selectedAssignee.name, avatar: selectedAssignee.avatar } : null,
    };
    delete taskData.assigneeUid;
    try {
      if (isEditMode) {
        const taskRef = doc(db, 'tasks', task.id);
        await updateDoc(taskRef, taskData);
      } else {
        await addDoc(collection(db, 'tasks'), {
          ...taskData,
          creatorUid: currentUser.uid,
          creatorName: currentUser.displayName,
          createdAt: serverTimestamp(),
        });
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          {/* ADD THIS DIALOG DESCRIPTION BACK IN */}
          <DialogDescription>
            {isEditMode ? "Make changes to your task here. Click save when you're done." : "Add a new task to your board. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>

        <div className={styles.dialogBody}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formSection}>
                <div className={styles.gridSpan2}>
                  <Label htmlFor="name">Task Name</Label>
                  <Input id="name" {...register('name')} />
                  {errors.name && <p className={styles.error}>{errors.name.message}</p>}
                </div>
                <div className={styles.gridSpan2}>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" {...register('description')} rows="4" />
                </div>
            </div>
            
            <hr className={styles.divider} />
            
            <div className={styles.formSection}>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select id="status" {...register('status')} className={styles.select} data-status={watchedStatus?.replace(/\s+/g, '-').toLowerCase()}>
                    {TASK_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select id="priority" {...register('priority')} className={styles.select} data-priority={watchedPriority?.toLowerCase()}>
                    {TASK_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="assigneeUid">Assignee</Label>
                  <select id="assigneeUid" {...register('assigneeUid')} className={styles.select}>
                    <option value="">Unassigned</option>
                    {users.map(user => <option key={user.uid} value={user.uid}>{user.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" {...register('dueDate', { valueAsDate: true })} />
                </div>
            </div>

            <DialogFooter className={styles.footer}>
              {isEditMode && auth.currentUser?.uid === task.creatorUid && (
                  <Button type="button" variant="destructive-ghost" onClick={handleDelete} className={styles.deleteButton}>
                    Delete
                  </Button>
              )}
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isEditMode ? 'Save Changes' : 'Create Task'}
              </Button>
            </DialogFooter>
          </form>

          {isEditMode && task && <Comments taskId={task.id} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;