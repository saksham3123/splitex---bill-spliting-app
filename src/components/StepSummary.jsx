import { useRef } from 'react';
import './StepSummary.css';

function PersonCard({ person, amount, color, getInitials, formatAmount, items }) {
  const initials = getInitials(person.name);
  const personalItems = items.filter(i => i.assignedTo === person.id);
  const sharedItems = items.filter(i => i.assignedTo === 'all');

  return (
    <div className="person-card animate-fade" style={{ borderColor: `${color.border}40` }}>
      <div className="person-card-header" style={{ background: color.bg }}>
        <div className="avatar" style={{ background: color.bg, border: `2px solid ${color.border}`, color: color.text }}>
          {initials}
        </div>
        <div className="person-card-info">
          <span className="person-card-name">{person.name}</span>
          <span className="person-card-total" style={{ color: color.text }}>
            {formatAmount(amount)}
          </span>
        </div>
      </div>

      <div className="person-card-body">
        {personalItems.length > 0 && (
          <div className="item-breakdown-group">
            <span className="breakdown-label">Personal items</span>
            {personalItems.map(item => (
              <div key={item.id} className="breakdown-row">
                <span>{item.name}</span>
                <span>{formatAmount(item.amount)}</span>
              </div>
            ))}
          </div>
        )}
        {sharedItems.length > 0 && (
          <div className="item-breakdown-group">
            <span className="breakdown-label">Shared ({sharedItems.length} split)</span>
            {sharedItems.map(item => (
              <div key={item.id} className="breakdown-row muted">
                <span>{item.name}</span>
                <span>{formatAmount(item.amount / (items.filter(i => i.assignedTo === 'all').length > 0 ? items.filter(i => i.assignedTo !== 'all').length + items.filter(i => i.assignedTo === 'all').length : 1))}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function StepSummary({ people, items, calculations, tip, tax, currency, avatarColors, onBack, onReset, formatAmount, getPersonById, getPersonColor, getPersonInitials }) {
  const { subtotal, tipAmount, taxAmount, grandTotal, perPerson, settlements } = calculations;
  const summaryRef = useRef(null);

  const handlePrint = () => window.print();

  if (people.length === 0 || items.length === 0) {
    return (
      <div className="step-summary card animate-scale" style={{ padding: 28 }}>
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <p>Add people and items first to see the summary</p>
        </div>
      </div>
    );
  }

  return (
    <div className="step-summary animate-scale" ref={summaryRef}>
      {/* Grand total hero */}
      <div className="grand-total-hero card">
        <div className="grand-hero-inner">
          <div>
            <p className="grand-label">Grand Total</p>
            <p className="grand-value">{formatAmount(grandTotal)}</p>
          </div>
          <div className="grand-breakdown-pills">
            <div className="pill">
              <span className="pill-label">Subtotal</span>
              <span className="pill-value">{formatAmount(subtotal)}</span>
            </div>
            {tip > 0 && (
              <div className="pill pill-green">
                <span className="pill-label">Tip {tip}%</span>
                <span className="pill-value">+{formatAmount(tipAmount)}</span>
              </div>
            )}
            {tax > 0 && (
              <div className="pill pill-amber">
                <span className="pill-label">Tax {tax}%</span>
                <span className="pill-value">+{formatAmount(taxAmount)}</span>
              </div>
            )}
          </div>
        </div>
        <div className="grand-per-person">
          <span>{formatAmount(grandTotal / people.length)}</span>
          <span className="grand-per-label">per person (equal share)</span>
        </div>
      </div>

      {/* Per-person cards */}
      <div className="section-header">
        <h3>💳 Per Person Breakdown</h3>
        <span className="badge badge-purple">{people.length} people</span>
      </div>

      <div className="person-cards-grid">
        {people.map(person => {
          const color = getPersonColor(person);
          const amount = perPerson[person.id] || 0;
          return (
            <PersonCard
              key={person.id}
              person={person}
              amount={amount}
              color={color}
              getInitials={getPersonInitials}
              formatAmount={formatAmount}
              items={items}
              people={people}
            />
          );
        })}
      </div>

      {/* Settlements */}
      <div className="section-header">
        <h3>🤝 Who Pays Whom</h3>
        <span className="badge badge-green">{settlements.length} transfer{settlements.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="card settlements-card">
        {settlements.length === 0 ? (
          <div className="settlements-equal">
            <span className="settlements-icon">✨</span>
            <p>Everyone owes the same amount — no transfers needed!</p>
          </div>
        ) : (
          <div className="settlements-list">
            {settlements.map((s, idx) => {
              const from = getPersonById(s.from);
              const to = getPersonById(s.to);
              const fromColor = getPersonColor(from);
              const toColor = getPersonColor(to);
              return (
                <div key={idx} className="settlement-row animate-slide" style={{ animationDelay: `${idx * 0.07}s` }}>
                  <div className="settlement-from">
                    <div className="avatar avatar-sm"
                      style={{ background: fromColor?.bg, border: `2px solid ${fromColor?.border}`, color: fromColor?.text }}>
                      {getPersonInitials(from?.name || '')}
                    </div>
                    <span className="settlement-name">{from?.name}</span>
                  </div>
                  <div className="settlement-arrow">
                    <div className="arrow-line" />
                    <div className="arrow-amount">{formatAmount(s.amount)}</div>
                    <div className="arrow-tip">→</div>
                  </div>
                  <div className="settlement-to">
                    <div className="avatar avatar-sm"
                      style={{ background: toColor?.bg, border: `2px solid ${toColor?.border}`, color: toColor?.text }}>
                      {getPersonInitials(to?.name || '')}
                    </div>
                    <span className="settlement-name">{to?.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="summary-actions">
        <button className="btn btn-ghost" onClick={onBack}>← Edit</button>
        <button className="btn btn-ghost" onClick={handlePrint} id="print-btn">🖨 Print</button>
        <button className="btn btn-danger" onClick={onReset} id="reset-btn">🔄 New Bill</button>
      </div>
    </div>
  );
}
