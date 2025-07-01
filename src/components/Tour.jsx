import React from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useAuth } from '../hooks/useAuth';
import useFilterStore from '../store/useFilterStore';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const Tour = () => {
  const { user } = useAuth();
  const { isTourOpen, setTourOpen } = useFilterStore();

  const tourSteps = [
    {
      target: '#tour-step-1',
      content: 'This is your Kanban board, where tasks are organized by status.',
      disableBeacon: true,
    },
    {
      target: '#tour-step-2',
      content: 'You can drag and drop tasks between columns to update their status instantly.',
      disableScrolling: true,
    },
    {
      target: '#tour-step-3',
      content: 'Use these controls to search, filter, and create new tasks.',
      disableScrolling: true,
    },
    {
      target: '#tour-step-4',
      content: 'Click here to switch between the Kanban board and a compact List View.',
      disableScrolling: true,
    },
    {
      target: '#tour-step-5',
      content: "Finally, manage your profile, view analytics, and find this tour again from the user menu.",
      placement: 'left',
      disableScrolling: true,
    },
  ];

  const handleJoyrideCallback = async (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      setTourOpen(false);
      if (user?.uid) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          await updateDoc(userDocRef, { hasCompletedTutorial: true });
        } catch (error) {
          console.error("Failed to update tutorial status:", error);
        }
      }
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      run={isTourOpen}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={tourSteps}
      styles={{
        options: {
          arrowColor: '#ffffff',
          backgroundColor: '#ffffff',
          primaryColor: '#14b8a6',
          textColor: '#1e293b',
          zIndex: 10000,
        },
        floater: {
            maxWidth: '380px',
        },
      }}
    />
  );
};

export default Tour;