/**
 * Utility to export HTML card elements as PNG images
 * Uses html2canvas for cross-browser compatibility
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

export async function exportCardAsImage(element: HTMLElement): Promise<Blob> {
  const h2c = await loadHtml2Canvas();

  if (!h2c) {
    throw new Error('Failed to load html2canvas');
  }

  try {
    // Use 2x scale for high quality, 1200x1200 for LinkedIn
    const canvas = await h2c(element, {
      scale: 2,
      backgroundColor: '#0F0F0F',
      logging: false,
      useCORS: true,
      allowTaint: true,
      pixelRatio: 2,
    });

    // Create a high-quality image blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Ensure blob is under 5MB for LinkedIn
            if (blob.size > 5 * 1024 * 1024) {
              // If too large, re-export with lower quality
              canvas.toBlob(
                (smallerBlob) => {
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
