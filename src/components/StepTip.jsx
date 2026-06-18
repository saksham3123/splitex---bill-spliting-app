import './StepTip.css';

const TIP_PRESETS = [0, 10, 15, 18, 20, 25];
const CURRENCIES = [
  { code: 'USD', label: '🇺🇸 USD ($)' },
  { code: 'EUR', label: '🇪🇺 EUR (€)' },
  { code: 'GBP', label: '🇬🇧 GBP (£)' },
  { code: 'INR', label: '🇮🇳 INR (₹)' },
  { code: 'JPY', label: '🇯🇵 JPY (¥)' },
  { code: 'AUD', label: '🇦🇺 AUD (A$)' },
  { code: 'CAD', label: '🇨🇦 CAD (C$)' },
];

export function StepTip({ tip, tax, currency, subtotal, onSetTip, onSetTax, onSetCurrency, onNext, onBack, formatAmount }) {
  const tipAmount = subtotal * (tip / 100);
  const taxAmount = subtotal * (tax / 100);
  const grandTotal = subtotal + tipAmount + taxAmount;

  const handleTipInput = (val) => {
    const n = Math.min(100, Math.max(0, parseFloat(val) || 0));
    onSetTip(n);
  };

  const handleTaxInput = (val) => {
    const n = Math.min(50, Math.max(0, parseFloat(val) || 0));
    onSetTax(n);
  };

  return (
    <div className="step-tip card animate-scale">
      <div className="step-header">
        <div className="step-title-group">
          <span className="step-num">03</span>
          <div>
            <h2>Tip &amp; Tax</h2>
            <p className="step-desc">Adjust how much extra to add</p>
          </div>
        </div>
      </div>

      {/* Currency */}
      <div className="tip-section">
        <label className="label" htmlFor="currency-select">Currency</label>
        <select
          id="currency-select"
          className="input"
          value={currency}
          onChange={e => onSetCurrency(e.target.value)}
        >
          {CURRENCIES.map(c => (
            <option key={c.code} value={c.code}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Tip */}
      <div className="tip-section">
        <div className="tip-section-header">
          <label className="label">Tip</label>
          <div className="tip-value-display">
            <span className="tip-percent">{tip}%</span>
            <span className="tip-amount-preview">+{formatAmount(tipAmount)}</span>
          </div>
        </div>

        {/* Preset buttons */}
        <div className="tip-presets">
          {TIP_PRESETS.map(pct => (
            <button
              key={pct}
              id={`tip-preset-${pct}`}
              className={`tip-preset-btn ${tip === pct ? 'active' : ''}`}
              onClick={() => onSetTip(pct)}
            >
              {pct === 0 ? 'None' : `${pct}%`}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div className="tip-slider-wrap">
          <input
            id="tip-slider"
            type="range"
            min="0"
            max="50"
            step="1"
            value={tip}
            onChange={e => handleTipInput(e.target.value)}
            style={{
              background: `linear-gradient(to right, var(--accent-primary) ${tip * 2}%, var(--border) ${tip * 2}%)`
            }}
          />
          <div className="slider-labels">
            <span>0%</span><span>25%</span><span>50%</span>
          </div>
        </div>

        {/* Manual input */}
        <div className="input-group" style={{ marginTop: 8 }}>
          <input
            id="tip-manual-input"
            className="input"
            type="number"
            value={tip}
            onChange={e => handleTipInput(e.target.value)}
            min="0"
            max="100"
            step="1"
            style={{ maxWidth: 100 }}
          />
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>% tip</span>
        </div>
      </div>

      {/* Tax */}
      <div className="tip-section">
        <div className="tip-section-header">
          <label className="label">Tax / Service Charge</label>
          <div className="tip-value-display">
            <span className="tip-percent">{tax}%</span>
            <span className="tip-amount-preview">+{formatAmount(taxAmount)}</span>
          </div>
        </div>
        <div className="input-group">
          <input
            id="tax-input"
            className="input"
            type="number"
            value={tax}
            onChange={e => handleTaxInput(e.target.value)}
            min="0"
            max="50"
            step="0.5"
            style={{ maxWidth: 100 }}
          />
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>% tax</span>
        </div>
      </div>

      {/* Grand total preview */}
      <div className="grand-total-preview">
        <div className="total-breakdown">
          <div className="total-row">
            <span>Subtotal</span>
            <span>{formatAmount(subtotal)}</span>
          </div>
          {tip > 0 && (
            <div className="total-row accent-row">
              <span>Tip ({tip}%)</span>
              <span>+{formatAmount(tipAmount)}</span>
            </div>
          )}
          {tax > 0 && (
            <div className="total-row accent-row-amber">
              <span>Tax ({tax}%)</span>
              <span>+{formatAmount(taxAmount)}</span>
            </div>
          )}
          <div className="divider" style={{ margin: '12px 0' }} />
          <div className="total-row grand-row">
            <span>Grand Total</span>
            <span className="grand-amount">{formatAmount(grandTotal)}</span>
          </div>
        </div>
      </div>

      <div className="step-footer step-footer-row">
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <button id="tip-next-btn" className="btn btn-primary" onClick={onNext}>
          View Summary →
        </button>
      </div>
    </div>
  );
}
