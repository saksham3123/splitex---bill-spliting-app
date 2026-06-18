import { useState } from 'react';
import './CreateGroupModal.css';

const GROUP_TYPES = [
  { id: 'trip',      icon: '✈️',  label: 'Trip',      desc: 'Vacation, travel & adventures' },
  { id: 'expense',   icon: '💸',  label: 'Expense',   desc: 'One-time shared costs' },
  { id: 'recurring', icon: '🔄',  label: 'Recurring', desc: 'Rent, utilities & subscriptions' },
];

const EMOJI_OPTIONS = [
  '✈️','🏖️','🏕️','🎉','🍕','🏠','🚗','🎶',
  '🌴','⛷️','🏋️','🎮','🍻','🏄','🧳','🌍',
  '💰','🛒','🎪','🏟️','🚢','🎭','🎨','🏔️',
  '🌮','☕','🎸','🏡','🎯','🧩','🌺','🍣',
];

const CURRENCIES = [
  { code: 'USD', label: '$ USD — US Dollar' },
  { code: 'EUR', label: '€ EUR — Euro' },
  { code: 'GBP', label: '£ GBP — British Pound' },
  { code: 'INR', label: '₹ INR — Indian Rupee' },
  { code: 'JPY', label: '¥ JPY — Japanese Yen' },
  { code: 'AUD', label: 'A$ AUD — Australian Dollar' },
  { code: 'CAD', label: 'C$ CAD — Canadian Dollar' },
];

const ACCENT_COLORS = [
  { hex: '#6366f1', name: 'Indigo'  },
  { hex: '#8b5cf6', name: 'Violet'  },
  { hex: '#ec4899', name: 'Pink'    },
  { hex: '#f59e0b', name: 'Amber'   },
  { hex: '#10b981', name: 'Emerald' },
  { hex: '#38bdf8', name: 'Sky'     },
  { hex: '#f87171', name: 'Rose'    },
  { hex: '#fb923c', name: 'Orange'  },
];

// Default icon per type
const TYPE_ICONS = { trip: '✈️', expense: '💸', recurring: '🔄' };

export function CreateGroupModal({ onClose, onCreate }) {
  const [name,     setName]     = useState('');
  const [type,     setType]     = useState('trip');
  const [icon,     setIcon]     = useState('✈️');
  const [color,    setColor]    = useState('#6366f1');
  const [currency, setCurrency] = useState('USD');

  const handleTypeSelect = (t) => {
    setType(t);
    // Auto-update icon only if still on the default for old type
    if (Object.values(TYPE_ICONS).includes(icon)) {
      setIcon(TYPE_ICONS[t]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name: name.trim(), type, icon, color, currency });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay animate-fade" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label="Create new group">
      <div className="modal-panel animate-scale">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-icon-preview" style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
              {icon}
            </div>
            <div>
              <h2>New Group</h2>
              <p className="modal-subtitle">Set up a bill-splitting space</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Group Name */}
          <div className="modal-field">
            <label className="modal-label" htmlFor="group-name-input">Group Name</label>
            <input
              id="group-name-input"
              className="input"
              type="text"
              placeholder="e.g. Goa Trip, Monthly Rent, Office Lunch…"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              maxLength={40}
            />
          </div>

          {/* Type */}
          <div className="modal-field">
            <label className="modal-label">Type</label>
            <div className="type-selector" role="radiogroup" aria-label="Group type">
              {GROUP_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={type === t.id}
                  className={`type-option ${type === t.id ? 'active' : ''}`}
                  onClick={() => handleTypeSelect(t.id)}
                  id={`type-option-${t.id}`}
                >
                  <span className="type-option-icon">{t.icon}</span>
                  <span className="type-option-label">{t.label}</span>
                  <span className="type-option-desc">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Icon Picker */}
          <div className="modal-field">
            <label className="modal-label">Icon</label>
            <div className="emoji-grid" role="group" aria-label="Choose icon">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  className={`emoji-btn ${icon === e ? 'selected' : ''}`}
                  onClick={() => setIcon(e)}
                  aria-label={`Select icon ${e}`}
                  aria-pressed={icon === e}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Color + Currency */}
          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label">Accent Color</label>
              <div className="color-swatches" role="group" aria-label="Choose accent color">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    className={`color-swatch ${color === c.hex ? 'selected' : ''}`}
                    style={{ background: c.hex }}
                    onClick={() => setColor(c.hex)}
                    aria-label={c.name}
                    aria-pressed={color === c.hex}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="modal-field">
              <label className="modal-label" htmlFor="group-currency-select">Currency</label>
              <select
                id="group-currency-select"
                className="input select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!name.trim()}
              id="create-group-submit-btn"
              style={{ '--btn-color': color, '--btn-glow': `${color}55` }}
            >
              Create Group →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
