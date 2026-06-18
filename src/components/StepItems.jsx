import { useState } from 'react';
import './StepItems.css';

const ITEM_SUGGESTIONS = [
  { name: 'Pizza', icon: '🍕' },
  { name: 'Drinks', icon: '🍹' },
  { name: 'Appetizers', icon: '🥗' },
  { name: 'Dessert', icon: '🍰' },
  { name: 'Coffee', icon: '☕' },
  { name: 'Uber', icon: '🚗' },
];

function ItemRow({ item, people, avatarColors, onUpdate, onRemove, currencySymbol }) {
  const [editing, setEditing] = useState(false);
  const [localName, setLocalName] = useState(item.name);
  const [localAmount, setLocalAmount] = useState(item.amount.toString());

  const getInitials = (name) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const saveEdit = () => {
    const amount = parseFloat(localAmount);
    if (localName.trim() && !isNaN(amount) && amount > 0) {
      onUpdate(item.id, { name: localName.trim(), amount });
      setEditing(false);
    }
  };

  const assignedPerson = people.find(p => p.id === item.assignedTo);
  const assignedColor = assignedPerson ? avatarColors[assignedPerson.colorIdx] : null;

  return (
    <li className="item-row animate-slide">
      {editing ? (
        <div className="item-edit-form">
          <input
            className="input item-edit-name"
            value={localName}
            onChange={e => setLocalName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveEdit()}
            autoFocus
          />
          <input
            className="input item-edit-amount"
            type="number"
            value={localAmount}
            onChange={e => setLocalAmount(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveEdit()}
            step="0.01"
            min="0"
          />
          <button className="btn btn-success btn-sm" onClick={saveEdit}>Save</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <>
          <div className="item-main">
            <div className="item-info">
              <span className="item-name">{item.name}</span>
              <div className="item-assignment">
                {item.assignedTo === 'all' ? (
                  <span className="assignment-chip shared">
                    <span>⚡</span> Split equally
                  </span>
                ) : assignedPerson ? (
                  <span
                    className="assignment-chip personal"
                    style={{
                      background: assignedColor?.bg,
                      border: `1px solid ${assignedColor?.border}40`,
                      color: assignedColor?.text,
                    }}
                  >
                    {getInitials(assignedPerson.name)} {assignedPerson.name}
                  </span>
                ) : null}
              </div>
            </div>
            <span className="item-amount">{currencySymbol}{item.amount.toFixed(2)}</span>
          </div>

          <div className="item-assign-selector">
            <select
              className="input assign-select"
              value={item.assignedTo}
              onChange={e => onUpdate(item.id, { assignedTo: e.target.value })}
              aria-label="Assign item to person"
            >
              <option value="all">⚡ Split equally</option>
              {people.map(p => (
                <option key={p.id} value={p.id}>{p.name} only</option>
              ))}
            </select>
          </div>

          <div className="item-actions">
            <button
              className="btn btn-icon btn-ghost btn-sm"
              onClick={() => setEditing(true)}
              aria-label="Edit item"
              data-tooltip="Edit"
            >
              ✏️
            </button>
            <button
              className="btn btn-icon btn-danger btn-sm"
              onClick={() => onRemove(item.id)}
              aria-label="Remove item"
              data-tooltip="Remove"
            >
              ✕
            </button>
          </div>
        </>
      )}
    </li>
  );
}

const CURRENCY_SYMBOLS = {
  USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥', AUD: 'A$', CAD: 'C$',
};

export function StepItems({ items, people, avatarColors, onAddItem, onUpdateItem, onRemoveItem, onNext, onBack, addToast, currency }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [assignedTo, setAssignedTo] = useState('all');

  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  const currencySymbol = CURRENCY_SYMBOLS[currency] || '$';

  const handleAdd = () => {
    const parsed = parseFloat(amount);
    if (!name.trim() || isNaN(parsed) || parsed <= 0) {
      addToast('Please enter a valid item name and amount', 'error');
      return;
    }
    if (onAddItem({ name, amount: parsed, assignedTo })) {
      addToast(`"${name.trim()}" added!`);
      setName('');
      setAmount('');
      setAssignedTo('all');
    }
  };

  const handleSuggestion = (s) => {
    setName(s.name);
    document.getElementById('item-amount-input')?.focus();
  };

  return (
    <div className="step-items card animate-scale">
      <div className="step-header">
        <div className="step-title-group">
          <span className="step-num">02</span>
          <div>
            <h2>What did you order?</h2>
            <p className="step-desc">Add items and who owes them</p>
          </div>
        </div>
        {items.length > 0 && (
          <div className="items-summary-badge">
            <span className="badge badge-amber">{items.length} items</span>
            <span className="subtotal-display">{currencySymbol}{subtotal.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Add item form */}
      <div className="add-item-form">
        <div className="add-item-row">
          <div className="item-name-wrap">
            <input
              id="item-name-input"
              className="input"
              type="text"
              placeholder="Item name (e.g. Pizza)"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && document.getElementById('item-amount-input')?.focus()}
              maxLength={50}
            />
          </div>
          <div className="amount-wrap">
            <span className="input-prefix">{currencySymbol}</span>
            <input
              id="item-amount-input"
              className="input input-with-prefix"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              min="0"
              step="0.01"
            />
          </div>
        </div>
        <div className="add-item-row">
          <select
            className="input"
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="all">⚡ Split equally among all</option>
            {people.map(p => (
              <option key={p.id} value={p.id}>👤 {p.name}&apos;s item only</option>
            ))}
          </select>
          <button
            id="add-item-btn"
            className="btn btn-primary"
            onClick={handleAdd}
            disabled={!name.trim() || !amount}
          >
            <span>+</span> Add Item
          </button>
        </div>
      </div>

      {/* Quick suggestions */}
      <div className="quick-add">
        <span className="label">Quick add</span>
        <div className="suggestion-chips">
          {ITEM_SUGGESTIONS.map(s => (
            <button
              key={s.name}
              className="chip"
              onClick={() => handleSuggestion(s)}
              id={`suggest-item-${s.name.toLowerCase()}`}
            >
              {s.icon} {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* Items list */}
      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <p>Add the items from your bill. You can assign each item to a specific person or split it equally.</p>
        </div>
      ) : (
        <ul className="items-list">
          {items.map((item, idx) => (
            <ItemRow
              key={item.id}
              item={item}
              people={people}
              avatarColors={avatarColors}
              onUpdate={onUpdateItem}
              currencySymbol={currencySymbol}
              onRemove={(id) => {
                onRemoveItem(id);
                addToast('Item removed', 'info');
              }}
            />
          ))}
        </ul>
      )}

      {/* Footer */}
      <div className="step-footer step-footer-row">
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <button
          id="items-next-btn"
          className="btn btn-primary"
          onClick={onNext}
          disabled={items.length === 0}
        >
          Continue to Tip →
        </button>
      </div>
    </div>
  );
}
