import React, { useState } from 'react';
import { X, Clock, HelpCircle, ChevronDown, ChevronUp, PlusCircle, CheckCircle2 } from 'lucide-react';
import './QuestionDrawer.css';

export function QuestionDrawer({ isOpen, onClose, question, isSolved, onOpenAttemptModal }) {
  if (!isOpen || !question) return null;

  const [expandedHints, setExpandedHints] = useState({});

  const toggleHint = (idx) => {
    setExpandedHints(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const getDifficultyBadgeClass = (diff) => {
    switch (diff) {
      case 'Easy': return 'badge-success';
      case 'Medium': return 'badge-warning';
      case 'Hard': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-meta-tags">
            <span className={`badge ${getDifficultyBadgeClass(question.difficulty)}`}>
              {question.difficulty}
            </span>
            <span className="badge badge-neutral">{question.topic}</span>
            <span className="badge badge-neutral">
              <Clock size={11} /> {question.timeEstimate}m
            </span>
            {isSolved && (
              <span className="badge badge-success">
                <CheckCircle2 size={11} /> Solved
              </span>
            )}
          </div>
          <button className="btn-ghost drawer-close-btn" onClick={onClose} aria-label="Close question details">
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          <h2 className="drawer-title">{question.title}</h2>
          <p className="drawer-summary">{question.summary}</p>

          <div className="detail-section">
            <h3 className="section-title">Problem Statement</h3>
            <div className="problem-text">
              {question.description}
            </div>
          </div>

          <div className="detail-section">
            <h3 className="section-title">Examples</h3>
            {question.examples.map((ex, idx) => (
              <div key={idx} className="example-box">
                <div className="example-row">
                  <span className="example-label">Input:</span>
                  <code className="example-code">{ex.input}</code>
                </div>
                <div className="example-row">
                  <span className="example-label">Output:</span>
                  <code className="example-code">{ex.output}</code>
                </div>
              </div>
            ))}
          </div>

          {question.hints && question.hints.length > 0 && (
            <div className="detail-section">
              <h3 className="section-title">Algorithmic Hints</h3>
              <div className="hints-list">
                {question.hints.map((hint, idx) => (
                  <div key={idx} className="hint-card">
                    <button
                      className="hint-trigger"
                      onClick={() => toggleHint(idx)}
                      aria-expanded={Boolean(expandedHints[idx])}
                    >
                      <div className="hint-trigger-left">
                        <HelpCircle size={14} className="hint-icon" />
                        <span>Hint {idx + 1}</span>
                      </div>
                      {expandedHints[idx] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {expandedHints[idx] && (
                      <div className="hint-content">
                        {hint}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="info-notice">
            <div className="notice-title">Ready to log your progress?</div>
            <p className="notice-text">
              Solve on your local editor or favorite platform, then record your outcome, execution time, and any edge case notes to feed into your analytics.
            </p>
          </div>
        </div>

        <div className="drawer-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Back
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onOpenAttemptModal(question);
            }}
          >
            <PlusCircle size={15} />
            Log Practice Attempt
          </button>
        </div>
      </div>
    </div>
  );
}
