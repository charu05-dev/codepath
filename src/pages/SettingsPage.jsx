import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  ShieldAlert,
  RotateCcw,
  Trash2,
  Save,
  CheckCircle2,
  HardDrive,
  Info
} from 'lucide-react';
import './SettingsPage.css';

export function SettingsPage() {
  const { preferences, updatePreferences, resetAllData, clearAllAttempts } = useApp();

  const [formData, setFormData] = useState({
    displayName: preferences.displayName || 'Alex Rivera',
    targetRole: preferences.targetRole || 'Software Engineer (SDE I)',
    dailyHours: preferences.dailyHours || 2,
    currentLevel: preferences.currentLevel || 'Beginner'
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePreferences(formData);
  };

  const handleConfirmReset = () => {
    resetAllData();
    setShowResetConfirm(false);
    setFormData({
      displayName: 'Alex Rivera',
      targetRole: 'Software Engineer (SDE I)',
      dailyHours: 2,
      currentLevel: 'Beginner'
    });
  };

  const handleConfirmClear = () => {
    clearAllAttempts();
    setShowClearConfirm(false);
  };

  return (
    <div className="settings-page">
      {/* Profile & Target Parameters Form */}
      <section className="card settings-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Demo User Profile & Targets</h3>
            <div className="card-subtitle">
              Configure your local identity and candidate target specifications
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="displayNameInput">Candidate Display Name</label>
              <input
                id="displayNameInput"
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="targetRoleInput">Target Interview Role</label>
              <input
                id="targetRoleInput"
                type="text"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="currentLevelInput">Experience Level</label>
              <select
                id="currentLevelInput"
                value={formData.currentLevel}
                onChange={(e) => setFormData({ ...formData, currentLevel: e.target.value })}
                className="form-select"
              >
                <option value="Beginner">Beginner (University Graduate / Intern)</option>
                <option value="Intermediate">Intermediate (1-2 YoE / Associate)</option>
                <option value="Advanced">Advanced (Mid-level to Senior transitions)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="dailyHoursInput">Daily Study Allocation (Hours)</label>
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

          <div className="form-save-row">
            <button type="submit" className="btn btn-primary">
              <Save size={14} />
              Save Profile Preferences
            </button>
          </div>
        </form>
      </section>

      {/* Local Storage Architecture Notice */}
      <section className="card storage-info-card">
        <div className="storage-icon-box">
          <HardDrive size={22} className="text-violet" />
        </div>
        <div className="storage-text-content">
          <h4 className="storage-heading">Client-Side Persistence Model</h4>
          <p className="storage-desc">
            All your curriculum progression, attempt history, and mistake notes are stored directly in your browser's <code className="mono">localStorage</code>.
            No remote database or authentication server is invoked in this version.
          </p>
        </div>
        <div className="storage-badge-pill mono">
          Status: Operational (Local)
        </div>
      </section>

      {/* Danger Zone: Reset & Clear actions */}
      <section className="card danger-card">
        <div className="card-header">
          <div>
            <h3 className="card-title text-error">Data Management & Factory Reset</h3>
            <div className="card-subtitle">
              Reset demo workspace or clear attempt logs for testing zero-data states
            </div>
          </div>
        </div>

        <div className="danger-actions-list">
          <div className="danger-item">
            <div className="danger-info">
              <div className="danger-item-title font-medium">Restore Initial Demo Seed Data</div>
              <p className="danger-item-desc">
                Resets the curriculum, seed attempts, and preferences back to the factory sample dataset.
              </p>
            </div>
            <button
              className="btn btn-outline"
              onClick={() => setShowResetConfirm(true)}
            >
              <RotateCcw size={14} />
              Restore Initial Data
            </button>
          </div>

          <div className="danger-item">
            <div className="danger-info">
              <div className="danger-item-title font-medium text-error">Clear All Practice History</div>
              <p className="danger-item-desc">
                Empties all recorded attempts and mistakes to test zero-attempt states across the dashboard and analytics.
              </p>
            </div>
            <button
              className="btn btn-danger"
              onClick={() => setShowClearConfirm(true)}
            >
              <Trash2 size={14} />
              Clear Attempts
            </button>
          </div>
        </div>
      </section>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="modal-overlay" onClick={() => setShowResetConfirm(false)} role="dialog" aria-modal="true">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Restore Factory Demo Data?</h3>
            </div>
            <div className="modal-body">
              <p className="modal-text">
                This will overwrite your current progress and restore the 6 initial sample attempts and default beginner roadmap. Are you sure you wish to proceed?
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleConfirmReset}>
                Confirm Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal-overlay" onClick={() => setShowClearConfirm(false)} role="dialog" aria-modal="true">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title text-error">Clear All Recorded Attempts?</h3>
            </div>
            <div className="modal-body">
              <p className="modal-text">
                This will wipe all attempt records from localStorage so you can inspect zero-data metric states. Questions and roadmap structure will be preserved.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowClearConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleConfirmClear}>
                Wipe All Attempts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
