/**
 * Main Application Logic
 */

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initPage();
});

/**
 * Initialize mobile navigation
 */
function initNavigation() {
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');
  const sidebar = document.getElementById('sidebar');

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      
      if (isOpen) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });
  }

  if (mobileDrawerOverlay) {
    mobileDrawerOverlay.addEventListener('click', () => {
      closeMobileDrawer();
    });
  }

  function openMobileDrawer() {
    mobileDrawer.classList.add('open');
    mobileDrawerOverlay.classList.add('visible');
    mobileNavToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    mobileDrawer.classList.remove('open');
    mobileDrawerOverlay.classList.remove('visible');
    mobileNavToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // Close drawer when clicking a link
  const drawerLinks = document.querySelectorAll('.mobile-drawer a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
    });
  });
}

/**
 * Initialize page based on current route
 */
async function initPage() {
  const path = window.location.pathname;
  
  if (path.includes('topic.html')) {
    await initTopicPage();
  } else {
    await initIndexPage();
  }
}

/**
 * Initialize index page
 */
async function initIndexPage() {
  console.log('Inicializace indexové stránky...');
  try {
    // Load all topics
    console.log('Načítání otázek...');
    const topics = await topicLoader.loadAllTopics();
    console.log(`Načteno ${topics.length} otázek:`, topics);
    
  if (topics.length === 0) {
    console.error('No topics loaded. Check console for errors.');
    const containers = ['topicsList', 'mobileTopicsList', 'indexTopicsList'];
    containers.forEach(id => {
      const container = document.getElementById(id);
      if (container) {
        container.innerHTML = '<li class="topic-item"><div class="topic-link">Chyba při načítání otázek. Zkontrolujte konzoli prohlížeče.</div></li>';
      }
    });
    return;
  }
    
    // Render topic lists (sidebar and main content)
    renderTopicList('topicsList', topics, false);
    renderTopicList('mobileTopicsList', topics, false);
    renderTopicList('indexTopicsList', topics, true);

    // Update stats
    updateIndexStats(topics.length);
    
    // Listen for progress updates
    window.addEventListener('progressUpdated', () => {
      updateIndexStats(topics.length);
      renderTopicList('topicsList', topics, false);
      renderTopicList('mobileTopicsList', topics, false);
      renderTopicList('indexTopicsList', topics, true);
    });
  } catch (error) {
    console.error('Error initializing index page:', error);
    const containers = ['topicsList', 'mobileTopicsList', 'indexTopicsList'];
    containers.forEach(id => {
      const container = document.getElementById(id);
      if (container) {
        container.innerHTML = '<li class="topic-item"><div class="topic-link">Chyba při načítání otázek: ' + escapeHtml(error.message) + '</div></li>';
      }
    });
  }
}

/**
 * Initialize topic detail page
 */
async function initTopicPage() {
  // Get topic ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const topicId = urlParams.get('id');

  if (!topicId) {
    console.error('Nebylo zadáno ID otázky');
    const titleElement = document.getElementById('topicTitle');
    if (titleElement) {
      titleElement.textContent = 'Chyba: Nebylo zadáno ID otázky';
    }
    return;
  }

  try {
    // Load all topics for navigation
    await topicLoader.loadAllTopics();
    
    // Load current topic
    const topic = await topicLoader.loadTopic(topicId);
    if (!topic) {
      console.error(`Otázka ${topicId} nenalezena`);
      const titleElement = document.getElementById('topicTitle');
      if (titleElement) {
        titleElement.textContent = `Chyba: Otázka ${topicId} nenalezena`;
      }
      return;
    }

    // Render topic lists in sidebars
    const topics = topicLoader.topics;
    renderTopicList('topicsList', topics, false, topicId);
    renderTopicList('mobileTopicsList', topics, false, topicId);

    // Render topic content
    renderTopicContent(topic);

    // Initialize flashcards
    if (topic.flashcards && topic.flashcards.length > 0) {
      flashcardsHandler.init(topic.flashcards);
    }

    // Setup completion toggle
    setupCompletionToggle(topicId);

    // Setup navigation
    setupTopicNavigation(topicId);
  } catch (error) {
    console.error('Chyba při načítání otázky:', error);
    const titleElement = document.getElementById('topicTitle');
    if (titleElement) {
      titleElement.textContent = 'Chyba při načítání otázky: ' + error.message;
    }
  }
}

