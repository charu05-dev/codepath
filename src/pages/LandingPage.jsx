import React from 'react';
import { Link } from 'react-router-dom';
import {
  Terminal,
  ArrowRight,
  Compass,
  CheckCircle2,
  AlertOctagon,
  BarChart3,
  ShieldAlert,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import './LandingPage.css';

export function LandingPage() {
  const features = [
    {
      icon: Compass,
      title: "Deterministic Roadmap Sequencing",
      description: "Structured multi-week algorithmic progression organized by foundational patterns—from arrays and hash maps to two pointers and sliding windows."
    },
    {
      icon: AlertOctagon,
      title: "Root-Cause Mistake Tracker",
      description: "Log logic slips, edge-case oversights, and complexity pitfalls with notes to identify recurring bugs before high-stakes interview loops."
    },
    {
      icon: BarChart3,
      title: "Accurate Performance Analytics",
      description: "Real-time accuracy calculations, difficulty distributions, and topic mastery ratings derived strictly from your stored attempt log."
    },
    {
      icon: Cpu,
      title: "Local-First Zero Latency",
      description: "Your curriculum, notes, and activity persist in your browser localStorage with instant responses, full privacy, and offline readiness."
    }
  ];

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-brand">
            <div className="brand-mark">
              <Terminal size={16} color="#9281f7" />
            </div>
            <span className="brand-name">CodePath <span className="brand-badge">AI</span></span>
          </div>
          <div className="landing-nav-actions">
            <Link to="/dashboard" className="btn btn-primary">
              Open Dashboard
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-announcement">
          <span className="badge badge-violet">DSA PREPARATION PLATFORM</span>
          <span className="announcement-text">Designed specifically for fresh graduates & junior engineers</span>
        </div>

        <h1 className="hero-headline serif">
          Prepare smarter.<br />Solve with confidence.
        </h1>

        <p className="hero-description">
          A dedicated DSA interview preparation system built with precision developer tooling aesthetics.
          Sequence your study path, diagnose recurring algorithmic mistakes, and track mastery without fluff.
        </p>

        <div className="hero-cta-group">
          <Link to="/dashboard" className="btn btn-lg btn-primary">
            Open Dashboard
            <ArrowRight size={16} />
          </Link>
          <Link to="/practice" className="btn btn-lg btn-outline">
            Browse Question Bank
          </Link>
        </div>

        {/* Technical Notice Banner */}
        <div className="landing-disclaimer">
          <div className="disclaimer-title">
            <ShieldAlert size={14} className="text-violet" />
            Architectural Note: Local Evaluation Model
          </div>
          <p className="disclaimer-text">
            CodePath AI is currently operating as a high-fidelity local preparation dashboard. All metrics,
            roadmaps, and logs are persisted client-side in your browser. Live cloud-based AI code evaluations and automated execution engines are planned for subsequent releases.
          </p>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="landing-features">
        <div className="section-header">
          <div className="section-tag">ENGINEERED FOR RIGOR</div>
          <h2 className="section-title">Everything you need to crack the technical screen</h2>
        </div>

        <div className="features-grid">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="feature-card card">
                <div className="feature-icon-wrapper">
                  <Icon size={20} color="#9281f7" />
                </div>
                <h3 className="feature-title">{feat.title}</h3>
                <p className="feature-description">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Workflow Section */}
      <section className="landing-workflow">
        <div className="workflow-card card">
          <div className="workflow-header">
            <span className="badge badge-neutral">THE LEARNING LOOP</span>
            <h3 className="workflow-title">How CodePath AI refines your problem solving</h3>
          </div>
          <div className="workflow-steps">
            <div className="workflow-step">
              <div className="step-num mono">01</div>
              <div className="step-name">Generate Roadmap</div>
              <div className="step-desc">Establish your weekly milestones according to your daily availability and target role.</div>
            </div>
            <div className="workflow-step">
              <div className="step-num mono">02</div>
              <div className="step-name">Practice & Time</div>
              <div className="step-desc">Tackle curated algorithmic challenges with progressive hints and realistic time envelopes.</div>
            </div>
            <div className="workflow-step">
              <div className="step-num mono">03</div>
              <div className="step-name">Catalog Mistakes</div>
              <div className="step-desc">Document off-by-one errors, edge cases, and algorithmic complexity traps for targeted revisions.</div>
            </div>
            <div className="workflow-step">
              <div className="step-num mono">04</div>
              <div className="step-name">Empirical Analytics</div>
              <div className="step-desc">Inspect your strongest and weakest topic dimensions to eliminate blind spots prior to interview day.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Terminal size={14} color="#9281f7" />
            <span>CodePath AI &copy; 2026. Local-first interview preparation workspace.</span>
          </div>
          <div className="footer-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/roadmap">Roadmap</Link>
            <Link to="/practice">Practice</Link>
            <Link to="/mistakes">Mistakes</Link>
            <Link to="/analytics">Analytics</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
