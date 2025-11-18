import { useState } from 'react';
import '../styles/Header.css';

interface HeaderProps {
  onLogoClick?: () => void;
}

export function Header({ onLogoClick }: HeaderProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleHomeClick = () => {
    onLogoClick?.();
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <button
          className="linkedin-wrapped-title-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleHomeClick}
          aria-label="Navigate to home"
          title="Go to home"
        >
          <div className="logo-wrapper">
            <h1 className={`linkedin-wrapped-title ${isHovered ? 'hovered' : ''}`}>
              LinkedIn Wrapped
            </h1>
            {/* Threading ribbon SVG overlay */}
            <svg
              className={`threading-ribbon ${isHovered ? 'visible' : ''}`}
              viewBox="0 0 300 50"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#0A66C2', stopOpacity: 0 }} />
                  <stop offset="50%" style={{ stopColor: '#0A66C2', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#0A66C2', stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              {/* Ribbon threading through the text */}
              <path
                className="ribbon-thread"
                d="M -10 25 Q 40 8 80 30 Q 120 50 160 25 Q 200 5 240 28 Q 270 40 310 25"
                fill="none"
                stroke="url(#ribbonGradient)"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </button>
      </div>
    </header>
  );
}
