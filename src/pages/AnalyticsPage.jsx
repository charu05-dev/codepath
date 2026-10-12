import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Target,
  Award,
  AlertOctagon,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  CheckCircle2,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import './AnalyticsPage.css';

export function AnalyticsPage() {
  const { analytics, questions } = useApp();

  const difficultyColors = {
    'Easy': '#3ad389',
    'Medium': '#ffca16',
    'Hard': '#ff9592'
  };

  const mistakeColors = [
    '#ff9592',
    '#ffca16',
    '#9281f7',
    '#70b8ff',
    '#baa7ff',
    '#6c7073'
  ];

  return (
    <div className="analytics-page">
      {/* Overview Stat Cards */}
      <section className="overview-grid">
        <div className="card stat-card">
          <div className="stat-label mono">TOTAL ATTEMPTS</div>
          <div className="stat-value">{analytics.totalAttempts}</div>
          <div className="stat-meta">Practice logs submitted</div>
        </div>

        <div className="card stat-card">
          <div className="stat-label mono">QUESTIONS SOLVED</div>
          <div className="stat-value text-success">
            {analytics.totalSolved} <span className="stat-denom">/ {analytics.totalQuestions}</span>
          </div>
          <div className="stat-meta">Unique problems cleared</div>
        </div>

        <div className="card stat-card">
          <div className="stat-label mono">SUCCESS RATE</div>
          <div className="stat-value text-violet">{analytics.overallAccuracy}%</div>
          <div className="stat-meta">Overall problem accuracy</div>
        </div>

        <div className="card stat-card">
          <div className="stat-label mono">ACTIVE STREAK</div>
          <div className="stat-value text-warning">{analytics.streak} <span className="stat-denom">days</span></div>
          <div className="stat-meta">Consecutive daily sessions</div>
        </div>
      </section>

      {/* Domain Proficiency: Strongest vs Weakest */}
      <section className="card domain-eval-card">
        <div className="eval-half strongest-half">
          <div className="eval-tag">
            <Award size={14} className="text-success" />
            <span className="mono text-success">STRONGEST DOMAIN</span>
          </div>
          <h3 className="eval-topic">
            {analytics.strongestTopic ? analytics.strongestTopic.topic : 'None'}
          </h3>
          <div className="eval-stats mono">
            {analytics.strongestTopic ? `${analytics.strongestTopic.accuracy}% Accuracy · ${analytics.strongestTopic.solved} Solved` : 'No data'}
          </div>
          <p className="eval-desc">
            Highest success rate across completed challenges. Pattern recognition in this category is solid.
          </p>
        </div>

        <div className="eval-divider"></div>

        <div className="eval-half weakest-half">
          <div className="eval-tag">
            <AlertOctagon size={14} className="text-warning" />
            <span className="mono text-warning">FOCUS AREA (WEAKEST DOMAIN)</span>
          </div>
          <h3 className="eval-topic">
            {analytics.weakestTopic ? analytics.weakestTopic.topic : 'None'}
          </h3>
          <div className="eval-stats mono">
            {analytics.weakestTopic ? `${analytics.weakestTopic.accuracy}% Accuracy · ${analytics.weakestTopic.solved} Solved` : 'No data'}
          </div>
          <p className="eval-desc">
            Lowest relative accuracy or least practiced pattern. Targeted drilling here yields highest interview leverage.
          </p>
        </div>
      </section>

      {/* Visualizations Grid */}
      <section className="charts-grid">
        {/* Topic-Wise Accuracy Bar Chart */}
        <div className="card chart-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Topic Accuracy Breakdown</h3>
              <div className="card-subtitle">Calculated as (Solved Attempts / Total Attempts) per topic</div>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={analytics.topicStats}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
              >
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  stroke="#6c7073"
                  fontSize={11}
                  unit="%"
                  tickLine={false}
                  axisLine={{ stroke: '#292d30' }}
                />
                <YAxis
                  type="category"
                  dataKey="topic"
                  stroke="#a1a4a5"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#292d30' }}
                  width={110}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="custom-chart-tooltip">
                          <div className="tooltip-title">{data.topic}</div>
                          <div className="text-violet mono">Accuracy: {data.accuracy}%</div>
                          <div className="text-muted mono">Solved: {data.solved} / {data.total}</div>
                          <div className="text-dim mono">Attempts: {data.attempts}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="accuracy" fill="#9281f7" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Difficulty Distribution Chart */}
        <div className="card chart-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Difficulty Distribution</h3>
              <div className="card-subtitle">Problems solved vs total across difficulty tiers</div>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={analytics.difficultyStats}
                margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
              >
                <XAxis
                  dataKey="difficulty"
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
                          <div className="tooltip-title">{data.difficulty} Tier</div>
                          <div className="text-success mono">Solved: {data.solved}</div>
                          <div className="text-muted mono">Total bank: {data.total}</div>
                          <div className="text-dim mono">Attempts: {data.attempts}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="solved" radius={[4, 4, 0, 0]}>
                  {analytics.difficultyStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={difficultyColors[entry.difficulty] || '#9281f7'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Mistake Categories & Strategic Recommendation */}
      <section className="analytics-bottom-grid">
        {/* Most Common Mistakes */}
        <div className="card mistake-dist-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Mistake Root-Cause Frequency</h3>
              <div className="card-subtitle">Distribution of failed attempt classifications</div>
            </div>
          </div>

          {analytics.mistakeBreakdown.length === 0 ? (
            <div className="empty-state">
              <CheckCircle2 className="empty-state-icon text-success" />
              <div className="empty-state-title">No mistakes logged</div>
              <div className="empty-state-desc">
                Failed attempts and revision tags will be categorized here to show root cause frequencies.
              </div>
            </div>
          ) : (
            <div className="mistake-progress-list">
              {analytics.mistakeBreakdown.map((item, idx) => {
                const totalMistakes = analytics.mistakeBreakdown.reduce((sum, m) => sum + m.count, 0);
                const pct = totalMistakes > 0 ? Math.round((item.count / totalMistakes) * 100) : 0;

                return (
                  <div key={item.category} className="mistake-stat-item">
                    <div className="mistake-stat-header">
                      <span className="mistake-cat-name font-medium">{item.category}</span>
                      <span className="mistake-cat-count mono">
                        {item.count} occurrences ({pct}%)
                      </span>
                    </div>
                    <div className="progress-bar-track">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: mistakeColors[idx % mistakeColors.length]
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Suggested Next Steps */}
        <div className="card recommendation-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Compass size={16} className="text-violet" />
                Data-Driven Next Steps
              </h3>
              <div className="card-subtitle">Automated recommendations derived from your session history</div>
            </div>
          </div>

          <div className="recommendation-content">
            <div className="rec-step-box">
              <div className="rec-step-title font-medium">
                1. Focus drilling on {analytics.weakestTopic ? analytics.weakestTopic.topic : 'Arrays'}
              </div>
              <p className="rec-step-desc">
                Your current accuracy in this domain is {analytics.weakestTopic ? analytics.weakestTopic.accuracy : 0}%.
                Target 2 Medium problems here to reinforce boundary handling.
              </p>
            </div>

            <div className="rec-step-box">
              <div className="rec-step-title font-medium">
                2. Review flagged revision questions
              </div>
              <p className="rec-step-desc">
                Address previous syntax or edge-case oversights recorded in the Mistake Tracker before moving forward.
              </p>
            </div>

            <div className="rec-actions">
              <Link to="/practice" className="btn btn-primary">
                Jump to Practice Bank
                <ArrowRight size={14} />
              </Link>
              <Link to="/mistakes" className="btn btn-outline">
                Review Mistakes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
