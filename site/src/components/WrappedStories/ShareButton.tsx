import React, { useState, useCallback } from 'react';
import { exportCardAsImage } from '../../utils/imageExport';
import { copyToClipboard } from '../../utils/clipboard';
import '../../styles/ShareButton.css';

interface ShareButtonProps {
  cardId: string;
  shareText: string;
  cardRef: React.RefObject<HTMLDivElement>;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  cardId,
  shareText,
  cardRef,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;

    setIsExporting(true);
    setError(null);

    try {
      // Step 1: Export card as image
      const imageBlob = await exportCardAsImage(cardRef.current);

      // Step 2: Download image
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `linkedin-wrapped-2025-${cardId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Step 3: Copy text to clipboard
      await copyToClipboard(shareText);

      // Step 4: Open LinkedIn share page in new tab
      const linkedInUrl = 'https://www.linkedin.com/sharing/share-offsite/';
      window.open(linkedInUrl, '_blank', 'noopener,noreferrer');

      // Step 5: Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to share';
      setError(errorMessage);
      console.error('Share failed:', err);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsExporting(false);
    }
  }, [cardRef, cardId, shareText]);

  return (
    <div className="share-button-wrapper">
      <button
        className="share-button"
        onClick={handleShare}
        disabled={isExporting}
        aria-label="Share this card on LinkedIn"
      >
        {isExporting ? (
          <>
            <span className="spinner"></span>
            <span>Preparing...</span>
          </>
        ) : (
          <>
            <span className="linkedin-icon">in</span>
            <span>Share</span>
          </>
        )}
      </button>

      {showSuccess && (
        <div className="share-feedback success">
          ✅ Image downloaded & text copied! Open LinkedIn to paste.
        </div>
      )}

      {error && (
        <div className="share-feedback error">
          ❌ {error}
        </div>
      )}
    </div>
  );
};
