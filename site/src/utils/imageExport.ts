/**
 * Utility to export HTML card elements as PNG images
 * Uses html2canvas for cross-browser compatibility
 * Removes text selection highlighting and interactive elements
 */

// Dynamic import to handle library loading gracefully
let html2canvas: any = null;

async function loadHtml2Canvas() {
  if (html2canvas) return html2canvas;

  try {
    // Try importing html2canvas - will be added to package.json
    const module = await import('html2canvas');
    html2canvas = module.default;
    return html2canvas;
  } catch (err) {
    throw new Error('html2canvas library is not available. Please ensure it is installed.');
  }
}

/**
 * Prepare an element for export by removing interactive elements and text selection styling
 * @param element The element to prepare
 * @returns A cloned element ready for export
 */
function prepareElementForExport(element: HTMLElement): HTMLElement {
  // Clone the element to avoid modifying the original
  const clone = element.cloneNode(true) as HTMLElement;

  // Remove any share buttons and interactive elements
  const shareButtons = clone.querySelectorAll('.share-button-wrapper, .share-button, [class*="share"]');
  shareButtons.forEach(btn => btn.remove());

  // Remove text selection styling and user select
  clone.style.userSelect = 'none';
  (clone as any).style.webkitUserSelect = 'none';
  (clone as any).style.msUserSelect = 'none';
  (clone as any).style.MozUserSelect = 'none';

  // Remove focus and highlight indicators
  clone.querySelectorAll('*').forEach(el => {
    (el as HTMLElement).style.outline = 'none';
    (el as HTMLElement).style.boxShadow = 'none';
  });

  // Clear any selection
  (clone as any).style.WebkitTouchCallout = 'none';

  return clone;
}

export async function exportCardAsImage(element: HTMLElement): Promise<Blob> {
  const h2c = await loadHtml2Canvas();

  if (!h2c) {
    throw new Error('Failed to load html2canvas');
  }

  try {
    // Prepare element for export
    const preparedElement = prepareElementForExport(element);

    // Temporarily add to DOM for rendering
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.appendChild(preparedElement);
    document.body.appendChild(tempContainer);

    try {
      // Use 2x scale for high quality, 1200x1200 for LinkedIn
      const canvas = await h2c(preparedElement, {
        scale: 2,
        backgroundColor: '#0F0F0F',
        logging: false,
        useCORS: true,
        allowTaint: true,
        pixelRatio: 2,
      });

      // Create a high-quality image blob
      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob: Blob | null) => {
            if (blob) {
              // Ensure blob is under 5MB for LinkedIn
              if (blob.size > 5 * 1024 * 1024) {
                // If too large, re-export with lower quality
                canvas.toBlob(
                  (smallerBlob: Blob | null) => {
                    if (smallerBlob) {
                      resolve(smallerBlob);
                    } else {
                      reject(new Error('Failed to compress image'));
                    }
                  },
                  'image/png',
                  0.85 // 85% quality
                );
              } else {
                resolve(blob);
              }
            } else {
              reject(new Error('Failed to generate image blob'));
            }
          },
          'image/png',
          1 // Full quality PNG
        );
      });
    } finally {
      // Clean up temporary container
      document.body.removeChild(tempContainer);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to export card as image: ${errorMessage}`);
  }
}

/**
 * Get the optimal dimensions for a card export
 * Returns width and height for 1200x1200px (LinkedIn-friendly)
 */
export function getOptimalExportDimensions(): { width: number; height: number } {
  return {
    width: 1200,
    height: 1200,
  };
}
