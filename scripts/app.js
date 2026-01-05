/**
 * Main Application Logic
 */

/**
 * Get correct Czech plural form
 * @param {number} count - Number to get plural for
 * @param {string} one - Form for 1 (e.g., "otázka")
 * @param {string} few - Form for 2-4 (e.g., "otázky")
 * @param {string} many - Form for 5+ (e.g., "otázek")
 * @returns {string} Correct plural form
 */
function getCzechPlural(count, one, few, many) {
  if (count === 1) {
    return one;
  }
  if (count >= 2 && count <= 4) {
    return few;
  }
  return many;
}

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
    const plural = getCzechPlural(topics.length, 'otázka', 'otázky', 'otázek');
    console.log(`Načteno ${topics.length} ${plural}:`, topics);
    
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
    
    // Pre-load term links for linking in materials (load topic-specific terms)
    await loadTermLinks(topicId);
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

    // Setup navigation
    setupTopicNavigation(topicId);
    
    // Setup sticky header and floating button
    setupStickyNavigation(topic);
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

  container.innerHTML = topics.map((topic, index) => {
    const isActive = activeTopicId === topic.id;
    const url = isIndexPage ? topicLoader.getTopicUrl(topic.id) : topicLoader.getTopicUrl(topic.id);
    // Use order field if available, otherwise use index + 1
    const topicNumber = topic.order || (index + 1);
    
    // Image with fallback
    const imageHtml = topic.image ? `
      <img src="${escapeHtml(topic.image)}" alt="${escapeHtml(topic.title)}" class="topic-image" 
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <div class="topic-image-fallback" style="display: none;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 2v4m0 12v4M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </div>
    ` : `
      <div class="topic-image-fallback">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 2v4m0 12v4M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </div>
    `;
    
    return `
      <li class="topic-item">
        <a href="${url}" class="topic-link ${isActive ? 'active' : ''}" ${isActive ? 'aria-current="page"' : ''}>
          <div class="topic-image-container">
            ${imageHtml}
          </div>
          <div class="topic-info">
            <div class="topic-title">${topicNumber}. ${escapeHtml(topic.title)}</div>
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
  
  if (totalElement) {
    const plural = getCzechPlural(totalTopics, 'otázka', 'otázky', 'otázek');
    totalElement.textContent = `${totalTopics} ${plural}`;
  }
}

/**
 * Group sections by subtopics based on topic title
 * @param {Array} sections - Array of section objects
 * @param {Array} subtopics - Array of subtopic names (from title, comma-separated)
 * @returns {Array} Array of grouped sections with subtopic info
 */
function groupSectionsBySubtopics(sections, subtopics) {
  const groups = [];
  let currentGroup = null;
  
  sections.forEach((section, index) => {
    const sectionHeading = section.heading ? section.heading.trim().toUpperCase() : '';
    const sectionContent = section.content ? section.content.trim().toUpperCase() : '';
    
    // Check if this section's heading exactly matches a subtopic (case-insensitive)
    let matchingSubtopic = subtopics.find(subtopic => {
      const normalizedSubtopic = subtopic.trim().toUpperCase();
      return sectionHeading === normalizedSubtopic;
    });
    
    // If no match in heading, check if content contains a subtopic name on its own line
    // (e.g., "JAPONSKO" might appear in content rather than as a heading)
    if (!matchingSubtopic) {
      matchingSubtopic = subtopics.find(subtopic => {
        const normalizedSubtopic = subtopic.trim().toUpperCase();
        // Check if content starts with the subtopic name (possibly followed by space, parenthesis, etc.)
        // Or if it appears on its own line (preceded by newline)
        return sectionContent.startsWith(normalizedSubtopic + ' ') || 
               sectionContent.startsWith(normalizedSubtopic + '(') ||
               sectionContent.startsWith(normalizedSubtopic + '\n') ||
               sectionContent.includes('\n' + normalizedSubtopic + ' ') ||
               sectionContent.includes('\n' + normalizedSubtopic + '(');
      });
    }
    
    if (matchingSubtopic) {
      // Start a new group for this subtopic
      if (currentGroup && currentGroup.sections.length > 0) {
        groups.push(currentGroup);
      }
      // Use the original case from subtopics array for display
      // Find the original case from the title
      const originalSubtopic = subtopics.find(st => st.trim().toUpperCase() === matchingSubtopic.trim().toUpperCase());
      currentGroup = {
        subtopic: originalSubtopic ? originalSubtopic.trim() : matchingSubtopic,
        sections: [section]
      };
    } else {
      // This section doesn't match a subtopic heading - it's a subsection
      // Add it to the current group if one exists, otherwise create an ungrouped section
      if (currentGroup) {
        // Add to current group (subsections of the subtopic)
        currentGroup.sections.push(section);
      } else {
        // No current group - create an ungrouped section
        if (groups.length === 0 || groups[groups.length - 1].subtopic) {
          groups.push({
            subtopic: null,
            sections: [section]
          });
        } else {
          groups[groups.length - 1].sections.push(section);
        }
      }
    }
  });
  
  // Add the last group if it exists
  if (currentGroup && currentGroup.sections.length > 0) {
    groups.push(currentGroup);
  }
  
  return groups;
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

  // Render header with image
  const titleElement = document.getElementById('topicTitle');
  if (titleElement) {
    const topicNumber = topic.order || '';
    const imageHtml = topic.image ? `
      <img src="${escapeHtml(topic.image)}" alt="${escapeHtml(topic.title)}" class="topic-header-image"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <div class="topic-header-image-fallback" style="display: none;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 2v4m0 12v4M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </div>
    ` : `
      <div class="topic-header-image-fallback">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 2v4m0 12v4M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </div>
    `;
    titleElement.innerHTML = `
      <div class="topic-header-content">
        <div class="topic-header-image-container">${imageHtml}</div>
        <span>${topicNumber ? topicNumber + '. ' : ''}${escapeHtml(topic.title)}</span>
      </div>
    `;
  }

  // Update sticky header title
  const stickyHeaderTitle = document.getElementById('stickyHeaderTitle');
  if (stickyHeaderTitle) {
    const topicNumber = topic.order || '';
    stickyHeaderTitle.textContent = topicNumber ? `${topicNumber}. ${topic.title}` : topic.title;
  }

  // Render meta info (removed - no longer displaying time and difficulty)
  const metaElement = document.getElementById('topicMeta');
  if (metaElement) {
    metaElement.innerHTML = '';
  }

  // Render outline
  if (topic.summary) {
    const outlineContent = document.getElementById('outlineContent');
    if (outlineContent) {
      outlineContent.innerHTML = `<div class="outline-text">${markdownToHtml(topic.summary)}</div>`;
    }
  } else {
    const outlineSection = document.getElementById('outlineSection');
    if (outlineSection) {
      outlineSection.style.display = 'none';
    }
  }

  // Render materials (without summary, it's now separate)
  if (topic.materials) {
    const materialsContent = document.getElementById('materialsContent');
    if (materialsContent) {
      let html = '';
      
      if (topic.materials.sections && topic.materials.sections.length > 0) {
        // Check if topic title contains multiple subtopics (comma-separated)
        const titleParts = topic.title ? topic.title.split(',').map(part => part.trim().toUpperCase()) : [];
        const hasMultipleSubtopics = titleParts.length > 1;
        
        if (hasMultipleSubtopics) {
          // Group sections by subtopic
          const groupedSections = groupSectionsBySubtopics(topic.materials.sections, titleParts);
          
          // Render grouped sections
          groupedSections.forEach(group => {
            if (group.subtopic) {
              html += `<div class="materials-subtopic-group">`;
              html += `<h2 class="materials-subtopic-heading">${escapeHtml(group.subtopic)}</h2>`;
              
              group.sections.forEach((section, sectionIndex) => {
                // Skip the heading if it's the first section and matches the subtopic name
                const sectionHeading = section.heading ? section.heading.trim() : '';
                const subtopicNormalized = group.subtopic.trim().toUpperCase();
                const sectionHeadingNormalized = sectionHeading.toUpperCase();
                const shouldSkipHeading = sectionIndex === 0 && sectionHeadingNormalized === subtopicNormalized;
                
                html += `
                  <div class="materials-section">
                    ${section.heading && !shouldSkipHeading ? `<h3 class="materials-heading">${escapeHtml(section.heading)}</h3>` : ''}
                    <div class="materials-content">${markdownToHtml(section.content || '')}</div>
                  </div>
                `;
              });
              
              html += `</div>`;
            } else {
              // Sections that don't match any subtopic - render normally
              group.sections.forEach(section => {
                html += `
                  <div class="materials-section">
                    ${section.heading ? `<h3 class="materials-heading">${escapeHtml(section.heading)}</h3>` : ''}
                    <div class="materials-content">${markdownToHtml(section.content || '')}</div>
                  </div>
                `;
              });
            }
          });
        } else {
          // Single topic - render sections normally
          html += topic.materials.sections.map(section => `
            <div class="materials-section">
              ${section.heading ? `<h3 class="materials-heading">${escapeHtml(section.heading)}</h3>` : ''}
              <div class="materials-content">${markdownToHtml(section.content || '')}</div>
            </div>
          `).join('');
        }
      }
      
      materialsContent.innerHTML = html;
    }
  }

  // Render audio
  if (topic.audio) {
    const audioContent = document.getElementById('audioContent');
    if (audioContent) {
      const hasTranscript = topic.audio.transcript && topic.audio.transcript.trim() !== '';
      
      // Check if we have multiple audio files
      const audioFiles = topic.audio.files && Array.isArray(topic.audio.files) ? topic.audio.files : null;
      
      let audioHtml = '';
      
      if (audioFiles && audioFiles.length > 1) {
        // Render multiple audio files
        audioHtml = audioFiles.map((audioFile, index) => {
          const fileHasTranscript = audioFile.transcript && audioFile.transcript.trim() !== '';
          const transcriptId = `transcriptToggle_${index}`;
          const transcriptContentId = `transcriptContent_${index}`;
          
          return `
          <div class="audio-item">
            <div class="audio-title">${escapeHtml(audioFile.title || `Audio ${index + 1}`)}</div>
            <audio class="audio-player" controls>
              <source src="${escapeHtml(audioFile.src || '')}" type="audio/mpeg">
              Váš prohlížeč nepodporuje audio element.
            </audio>
            ${fileHasTranscript ? `
              <div class="audio-transcript">
                <button class="audio-transcript-toggle" id="${transcriptId}">Zobrazit přepis</button>
                <div class="audio-transcript-content" id="${transcriptContentId}">${markdownToHtml(audioFile.transcript)}</div>
              </div>
            ` : ''}
          </div>
        `;
        }).join('');
      } else {
        // Single audio file (backward compatibility)
        const audioSrc = audioFiles && audioFiles.length === 1 ? audioFiles[0].src : (topic.audio.src || '');
        const audioTitle = audioFiles && audioFiles.length === 1 ? audioFiles[0].title : (topic.audio.title || 'Audio');
        
        audioHtml = `
          <div class="audio-item">
            <div class="audio-title">${escapeHtml(audioTitle)}</div>
            <audio class="audio-player" controls>
              <source src="${escapeHtml(audioSrc)}" type="audio/mpeg">
              Váš prohlížeč nepodporuje audio element.
            </audio>
            ${hasTranscript ? `
              <div class="audio-transcript">
                <button class="audio-transcript-toggle" id="transcriptToggle">Zobrazit přepis</button>
                <div class="audio-transcript-content" id="transcriptContent">${markdownToHtml(topic.audio.transcript)}</div>
              </div>
            ` : ''}
          </div>
        `;
      }
      
      audioContent.innerHTML = audioHtml;

      // Setup transcript toggles
      if (audioFiles && audioFiles.length > 1) {
        // Multiple audio files - setup toggles for each
        audioFiles.forEach((audioFile, index) => {
          if (audioFile.transcript && audioFile.transcript.trim() !== '') {
            const toggle = document.getElementById(`transcriptToggle_${index}`);
            const content = document.getElementById(`transcriptContent_${index}`);
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
        });
      } else if (hasTranscript) {
        // Single audio file
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

  // Render quiz
  if (topic.quiz && topic.quiz.questions && topic.quiz.questions.length > 0) {
    const quizContent = document.getElementById('quizContent');
    const quizSection = document.getElementById('quizSection');
    
    if (quizSection) {
      // Update section title (no count)
      const sectionTitle = quizSection.querySelector('.section-title');
      if (sectionTitle) {
        const spanElement = sectionTitle.querySelector('span');
        if (spanElement) {
          spanElement.textContent = `Kvíz`;
        }
      }
    }
    
    if (quizContent) {
      // Shuffle questions randomly
      const shuffledQuestions = [...topic.quiz.questions].sort(() => Math.random() - 0.5);
      
      // Store shuffled questions globally for this topic
      window.currentQuiz = {
        questions: shuffledQuestions,
        currentIndex: 0,
        answers: {}
      };
      
      renderQuizQuestion(0);
    }
  } else {
    const quizSection = document.getElementById('quizSection');
    if (quizSection) {
      quizSection.style.display = 'none';
    }
  }

  // Render resources
  if (topic.resources && topic.resources.length > 0) {
    const resourcesList = document.getElementById('resourcesList');
    if (resourcesList) {
      // Check if resources is structured with sections (new format) or flat array (old format)
      const isSectionedFormat = topic.resources[0] && topic.resources[0].heading && topic.resources[0].resources;
      
      if (isSectionedFormat) {
        // New format: sections with sub-sections
        resourcesList.innerHTML = topic.resources.map(section => {
          const sectionResources = section.resources.map(resource => {
            const platformText = resource.platform ? `<span class="resource-platform">${escapeHtml(resource.platform)}</span>` : '';
            const explanationText = resource.explanation ? `<span class="resource-explanation">${escapeHtml(resource.explanation)}</span>` : '';
            return `
              <li class="resource-item">
                <a href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer" class="resource-link">
                  ${escapeHtml(resource.title)}
                </a>
                ${platformText}
                ${explanationText}
              </li>
            `;
          }).join('');
          
          return `
            <li class="resource-section">
              <h3 class="resource-section-heading">${escapeHtml(section.heading)}</h3>
              <ul class="resource-sub-list">
                ${sectionResources}
              </ul>
            </li>
          `;
        }).join('');
      } else {
        // Old format: flat array of resources
        resourcesList.innerHTML = topic.resources.map(resource => {
          const typeText = resource.type ? ` (${escapeHtml(resource.type)})` : '';
          const description = resource.reason ? ` - ${escapeHtml(resource.reason)}` : '';
          return `
            <li class="resource-item">
              <a href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer" class="resource-link">
                ${escapeHtml(resource.title)}${typeText}${description}
              </a>
            </li>
          `;
        }).join('');
      }
    }
  } else {
    const resourcesSection = document.getElementById('resourcesSection');
    if (resourcesSection) {
      resourcesSection.style.display = 'none';
    }
  }

  // Setup smooth scroll for quick navigation
  setupQuickNavigation();
}

/**
 * Render a single quiz question
 * @param {number} questionIndex - Index of question to display
 */
function renderQuizQuestion(questionIndex) {
  const quizContent = document.getElementById('quizContent');
  if (!quizContent || !window.currentQuiz) return;
  
  const quiz = window.currentQuiz;
  const question = quiz.questions[questionIndex];
  const totalQuestions = quiz.questions.length;
  const isAnswered = quiz.answers[questionIndex] !== undefined;
  const userAnswer = quiz.answers[questionIndex];
  const isCorrect = userAnswer === question.correct;
  
  if (!question) return;
  
  const qId = `q${questionIndex}`;
  let answersHtml = '';
  
  if (question.answers && question.answers.length > 0) {
    answersHtml = question.answers.map((answer, aIndex) => {
      const aId = `${qId}_a${aIndex}`;
      const isSelected = userAnswer === aIndex;
      const isCorrectAnswer = aIndex === question.correct;
      let answerClass = 'quiz-answer';
      
      if (isAnswered) {
        if (isCorrectAnswer) {
          answerClass += ' quiz-answer-correct';
        } else if (isSelected && !isCorrectAnswer) {
          answerClass += ' quiz-answer-incorrect';
        }
      }
      
      return `
        <div class="${answerClass}">
          <input type="radio" id="${aId}" name="${qId}" value="${aIndex}" 
                 ${isSelected ? 'checked' : ''} 
                 ${isAnswered ? 'disabled' : ''}>
          <label for="${aId}">${escapeHtml(answer)}</label>
        </div>
      `;
    }).join('');
  }
  
  let resultHtml = '';
  if (isAnswered) {
    resultHtml = `
      <div class="quiz-result ${isCorrect ? 'quiz-result-correct' : 'quiz-result-incorrect'}">
        <div class="quiz-result-icon">${isCorrect ? '✓' : '✗'}</div>
        <div class="quiz-result-text">
          ${isCorrect ? 'Správně!' : 'Špatně. Správná odpověď je: ' + escapeHtml(question.answers[question.correct])}
        </div>
      </div>
    `;
  }
  
  const canGoPrev = questionIndex > 0;
  const canGoNext = questionIndex < totalQuestions - 1;
  
  quizContent.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-progress">
        ${questionIndex + 1} z ${totalQuestions}
      </div>
      <div class="quiz-question">
        <h3 class="quiz-question-title">${escapeHtml(question.question)}</h3>
        <div class="quiz-answers">${answersHtml}</div>
        ${resultHtml}
      </div>
      <div class="quiz-navigation">
        <button class="quiz-nav-button" ${!canGoPrev ? 'disabled' : ''} onclick="navigateQuiz(${questionIndex - 1})">
          ← Předchozí
        </button>
        ${!isAnswered ? `
          <button class="quiz-submit-button" onclick="submitQuizAnswer(${questionIndex})">
            Odeslat odpověď
          </button>
        ` : ''}
        <button class="quiz-nav-button" ${!canGoNext ? 'disabled' : ''} onclick="navigateQuiz(${questionIndex + 1})">
          Další →
        </button>
      </div>
    </div>
  `;
}

/**
 * Submit quiz answer for current question
 * @param {number} questionIndex - Index of question
 */
function submitQuizAnswer(questionIndex) {
  if (!window.currentQuiz) return;
  
  const question = window.currentQuiz.questions[questionIndex];
  const qId = `q${questionIndex}`;
  const selectedAnswer = document.querySelector(`input[name="${qId}"]:checked`);
  
  if (!selectedAnswer) {
    alert('Vyberte prosím odpověď');
    return;
  }
  
  const answerIndex = parseInt(selectedAnswer.value);
  window.currentQuiz.answers[questionIndex] = answerIndex;
  
  // Re-render to show result
  renderQuizQuestion(questionIndex);
}

/**
 * Navigate to another quiz question
 * @param {number} questionIndex - Index of question to navigate to
 */
function navigateQuiz(questionIndex) {
  if (!window.currentQuiz) return;
  
  if (questionIndex >= 0 && questionIndex < window.currentQuiz.questions.length) {
    window.currentQuiz.currentIndex = questionIndex;
    renderQuizQuestion(questionIndex);
    
    // Scroll to section title to keep it visible
    const quizSection = document.getElementById('quizSection');
    if (quizSection) {
      const sectionTitle = quizSection.querySelector('.section-title');
      const scrollTarget = sectionTitle || quizSection;
      const offset = calculateScrollOffset();
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
 * Calculate dynamic offset for scroll positioning
 * Accounts for sticky header and mobile nav
 * @returns {number} Offset in pixels
 */
function calculateScrollOffset() {
  let offset = 0;
  
  // Check if sticky header is visible
  const stickyHeader = document.getElementById('stickyHeader');
  if (stickyHeader && stickyHeader.classList.contains('visible')) {
    const stickyHeaderRect = stickyHeader.getBoundingClientRect();
    offset += stickyHeaderRect.height;
  }
  
  // Check if mobile nav is visible
  const mobileNav = document.querySelector('.mobile-nav');
  if (mobileNav && window.getComputedStyle(mobileNav).display !== 'none') {
    const mobileNavRect = mobileNav.getBoundingClientRect();
    offset += mobileNavRect.height;
  }
  
  // Add extra padding to ensure section title is fully visible
  // This prevents overlap with topic header
  // If no sticky elements, use minimum offset to account for any fixed elements
  return Math.max(offset + 40, 100); // 40px extra padding, minimum 100px
}

/**
 * Setup smooth scroll for quick navigation links
 */
function setupQuickNavigation() {
  const navLinks = document.querySelectorAll('.quick-navigation a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          // Find the section title within the target section to keep it visible
          const sectionTitle = targetElement.querySelector('.section-title');
          const scrollTarget = sectionTitle || targetElement;
          
          const offset = calculateScrollOffset();
          const elementPosition = scrollTarget.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Smooth scroll for scroll-to-top buttons
  const scrollToTopLinks = document.querySelectorAll('.scroll-to-top');
  scrollToTopLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          // Account for mobile navigation bar height
          const mobileNav = document.querySelector('.mobile-nav');
          const offset = mobileNav && window.getComputedStyle(mobileNav).display !== 'none' ? 80 : 0;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
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
      const prevTopicNumber = prevTopic.order || '';
      prevButton.textContent = prevTopicNumber ? `← ${prevTopicNumber}. ${prevTopic.title}` : `← ${prevTopic.title}`;
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
      const nextTopicNumber = nextTopic.order || '';
      nextButton.textContent = nextTopicNumber ? `${nextTopicNumber}. ${nextTopic.title} →` : `${nextTopic.title} →`;
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
 * Setup sticky header and floating back-to-top button
 * @param {Object} topic - Current topic object
 */
function setupStickyNavigation(topic) {
  const stickyHeader = document.getElementById('stickyHeader');
  const floatingButton = document.getElementById('floatingBackToTop');
  const topicHeader = document.getElementById('topicHeader');
  
  if (!topicHeader) return;

  // Threshold for showing sticky elements (in pixels from top)
  const SCROLL_THRESHOLD = 200;
  
  let ticking = false;
  
  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        const shouldShow = scrollY > SCROLL_THRESHOLD;
        
        // Toggle sticky header
        if (stickyHeader) {
          if (shouldShow) {
            stickyHeader.classList.add('visible');
          } else {
            stickyHeader.classList.remove('visible');
          }
        }
        
        // Toggle floating button
        if (floatingButton) {
          if (shouldShow) {
            floatingButton.classList.add('visible');
          } else {
            floatingButton.classList.remove('visible');
          }
        }
        
        ticking = false;
      });
      
      ticking = true;
    }
  }
  
  // Add smooth scroll behavior to anchor links (using same logic as setupQuickNavigation)
  function scrollToHeader(e) {
    e.preventDefault();
    const mobileNav = document.querySelector('.mobile-nav');
    const offset = mobileNav && window.getComputedStyle(mobileNav).display !== 'none' ? 80 : 0;
    const elementPosition = topicHeader.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
  
  if (floatingButton) {
    floatingButton.addEventListener('click', scrollToHeader);
  }
  
  // Listen to scroll events
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Initial check
  handleScroll();
}

/**
 * Cache for term links (cached per topic)
 */
let termLinksCache = {};

/**
 * Current topic's term links (used by markdownToHtml)
 */
let currentTopicTermLinks = {};

/**
 * Load term links from JSON files
 * @param {string} topicId - Optional topic ID (e.g., 'T02')
 * @returns {Promise<Object>} Object mapping terms to URLs
 */
async function loadTermLinks(topicId = null) {
  // Use cache key based on topicId (null for common terms only)
  const cacheKey = topicId || 'common';
  
  if (termLinksCache[cacheKey]) {
    return termLinksCache[cacheKey];
  }

  let allTerms = {};

  try {
    // First, load common terms
    const commonResponse = await fetch('data/term_links/common_terms.json');
    if (commonResponse.ok) {
      const commonData = await commonResponse.json();
      allTerms = { ...commonData.terms || {} };
      console.log(`Načteno ${Object.keys(allTerms).length} společných termínů`);
    } else {
      console.warn('Nepodařilo se načíst common_terms.json');
    }
  } catch (error) {
    console.warn('Chyba při načítání common_terms.json:', error);
  }

  // Then, load topic-specific terms if topicId is provided
  if (topicId) {
    try {
      const topicResponse = await fetch(`data/term_links/${topicId}_terms.json`);
      if (topicResponse.ok) {
        const topicData = await topicResponse.json();
        // Merge topic terms (they override common terms if there's a conflict)
        allTerms = { ...allTerms, ...(topicData.terms || {}) };
        console.log(`Načteno ${Object.keys(topicData.terms || {}).length} termínů pro ${topicId}`);
      } else {
        console.warn(`Nepodařilo se načíst ${topicId}_terms.json (může být normální, pokud soubor neexistuje)`);
      }
    } catch (error) {
      console.warn(`Chyba při načítání ${topicId}_terms.json:`, error);
    }
  }
  
  // Sort terms by length (longer first) to avoid partial matches
  const sortedEntries = Object.entries(allTerms).sort((a, b) => b[0].length - a[0].length);
  const sortedTerms = Object.fromEntries(sortedEntries);
  
  // Cache the result
  termLinksCache[cacheKey] = sortedTerms;
  
  // Set as current topic terms (for use by markdownToHtml which doesn't have topicId parameter)
  // This allows markdownToHtml to access the terms without needing topicId
  currentTopicTermLinks = sortedTerms;
  
  return sortedTerms;
}

/**
 * Add links to terms in already-escaped HTML text
 * This function does NOT modify the original text, only the HTML output
 * @param {string} html - HTML-escaped text to process
 * @param {Object} termLinks - Object mapping terms to URLs
 * @returns {string} HTML with links added
 */
function addTermLinksToHtml(html, termLinks) {
  if (!html || !termLinks || Object.keys(termLinks).length === 0) {
    return html;
  }

  let result = html;
  const processedRanges = []; // Track processed positions to avoid overlaps
  
  // Process each term (already sorted by length, longer first)
  // Processing longer terms first prevents shorter terms from matching inside longer ones
  for (const [term, url] of Object.entries(termLinks)) {
    // Skip if term is empty
    if (!term || term.trim() === '') continue;
    
    // Escape the term for HTML (same way as escapeHtml does)
    const div = document.createElement('div');
    div.textContent = term;
    const escapedTerm = div.innerHTML;
    
    // Escape special regex characters in escaped term
    const regexEscapedTerm = escapedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Split HTML by existing <a> tags to avoid processing inside links
    const parts = result.split(/(<a\s+[^>]*>.*?<\/a>)/gi);
    
    const processedParts = parts.map((part) => {
      // Skip parts that are already links
      if (part.match(/^<a\s+/i)) {
        return part;
      }
      
      // Process this part for the current term
      // For single-word terms, use word boundaries; for multi-word terms, match the phrase
      const hasSpaces = term.includes(' ');
      const regexPattern = hasSpaces ? regexEscapedTerm : `\\b${regexEscapedTerm}\\b`;
      const regex = new RegExp(regexPattern, 'gi');
      
      return part.replace(regex, (match) => {
        // Check if we're inside an HTML tag (avoid matching inside tags)
        const matchIndex = part.indexOf(match);
        const beforeMatch = part.substring(0, matchIndex);
        const lastTagOpen = beforeMatch.lastIndexOf('<');
        const lastTagClose = beforeMatch.lastIndexOf('>');
        
        // If we're inside a tag (last < is after last >), skip
        if (lastTagOpen > lastTagClose) {
          return match;
        }
        
        // Create the link - use the original match (which is the escaped term)
        return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="term-link">${match}</a>`;
      });
    });
    
    result = processedParts.join('');
  }
  
  return result;
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
 * Simple Markdown to HTML converter with term linking
 * Uses cached term links if available
 * @param {string} markdown - Markdown text
 * @returns {string} HTML
 */
function markdownToHtml(markdown) {
  if (!markdown) return '';
  
  // Keep original text unchanged - only process it for HTML output
  const text = markdown;
  
  // Escape HTML first (this preserves the original text structure)
  let html = escapeHtml(text);
  
  // Convert **bold** to <strong>
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Convert *italic* to <em>
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Convert line breaks to <br> (only for double line breaks, or preserve single)
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');
  
  // Add term links to HTML (this does NOT modify the original text)
  // Use currentTopicTermLinks which is set when loading terms for a topic
  if (currentTopicTermLinks && Object.keys(currentTopicTermLinks).length > 0) {
    html = addTermLinksToHtml(html, currentTopicTermLinks);
  }
  
  return html;
}

