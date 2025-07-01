import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // CORRECTED: Provide a real Date object or null
        dueDate: doc.data().dueDate?.toDate ? doc.data().dueDate.toDate() : null,
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
      }));
      setTasks(tasksData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching tasks: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { tasks, loading };
};