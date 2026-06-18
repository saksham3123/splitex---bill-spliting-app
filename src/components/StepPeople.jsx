import { useState } from 'react';
import './StepPeople.css';

export function StepPeople({ people, avatarColors, onAddPerson, onRemovePerson, onNext, addToast }) {
  const [name, setName] = useState('');

  const getInitials = (name) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const handleAdd = () => {
    if (!name.trim()) return;
    const duplicate = people.some(p => p.name.toLowerCase() === name.trim().toLowerCase());
    if (duplicate) {
      addToast('That name is already added!', 'error');
      return;
    }
    if (onAddPerson(name)) {
      addToast(`${name.trim()} added to the bill!`);
      setName('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  const SUGGESTIONS = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
  const unusedSuggestions = SUGGESTIONS.filter(
    s => !people.some(p => p.name.toLowerCase() === s.toLowerCase())
  );

  return (
    <div className="step-people card animate-scale" role="tabpanel" aria-label="Add people">
      <div className="step-header">
        <div className="step-title-group">
          <span className="step-num">01</span>
          <div>
            <h2>Who&apos;s splitting?</h2>
            <p className="step-desc">Add everyone joining the bill</p>
          </div>
        </div>
        {people.length > 0 && (
          <span className="badge badge-purple">{people.length} {people.length === 1 ? 'person' : 'people'}</span>
        )}
      </div>

      {/* Input */}
      <div className="people-input-row">
        <div className="people-input-wrap">
          <span className="input-emoji">👤</span>
          <input
            id="person-name-input"
            className="input people-input"
            type="text"
            placeholder="Enter a name..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={30}
            autoFocus
          />
        </div>
        <button
          id="add-person-btn"
          className="btn btn-primary"
          onClick={handleAdd}
          disabled={!name.trim()}
        >
          <span>+</span> Add
        </button>
      </div>

      {/* Quick-add suggestions */}
      {unusedSuggestions.length > 0 && people.length < 8 && (
        <div className="quick-add">
          <span className="label">Quick add</span>
          <div className="suggestion-chips">
            {unusedSuggestions.slice(0, 5).map(s => (
              <button
                key={s}
                className="chip"
                onClick={() => onAddPerson(s) && addToast(`${s} added!`)}
                id={`suggest-${s.toLowerCase()}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* People list */}
      {people.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🙋</div>
          <p>Add at least two people to start splitting your bill</p>
        </div>
      ) : (
        <ul className="people-list" role="list">
          {people.map((person, idx) => {
            const color = avatarColors[person.colorIdx];
            return (
              <li
                key={person.id}
                className="person-row animate-slide"
                style={{ animationDelay: `${idx * 0.04}s` }}
                role="listitem"
              >
                <div
                  className="avatar"
                  style={{
                    background: color.bg,
                    border: `2px solid ${color.border}`,
                    color: color.text,
                  }}
                >
                  {getInitials(person.name)}
                </div>
                <div className="person-info">
                  <span className="person-name">{person.name}</span>
                  <span className="person-tag">Person {idx + 1}</span>
                </div>
                <button
                  className="btn btn-icon btn-danger remove-btn"
                  onClick={() => {
                    onRemovePerson(person.id);
                    addToast(`${person.name} removed`, 'info');
                  }}
                  aria-label={`Remove ${person.name}`}
                  id={`remove-person-${person.id}`}
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Footer */}
      <div className="step-footer">
        <button
          id="people-next-btn"
          className="btn btn-primary btn-full"
          onClick={onNext}
          disabled={people.length < 1}
        >
          Continue to Items →
        </button>
      </div>
    </div>
  );
}
