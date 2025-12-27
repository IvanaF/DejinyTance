/**
 * Flashcards Handler
 * Manages flashcard interactions
 */

class FlashcardsHandler {
  constructor() {
    this.flashcards = [];
  }

  /**
   * Initialize flashcards from data
   * @param {Array} flashcards - Array of flashcard objects with q and a properties
   */
  init(flashcards) {
    this.flashcards = flashcards || [];
    this.render();
  }

  /**
   * Render flashcards to the container
   */
  render() {
    const container = document.getElementById('flashcardsContainer');
    if (!container) return;

    if (this.flashcards.length === 0) {
      container.innerHTML = '<p>Pro toto téma nejsou k dispozici žádné kartičky.</p>';
      return;
    }

    container.innerHTML = this.flashcards.map((card, index) => `
      <div class="flashcard" data-index="${index}" role="button" tabindex="0" aria-label="Kartička ${index + 1}">
        <div class="flashcard-question">${this.escapeHtml(card.q)}</div>
        <div class="flashcard-answer">${this.markdownToHtml(card.a)}</div>
        <div class="flashcard-hint">Klikněte pro zobrazení odpovědi</div>
      </div>
    `).join('');

    // Attach event listeners
    container.querySelectorAll('.flashcard').forEach(card => {
      card.addEventListener('click', (e) => this.flipCard(e.currentTarget));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.flipCard(e.currentTarget);
        }
      });
    });
  }

  /**
   * Flip a flashcard
   * @param {HTMLElement} cardElement - The flashcard DOM element
   */
  flipCard(cardElement) {
    cardElement.classList.toggle('flipped');
    const isFlipped = cardElement.classList.contains('flipped');
    
    // Update ARIA label
    const index = cardElement.dataset.index;
    cardElement.setAttribute('aria-label', 
      isFlipped 
        ? `Kartička ${parseInt(index) + 1}, zobrazuje odpověď`
        : `Kartička ${parseInt(index) + 1}, zobrazuje otázku`
    );
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Simple Markdown to HTML converter (basic support)
   * For MVP, supports bold (**text**) and line breaks
   * @param {string} markdown - Markdown text
   * @returns {string} HTML
   */
  markdownToHtml(markdown) {
    if (!markdown) return '';
    
    let html = this.escapeHtml(markdown);
    
    // Convert **bold** to <strong>
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Convert line breaks to <br>
    html = html.replace(/\n/g, '<br>');
    
    return html;
  }
}

// Export singleton instance
const flashcardsHandler = new FlashcardsHandler();

