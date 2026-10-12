import { TOPICS, DIFFICULTIES } from '../data/initialData';

/**
 * Computes comprehensive stats from questions and attempts
 */
export function calculateAnalytics(questions = [], attempts = []) {
  const totalAttempts = attempts.length;
  
  // Set of solved question IDs
  const solvedQuestionIds = new Set(
    attempts.filter(a => a.result === 'Solved').map(a => a.questionId)
  );
  const totalSolved = solvedQuestionIds.size;
  const totalQuestions = questions.length;

  // Accuracy: successful attempts / total attempts
  const successfulAttemptsCount = attempts.filter(a => a.result === 'Solved').length;
  const overallAccuracy = totalAttempts > 0 
    ? Math.round((successfulAttemptsCount / totalAttempts) * 100) 
    : 0;

  // Calculate current streak in days
  const streak = calculateStreak(attempts);

  // Topic-wise breakdown
  const topicStats = TOPICS.map(topic => {
    const topicQuestions = questions.filter(q => q.topic === topic);
    const topicQuestionIds = new Set(topicQuestions.map(q => q.id));
    
    const topicAttempts = attempts.filter(a => topicQuestionIds.has(a.questionId));
    const topicSolvedAttempts = topicAttempts.filter(a => a.result === 'Solved');
    
    const topicSolvedCount = new Set(
      topicSolvedAttempts.map(a => a.questionId)
    ).size;

    const accuracy = topicAttempts.length > 0 
      ? Math.round((topicSolvedAttempts.length / topicAttempts.length) * 100) 
      : 0;

    return {
      topic,
      total: topicQuestions.length,
      solved: topicSolvedCount,
      attempts: topicAttempts.length,
      accuracy,
      progressPercent: topicQuestions.length > 0 
        ? Math.round((topicSolvedCount / topicQuestions.length) * 100) 
        : 0
    };
  });

  // Difficulty breakdown
  const difficultyStats = DIFFICULTIES.map(diff => {
    const diffQuestions = questions.filter(q => q.difficulty === diff);
    const diffQuestionIds = new Set(diffQuestions.map(q => q.id));

    const diffAttempts = attempts.filter(a => diffQuestionIds.has(a.questionId));
    const diffSolved = new Set(
      diffAttempts.filter(a => a.result === 'Solved').map(a => a.questionId)
    ).size;

    return {
      difficulty: diff,
      total: diffQuestions.length,
      solved: diffSolved,
      attempts: diffAttempts.length
    };
  });

  // Mistake categories frequency
  const mistakeCounts = {};
  attempts.forEach(a => {
    if (a.mistakeCategory) {
      mistakeCounts[a.mistakeCategory] = (mistakeCounts[a.mistakeCategory] || 0) + 1;
    }
  });

  const mistakeBreakdown = Object.entries(mistakeCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  // Strongest and Weakest topic calculation
  // Strongest: highest accuracy with at least 1 attempt, fallback to most solved
  // Weakest: lowest accuracy or lowest completion among attempted topics
  const attemptedTopics = topicStats.filter(t => t.attempts > 0);
  
  let strongestTopic = null;
  let weakestTopic = null;

  if (attemptedTopics.length > 0) {
    const sortedByAccuracy = [...attemptedTopics].sort((a, b) => b.accuracy - a.accuracy || b.solved - a.solved);
    strongestTopic = sortedByAccuracy[0];
    weakestTopic = sortedByAccuracy[sortedByAccuracy.length - 1];
  } else {
    // If no attempts, default suggestion based on curriculum
    strongestTopic = { topic: 'Arrays', accuracy: 0, solved: 0, reason: 'Curriculum foundation' };
    weakestTopic = { topic: 'Sliding Window', accuracy: 0, solved: 0, reason: 'Unattempted advanced pattern' };
  }

  // Weekly activity timeline (last 7 days)
  const weeklyActivity = generateWeeklyActivity(attempts);

  // Recommended next question
  const nextRecommended = pickNextRecommendedQuestion(questions, attempts, weakestTopic?.topic);

  return {
    totalAttempts,
    totalSolved,
    totalQuestions,
    overallAccuracy,
    streak,
    topicStats,
    difficultyStats,
    mistakeBreakdown,
    strongestTopic,
    weakestTopic,
    weeklyActivity,
    nextRecommended
  };
}

/**
 * Calculates continuous streak from attempt timestamps
 */
function calculateStreak(attempts) {
  if (!attempts || attempts.length === 0) return 0;

  // Extract unique active days (YYYY-MM-DD)
  const dates = [...new Set(attempts.map(a => {
    const d = new Date(a.timestamp);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }))].sort().reverse();

  if (dates.length === 0) return 0;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const yesterday = new Date(Date.now() - 86400000);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  // If user hasn't attempted today or yesterday, streak is broken
  if (dates[0] !== todayStr && dates[0] !== yesterdayStr) {
    return 0;
  }

  let currentStreak = 1;
  let prevDate = new Date(dates[0]);

  for (let i = 1; i < dates.length; i++) {
    const currDate = new Date(dates[i]);
    const diffTime = Math.abs(prevDate - currDate);
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      prevDate = currDate;
    } else {
      break;
    }
  }

  return currentStreak;
}

/**
 * Generates last 7 days activity chart points
 */
function generateWeeklyActivity(attempts) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = days[d.getDay()];

    const count = attempts.filter(a => a.timestamp.startsWith(dateStr)).length;
    const solvedCount = attempts.filter(a => a.timestamp.startsWith(dateStr) && a.result === 'Solved').length;

    result.push({
      date: dateStr,
      day: dayLabel,
      attempts: count,
      solved: solvedCount
    });
  }

  return result;
}

/**
 * Deterministic recommendation engine for the "Continue Learning" banner
 */
export function pickNextRecommendedQuestion(questions, attempts, weakTopicName) {
  const solvedIds = new Set(
    attempts.filter(a => a.result === 'Solved').map(a => a.questionId)
  );

  // 1. Any question marked for revision
  const revisionAttempt = attempts.find(a => a.needsRevision && !solvedIds.has(a.questionId));
  if (revisionAttempt) {
    const q = questions.find(item => item.id === revisionAttempt.questionId);
    if (q) return { ...q, reason: 'Pending revision from previous failed attempt' };
  }

  // 2. Unsolved question from the weakest topic
  if (weakTopicName) {
    const weakUnsolved = questions.find(q => q.topic === weakTopicName && !solvedIds.has(q.id));
    if (weakUnsolved) {
      return { ...weakUnsolved, reason: `Improve performance in your focus topic: ${weakTopicName}` };
    }
  }

  // 3. First unsolved question in order
  const firstUnsolved = questions.find(q => !solvedIds.has(q.id));
  if (firstUnsolved) {
    return { ...firstUnsolved, reason: 'Next step in structured curriculum' };
  }

  // If all solved
  return questions[0] ? { ...questions[0], reason: 'All questions completed! Review key patterns.' } : null;
}
