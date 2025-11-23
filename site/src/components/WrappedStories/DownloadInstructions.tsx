import React, { useCallback } from 'react';
import { openLinkedInShare } from '../../utils/linkedinShareLink';
import '../../styles/WrappedStories.css';

interface DownloadInstructionsProps {
  isVisible: boolean;
  shareText: string;
  onDismiss?: () => void;
}

/**
 * Component that displays instructions after downloading wrapped cards
 * Guides users to attach the downloaded file to their LinkedIn post
 * and provides a button to open LinkedIn sharing
 */
export const DownloadInstructions: React.FC<DownloadInstructionsProps> = ({
  isVisible,
  shareText,
  onDismiss,
}) => {
  const handleShareOnLinkedIn = useCallback(() => {
    // Copy share text to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).then(() => {
        // Open LinkedIn share
        openLinkedInShare();
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      // Open LinkedIn share
      openLinkedInShare();
    }
  }, [shareText]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="download-instructions-overlay">
      <div className="download-instructions-modal">
        {/* Header */}
        <div className="instructions-header">
          <h3 className="instructions-title">✅ Download complete</h3>
          <button
            className="instructions-close-btn"
            onClick={onDismiss}
            aria-label="Close instructions"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="instructions-content">
          <p className="instructions-text">
            Your LinkedIn Wrapped was successfully downloaded! Now you can share it with your network.
          </p>

          <div className="instructions-steps">
            <p className="instruction-step">1. <b>Open LinkedIn.</b> Click the button below to open LinkedIn with a prepared post</p>
            <p className="instruction-step">2. <b>Attach your file.</b> Add your LinkedIn Wrapped content to the post:
              <ul>
                <li>For a single-card PNG image: Click the image icon in the bottom left of the post composer to upload your image.</li>
                <li>For a multi-card PDF carousel: Click the <b>+</b> icon at the bottom of the post composer to expand additional options. Then, click the document icon second from the right to upload your PDF file.</li>
              </ul>
            </p>
          </div>

          {/* Disclaimer */}
          <div className="instructions-disclaimer">
            <p className="disclaimer-text">
               𝒊 &nbsp; &nbsp; We can't automatically attach the file to your LinkedIn post without violating LinkedIn's terms of service.
              These manual steps ensure we stay compliant and respect LinkedIn's policies.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="instructions-actions">
          <button
            className="btn-share-linkedin"
            onClick={handleShareOnLinkedIn}
            aria-label="Share on LinkedIn with prepared text"
          >
            <img
              src="/linkedin-logo.png"
              alt="LinkedIn"
              className="btn-linkedin-icon"
            />
            Share on LinkedIn
          </button>

          {onDismiss && (
            <button
              className="btn-dismiss"
              onClick={onDismiss}
            >
              Maybe later
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
