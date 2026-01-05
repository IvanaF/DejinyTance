/**
 * Help Modal Handler
 * Manages help modal display
 */

/**
 * Initialize help system
 */
function initHelp() {
  const helpButton = document.getElementById('helpButton');
  const helpModal = document.getElementById('helpModal');
  const helpOverlay = document.getElementById('helpOverlay');
  const closeButton = document.getElementById('helpClose');

  if (!helpButton || !helpModal) {
    console.warn('Help elements not found in DOM');
    return;
  }

  // Open modal
  helpButton.addEventListener('click', (e) => {
    e.preventDefault();
    openHelpModal();
  });

  // Close modal handlers
  if (closeButton) {
    closeButton.addEventListener('click', closeHelpModal);
  }

  if (helpOverlay) {
    helpOverlay.addEventListener('click', closeHelpModal);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && helpModal.classList.contains('open')) {
      closeHelpModal();
    }
  });
}

/**
 * Open help modal
 */
function openHelpModal() {
  const helpModal = document.getElementById('helpModal');
  const helpOverlay = document.getElementById('helpOverlay');
  
  if (helpModal) {
    helpModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  
  if (helpOverlay) {
    helpOverlay.classList.add('visible');
  }
}

/**
 * Close help modal
 */
function closeHelpModal() {
  const helpModal = document.getElementById('helpModal');
  const helpOverlay = document.getElementById('helpOverlay');
  
  if (helpModal) {
    helpModal.classList.remove('open');
    document.body.style.overflow = '';
  }
  
  if (helpOverlay) {
    helpOverlay.classList.remove('visible');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initHelp);

