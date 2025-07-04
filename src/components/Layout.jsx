import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useFilterStore from '../store/useFilterStore'; // Import Zustand store
import { FiLogOut, FiUser, FiBarChart2, FiGrid, FiCheckSquare, FiHelpCircle } from 'react-icons/fi';
import styles from './Layout.module.css';
import { cn } from '../lib/utils';

const Layout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const setTourOpen = useFilterStore((state) => state.setTourOpen); // Get action from store

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <FiCheckSquare className={styles.logoIcon} />
          <span>TikTasks</span>
        </Link>
        
        {/* This new wrapper will be the target for the tour's final step */}
        <div id="tour-step-5" className={styles.headerNavWrapper}>
          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}><FiGrid /> <span>Board</span></Link>
            <Link to="/analytics" className={styles.navLink}><FiBarChart2 /> <span>Analytics</span></Link>
          </nav>
          <div className={styles.userMenu}>
            {user && (
              <div className={styles.dropdown} ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(prev => !prev)} className={styles.avatarButton}>
                  <img
                    src={user.photoURL || `https://api.dicebear.com/8.x/lorelei/svg?seed=${user.uid}`}
                    alt="User Avatar"
                    className={styles.avatar}
                  />
                </button>
                <div className={cn(styles.dropdownContent, isDropdownOpen && styles.open)}>
                  <Link to="/profile" onClick={() => setIsDropdownOpen(false)}><FiUser /> Profile</Link>
                  <button onClick={() => { setTourOpen(true); setIsDropdownOpen(false); }}>
                    <FiHelpCircle /> Start Tour
                  </button>
                  <button onClick={handleSignOut}><FiLogOut /> Sign Out</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className={styles.contentWrapper}>
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;