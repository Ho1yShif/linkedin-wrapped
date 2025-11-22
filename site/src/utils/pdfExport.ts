/**
 * Utility to export story cards as a PDF document
 * Uses jsPDF and html2canvas for cross-browser compatibility
 */

let jsPDFLib: any = null;
let html2canvas: any = null;

/**
 * Dynamically load required libraries
 */
async function loadLibraries() {
  if (!jsPDFLib || !html2canvas) {
    try {
      // Load html2canvas
      const canvasModule = await import('html2canvas');
      html2canvas = canvasModule.default;

      // Load jsPDF - use dynamic require-like approach
      try {
        // @ts-ignore - dynamic import of jsPDF
        const pdfModule = await import('jspdf');
        jsPDFLib = pdfModule.jsPDF;
      } catch {
        // Try alternative export path
        // @ts-ignore - dynamic import fallback
        const pdfModule = await import('jspdf');
        jsPDFLib = pdfModule.default;
      }
    } catch (err) {
      throw new Error('Failed to load PDF export libraries. Ensure jsPDF and html2canvas are installed.');
    }
  }
}

/**
 * Prepare a card element for export by cloning and removing interactive elements
 * Removes any text selection styling and share buttons
 */
function prepareCardForExport(element: HTMLElement): HTMLElement {
  // Clone the element to avoid modifying the original
  const clone = element.cloneNode(true) as HTMLElement;

  // Remove any share buttons
  const shareButtons = clone.querySelectorAll('.share-button-wrapper, .share-button, [class*="share"]');
  shareButtons.forEach(btn => btn.remove());

  // Remove any text selection styling
  clone.style.userSelect = 'none';
  (clone as any).style.webkitUserSelect = 'none';
  (clone as any).style.msUserSelect = 'none';
  (clone as any).style.MozUserSelect = 'none';

  // Ensure no element is focused or highlighted
  clone.querySelectorAll('*').forEach(el => {
    (el as HTMLElement).style.outline = 'none';
    (el as HTMLElement).style.boxShadow = 'none';
  });

  return clone;
}

/**
 * Export all story cards as a PDF document
 * One page per card or multiple cards per page depending on height
 *
 * @param cardElements Array of card DOM elements to export
 * @param filename Optional filename for the PDF (default: linkedin-wrapped.pdf)
 */
export async function exportCardsAsPDF(
  cardElements: HTMLElement[],
  filename: string = 'linkedin-wrapped.pdf'
): Promise<void> {
  if (!cardElements || cardElements.length === 0) {
    throw new Error('No cards provided for PDF export');
  }

  await loadLibraries();

  try {
    if (!jsPDFLib) {
      throw new Error('jsPDF library failed to load');
    }

    // Initialize PDF with A4 dimensions in portrait mode
    // Units are in mm, A4 = 210x297mm
    const PDF = new jsPDFLib({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = PDF.internal.pageSize.getWidth();
    const pageHeight = PDF.internal.pageSize.getHeight();
    const margin = 10; // 10mm margins

    let isFirstPage = true;
    let currentYPosition = margin;

    // Process each card
    for (let i = 0; i < cardElements.length; i++) {
      const cardElement = cardElements[i];
      const preparedCard = prepareCardForExport(cardElement);

      // Temporarily add to DOM for rendering
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.appendChild(preparedCard);
      document.body.appendChild(tempContainer);

      try {
        // Capture card as canvas
        const canvas = await html2canvas(preparedCard, {
          scale: 2,
          backgroundColor: '#0F0F0F',
          logging: false,
          useCORS: true,
          allowTaint: true,
          pixelRatio: 2,
        });

        // Calculate dimensions to fit on page
        // Maintain aspect ratio of the card (9:14 for story format)
        const maxWidth = pageWidth - 2 * margin;
        const maxHeight = pageHeight - 2 * margin;

        // Calculate proportions
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const aspectRatio = canvasHeight / canvasWidth;

        let imageWidth = maxWidth;
        let imageHeight = imageWidth * aspectRatio;

        // If height exceeds page, scale down
        if (imageHeight > maxHeight) {
          imageHeight = maxHeight;
          imageWidth = imageHeight / aspectRatio;
        }

        // Center the image on the page
        const xPosition = (pageWidth - imageWidth) / 2;

        // Check if we need a new page
        if (!isFirstPage && currentYPosition + imageHeight > pageHeight - margin) {
          PDF.addPage();
          currentYPosition = margin;
        }

        // Convert canvas to image
        const imageData = canvas.toDataURL('image/png');

        // Add image to PDF
        PDF.addImage(imageData, 'PNG', xPosition, currentYPosition, imageWidth, imageHeight);

        // Update position for next card or add new page
        currentYPosition += imageHeight + margin;

        isFirstPage = false;
      } finally {
        // Clean up temporary container
        document.body.removeChild(tempContainer);
      }
    }

    // Save the PDF
    PDF.save(filename);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to export cards as PDF: ${errorMessage}`);
  }
}

/**
 * Export a single card as PDF (wrapper for single card case)
 */
export async function exportCardAsPDF(
  cardElement: HTMLElement,
  filename: string = 'linkedin-wrapped-card.pdf'
): Promise<void> {
  return exportCardsAsPDF([cardElement], filename);
}
