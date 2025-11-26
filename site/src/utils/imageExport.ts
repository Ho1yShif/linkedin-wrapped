/**
 * Utility to export HTML card elements as PNG images
 * Creates a visible screenshot and converts to canvas
 * Removes share buttons before export
 *
 * Performance optimizations:
 * - Batched DOM operations
 * - Reduced canvas scale (1.5x instead of 2x)
 * - Shared style cleanup logic
 * - Disabled unnecessary html2canvas features
 */

// Cached library references to avoid re-importing
let cachedHtml2Canvas: any = null;

/**
 * Load html2canvas library dynamically with caching
 */
async function loadHtml2Canvas() {
  if (cachedHtml2Canvas) {
    return cachedHtml2Canvas;
  }

  try {
    const module = await import('html2canvas');
    cachedHtml2Canvas = module.default;
    return cachedHtml2Canvas;
  } catch (err) {
    throw new Error('html2canvas library is required for PNG export');
  }
}

/**
 * Unified style cleanup utility - removes highlighting effects and unwanted styles
 * Batches DOM queries for optimal performance
 */
function cleanupExportStyles(element: HTMLElement, styleId: string): void {
  // Inject CSS global override once
  const style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = `
    /* Global override for all selection highlighting */
    *::selection {
      background: transparent !important;
      color: inherit !important;
    }

    *::-moz-selection {
      background: transparent !important;
      color: inherit !important;
    }

    /* Override pseudo-element selection */
    *::before::selection,
    *::after::selection {
      background: transparent !important;
      color: inherit !important;
    }

    *::-moz-selection::before,
    *::-moz-selection::after {
      background: transparent !important;
      color: inherit !important;
    }
  `;
  document.head.appendChild(style);

  // Single batch query instead of multiple
  const allElements = [element, ...Array.from(element.querySelectorAll('*'))] as HTMLElement[];

  // Single pass through all elements
  allElements.forEach(el => {
    // Disable user selection
    el.style.userSelect = 'none';
    (el.style as any).webkitUserSelect = 'none';
    (el.style as any).msUserSelect = 'none';
    (el.style as any).mozUserSelect = 'none';

    // Clear highlight-related styles
    el.style.backgroundColor = '';
    el.style.color = '';

    if (el.style.cssText.includes('highlight')) {
      el.style.cssText = el.style.cssText.replace(/highlight[^;]*;?/gi, '');
    }
  });
}

/**
 * Export a single card as PNG image
 * Optimized for speed with reduced scale and batched DOM operations
 * @param element The card element to export
 * @returns A blob containing the PNG image
 */
export async function exportCardAsImage(element: HTMLElement): Promise<Blob> {
  try {
    const html2canvas = await loadHtml2Canvas();

    if (!html2canvas) {
      throw new Error('Failed to load html2canvas');
    }

    // Clone the element to prepare it for export
    const clone = element.cloneNode(true) as HTMLElement;

    // Single batched DOM cleanup pass - remove unwanted elements
    const shareButtons = clone.querySelectorAll('.share-button-wrapper, .share-button, [class*="share"]');
    const iframeContainers = clone.querySelectorAll('.peak-post-embed-container');

    // Remove share buttons
    shareButtons.forEach(btn => btn.remove());

    // Replace iframes with trophy emoji for peak performer card exports
    iframeContainers.forEach((container) => {
      const trophyDiv = document.createElement('div');
      trophyDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; min-height: 200px; font-size: 3.5rem;';
      trophyDiv.textContent = '🏆';
      container.replaceWith(trophyDiv);
    });

    // Ensure clone is visible
    clone.style.opacity = '1';
    clone.style.transform = 'scale(1)';
    clone.style.visibility = 'visible';
    clone.style.display = 'block';
    clone.style.borderRadius = '0';
    clone.style.overflow = 'hidden';

    // Unified style cleanup with batched DOM queries
    const styleId = 'png-export-styles-' + Math.random().toString(36).substr(2, 9);
    cleanupExportStyles(clone, styleId);

    // Single comprehensive pass through all elements for style normalization
    const allElements = clone.querySelectorAll('*');
    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement;

      // Remove all background-related styles that might cause highlighting
      htmlEl.style.setProperty('background', 'transparent', 'important');
      htmlEl.style.setProperty('backgroundImage', 'none', 'important');
      htmlEl.style.setProperty('backgroundClip', 'unset', 'important');

      // Remove webkit-specific gradient text styles
      (htmlEl.style as any).setProperty('-webkit-background-clip', 'unset', 'important');
      (htmlEl.style as any).setProperty('-webkit-text-fill-color', 'unset', 'important');
      (htmlEl.style as any).setProperty('-moz-background-clip', 'unset', 'important');

      // Set explicit white color
      htmlEl.style.setProperty('color', 'rgba(255, 255, 255, 0.95)', 'important');

      // Remove shadows that might create highlighting effect
      htmlEl.style.setProperty('textShadow', 'none', 'important');
      htmlEl.style.setProperty('boxShadow', 'none', 'important');
    });

    // Get dimensions
    const rect = element.getBoundingClientRect();
    const width = Math.ceil(rect.width || 400);
    const height = Math.ceil(rect.height || 600);

    // Set up clone styling
    clone.style.width = `${width}px`;
    clone.style.height = `${height}px`;
    clone.style.margin = '0';
    clone.style.padding = window.getComputedStyle(element).padding;
    clone.style.boxSizing = 'border-box';
    clone.style.position = 'relative';
    clone.style.display = 'block';

    // Place in DOM at visible location (not off-screen, as that can cause rendering issues)
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.zIndex = '999999';
    container.style.pointerEvents = 'none';
    container.style.opacity = '0';

    container.appendChild(clone);
    document.body.appendChild(container);

    try {
      // Capture using html2canvas with optimized settings
      // scale: 1.5 provides good quality while improving speed significantly
      // Disabled unnecessary features (proxy, foreignObjectRendering)
      const canvas = await html2canvas(clone, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0F0F0F',
        logging: false,
        width: width,
        height: height,
        windowHeight: height,
        windowWidth: width,
        proxy: null,
        foreignObjectRendering: false,
      });

      // Convert canvas to blob
      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob: Blob | null) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create image blob'));
            }
          },
          'image/png',
          1
        );
      });
    } finally {
      // Clean up
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to export card as image: ${errorMessage}`);
  }
}/**
 * Get the optimal dimensions for a card export
 * Returns width and height for LinkedIn-friendly aspect ratio
 */
export function getOptimalExportDimensions(): { width: number; height: number } {
  return {
    width: 1080,
    height: 1350,
  };
}
