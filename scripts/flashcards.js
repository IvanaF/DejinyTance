/**
 * Flashcards Handler
 * Manages flashcard interactions
 */

class FlashcardsHandler {
  constructor() {
    this.flashcards = [];
    this.shuffledCards = [];
    this.currentIndex = 0;
  }

  /**
   * Get Czech plural form
   * @param {number} count - Number
   * @param {string} one - Form for 1
   * @param {string} few - Form for 2-4
   * @param {string} many - Form for 5+
   * @returns {string} Correct plural form
   */
  getCzechPlural(count, one, few, many) {
    if (count === 1) return one;
    if (count >= 2 && count <= 4) return few;
    return many;
  }

  /**
   * Initialize flashcards from data
   * @param {Array} flashcards - Array of flashcard objects with q and a properties
   */
  init(flashcards) {
    this.flashcards = flashcards || [];
    
    // Shuffle flashcards randomly
    this.shuffledCards = [...this.flashcards].sort(() => Math.random() - 0.5);
    this.currentIndex = 0;
    
    // Update section title (no count)
    const flashcardsSection = document.getElementById('flashcardsSection');
    if (flashcardsSection && this.flashcards.length > 0) {
      const sectionTitle = flashcardsSection.querySelector('.section-title span');
      if (sectionTitle) {
        sectionTitle.textContent = `Kartičky`;
      }
    }
    
    this.render();
  }

  /**
   * Render current flashcard to the container
   */
  render() {
    const container = document.getElementById('flashcardsContainer');
    if (!container) return;

    if (this.shuffledCards.length === 0) {
      container.innerHTML = '<p>Pro toto téma nejsou k dispozici žádné kartičky.</p>';
      return;
    }

    const card = this.shuffledCards[this.currentIndex];
    const totalCards = this.shuffledCards.length;
    const canGoPrev = this.currentIndex > 0;
    const canGoNext = this.currentIndex < totalCards - 1;

    container.innerHTML = `
      <div class="flashcard-container">
        <div class="flashcard-progress">
          ${this.currentIndex + 1} z ${totalCards}
        </div>
        <div class="flashcard" id="currentFlashcard" role="button" tabindex="0" aria-label="Kartička ${this.currentIndex + 1}">
          <div class="flashcard-question">${this.escapeHtml(card.q)}</div>
          <div class="flashcard-answer">${this.markdownToHtml(card.a)}</div>
          <div class="flashcard-hint">Klikněte pro zobrazení odpovědi</div>
        </div>
        <div class="flashcard-navigation">
          <button class="flashcard-nav-button" ${!canGoPrev ? 'disabled' : ''} onclick="flashcardsHandler.navigateFlashcard(${this.currentIndex - 1})">
            ← Předchozí
          </button>
          <button class="flashcard-flip-button" onclick="flashcardsHandler.flipCurrentCard()">
            Otočit kartu
          </button>
          <button class="flashcard-nav-button" ${!canGoNext ? 'disabled' : ''} onclick="flashcardsHandler.navigateFlashcard(${this.currentIndex + 1})">
            Další →
          </button>
        </div>
      </div>
    `;

    // Attach event listeners
    const currentCard = document.getElementById('currentFlashcard');
    if (currentCard) {
      currentCard.addEventListener('click', () => this.flipCurrentCard());
      currentCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.flipCurrentCard();
        }
      });
    }
  }

  /**
   * Navigate to another flashcard
   * @param {number} index - Index of flashcard to navigate to
   */
  navigateFlashcard(index) {
    if (index >= 0 && index < this.shuffledCards.length) {
      this.currentIndex = index;
      this.render();
      
      // Scroll to section title to keep it visible
      const flashcardsSection = document.getElementById('flashcardsSection');
      if (flashcardsSection) {
        const sectionTitle = flashcardsSection.querySelector('.section-title');
        const scrollTarget = sectionTitle || flashcardsSection;
        
        // Calculate dynamic offset (same function as in app.js)
        let offset = 0;
        const stickyHeader = document.getElementById('stickyHeader');
        if (stickyHeader && stickyHeader.classList.contains('visible')) {
          const stickyHeaderRect = stickyHeader.getBoundingClientRect();
          offset += stickyHeaderRect.height;
        }
        const mobileNav = document.querySelector('.mobile-nav');
        if (mobileNav && window.getComputedStyle(mobileNav).display !== 'none') {
          const mobileNavRect = mobileNav.getBoundingClientRect();
          offset += mobileNavRect.height;
        }
        offset += 40; // Extra padding to prevent overlap with topic header
        offset = Math.max(offset, 100); // Minimum 100px offset
        
        const elementPosition = scrollTarget.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }

  /**
   * Flip the current flashcard
   */
  flipCurrentCard() {
    const currentCard = document.getElementById('currentFlashcard');
    if (currentCard) {
      this.flipCard(currentCard);
    }
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

