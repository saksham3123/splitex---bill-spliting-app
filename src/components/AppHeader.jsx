import './AppHeader.css';

const STEPS = [
  { id: 1, icon: '👥', label: 'People' },
  { id: 2, icon: '🧾', label: 'Items' },
  { id: 3, icon: '💸', label: 'Tip & Tax' },
  { id: 4, icon: '📊', label: 'Summary' },
];

const TYPE_LABELS = { trip: 'Trip', expense: 'Expense', recurring: 'Recurring' };

export function AppHeader({ currentStep, onStepClick, peopleCount, itemsCount, activeGroup, onBack, theme, onThemeChange }) {
  return (
    <header className="app-header animate-fade">
      <div className="app-header-top">
        <div className="app-header-left">
          {onBack && (
            <button className="back-btn" onClick={onBack} id="back-to-groups-btn" aria-label="Back to all groups">
              ← All Groups
            </button>
          )}
          <div className="app-header-brand">
            <div className="app-logo">
              <span>{activeGroup ? activeGroup.icon : '💰'}</span>
            </div>
            <div>
              <h1 className="app-title">{activeGroup ? activeGroup.name : 'SplitEx'}</h1>
              <p className="app-subtitle">
                {activeGroup
                  ? `${TYPE_LABELS[activeGroup.type] || 'Group'} · SplitEx`
                  : 'Split bills effortlessly'}
              </p>
            </div>
          </div>
        </div>

        {/* Theme switcher */}
        {onThemeChange && (
          <div className="theme-switcher" role="group" aria-label="Choose display mode">
            <button
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => onThemeChange('dark')}
              id="theme-dark-btn"
              aria-pressed={theme === 'dark'}
              title="Dark mode"
            >
              <span className="theme-btn-icon">🌑</span>
              <span>Dark</span>
            </button>
            <button
              className={`theme-btn ${theme === 'night' ? 'active' : ''}`}
              onClick={() => onThemeChange('night')}
              id="theme-night-btn"
              aria-pressed={theme === 'night'}
              title="Night mode"
            >
              <span className="theme-btn-icon">🌙</span>
              <span>Night</span>
            </button>
          </div>
        )}
      </div>

      <nav className="step-nav" role="tablist" aria-label="Bill splitting steps">
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isActive    = currentStep === step.id;
          const isDisabled  = (step.id > 2 && itemsCount === 0) ||
                              (step.id > 1 && peopleCount === 0);
          return (
            <button
              key={step.id}
              className={`step-btn ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => !isDisabled && onStepClick(step.id)}
              role="tab"
              aria-selected={isActive}
              aria-label={`Step ${step.id}: ${step.label}`}
              disabled={isDisabled}
            >
              <span className="step-icon">{isCompleted ? '✓' : step.icon}</span>
              <span className="step-label">{step.label}</span>
              {idx < STEPS.length - 1 && (
                <span className={`step-connector ${isCompleted ? 'done' : ''}`} />
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
