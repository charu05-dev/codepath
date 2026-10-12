import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  STORAGE_KEYS,
  getFromStorage,
  saveToStorage,
  initStorage,
  resetStorage as resetStorageService,
  generateDeterministicRoadmap
} from '../services/storageService';
import { calculateAnalytics } from '../utils/analytics';
import { INITIAL_QUESTIONS, INITIAL_ATTEMPTS, DEFAULT_USER_PREFERENCES } from '../data/initialData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Initialize storage once
  useEffect(() => {
    initStorage();
  }, []);

  const [questions, setQuestions] = useState(() => 
    getFromStorage(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS)
  );

  const [attempts, setAttempts] = useState(() => 
    getFromStorage(STORAGE_KEYS.ATTEMPTS, INITIAL_ATTEMPTS)
  );

  const [preferences, setPreferences] = useState(() => 
    getFromStorage(STORAGE_KEYS.PREFERENCES, DEFAULT_USER_PREFERENCES)
  );

  const [roadmap, setRoadmap] = useState(() => {
    const existing = getFromStorage(STORAGE_KEYS.ROADMAP, null);
    if (existing) return existing;
    return generateDeterministicRoadmap(DEFAULT_USER_PREFERENCES, INITIAL_QUESTIONS);
  });

  const [toasts, setToasts] = useState([]);

  // Toast notification helper
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Add or update attempt
  const logAttempt = (attemptData) => {
    const newAttempt = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
      ...attemptData
    };

    setAttempts(prev => {
      const updated = [newAttempt, ...prev];
      saveToStorage(STORAGE_KEYS.ATTEMPTS, updated);
      return updated;
    });

    // Also sync roadmap task completion if attempt was solved
    if (attemptData.result === 'Solved') {
      setRoadmap(prevRoadmap => {
        if (!prevRoadmap || !prevRoadmap.weeks) return prevRoadmap;
        const updatedWeeks = prevRoadmap.weeks.map(week => ({
          ...week,
          tasks: week.tasks.map(task => {
            if (task.questionId === attemptData.questionId) {
              return { ...task, completed: true, completedAt: new Date().toISOString() };
            }
            return task;
          })
        }));
        const updatedRoadmap = { ...prevRoadmap, weeks: updatedWeeks };
        saveToStorage(STORAGE_KEYS.ROADMAP, updatedRoadmap);
        return updatedRoadmap;
      });
    }

    addToast(
      attemptData.result === 'Solved' 
        ? 'Attempt logged! Question marked as solved.' 
        : 'Attempt logged to mistake tracker.',
      attemptData.result === 'Solved' ? 'success' : 'warning'
    );
  };

  // Update existing attempt (e.g. edit notes, toggle revision)
  const updateAttempt = (attemptId, updates) => {
    setAttempts(prev => {
      const updated = prev.map(a => a.id === attemptId ? { ...a, ...updates } : a);
      saveToStorage(STORAGE_KEYS.ATTEMPTS, updated);
      return updated;
    });
    addToast('Attempt record updated.', 'info');
  };

  // Toggle roadmap task completion
  const toggleTaskStatus = (taskId) => {
    setRoadmap(prevRoadmap => {
      if (!prevRoadmap || !prevRoadmap.weeks) return prevRoadmap;
      let newStatus = false;
      let targetQId = null;

      const updatedWeeks = prevRoadmap.weeks.map(week => ({
        ...week,
        tasks: week.tasks.map(task => {
          if (task.id === taskId) {
            newStatus = !task.completed;
            targetQId = task.questionId;
            return {
              ...task,
              completed: newStatus,
              completedAt: newStatus ? new Date().toISOString() : null
            };
          }
          return task;
        })
      }));

      const updatedRoadmap = { ...prevRoadmap, weeks: updatedWeeks };
      saveToStorage(STORAGE_KEYS.ROADMAP, updatedRoadmap);

      // If marked complete directly, and no solved attempt exists, record a default solve attempt
      if (newStatus && targetQId) {
        const alreadySolved = attempts.some(a => a.questionId === targetQId && a.result === 'Solved');
        if (!alreadySolved) {
          const autoAttempt = {
            id: `att-auto-${Date.now()}`,
            questionId: targetQId,
            timestamp: new Date().toISOString(),
            result: 'Solved',
            timeTaken: 20,
            mistakeCategory: null,
            notes: 'Completed as part of roadmap task milestone.',
            needsRevision: false
          };
          setAttempts(prev => {
            const nextAttempts = [autoAttempt, ...prev];
            saveToStorage(STORAGE_KEYS.ATTEMPTS, nextAttempts);
            return nextAttempts;
          });
        }
      }

      return updatedRoadmap;
    });
    addToast('Roadmap task updated.', 'info');
  };

  // Regenerate roadmap using user preferences
  const regenerateRoadmap = (customPrefs) => {
    const prefsToUse = customPrefs || preferences;
    const newRoadmap = generateDeterministicRoadmap(prefsToUse, questions);
    setRoadmap(newRoadmap);
    saveToStorage(STORAGE_KEYS.ROADMAP, newRoadmap);
    addToast('Roadmap customized and regenerated.', 'success');
  };

  // Update user preferences
  const updatePreferences = (newPrefs) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    saveToStorage(STORAGE_KEYS.PREFERENCES, updated);
    addToast('Preferences saved.', 'success');
  };

  // Reset demo data to initial state
  const resetAllData = () => {
    resetStorageService();
    setQuestions(INITIAL_QUESTIONS);
    setAttempts(INITIAL_ATTEMPTS);
    setPreferences(DEFAULT_USER_PREFERENCES);
    setRoadmap(generateDeterministicRoadmap(DEFAULT_USER_PREFERENCES, INITIAL_QUESTIONS));
    addToast('Demo data restored to initial factory state.', 'info');
  };

  // Clear attempts for clean testing
  const clearAllAttempts = () => {
    setAttempts([]);
    saveToStorage(STORAGE_KEYS.ATTEMPTS, []);
    addToast('All attempt history cleared.', 'warning');
  };

  // Analytics derived dynamically from attempts and questions
  const analytics = calculateAnalytics(questions, attempts);

  return (
    <AppContext.Provider
      value={{
        questions,
        attempts,
        preferences,
        roadmap,
        analytics,
        toasts,
        logAttempt,
        updateAttempt,
        toggleTaskStatus,
        regenerateRoadmap,
        updatePreferences,
        resetAllData,
        clearAllAttempts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
