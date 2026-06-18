import { useState } from 'react';
import { CreateGroupModal } from './CreateGroupModal';
import { Footer } from './Footer';
import './GroupsDashboard.css';

const TYPE_CONFIG = {
  trip:      { label: 'Trip',      icon: '✈️', color: '#818cf8' },
  expense:   { label: 'Expense',   icon: '💸', color: '#f59e0b' },
  recurring: { label: 'Recurring', icon: '🔄', color: '#34d399' },
};

const CURRENCY_SYMBOLS = {
  USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥', AUD: 'A$', CAD: 'C$',
};

function formatTotal(group) {
  const symbol  = CURRENCY_SYMBOLS[group.currency] || '$';
  const subtotal = group.items.reduce((s, i) => s + (i.amount || 0), 0);
  const grand   = subtotal * (1 + (group.tip || 0) / 100 + (group.tax || 0) / 100);
  return `${symbol}${grand.toFixed(2)}`;
}

function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function GroupsDashboard({ groups, onOpenGroup, onCreateGroup, onDeleteGroup, addToast, theme, onThemeChange }) {
  const [showModal,     setShowModal]     = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleCreate = (groupData) => {
    onCreateGroup(groupData);
    setShowModal(false);
    addToast(`"${groupData.name}" created! 🎉`, 'success');
  };

  const handleDelete = (id, name, e) => {
    e.stopPropagation();
    if (deleteConfirm === id) {
      onDeleteGroup(id);
      setDeleteConfirm(null);
      addToast(`"${name}" deleted.`, 'info');
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 2500);
    }
  };

  return (
    <div className="dashboard">
      {/* ── Hero ──────────────────────────────────────────── */}
      <header className="dashboard-hero animate-fade">
        <div className="dashboard-brand">
          <div className="dashboard-logo">💰</div>
          <div>
            <h1 className="dashboard-title">SplitEx</h1>
            <p className="dashboard-subtitle">Split bills effortlessly</p>
          </div>
        </div>

        <div className="dashboard-hero-actions">
          {/* Theme switcher */}
          {onThemeChange && (
            <div className="theme-switcher" role="group" aria-label="Choose display mode">
              <button
                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => onThemeChange('dark')}
                id="dash-theme-dark-btn"
                aria-pressed={theme === 'dark'}
                title="Dark mode"
              >
                <span className="theme-btn-icon">🌑</span>
                <span>Dark</span>
              </button>
              <button
                className={`theme-btn ${theme === 'night' ? 'active' : ''}`}
                onClick={() => onThemeChange('night')}
                id="dash-theme-night-btn"
                aria-pressed={theme === 'night'}
                title="Night mode"
              >
                <span className="theme-btn-icon">🌙</span>
                <span>Night</span>
              </button>
            </div>
          )}

          <button
            id="create-group-btn"
            className="btn btn-primary btn-lg"
            onClick={() => setShowModal(true)}
          >
            <span className="btn-plus">+</span> New Group
          </button>
        </div>
      </header>

      {/* ── Groups ────────────────────────────────────────── */}
      <main className="dashboard-main">
        {groups.length === 0 ? (
          <div className="dashboard-empty animate-scale">
            <div className="empty-big-icon">🧾</div>
            <h2>No groups yet</h2>
            <p>Create your first group to start splitting expenses with friends</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              + Create a Group
            </button>
          </div>
        ) : (
          <>
            <div className="groups-section-header">
              <h2>Your Groups</h2>
              <span className="badge badge-purple">{groups.length}</span>
            </div>

            <div className="groups-grid">
              {groups.map((group) => {
                const tc          = TYPE_CONFIG[group.type] || TYPE_CONFIG.expense;
                const isConfirm   = deleteConfirm === group.id;
                const total       = formatTotal(group);
                const hasActivity = group.items.length > 0 || group.people.length > 0;

                return (
                  <article
                    key={group.id}
                    className="group-card animate-scale"
                    style={{ '--card-accent': group.color || tc.color }}
                    onClick={() => onOpenGroup(group.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open group: ${group.name}`}
                    onKeyDown={e => e.key === 'Enter' && onOpenGroup(group.id)}
                  >
                    <div className="group-card-accent" />

                    <div className="group-card-top">
                      <span className="group-card-icon">{group.icon}</span>
                      <div className="group-card-badges">
                        <span
                          className="group-type-badge"
                          style={{
                            background: `${tc.color}18`,
                            color:       tc.color,
                            border:      `1px solid ${tc.color}30`,
                          }}
                        >
                          {tc.icon} {tc.label}
                        </span>
                        {hasActivity && <span className="badge badge-green">Active</span>}
                      </div>
                      <button
                        className={`group-delete-btn ${isConfirm ? 'confirm' : ''}`}
                        onClick={(e) => handleDelete(group.id, group.name, e)}
                        title={isConfirm ? 'Click again to delete' : 'Delete group'}
                        aria-label={`Delete group ${group.name}`}
                      >
                        {isConfirm ? '⚠️' : '×'}
                      </button>
                    </div>

                    <div className="group-card-body">
                      <h3 className="group-card-name">{group.name}</h3>
                      <div className="group-card-total">{total}</div>
                      <div className="group-card-stats">
                        <span>👥 {group.people.length} {group.people.length === 1 ? 'person' : 'people'}</span>
                        <span>🧾 {group.items.length} {group.items.length === 1 ? 'item' : 'items'}</span>
                        {group.tip > 0 && <span>💸 {group.tip}% tip</span>}
                      </div>
                    </div>

                    <div className="group-card-footer">
                      <span className="group-card-date">
                        {group.updatedAt !== group.createdAt
                          ? `Updated ${formatDate(group.updatedAt)}`
                          : `Created ${formatDate(group.createdAt)}`}
                      </span>
                      <span className="group-open-cta">Open →</span>
                    </div>
                  </article>
                );
              })}

              <button
                className="group-card group-card-new"
                onClick={() => setShowModal(true)}
                id="add-group-card-btn"
                aria-label="Create new group"
              >
                <span className="new-group-plus">+</span>
                <span>New Group</span>
              </button>
            </div>
          </>
        )}
      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <div className="dashboard-footer-wrap">
        <Footer />
      </div>

      {showModal && (
        <CreateGroupModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
