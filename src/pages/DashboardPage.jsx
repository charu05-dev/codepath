import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AttemptModal } from '../components/AttemptModal';
import {
  CheckCircle2,
  Flame,
  Target,
  Clock,
  Compass,
  Code2,
  AlertOctagon,
  ArrowRight,
  TrendingUp,
  PlusCircle,
  HelpCircle,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import './DashboardPage.css';

export function DashboardPage() {
  const { analytics, questions, attempts, logAttempt } = useApp();
  const [modalQuestion, setModalQuestion] = useState(null);

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Easy': return 'badge-success';
      case 'Medium': return 'badge-warning';
      case 'Hard': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  const recentAttempts = attempts.slice(0, 5).map(att => {
    const q = questions.find(item => item.id === att.questionId) || {
      title: 'Unknown Question',
      topic: 'General',
      difficulty: 'Medium'
    };
    return { ...att, question: q };
  });

  return (
    <div className="dashboard-page">
      {/* Top 4 KPI Metrics */}
      <section className="kpi-grid">
        <div className="card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">QUESTIONS SOLVED</span>
            <CheckCircle2 size={16} className="text-success" />
          </div>
          <div className="kpi-body">
            <div className="kpi-value">{analytics.totalSolved}</div>
            <div className="kpi-subtext">
              of <span className="mono">{analytics.totalQuestions}</span> questions in curriculum
            </div>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill progress-success"
              style={{
                width: `${analytics.totalQuestions ? (analytics.totalSolved / analytics.totalQuestions) * 100 : 0}%`
              }}
            />
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">TOTAL ATTEMPTS</span>
            <Target size={16} className="text-info" />
          </div>
          <div className="kpi-body">
            <div className="kpi-value">{analytics.totalAttempts}</div>
            <div className="kpi-subtext">
              Logged practice sessions
            </div>
          </div>
          <div className="kpi-badge-row">
            <span className="badge badge-neutral">Accuracy: {analytics.overallAccuracy}%</span>
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">ACCURACY RATE</span>
            <TrendingUp size={16} className="text-violet" />
          </div>
          <div className="kpi-body">
            <div className="kpi-value">{analytics.overallAccuracy}%</div>
            <div className="kpi-subtext">
              Ratio of first/subsequent passes
            </div>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill progress-violet"
              style={{ width: `${analytics.overallAccuracy}%` }}
            />
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">CURRENT STREAK</span>
            <Flame size={16} className="text-warning" />
          </div>
          <div className="kpi-body">
            <div className="kpi-value">{analytics.streak} <span className="kpi-unit">days</span></div>
            <div className="kpi-subtext">
              {analytics.streak > 0 ? "Daily consistency maintained" : "Solve 1 question today to ignite streak"}
            </div>
          </div>
          <div className="kpi-badge-row">
            <span className="badge badge-warning">Active Streak</span>
          </div>
        </div>
      </section>

      {/* Continue Learning Banner */}
      {analytics.nextRecommended && (
        <section className="card next-card">
          <div className="next-card-content">
            <div className="next-badge-row">
              <span className="badge badge-violet">RECOMMENDED NEXT TASK</span>
              <span className={`badge ${getDifficultyBadge(analytics.nextRecommended.difficulty)}`}>
                {analytics.nextRecommended.difficulty}
              </span>
              <span className="badge badge-neutral">{analytics.nextRecommended.topic}</span>
            </div>
            <h2 className="next-title">{analytics.nextRecommended.title}</h2>
            <p className="next-desc">{analytics.nextRecommended.summary}</p>
            <div className="next-reason mono">
              Goal: {analytics.nextRecommended.reason}
            </div>
          </div>
          <div className="next-actions">
            <button
              className="btn btn-primary"
              onClick={() => setModalQuestion(analytics.nextRecommended)}
            >
              <PlusCircle size={15} />
              Log Attempt
            </button>
            <Link to="/practice" className="btn btn-outline">
              View Bank
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* Grid: Topic Progress & Weekly Activity Chart */}
      <section className="dashboard-split-grid">
        {/* Topic-wise Progress */}
        <div className="card topic-progress-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Layers size={16} className="text-violet" />
                Topic-Wise Curriculum Progress
              </h3>
              <div className="card-subtitle">Mastery distribution across essential DSA patterns</div>
            </div>
            <Link to="/practice" className="card-action-link">
              Filter <ChevronRight size={14} />
            </Link>
          </div>

          <div className="topic-list">
            {analytics.topicStats.map(stat => (
              <div key={stat.topic} className="topic-row">
                <div className="topic-meta">
                  <span className="topic-name">{stat.topic}</span>
                  <div className="topic-counts mono">
                    <span className="text-primary">{stat.solved}</span>
                    <span className="text-dim">/{stat.total} solved</span>
                    <span className="topic-acc-tag">({stat.accuracy}% acc)</span>
                  </div>
                </div>
                <div className="progress-bar-track">
                  <div
                    className="progress-bar-fill progress-violet"
                    style={{ width: `${stat.progressPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="card activity-chart-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <TrendingUp size={16} className="text-violet" />
                Weekly Problem Activity
              </h3>
              <div className="card-subtitle">Solved challenges over the last 7 calendar days</div>
            </div>
            <span className="badge badge-neutral">Past 7 Days</span>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={analytics.weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  stroke="#6c7073"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#292d30' }}
                />
                <YAxis
                  stroke="#6c7073"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#292d30' }}
                  allowDecimals={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="custom-chart-tooltip">
                          <div className="tooltip-date mono">{data.date} ({data.day})</div>
                          <div className="tooltip-val text-success">Solved: {data.solved}</div>
                          <div className="tooltip-val text-muted">Total attempts: {data.attempts}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="solved" fill="#9281f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-footer-metrics">
            <div className="footer-metric-item">
              <span className="item-label">Strongest Domain:</span>
              <span className="item-value text-success">
                {analytics.strongestTopic ? analytics.strongestTopic.topic : 'None'}
              </span>
            </div>
            <div className="footer-metric-item">
              <span className="item-label">Focus Area:</span>
              <span className="item-value text-warning">
                {analytics.weakestTopic ? analytics.weakestTopic.topic : 'None'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Attempts & Quick Actions */}
      <section className="card recent-attempts-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Recent Attempt Logs</h3>
            <div className="card-subtitle">Latest recorded outcomes and time spent</div>
          </div>
          <div className="quick-action-btns">
            <Link to="/practice" className="btn btn-sm btn-outline">
              <Code2 size={13} />
              Practice Questions
            </Link>
            <Link to="/roadmap" className="btn btn-sm btn-outline">
              <Compass size={13} />
              View Roadmap
            </Link>
          </div>
        </div>

        {recentAttempts.length === 0 ? (
          <div className="empty-state">
            <HelpCircle className="empty-state-icon" />
            <div className="empty-state-title">No attempts recorded yet</div>
            <div className="empty-state-desc">
              Get started by opening a question from the practice bank and recording your first attempt.
            </div>
            <Link to="/practice" className="btn btn-primary">
              Open Practice Bank
            </Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>QUESTION</th>
                  <th>TOPIC</th>
                  <th>RESULT</th>
                  <th>TIME</th>
                  <th>MISTAKE TYPE</th>
                  <th>DATE</th>
                </tr>
              </thead>
              <tbody>
                {recentAttempts.map(att => (
                  <tr key={att.id}>
                    <td className="table-title-cell font-medium">
                      {att.question.title}
                    </td>
                    <td>
                      <span className="badge badge-neutral">{att.question.topic}</span>
                    </td>
                    <td>
                      <span className={`badge ${att.result === 'Solved' ? 'badge-success' : 'badge-error'}`}>
                        {att.result}
                      </span>
                    </td>
                    <td className="mono text-muted">{att.timeTaken}m</td>
                    <td>
                      {att.mistakeCategory ? (
                        <span className="badge badge-warning">{att.mistakeCategory}</span>
                      ) : (
                        <span className="text-dim mono">—</span>
                      )}
                    </td>
                    <td className="mono text-muted">
                      {new Date(att.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modal for logging attempt */}
      <AttemptModal
        isOpen={Boolean(modalQuestion)}
        question={modalQuestion}
        onClose={() => setModalQuestion(null)}
        onSubmitAttempt={logAttempt}
      />
    </div>
  );
}
