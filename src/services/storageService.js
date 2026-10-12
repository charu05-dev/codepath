import { INITIAL_QUESTIONS, INITIAL_ATTEMPTS, DEFAULT_USER_PREFERENCES } from '../data/initialData';

const STORAGE_KEYS = {
  QUESTIONS: 'codepath_questions_v1',
  ATTEMPTS: 'codepath_attempts_v1',
  PREFERENCES: 'codepath_preferences_v1',
  ROADMAP: 'codepath_roadmap_v1'
};

/**
 * Safe local storage reader with fallback
 */
export function getFromStorage(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to parse storage item "${key}":`, err);
    return defaultValue;
  }
}

/**
 * Safe local storage writer
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save storage item "${key}":`, err);
  }
}

/**
 * Initialize storage with default data if empty
 */
export function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
    saveToStorage(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTEMPTS)) {
    saveToStorage(STORAGE_KEYS.ATTEMPTS, INITIAL_ATTEMPTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PREFERENCES)) {
    saveToStorage(STORAGE_KEYS.PREFERENCES, DEFAULT_USER_PREFERENCES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ROADMAP)) {
    const defaultRoadmap = generateDeterministicRoadmap(
      DEFAULT_USER_PREFERENCES,
      INITIAL_QUESTIONS
    );
    saveToStorage(STORAGE_KEYS.ROADMAP, defaultRoadmap);
  }
}

/**
 * Reset all storage to factory defaults
 */
export function resetStorage() {
  saveToStorage(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
  saveToStorage(STORAGE_KEYS.ATTEMPTS, INITIAL_ATTEMPTS);
  saveToStorage(STORAGE_KEYS.PREFERENCES, DEFAULT_USER_PREFERENCES);
  const defaultRoadmap = generateDeterministicRoadmap(
    DEFAULT_USER_PREFERENCES,
    INITIAL_QUESTIONS
  );
  saveToStorage(STORAGE_KEYS.ROADMAP, defaultRoadmap);
}

/**
 * Clear all progress/attempts (Zero-data state testing)
 */
export function clearAttempts() {
  saveToStorage(STORAGE_KEYS.ATTEMPTS, []);
}

/**
 * Deterministic roadmap generator based on user preferences and questions bank
 */
export function generateDeterministicRoadmap(prefs, questions) {
  const { currentLevel = 'Beginner', dailyHours = 2, targetWeeks = 6, knownTopics = [] } = prefs;

  // Pedagogical progression ordering
  const curriculumSequence = [
    {
      topic: 'Arrays',
      objective: 'Core array operations, memory layouts, in-place manipulation, and prefix math.',
      weekIdx: 1
    },
    {
      topic: 'Strings',
      objective: 'Character arrays, two-way matching, anagram hashing, and stack-assisted validation.',
      weekIdx: 2
    },
    {
      topic: 'HashMap/HashSet',
      objective: 'Constant time lookups, frequency maps, complement checks, and continuous sum tracking.',
      weekIdx: 3
    },
    {
      topic: 'Searching',
      objective: 'Binary search variants, rotated boundary analysis, and matrix coordinates mapping.',
      weekIdx: 4
    },
    {
      topic: 'Sorting',
      objective: 'In-place partitioning, interval sorting, frequency bucket sorting, and selection logic.',
      weekIdx: 5
    },
    {
      topic: 'Two Pointers',
      objective: 'Inward convergence, sorting combination, and bounded area maximization.',
      weekIdx: 6
    },
    {
      topic: 'Sliding Window',
      objective: 'Dynamic window expansion, contractive state invariant, and subsegment optimization.',
      weekIdx: 6
    }
  ];

  // Map weeks (capped or expanded according to targetWeeks)
  const weeksCount = Math.max(2, Math.min(12, Number(targetWeeks) || 6));
  const planWeeks = [];

  for (let w = 1; w <= weeksCount; w++) {
    // Select topic(s) assigned to this week or cyclic distribution
    const assigned = curriculumSequence.filter(item => {
      const normalizedWeek = ((item.weekIdx - 1) % weeksCount) + 1;
      return normalizedWeek === w;
    });

    const activeTopics = assigned.length > 0 ? assigned : [curriculumSequence[(w - 1) % curriculumSequence.length]];

    const weekTasks = [];
    activeTopics.forEach(tDef => {
      // Pick matching questions for this topic
      const topicQuestions = questions.filter(q => q.topic === tDef.topic);
      
      // Determine question slice based on dailyHours and level
      const questionsToTake = dailyHours >= 3 ? topicQuestions : topicQuestions.slice(0, 3);

      questionsToTake.forEach((q, idx) => {
        // If topic is already known, default state can be complete for earlier tasks
        const isKnown = knownTopics.includes(tDef.topic) && idx === 0;
        
        weekTasks.push({
          id: `task-w${w}-${q.id}`,
          questionId: q.id,
          title: q.title,
          topic: q.topic,
          difficulty: q.difficulty,
          estimatedMinutes: q.timeEstimate || 20,
          objective: `Master ${q.title} technique (${q.topic})`,
          completed: isKnown,
          completedAt: isKnown ? new Date(Date.now() - 3 * 86400000).toISOString() : null
        });
      });
    });

    planWeeks.push({
      weekNumber: w,
      title: `Week ${w}: ${activeTopics.map(t => t.topic).join(' & ')}`,
      objective: activeTopics.map(t => t.objective).join(' '),
      tasks: weekTasks
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    weeks: planWeeks
  };
}

export { STORAGE_KEYS };
