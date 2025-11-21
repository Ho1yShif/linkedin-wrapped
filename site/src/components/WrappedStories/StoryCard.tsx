import React, { useRef } from 'react';
import { ShareButton } from './ShareButton';
import type { ShareableCard } from '../../types/wrappedStories';

interface StoryCardProps {
  card: ShareableCard;
  isActive: boolean;
  cardIndex: number;
  totalCards: number;
  onNext: () => void;
  onPrevious: () => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  card,
  isActive,
  cardIndex,
  totalCards,
  onNext,
  onPrevious,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const clickZoneWidth = 30; // percentage of screen width for click zones

  const handleLeftClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const threshold = (rect.width * clickZoneWidth) / 100;

    if (clickX < threshold) {
      onPrevious();
    }
  };

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const threshold = (rect.width * (100 - clickZoneWidth)) / 100;

    if (clickX > threshold) {
      onNext();
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check left zone
    handleLeftClick(e);
    // Check right zone
    handleRightClick(e);
  };

  return (
    <div
      ref={cardRef}
      className={`story-card ${card.type} ${isActive ? 'active' : ''}`}
      style={{
        background: card.gradient,
        backgroundColor: card.backgroundColor,
      }}
      onClick={handleCardClick}
      role="region"
      aria-label={`Card ${cardIndex + 1}: ${card.title}`}
    >
      {/* Card Content */}
      <div className="card-content-wrapper">
        <div className="card-header">
          <h2 className="card-title">{card.title}</h2>
          <div className="card-badge">{cardIndex + 1}/{totalCards}</div>
        </div>

        <div className="card-body">
          <span className="card-icon">{card.data.icon}</span>

          {card.data.value && (
            <div className="card-value">{card.data.value}</div>
          )}

          {card.data.label && (
            <div className="card-label">{card.data.label}</div>
          )}

          {card.data.context && (
            <div className="card-context">{card.data.context}</div>
          )}
        </div>

        <div className="card-footer">
          <div className="branding">LinkedIn Wrapped 2025</div>
          <ShareButton
            cardId={card.id}
            shareText={card.shareText}
            cardRef={cardRef}
          />
        </div>
      </div>

      {/* Click Zone Indicators (hidden in production) */}
      <div className="click-zones" aria-hidden="true">
        <div className="click-zone left-zone" title="Click to go previous"></div>
        <div className="click-zone right-zone" title="Click to go next"></div>
      </div>
    </div>
  );
};
