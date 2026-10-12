import React, { useState } from 'react';
import { X, Clock, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { MISTAKE_CATEGORIES } from '../data/initialData';
import './AttemptModal.css';

export function AttemptModal({ isOpen, onClose, question, onSubmitAttempt }) {
  if (!isOpen || !question) return null;

  const [result, setResult] = useState('Solved'); // 'Solved' | 'Failed'
  const [timeTaken, setTimeTaken] = useState(question.timeEstimate || 20);
  const [mistakeCategory, setMistakeCategory] = useState('Logic');
  const [notes, setNotes] = useState('');
  const [needsRevision, setNeedsRevision] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitAttempt({
      questionId: question.id,
      result,
      timeTaken: Number(timeTaken) || 20,
      mistakeCategory: result === 'Failed' ? mistakeCategory : null,
      notes: notes.trim(),
      needsRevision: result === 'Failed' ? needsRevision : false
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-subtitle">LOG ATTEMPT</div>
            <h2 className="modal-title">{question.title}</h2>
          </div>
          <button className="btn-ghost modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Outcome Toggle */}
            <div className="form-group">
              <label className="form-label">Attempt Outcome</label>
              <div className="outcome-selector">
                <button
                  type="button"
                  className={`outcome-btn ${result === 'Solved' ? 'outcome-solved-active' : ''}`}
                  onClick={() => {
                    setResult('Solved');
                    setNeedsRevision(false);
                  }}
                >
                  <CheckCircle size={15} />
                  Solved Correctly
                </button>
                <button
                  type="button"
                  className={`outcome-btn ${result === 'Failed' ? 'outcome-failed-active' : ''}`}
                  onClick={() => {
                    setResult('Failed');
                    setNeedsRevision(true);
                  }}
                >
                  <AlertTriangle size={15} />
                  Encountered Issue / Failed
                </button>
              </div>
            </div>

            {/* Time Taken */}
            <div className="form-group">
              <label className="form-label" htmlFor="timeTakenInput">
                Time Spent (Minutes)
              </label>
              <div className="input-with-icon">
                <Clock size={15} className="input-icon" />
                <input
                  id="timeTakenInput"
                  type="number"
                  min="1"
                  max="180"
                  value={timeTaken}
                  onChange={(e) => setTimeTaken(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-hint">Recommended time for this problem: ~{question.timeEstimate}m</div>
            </div>

            {/* Mistake classification (if failed) */}
            {result === 'Failed' && (
              <div className="form-group failed-section">
                <label className="form-label" htmlFor="mistakeCategorySelect">
                  Primary Mistake Root Cause
                </label>
                <select
                  id="mistakeCategorySelect"
                  value={mistakeCategory}
                  onChange={(e) => setMistakeCategory(e.target.value)}
                  className="form-select"
                >
                  {MISTAKE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="form-hint">
                  Helps detect recurring failure patterns in your analytics.
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={needsRevision}
                      onChange={(e) => setNeedsRevision(e.target.checked)}
                    />
                    <span>Flag for scheduled revision in Mistake Tracker</span>
                  </label>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="form-group">
              <label className="form-label" htmlFor="attemptNotesInput">
                Learnings & Technical Notes
              </label>
              <textarea
                id="attemptNotesInput"
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What invariant did you observe? What edge case broke your code?"
                className="form-textarea"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Record Attempt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