/**
 * Render topic list
 * @param {string} containerId - ID of container element
 * @param {Array} topics - Array of topic objects
 * @param {boolean} isIndexPage - Whether this is the index page
 * @param {string} activeTopicId - Currently active topic ID (optional)
 */
function renderTopicList(containerId, topics, isIndexPage, activeTopicId = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (topics.length === 0) {
    container.innerHTML = '<li class="topic-item"><div class="topic-link">Žádné otázky nejsou k dispozici</div></li>';
    return;
  }

  container.innerHTML = topics.map(topic => {
    const isCompleted = progressTracker.isCompleted(topic.id);
    const isActive = activeTopicId === topic.id;
    const url = isIndexPage ? topicLoader.getTopicUrl(topic.id) : topicLoader.getTopicUrl(topic.id);
    
    return `
      <li class="topic-item">
        <a href="${url}" class="topic-link ${isActive ? 'active' : ''}" ${isActive ? 'aria-current="page"' : ''}>
          <div class="topic-info">
            <div class="topic-title">${escapeHtml(topic.title)}</div>
          </div>
          <div class="topic-status">
            <div class="completion-check ${isCompleted ? 'completed' : ''}" aria-label="${isCompleted ? 'Dokončeno' : 'Nedokončeno'}"></div>
          </div>
        </a>
      </li>
    `;
  }).join('');
}

/**
 * Update index page statistics
 * @param {number} totalTopics - Total number of topics
 */
function updateIndexStats(totalTopics) {
  const totalElement = document.getElementById('totalTopics');
  const completedElement = document.getElementById('completedTopics');
  
  if (totalElement) {
    totalElement.textContent = totalTopics;
  }
  
  if (completedElement) {
    const completed = progressTracker.getCompletionCount(totalTopics);
    completedElement.textContent = completed;
  }
}

/**
 * Render topic content
 * @param {Object} topic - Topic object
 */
function renderTopicContent(topic) {
  // Update page title
  const pageTitle = document.getElementById('pageTitle');
  if (pageTitle) {
    pageTitle.textContent = `${topic.title} - Dějiny tance a baletu - Maturitní otázky`;
  }

  // Render header
  const titleElement = document.getElementById('topicTitle');
  if (titleElement) {
    titleElement.textContent = topic.title;
  }

  // Render meta info (removed - no longer displaying time and difficulty)
  const metaElement = document.getElementById('topicMeta');
  if (metaElement) {
    metaElement.innerHTML = '';
  }

  // Render objectives
  if (topic.objectives && topic.objectives.length > 0) {
    const objectivesList = document.getElementById('objectivesList');
    if (objectivesList) {
      objectivesList.innerHTML = topic.objectives.map(obj => 
        `<li class="objective-item">${escapeHtml(obj)}</li>`
      ).join('');
    }
  } else {
    const objectivesSection = document.getElementById('objectivesSection');
    if (objectivesSection) {
      objectivesSection.style.display = 'none';
    }
  }

  // Render materials
  if (topic.materials) {
    const materialsContent = document.getElementById('materialsContent');
    if (materialsContent) {
      let html = '';
      
      if (topic.materials.summary) {
        html += `<div class="materials-summary">${markdownToHtml(topic.materials.summary)}</div>`;
      }
      
      if (topic.materials.sections && topic.materials.sections.length > 0) {
        html += topic.materials.sections.map(section => `
          <div class="materials-section">
            ${section.heading ? `<h3 class="materials-heading">${escapeHtml(section.heading)}</h3>` : ''}
            <div class="materials-content">${markdownToHtml(section.content || '')}</div>
          </div>
        `).join('');
      }
      
      materialsContent.innerHTML = html;
    }
  }

  // Render audio
  if (topic.audio) {
    const audioContent = document.getElementById('audioContent');
    if (audioContent) {
      const hasTranscript = topic.audio.transcript && topic.audio.transcript.trim() !== '';
      audioContent.innerHTML = `
        <h3 style="margin-bottom: var(--spacing-md);">${escapeHtml(topic.audio.title || 'Audio')}</h3>
        <audio class="audio-player" controls>
          <source src="${escapeHtml(topic.audio.src || '')}" type="audio/mpeg">
          Váš prohlížeč nepodporuje audio element.
        </audio>
        ${hasTranscript ? `
          <div class="audio-transcript">
            <button class="audio-transcript-toggle" id="transcriptToggle">Zobrazit přepis</button>
            <div class="audio-transcript-content" id="transcriptContent">${markdownToHtml(topic.audio.transcript)}</div>
          </div>
        ` : ''}
      `;

      // Setup transcript toggle
      if (hasTranscript) {
        const toggle = document.getElementById('transcriptToggle');
        const content = document.getElementById('transcriptContent');
        if (toggle && content) {
          toggle.addEventListener('click', () => {
            const isVisible = content.classList.contains('show');
            if (isVisible) {
              content.classList.remove('show');
              toggle.textContent = 'Zobrazit přepis';
            } else {
              content.classList.add('show');
              toggle.textContent = 'Skrýt přepis';
            }
          });
        }
      }
    }
  } else {
    const audioSection = document.getElementById('audioSection');
    if (audioSection) {
      audioSection.style.display = 'none';
    }
  }

  // Render resources
  if (topic.resources && topic.resources.length > 0) {
    const resourcesList = document.getElementById('resourcesList');
    if (resourcesList) {
      resourcesList.innerHTML = topic.resources.map(resource => `
        <li class="resource-item">
          <a href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer" class="resource-title">
            ${escapeHtml(resource.title)}
          </a>
          ${resource.reason ? `<div class="resource-reason">${escapeHtml(resource.reason)}</div>` : ''}
        </li>
      `).join('');
    }
  } else {
    const resourcesSection = document.getElementById('resourcesSection');
    if (resourcesSection) {
      resourcesSection.style.display = 'none';
    }
  }
}

