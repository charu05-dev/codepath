import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Compass,
  CheckCircle,
  Circle,
  RotateCcw,
  Sparkles,
  Sliders,
  Calendar,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Info
} from 'lucide-react';
import { TOPICS } from '../data/initialData';
import './RoadmapPage.css';

export function RoadmapPage() {
  const { roadmap, preferences, updatePreferences, regenerateRoadmap, toggleTaskStatus } = useApp();
  const navigate = useNavigate();

  const [isCustomizing, setIsCustomizing] = useState(false);
  const [formData, setFormData] = useState({
    currentLevel: preferences.currentLevel || 'Beginner',
    targetRole: preferences.targetRole || 'Software Engineer (SDE I)',
    dailyHours: preferences.dailyHours || 2,
    targetWeeks: preferences.targetWeeks || 6,
    knownTopics: preferences.knownTopics || []
  });

  const handleTopicToggle = (topic) => {
    setFormData(prev => {
      const exists = prev.knownTopics.includes(topic);
      return {
        ...prev,
        knownTopics: exists
          ? prev.knownTopics.filter(t => t !== topic)
          : [...prev.knownTopics, topic]
      };
    });
  };

  const handleGenerateSubmit = (e) => {
    e.preventDefault();
    updatePreferences(formData);
    regenerateRoadmap(formData);
    setIsCustomizing(false);
  };

  // Calculate completion percentage across tasks
  const allTasks = (roadmap?.weeks || []).flatMap(w => w.tasks);
  const totalTasksCount = allTasks.length;
  const completedTasksCount = allTasks.filter(t => t.completed).length;
  const progressPercent = totalTasksCount > 0
    ? Math.round((completedTasksCount / totalTasksCount) * 100)
    : 0;

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Easy': return 'badge-success';
      case 'Medium': return 'badge-warning';
      case 'Hard': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="roadmap-page">
      {/* Top Banner & Progress Header */}
      <section className="card roadmap-banner-card">
        <div className="banner-left">
          <div className="banner-badge-row">
            <span className="badge badge-violet">STRUCTURED CURRICULUM</span>
            <span className="badge badge-neutral">Level: {preferences.currentLevel}</span>
            <span className="badge badge-neutral">{preferences.dailyHours} hrs/day</span>
          </div>
          <h2 className="banner-title">
            {preferences.targetWeeks}-Week Milestone Roadmap for {preferences.targetRole}
          </h2>
          <p className="banner-desc">
            Progressive pattern-driven schedule prioritizing linear structures before branch-heavy algorithms.
            Every task is connected directly to our practice bank.
          </p>
        </div>

        <div className="banner-right">
          <div className="progress-summary">
            <div className="summary-number mono text-violet">
              {progressPercent}%
            </div>
            <div className="summary-label">
              {completedTasksCount} of {totalTasksCount} tasks completed
            </div>
            <div className="progress-bar-track banner-progress-track">
              <div
                className="progress-bar-fill progress-violet"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="banner-buttons">
            <button
              className="btn btn-outline"
              onClick={() => setIsCustomizing(!isCustomizing)}
            >
              <Sliders size={14} />
              {isCustomizing ? 'Hide Setup Form' : 'Customize Parameters'}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => regenerateRoadmap()}
              title="Regenerate deterministic progression using current preferences"
            >
              <RotateCcw size={14} />
              Regenerate Plan
            </button>
          </div>
        </div>
      </section>

      {/* Honest Local Preview Disclaimer */}
      <div className="ai-disclaimer-note">
        <Info size={14} className="text-violet" />
        <span>
          <strong>Local Preview Engine:</strong> This roadmap was deterministically assembled based on your selected target role and availability profile. Live generative AI planning will connect in future updates.
        </span>
      </div>

      {/* Preferences Setup Drawer / Form */}
      {isCustomizing && (
        <section className="card customize-form-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Curriculum Target Customization</h3>
              <div className="card-subtitle">Adjust your daily capacity and existing topic comfort</div>
            </div>
          </div>

          <form onSubmit={handleGenerateSubmit}>
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label" htmlFor="levelSelect">Current DSA Level</label>
                <select
                  id="levelSelect"
                  value={formData.currentLevel}
                  onChange={(e) => setFormData({ ...formData, currentLevel: e.target.value })}
                  className="form-select"
                >
                  <option value="Beginner">Beginner (Core syntax & basic arrays)</option>
                  <option value="Intermediate">Intermediate (Comfortable with maps & recursion)</option>
                  <option value="Advanced">Advanced (Optimizing space & time bounds)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="roleInput">Target Role</label>
                <input
                  id="roleInput"
                  type="text"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="dailyHoursInput">Daily Hours Available</label>
                <input
                  id="dailyHoursInput"
                  type="number"
                  min="1"
                  max="12"
                  value={formData.dailyHours}
                  onChange={(e) => setFormData({ ...formData, dailyHours: Number(e.target.value) })}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="weeksInput">Target Preparation Duration (Weeks)</label>
              <input
                id="weeksInput"
                type="number"
                min="2"
                max="12"
                value={formData.targetWeeks}
                onChange={(e) => setFormData({ ...formData, targetWeeks: Number(e.target.value) })}
                className="form-input"
                style={{ maxWidth: '240px' }}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Already Familiar Topics (Mark as known)</label>
              <div className="topics-checkbox-pills">
                {TOPICS.map(topic => {
                  const selected = formData.knownTopics.includes(topic);
                  return (
                    <button
                      type="button"
                      key={topic}
                      onClick={() => handleTopicToggle(topic)}
                      className={`topic-pill-btn ${selected ? 'pill-active' : ''}`}
                    >
                      {selected ? <CheckCircle size={13} /> : <Circle size={13} />}
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-actions-row">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsCustomizing(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save & Regenerate Roadmap
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Multi-week Timeline */}
      <section className="weeks-timeline">
        {(roadmap?.weeks || []).map((week) => {
          const weekDone = week.tasks.filter(t => t.completed).length;
          const weekTotal = week.tasks.length;
          const weekPct = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;

          return (
            <div key={week.weekNumber} className="card week-card">
              <div className="week-header">
                <div className="week-title-area">
                  <div className="week-badge-line">
                    <span className="badge badge-violet mono">WEEK {week.weekNumber}</span>
                    <span className="week-completion-tag mono">
                      {weekDone}/{weekTotal} done ({weekPct}%)
                    </span>
                  </div>
                  <h3 className="week-title">{week.title}</h3>
                  <p className="week-objective">{week.objective}</p>
                </div>
              </div>

              {/* Task list for this week */}
              <div className="tasks-grid">
                {week.tasks.map(task => (
                  <div
                    key={task.id}
                    className={`task-card ${task.completed ? 'task-card-completed' : ''}`}
                  >
                    <div className="task-top-row">
                      <div className="task-tags">
                        <span className={`badge ${getDifficultyBadge(task.difficulty)}`}>
                          {task.difficulty}
                        </span>
                        <span className="badge badge-neutral">{task.topic}</span>
                        <span className="badge badge-neutral mono">
                          <Clock size={10} /> {task.estimatedMinutes}m
                        </span>
                      </div>
                      <button
                        className={`task-check-btn ${task.completed ? 'text-success' : 'text-dim'}`}
                        onClick={() => toggleTaskStatus(task.id)}
                        title={task.completed ? "Mark incomplete" : "Mark completed"}
                        aria-label={`Toggle completion for ${task.title}`}
                      >
                        {task.completed ? <CheckCircle size={18} /> : <Circle size={18} />}
                      </button>
                    </div>

                    <div className="task-title-area">
                      <h4 className="task-title">{task.title}</h4>
                      <p className="task-objective">{task.objective}</p>
                    </div>

                    <div className="task-footer">
                      <span className={`task-status-label mono ${task.completed ? 'text-success' : 'text-muted'}`}>
                        {task.completed ? 'Completed' : 'Pending'}
                      </span>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => navigate('/practice', { state: { targetQuestionId: task.questionId } })}
                      >
                        Start Practice
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
