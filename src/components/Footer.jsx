import './Footer.css';

const CREATOR_NAME  = 'Saksham';
const CREATOR_EMAIL = 'saksham648@gmail.com';

export function Footer() {
  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-inner">
        {/* Creator info */}
        <div className="footer-creator" id="footer-creator-info">
          <span className="footer-creator-icon">👤</span>
          <div>
            <span className="footer-creator-name">{CREATOR_NAME}</span>
            <a
              href={`mailto:${CREATOR_EMAIL}`}
              className="footer-creator-email"
              aria-label={`Email ${CREATOR_NAME}`}
            >
              {CREATOR_EMAIL}
            </a>
          </div>
        </div>

        {/* Mandatory CTA */}
        <a
          id="digital-heroes-btn"
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-digital-heroes"
          aria-label="Built for Digital Heroes — Visit digitalheroesco.com"
        >
          <span className="dh-star">⚡</span>
          Built for Digital Heroes
          <span className="dh-arrow">↗</span>
        </a>
      </div>
    </footer>
  );
}
