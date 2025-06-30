import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import styles from './Comments.module.css';
import { format } from 'date-fns';

const Comments = ({ taskId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!taskId) return;
    const q = query(collection(db, 'tasks', taskId, 'comments'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }));
      setComments(commentsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [taskId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim() === '' || !user) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'tasks', taskId, 'comments'), {
        text: newComment,
        authorName: user.displayName,
        authorUid: user.uid,
        authorAvatar: user.photoURL || `https://api.dicebear.com/8.x/lorelei/svg?seed=${user.uid}`,
        createdAt: serverTimestamp(),
      });
      setNewComment('');
    } catch (error) {
      console.error("Error adding comment: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className={styles.noComments}>Loading comments...</p>;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Activity</h3>
      <div className={styles.commentsList}>
        {comments.map(comment => (
          <div key={comment.id} className={styles.comment}>
            <img src={comment.authorAvatar} alt={comment.authorName} className={styles.avatar} />
            <div className={styles.commentContent}>
              <div className={styles.commentHeader}>
                <span className={styles.authorName}>{comment.authorName}</span>
                <span className={styles.timestamp}>
                  {comment.createdAt ? format(comment.createdAt, 'MMM d, yyyy h:mm a') : ''}
                </span>
              </div>
              <p className={styles.commentText}>{comment.text}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && <p className={styles.noComments}>No comments yet.</p>}
      </div>
      <form onSubmit={handleAddComment} className={styles.addCommentForm}>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows="3"
        />
        <Button type="submit" disabled={!newComment.trim() || isSubmitting} size="small">
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>
    </div>
  );
};

export default Comments;