/**
 * Setup completion toggle
 * @param {string} topicId - Topic ID
 */
function setupCompletionToggle(topicId) {
  const checkbox = document.getElementById('completionCheckbox');
  const toggle = document.getElementById('completionToggle');
  const label = document.getElementById('completionLabel');

  if (!checkbox || !toggle || !label) return;

  // Set initial state
  const isCompleted = progressTracker.isCompleted(topicId);
  checkbox.checked = isCompleted;
  if (isCompleted) {
    toggle.classList.add('completed');
    label.textContent = 'Dokončeno';
  }

  // Handle toggle
  checkbox.addEventListener('change', () => {
    const completed = checkbox.checked;
    progressTracker.setCompleted(topicId, completed);
    
    if (completed) {
      toggle.classList.add('completed');
      label.textContent = 'Dokončeno';
    } else {
      toggle.classList.remove('completed');
      label.textContent = 'Označit jako dokončené';
    }
  });
}

/**
 * Setup topic navigation (next/previous)
 * @param {string} topicId - Current topic ID
 */
function setupTopicNavigation(topicId) {
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');

  const prevTopic = topicLoader.getPreviousTopic(topicId);
  const nextTopic = topicLoader.getNextTopic(topicId);

  if (prevButton) {
    if (prevTopic) {
      prevButton.href = topicLoader.getTopicUrl(prevTopic.id);
      prevButton.textContent = `← ${prevTopic.title}`;
      prevButton.removeAttribute('aria-label');
    } else {
      prevButton.classList.add('disabled');
      prevButton.href = '#';
      prevButton.textContent = '← Předchozí';
      prevButton.addEventListener('click', (e) => e.preventDefault());
    }
  }

  if (nextButton) {
    if (nextTopic) {
      nextButton.href = topicLoader.getTopicUrl(nextTopic.id);
      nextButton.textContent = `${nextTopic.title} →`;
      nextButton.removeAttribute('aria-label');
    } else {
      nextButton.classList.add('disabled');
      nextButton.href = '#';
      nextButton.textContent = 'Další →';
      nextButton.addEventListener('click', (e) => e.preventDefault());
    }
  }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Simple Markdown to HTML converter
 * @param {string} markdown - Markdown text
 * @returns {string} HTML
 */
function markdownToHtml(markdown) {
  if (!markdown) return '';
  
  let html = escapeHtml(markdown);
  
  // Convert **bold** to <strong>
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Convert *italic* to <em>
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Convert line breaks to <br> (only for double line breaks, or preserve single)
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

