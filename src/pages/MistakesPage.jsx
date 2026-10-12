import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  AlertOctagon,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Edit3,
  Bookmark,
  RotateCcw,
  HelpCircle,
  ExternalLink,
  Save,
  X
} from 'lucide-react';
import { TOPICS, MISTAKE_CATEGORIES } from '../data/initialData';
import './MistakesPage.css';

export function MistakesPage() {
  const { attempts, questions, updateAttempt } = useApp();

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRevisionFilter, setSelectedRevisionFilter] = useState('All'); // 'All' | 'Needs revision' | 'Reviewed'

  // Inline editing modal / dialog state
  const [editingAttempt, setEditingAttempt] = useState(null);
  const [editedNotes, setEditedNotes] = useState('');
  const [editedCategory, setEditedCategory] = useState('');

  // Extract attempts that have logged mistakes or failures
  const mistakeAttempts = useMemo(() => {
    return attempts
      .filter(a => a.result === 'Failed' || a.mistakeCategory !== null || a.needsRevision)
      .map(att => {
        const q = questions.find(item => item.id === att.questionId) || {
          title: 'Unknown Question',
          topic: 'General',
          difficulty: 'Medium'
        };
        return { ...att, question: q };
      });
  }, [attempts, questions]);

  // Filtering
  const filteredMistakes = useMemo(() => {
    return mistakeAttempts.filter(item => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.question.title.toLowerCase().includes(q);
        const matchesNotes = (item.notes || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesNotes) return false;
      }

      // Topic filter
      if (selectedTopic !== 'All' && item.question.topic !== selectedTopic) {
        return false;
      }

      // Mistake Category
      if (selectedCategory !== 'All' && item.mistakeCategory !== selectedCategory) {
        return false;
      }

      // Revision filter
      if (selectedRevisionFilter === 'Needs revision' && !item.needsRevision) {
        return false;
      }
      if (selectedRevisionFilter === 'Reviewed' && item.needsRevision) {
        return false;
      }

      return true;
    });
  }, [mistakeAttempts, searchQuery, selectedTopic, selectedCategory, selectedRevisionFilter]);

  const handleOpenEdit = (attempt) => {
    setEditingAttempt(attempt);
    setEditedNotes(attempt.notes || '');
    setEditedCategory(attempt.mistakeCategory || 'Logic');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingAttempt) return;

    updateAttempt(editingAttempt.id, {
      notes: editedNotes.trim(),
      mistakeCategory: editedCategory
    });
    setEditingAttempt(null);
  };

  const handleToggleRevision = (attempt) => {
    updateAttempt(attempt.id, {
      needsRevision: !attempt.needsRevision
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTopic('All');
    setSelectedCategory('All');
    setSelectedRevisionFilter('All');
  };

  return (
    <div className="mistakes-page">
      {/* Top Banner info */}
      <section className="card mistakes-banner-card">
        <div className="banner-icon-box">
          <AlertOctagon size={24} color="#ff9592" />
        </div>
        <div className="banner-text">
          <h2 className="banner-title">Mistake Diagnostic Log</h2>
          <p className="banner-subtitle">
            Cataloging root causes helps isolate whether you stumble on edge conditions, pointer logic, or algorithmic complexity bounds.
          </p>
        </div>
        <div className="banner-stat mono">
          <span className="text-error">{mistakeAttempts.filter(m => m.needsRevision).length}</span>
          <span className="text-muted"> flagged for review</span>
        </div>
      </section>

      {/* Filter and search control bar */}
      <section className="card mistakes-controls-card">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search logged mistakes by question title or your notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-row">
          <div className="filter-select-group">
            <span className="filter-label mono">TOPIC:</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Topics</option>
              {TOPICS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="filter-select-group">
            <span className="filter-label mono">ROOT CAUSE:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Categories</option>
              {MISTAKE_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="filter-select-group">
            <span className="filter-label mono">STATUS:</span>
            <select
              value={selectedRevisionFilter}
              onChange={(e) => setSelectedRevisionFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Records</option>
              <option value="Needs revision">Flagged for Revision</option>
              <option value="Reviewed">Reviewed / Clear</option>
            </select>
          </div>

          {(searchQuery || selectedTopic !== 'All' || selectedCategory !== 'All' || selectedRevisionFilter !== 'All') && (
            <button className="btn btn-sm btn-ghost reset-filters-btn" onClick={resetFilters}>
              <RotateCcw size={13} />
              Reset Filters
            </button>
          )}
        </div>

        <div className="results-counter mono">
          Showing <span>{filteredMistakes.length}</span> logged entries
        </div>
      </section>

      {/* Mistakes Table / List */}
      <section className="card mistakes-table-card">
        {filteredMistakes.length === 0 ? (
          <div className="empty-state">
            <HelpCircle className="empty-state-icon" />
            <div className="empty-state-title">No mistakes logged under current criteria</div>
            <div className="empty-state-desc">
              When an attempt fails or encounters an edge case, log the root cause from the Practice page to populate this tracker.
            </div>
            <Link to="/practice" className="btn btn-primary">
              Browse Practice Bank
            </Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table mistakes-table">
              <thead>
                <tr>
                  <th>REVISION</th>
                  <th>PROBLEM</th>
                  <th>TOPIC</th>
                  <th>MISTAKE ROOT CAUSE</th>
                  <th>OBSERVATION & NOTES</th>
                  <th>DATE</th>
                  <th className="text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredMistakes.map(item => (
                  <tr key={item.id}>
                    <td style={{ width: '130px' }}>
                      <button
                        className={`btn btn-sm ${item.needsRevision ? 'btn-danger' : 'btn-ghost'}`}
                        onClick={() => handleToggleRevision(item)}
                        title={item.needsRevision ? "Mark reviewed" : "Flag for revision"}
                      >
                        <Bookmark size={12} />
                        {item.needsRevision ? 'Revise' : 'Reviewed'}
                      </button>
                    </td>

                    <td className="table-title-cell font-medium">
                      <Link
                        to="/practice"
                        state={{ targetQuestionId: item.question.id }}
                        className="question-ref-link"
                      >
                        {item.question.title}
                        <ExternalLink size={11} className="inline-ext-icon" />
                      </Link>
                    </td>

                    <td>
                      <span className="badge badge-neutral">{item.question.topic}</span>
                    </td>

                    <td>
                      <span className="badge badge-warning">
                        {item.mistakeCategory || 'Unclassified'}
                      </span>
                    </td>

                    <td className="notes-cell">
                      <div className="notes-snippet">
                        {item.notes || <span className="text-dim italic">No notes recorded</span>}
                      </div>
                    </td>

                    <td className="mono text-muted">
                      {new Date(item.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>

                    <td className="text-right">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => handleOpenEdit(item)}
                        title="Edit mistake category and notes"
                      >
                        <Edit3 size={13} />
                        Edit Notes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Edit Note Modal */}
      {editingAttempt && (
        <div className="modal-overlay" onClick={() => setEditingAttempt(null)} role="dialog" aria-modal="true">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-subtitle">EDIT ATTEMPT RECORD</div>
                <h3 className="modal-title">{editingAttempt.question.title}</h3>
              </div>
              <button
                className="btn-ghost modal-close-btn"
                onClick={() => setEditingAttempt(null)}
                aria-label="Close edit modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="editCategorySelect">
                    Mistake Category
                  </label>
                  <select
                    id="editCategorySelect"
                    value={editedCategory}
                    onChange={(e) => setEditedCategory(e.target.value)}
                    className="form-select"
                  >
                    {MISTAKE_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="editNotesTextarea">
                    Technical Notes & Root Cause Analysis
                  </label>
                  <textarea
                    id="editNotesTextarea"
                    rows="4"
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    className="form-textarea"
                    placeholder="Describe what condition failed or what pattern to remember..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditingAttempt(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={14} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
