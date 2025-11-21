/**
 * Utility function to copy text to clipboard
 */

export async function copyToClipboard(text: string): Promise<void> {
  try {
    // Try using the modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (!successful) {
      throw new Error('Failed to copy text to clipboard');
    }
  } catch (err) {
    throw new Error(`Clipboard error: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}
