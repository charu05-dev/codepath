import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ToastContainer } from '../components/ToastContainer';
import {
  LayoutDashboard,
  Compass,
  Code2,
  AlertOctagon,
  BarChart3,
  Settings,
  Sparkles,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Terminal
} from 'lucide-react';
import './AppLayout.css';

export function AppLayout({ children }) {
  const { preferences, analytics } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'DSA Roadmap', path: '/roadmap', icon: Compass },
    { label: 'Practice', path: '/practice', icon: Code2 },
    { label: 'Mistake Tracker', path: '/mistakes', icon: AlertOctagon },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 }
  ];

  // Helper to determine breadcrumb title
  const getPageInfo = () => {
    switch (location.pathname) {
      case '/dashboard':
        return {
          title: 'Dashboard',
          subtitle: 'Real-time overview of your algorithmic preparation metrics and next steps.'
        };
      case '/roadmap':
        return {
          title: 'DSA Roadmap',
          subtitle: 'Structured multi-week curriculum customized to your target role and pace.'
        };
      case '/practice':
        return {
          title: 'Practice Question Bank',
          subtitle: 'Curated pattern-oriented challenges with detailed hints and attempt logging.'
        };
      case '/mistakes':
        return {
          title: 'Mistake Tracker',
          subtitle: 'Isolate syntax bugs, edge case oversights, and complexity pitfalls for focused review.'
        };
      case '/analytics':
        return {
          title: 'Performance Analytics',
          subtitle: 'Empirical topic mastery, accuracy curves, and targeted learning recommendations.'
        };
      case '/settings':
        return {
          title: 'Settings & Workspace',
          subtitle: 'Manage local target parameters, profile preferences, and data reset operations.'
        };
      default:
        return {
          title: 'CodePath AI',
          subtitle: 'Technical interview training platform.'
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="app-shell">
      {/* Mobile top bar */}
      <div className="mobile-header">
        <Link to="/dashboard" className="brand-logo">
          <div className="brand-mark">
            <Terminal size={15} color="#9281f7" />
          </div>
          <span className="brand-name">CodePath <span className="brand-badge">AI</span></span>
        </Link>
        <button
          className="btn-ghost mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Main Left Sidebar */}
      <aside className={`app-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-top">
          <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="brand-mark">
              <Terminal size={16} color="#9281f7" />
            </div>
            <span className="brand-name">CodePath <span className="brand-badge">AI</span></span>
          </Link>
          <div className="sidebar-status-tag">
            <span className="status-dot"></span>
            <span>Local Engine v1.0</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group-label">PREPARATION</div>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={16} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {item.path === '/mistakes' && analytics.mistakeBreakdown.length > 0 && (
                  <span className="nav-count-badge">
                    {analytics.mistakeBreakdown.reduce((sum, m) => sum + m.count, 0)}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Sidebar Profile / Settings */}
        <div className="sidebar-bottom">
          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Settings size={16} className="nav-icon" />
            <span className="nav-label">Settings</span>
          </NavLink>

          <div className="profile-card">
            <div className="profile-avatar">
              {preferences.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <div className="profile-name">{preferences.displayName}</div>
              <div className="profile-role">{preferences.targetRole}</div>
            </div>
            <div className="profile-status-pill">Local</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="app-main-wrapper">
        <header className="main-header">
          <div className="header-breadcrumbs">
            <Link to="/dashboard" className="crumb-item">CodePath</Link>
            <ChevronRight size={14} className="crumb-sep" />
            <span className="crumb-current">{pageInfo.title}</span>
          </div>

          <div className="header-meta">
            <div className="header-metric">
              <span className="metric-label">Streak:</span>
              <span className="metric-value text-warning">{analytics.streak}d</span>
            </div>
            <div className="header-metric">
              <span className="metric-label">Solved:</span>
              <span className="metric-value text-success">{analytics.totalSolved}/{analytics.totalQuestions}</span>
            </div>
            <Link to="/" className="btn btn-sm btn-outline home-link-btn" title="View Public Landing Page">
              Landing Page
              <ExternalLink size={12} />
            </Link>
          </div>
        </header>

        <div className="page-title-banner">
          <div className="page-heading">
            <h1>{pageInfo.title}</h1>
            <p className="page-subtitle">{pageInfo.subtitle}</p>
          </div>
        </div>

        <main className="main-content">
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
