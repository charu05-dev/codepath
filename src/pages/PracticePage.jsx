import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AttemptModal } from '../components/AttemptModal';
import { QuestionDrawer } from '../components/QuestionDrawer';
import {
  Search,
  Filter,
  ArrowUpDown,
  Clock,
  PlusCircle,
  Eye,
  CheckCircle2,
  XCircle,
  HelpCircle,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { TOPICS, DIFFICULTIES } from '../data/initialData';
import './PracticePage.css';

export function PracticePage() {
  const { questions, attempts, logAttempt } = useApp();
  const location = useLocation();

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All'); // 'All' | 'Unattempted' | 'Solved' | 'Needs revision'
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'title' | 'difficulty' | 'time'

  // Modals & Drawer state
  const [drawerQuestion, setDrawerQuestion] = useState(null);
  const [attemptModalQuestion, setAttemptModalQuestion] = useState(null);

  // If navigated from Roadmap or Continue Card with targetQuestionId
  useEffect(() => {
    if (location.state?.targetQuestionId) {
      const q = questions.find(item => item.id === location.state.targetQuestionId);
      if (q) {
        setDrawerQuestion(q);
      }
    }
  }, [location.state, questions]);

  // Derived statuses
  const solvedQuestionIds = useMemo(() => {
    return new Set(attempts.filter(a => a.result === 'Solved').map(a => a.questionId));
  }, [attempts]);

  const revisionQuestionIds = useMemo(() => {
    return new Set(attempts.filter(a => a.needsRevision).map(a => a.questionId));
  }, [attempts]);

  // Filtering & Sorting pipeline
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = q.title.toLowerCase().includes(query);
        const matchesTopic = q.topic.toLowerCase().includes(query);
        if (!matchesTitle && !matchesTopic) return false;
      }

      // Topic filter
      if (selectedTopic !== 'All' && q.topic !== selectedTopic) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) {
        return false;
      }

      // Status filter
      if (selectedStatus === 'Solved' && !solvedQuestionIds.has(q.id)) {
        return false;
      }
      if (selectedStatus === 'Unattempted' && (solvedQuestionIds.has(q.id) || revisionQuestionIds.has(q.id))) {
        return false;
      }
      if (selectedStatus === 'Needs revision' && !revisionQuestionIds.has(q.id)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'difficulty') {
        const order = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return order[a.difficulty] - order[b.difficulty];
      }
      if (sortBy === 'time') {
        return a.timeEstimate - b.timeEstimate;
      }
      return 0; // default order
    });
  }, [questions, searchQuery, selectedTopic, selectedDifficulty, selectedStatus, sortBy, solvedQuestionIds, revisionQuestionIds]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTopic('All');
    setSelectedDifficulty('All');
    setSelectedStatus('All');
    setSortBy('default');
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Easy': return 'badge-success';
      case 'Medium': return 'badge-warning';
      case 'Hard': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="practice-page">
      {/* Controls Bar: Search, Filters, Sorters */}
      <section className="card filter-controls-card">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search problems by name or pattern (e.g. 'Binary Search', 'Two Sum')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <XCircle size={15} />
            </button>
          )}
        </div>

        <div className="filters-row">
          <div className="filter-select-group">
            <span className="filter-label mono">TOPIC:</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Topics ({questions.length})</option>
              {TOPICS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="filter-select-group">
            <span className="filter-label mono">DIFFICULTY:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Difficulties</option>
              {DIFFICULTIES.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="filter-select-group">
            <span className="filter-label mono">STATUS:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Statuses</option>
              <option value="Unattempted">Unattempted</option>
              <option value="Solved">Solved</option>
              <option value="Needs revision">Needs Revision</option>
            </select>
          </div>

          <div className="filter-select-group">
            <span className="filter-label mono">SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="default">Default Order</option>
              <option value="title">Title (A-Z)</option>
              <option value="difficulty">Difficulty (Easy to Hard)</option>
              <option value="time">Duration (Shortest)</option>
            </select>
          </div>

          {(searchQuery || selectedTopic !== 'All' || selectedDifficulty !== 'All' || selectedStatus !== 'All' || sortBy !== 'default') && (
            <button className="btn btn-sm btn-ghost reset-filters-btn" onClick={resetFilters}>
              <RotateCcw size={13} />
              Reset Filters
            </button>
          )}
        </div>

        <div className="results-counter mono">
          Showing <span>{filteredQuestions.length}</span> of {questions.length} problems
        </div>
      </section>

      {/* Questions Bank Table */}
      <section className="card questions-list-card">
        {filteredQuestions.length === 0 ? (
          <div className="empty-state">
            <HelpCircle className="empty-state-icon" />
            <div className="empty-state-title">No matching problems found</div>
            <div className="empty-state-desc">
              Try adjusting your search criteria, switching topics, or resetting all filters.
            </div>
            <button className="btn btn-outline" onClick={resetFilters}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table practice-table">
              <thead>
                <tr>
                  <th>STATUS</th>
                  <th>PROBLEM TITLE</th>
                  <th>TOPIC</th>
                  <th>DIFFICULTY</th>
                  <th>EST. TIME</th>
                  <th className="text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.map((q) => {
                  const isSolved = solvedQuestionIds.has(q.id);
                  const needsRev = revisionQuestionIds.has(q.id);

                  return (
                    <tr key={q.id}>
                      <td style={{ width: '120px' }}>
                        {isSolved ? (
                          <span className="badge badge-success">
                            <CheckCircle2 size={11} /> Solved
                          </span>
                        ) : needsRev ? (
                          <span className="badge badge-warning">
                            Revise
                          </span>
                        ) : (
                          <span className="badge badge-neutral">
                            New
                          </span>
                        )}
                      </td>
                      <td className="table-title-cell">
                        <button
                          className="question-title-link"
                          onClick={() => setDrawerQuestion(q)}
                        >
                          {q.title}
                        </button>
                        <div className="question-table-summary">{q.summary}</div>
                      </td>
                      <td>
                        <span className="badge badge-neutral">{q.topic}</span>
                      </td>
                      <td>
                        <span className={`badge ${getDifficultyBadge(q.difficulty)}`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="mono text-muted">
                        <Clock size={12} className="inline-icon" /> {q.timeEstimate}m
                      </td>
                      <td className="text-right">
                        <div className="row-action-btns">
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => setDrawerQuestion(q)}
                            title="Inspect details and hints"
                          >
                            <Eye size={13} />
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => setAttemptModalQuestion(q)}
                            title="Log attempt outcome"
                          >
                            <PlusCircle size={13} />
                            Log Attempt
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Problem Details Drawer */}
      <QuestionDrawer
        isOpen={Boolean(drawerQuestion)}
        question={drawerQuestion}
        isSolved={drawerQuestion ? solvedQuestionIds.has(drawerQuestion.id) : false}
        onClose={() => setDrawerQuestion(null)}
        onOpenAttemptModal={(q) => setAttemptModalQuestion(q)}
      />

      {/* Attempt Modal */}
      <AttemptModal
        isOpen={Boolean(attemptModalQuestion)}
        question={attemptModalQuestion}
        onClose={() => setAttemptModalQuestion(null)}
        onSubmitAttempt={logAttempt}
      />
    </div>
  );
}
