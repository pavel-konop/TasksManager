import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import styles from './AuthForm.module.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!agreed) {
      setError('You must agree to the terms and conditions.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: user.email,
        avatar: `https://api.dicebear.com/8.x/lorelei/svg?seed=${name}`,
        hasCompletedTutorial: false,
      });

      navigate('/');
    } catch (err) {
      switch (err.code) {
        case 'auth/weak-password':
          setError('Your password must be at least 6 characters long.');
          break;
        case 'auth/email-already-in-use':
          setError('This email address is already registered.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        default:
          setError('Failed to create an account. Please try again.');
          break;
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create an Account</h2>
        <p className={styles.description}>
          Enter your information to create an account.
        </p>
        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.inputGroup}>
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className={styles.inputGroup}>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className={styles.inputGroup}>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className={styles.checkboxWrapper}>
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <Label htmlFor="agree" className={styles.checkboxLabel}>
              I agree to the{' '}
              <Link to="/terms" target="_blank" className={styles.link}>Terms & Conditions</Link>
            </Label>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <Button type="submit" className={styles.submitButton} disabled={!agreed}>Create Account</Button>
        </form>
        <p className={styles.linkText}>
          Already have an account?{' '}
          <Link to="/login" className={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;