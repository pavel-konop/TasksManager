import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import useFilterStore from '../store/useFilterStore';
import { TASK_STATUSES } from '../constants';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Label';
import styles from './Profile.module.css';

const Profile = () => {
  const { user } = useAuth();
  const { tasks, loading } = useTasks();
  const navigate = useNavigate();
  const { clearFilters, setAssigneeFilter, setStatusFilter } = useFilterStore();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);

  const userTasks = useMemo(() => {
    if (!user) return [];
    return tasks.filter(task => task.assignee?.uid === user.uid);
  }, [tasks, user]);

  const taskSummary = useMemo(() => {
    const summary = {};
    TASK_STATUSES.forEach(status => {
      summary[status] = userTasks.filter(task => task.status === status).length;
    });
    return summary;
  }, [userTasks]);

  const handleSummaryClick = (status) => {
    clearFilters();
    setAssigneeFilter(user.uid);
    setStatusFilter(status);
    navigate('/');
  };

  const handleNameChange = async (e) => {
    e.preventDefault();
    if (!displayName || user.displayName === displayName || displayName.trim() === '') return;

    setIsSaving(true);
    try {
      await updateProfile(auth.currentUser, { displayName });
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { name: displayName });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <img 
          src={user.photoURL || `https://api.dicebear.com/8.x/lorelei/svg?seed=${user.uid}`} 
          alt="User Avatar" 
          className={styles.avatar}
        />
        <h1 className={styles.name}>{user.displayName}</h1>
        <p className={styles.email}>{user.email}</p>

        <form onSubmit={handleNameChange} className={styles.updateForm}>
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <Button type="submit" disabled={isSaving || user.displayName === displayName}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
        </form>
      </div>

      <div className={styles.summarySection}>
        <h2 className={styles.sectionTitle}>Your Task Summary</h2>
        <div className={styles.summaryGrid}>
          {TASK_STATUSES.map(status => (
            <div 
              key={status} 
              className={styles.summaryCard} 
              onClick={() => handleSummaryClick(status)}
            >
              <h3 className={styles.summaryCount}>{taskSummary[status]}</h3>
              <p className={styles.summaryLabel}>{status} Tasks</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;