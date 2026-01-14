/**
 * Feedback System - Local Storage with Optional GitHub Integration
 * 
 * This module handles user feedback submission by storing it locally
 * and optionally opening a pre-filled GitHub "New Issue" URL.
 */

/**
 * Configuration for GitHub repository
 * This repository: https://github.com/IvanaF/DejinyTance
 */
const GITHUB_CONFIG = {
  // Your GitHub username or organization
  owner: 'IvanaF',
  // Repository name (must match the actual GitHub repository)
  repo: 'DejinyTance',
  // Labels to add to the issue (optional)
  // Make sure these labels exist in your repository: Settings → Issues → Labels
  labels: ['feedback', 'user-submitted'],
  // Issue template to use (optional, must exist in .github/ISSUE_TEMPLATE/)
  template: 'feedback.md'
};

// Feedback storage configuration
const FEEDBACK_CONFIG = {
  // ============================================
  // VÝBĚR ZPŮSOBU ODESLÁNÍ
  // ============================================
  // Vyberte jeden nebo oba způsoby:
  // - 'github' = automaticky vytvoří GitHub Issue (doporučeno)
  // - 'email' = odešle email přes Web3Forms
  // - 'both' = obojí (GitHub Issue + email)
  method: 'github', // 'github', 'email', nebo 'both'
  githubToken: 'YOUR_GITHUB_TOKEN_HERE', // ← VLOŽTE VÁŠ TOKEN (github_pat_* nebo ghp_*)
  
  // ============================================
  // NASTAVENÍ EMAILU (pro method: 'email' nebo 'both')
  // ============================================
  // Krok 1: Získejte bezplatný Access Key na https://web3forms.com
  //   - Jděte na https://web3forms.com
  //   - Zadejte svůj email
  //   - Zkopírujte Access Key, který dostanete
  //
  // Krok 2: Nastavte níže své údaje:
  recipientEmail: 'your-email@example.com', // ← ZMĚŇTE NA SVŮJ EMAIL
  web3formsAccessKey: 'YOUR_ACCESS_KEY_HERE', // ← ZÍSKEJTE NA https://web3forms.com
  
  // ============================================
  // VOLITELNÉ NASTAVENÍ
  // ============================================
  useLocalStorage: true,  // Ukládat také lokálně jako zálohu
  copyToClipboard: false  // Zkopírovat do schránky (false = nepoužívá se)
};

/**
 * Initialize feedback system
 */
function initFeedback() {
  const feedbackButton = document.getElementById('feedbackButton');
  const feedbackModal = document.getElementById('feedbackModal');
  const feedbackOverlay = document.getElementById('feedbackOverlay');
  const feedbackForm = document.getElementById('feedbackForm');
  const closeButton = document.getElementById('feedbackClose');
  const cancelButton = document.getElementById('feedbackCancel');

  if (!feedbackButton || !feedbackModal || !feedbackForm) {
    console.warn('Feedback elements not found in DOM');
    return;
  }

  // Open modal
  feedbackButton.addEventListener('click', (e) => {
    e.preventDefault();
    openFeedbackModal();
  });

  // Close modal handlers
  if (closeButton) {
    closeButton.addEventListener('click', closeFeedbackModal);
  }

  if (cancelButton) {
    cancelButton.addEventListener('click', closeFeedbackModal);
  }

  if (feedbackOverlay) {
    feedbackOverlay.addEventListener('click', closeFeedbackModal);
  }

  // Handle form submission
  feedbackForm.addEventListener('submit', handleFeedbackSubmit);

  // Handle file input changes
  const fileInput = document.getElementById('feedbackAttachment');
  if (fileInput) {
    fileInput.addEventListener('change', handleFileSelection);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && feedbackModal.classList.contains('open')) {
      closeFeedbackModal();
    }
  });
}

/**
 * Open feedback modal
 */
function openFeedbackModal() {
  const feedbackModal = document.getElementById('feedbackModal');
  const feedbackOverlay = document.getElementById('feedbackOverlay');
  
  if (feedbackModal) {
    feedbackModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  
  if (feedbackOverlay) {
    feedbackOverlay.classList.add('visible');
  }

  // Focus on first input
  const firstInput = document.querySelector('#feedbackForm input, #feedbackForm textarea');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 100);
  }
}

/**
 * Close feedback modal
 */
function closeFeedbackModal() {
  const feedbackModal = document.getElementById('feedbackModal');
  const feedbackOverlay = document.getElementById('feedbackOverlay');
  const feedbackForm = document.getElementById('feedbackForm');
  
  if (feedbackModal) {
    feedbackModal.classList.remove('open');
  }
  
  if (feedbackOverlay) {
    feedbackOverlay.classList.remove('visible');
  }
  
  document.body.style.overflow = '';
  
  // Reset form
  if (feedbackForm) {
    feedbackForm.reset();
    // Clear file preview
    clearFilePreview();
  }
}

// Store selected files for preview
let selectedFiles = [];

/**
 * Handle file input selection
 * @param {Event} e - File input change event
 */
function handleFileSelection(e) {
  const files = Array.from(e.target.files || []);
  
  // Validate file sizes (max 5MB per file)
  const maxSize = 5 * 1024 * 1024; // 5MB
  const validFiles = [];
  const invalidFiles = [];
  
  files.forEach(file => {
    if (file.size > maxSize) {
      invalidFiles.push({ name: file.name, reason: 'Příliš velký soubor (max 5MB)' });
    } else {
      validFiles.push(file);
    }
  });
  
  // Show error for invalid files
  if (invalidFiles.length > 0) {
    const errorMsg = invalidFiles.map(f => `${f.name}: ${f.reason}`).join('\n');
    alert(`Některé soubory nelze přidat:\n${errorMsg}`);
  }
  
  selectedFiles = validFiles;
  updateFilePreview();
}

/**
 * Update file preview display
 */
function updateFilePreview() {
  const previewContainer = document.getElementById('feedbackFilePreview');
  if (!previewContainer) return;
  
  // Clear existing preview
  previewContainer.innerHTML = '';
  
  if (selectedFiles.length === 0) {
    previewContainer.classList.add('feedback-file-preview-empty');
    return;
  }
  
  previewContainer.classList.remove('feedback-file-preview-empty');
  
  selectedFiles.forEach((file, index) => {
    const previewItem = document.createElement('div');
    previewItem.className = 'feedback-file-preview-item';
    
    // Create preview content
    let previewContent = '';
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = previewItem.querySelector('img');
        if (img) img.src = e.target.result;
      };
      reader.readAsDataURL(file);
      previewContent = '<img src="" alt="Preview" style="display: none;">';
    }
    
    previewItem.innerHTML = `
      ${previewContent}
      <div class="feedback-file-preview-item-info">
        <div class="feedback-file-preview-item-name">${escapeHtml(file.name)}</div>
        <div class="feedback-file-preview-item-size">${formatFileSize(file.size)}</div>
      </div>
      <button type="button" class="feedback-file-preview-item-remove" data-index="${index}" aria-label="Odstranit">×</button>
    `;
    
    // Show image preview if it's an image
    if (file.type.startsWith('image/')) {
      const img = previewItem.querySelector('img');
      if (img) {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
          img.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    }
    
    // Add remove button handler
    const removeButton = previewItem.querySelector('.feedback-file-preview-item-remove');
    removeButton.addEventListener('click', () => removeFile(index));
    
    previewContainer.appendChild(previewItem);
  });
}

/**
 * Remove file from selection
 * @param {number} index - Index of file to remove
 */
function removeFile(index) {
  selectedFiles.splice(index, 1);
  updateFilePreview();
  
  // Update file input
  const fileInput = document.getElementById('feedbackAttachment');
  if (fileInput) {
    // Create new FileList (we can't modify existing one, so we'll reset and re-add)
    const dt = new DataTransfer();
    selectedFiles.forEach(file => dt.items.add(file));
    fileInput.files = dt.files;
  }
}

/**
 * Clear file preview
 */
function clearFilePreview() {
  selectedFiles = [];
  const previewContainer = document.getElementById('feedbackFilePreview');
  if (previewContainer) {
    previewContainer.innerHTML = '';
    previewContainer.classList.add('feedback-file-preview-empty');
  }
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Convert file to base64 data URL
 * @param {File} file - File to convert
 * @returns {Promise<string>} Base64 data URL
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Convert files to base64 (only images)
 * @param {File[]} files - Files to convert
 * @returns {Promise<Array>} Array of {name, base64, type} objects
 */
async function convertFilesToBase64(files) {
  const imageFiles = files.filter(file => file.type.startsWith('image/'));
  const results = [];
  
  for (const file of imageFiles) {
    try {
      const base64 = await fileToBase64(file);
      results.push({
        name: file.name,
        base64: base64,
        type: file.type
      });
    } catch (error) {
      console.error('Error converting file to base64:', error);
    }
  }
  
  return results;
}

/**
 * Handle feedback form submission
 * @param {Event} e - Form submit event
 */
async function handleFeedbackSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  
  const feedbackType = formData.get('feedbackType') || 'general';
  const title = formData.get('title') || 'User Feedback';
  const description = formData.get('description') || '';
  const pageUrl = formData.get('pageUrl') || window.location.href;
  const userAgent = formData.get('userAgent') || navigator.userAgent;
  
  // Get attached files
  const attachedFiles = selectedFiles.length > 0 ? await convertFilesToBase64(selectedFiles) : [];
  
  // Save current scroll position to restore after closing modal
  const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  
  // Extract page context
  const pageContext = getPageContext();
  
  // Build issue body
  const issueBody = buildIssueBody({
    type: feedbackType,
    title: title,
    description: description,
    pageUrl: pageUrl,
    pageContext: pageContext,
    userAgent: userAgent,
    timestamp: new Date().toISOString(),
    attachments: attachedFiles
  });
  
  // Store feedback data (no personal information)
  const feedbackData = {
    type: feedbackType,
    title: title,
    description: description,
    pageUrl: pageUrl,
    pageContext: pageContext,
    userAgent: userAgent,
    timestamp: new Date().toISOString(),
    issueBody: issueBody,
    attachmentCount: attachedFiles.length
  };
  
  // Send feedback based on configured method
  try {
    let successMessage = 'Zpětná vazba byla úspěšně odeslána!';
    let hasError = false;
    let errorMessage = '';
    
    // Determine which methods to use
    const useGitHub = FEEDBACK_CONFIG.method === 'github' || FEEDBACK_CONFIG.method === 'both';
    const useEmail = FEEDBACK_CONFIG.method === 'email' || FEEDBACK_CONFIG.method === 'both';
    
    // Send via GitHub API if enabled
    if (useGitHub) {
      try {
        const issueUrl = await createGitHubIssue(title, issueBody, feedbackType);
        // Extract issue number from URL (e.g., https://github.com/owner/repo/issues/123 -> 123)
        const issueNumber = issueUrl.match(/\/issues\/(\d+)/)?.[1] || 'nová';
        successMessage = `Zpětná vazba byla úspěšně odeslána! GitHub Issue #${issueNumber} byla vytvořena.`;
        console.log('GitHub Issue created:', issueUrl);
      } catch (githubError) {
        console.error('Failed to create GitHub Issue:', githubError);
        hasError = true;
        errorMessage = githubError.message || 'Nepodařilo se vytvořit GitHub Issue.';
        
        // If GitHub fails and email is not enabled, show error
        if (!useEmail) {
          throw githubError;
        }
      }
    }
    
    // Send via email if enabled
    if (useEmail) {
      try {
        await sendFeedbackEmail(feedbackData, issueBody);
        if (useGitHub) {
          successMessage += ' Email byl také odeslán.';
        } else {
          successMessage = 'Zpětná vazba byla úspěšně odeslána!';
        }
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // If email fails but GitHub succeeded, just log it
        if (!useGitHub || hasError) {
          throw emailError;
        }
      }
    }
    
    // Store in localStorage as backup if enabled
    if (FEEDBACK_CONFIG.useLocalStorage) {
      storeFeedbackLocally(feedbackData);
    }
    
    // Copy to clipboard if enabled
    if (FEEDBACK_CONFIG.copyToClipboard) {
      copyFeedbackToClipboard(feedbackData, issueBody);
    }
    
    // Show success message
    if (!hasError || (useGitHub && useEmail)) {
      showFeedbackSuccess(successMessage);
    } else {
      showFeedbackError(errorMessage);
    }
    
    // Close modal after a short delay
    setTimeout(() => {
      closeFeedbackModal();
      // Restore scroll position after modal closes
      window.scrollTo(0, scrollPosition);
    }, 1500);
    
  } catch (error) {
    console.error('Failed to send feedback:', error);
    // Show error message
    showFeedbackError(error.message || 'Nepodařilo se odeslat zpětnou vazbu. Zkuste to prosím znovu.');
    
    // Still store locally as backup
    if (FEEDBACK_CONFIG.useLocalStorage) {
      storeFeedbackLocally(feedbackData);
    }
  }
}

/**
 * Get page context information
 * @returns {Object} Page context data
 */
function getPageContext() {
  const context = {
    pageType: window.location.pathname.includes('topic.html') ? 'topic' : 'index',
    topicId: null,
    topicTitle: null
  };
  
  // If on topic page, extract topic ID and title
  if (context.pageType === 'topic') {
    const urlParams = new URLSearchParams(window.location.search);
    context.topicId = urlParams.get('id');
    
    // Try to get topic title from page
    const topicTitleElement = document.getElementById('topicTitle');
    if (topicTitleElement) {
      // Remove topic number if present (e.g., "1. Title" -> "Title")
      const titleText = topicTitleElement.textContent || topicTitleElement.innerText;
      context.topicTitle = titleText.replace(/^\d+\.\s*/, '').trim();
    }
  }
  
  return context;
}

/**
 * Build GitHub issue body with formatted content
 * @param {Object} data - Feedback data
 * @returns {string} Formatted issue body
 */
function buildIssueBody(data) {
  const typeLabels = {
    'bug': '🐛 Bug Report',
    'feature': '✨ Feature Request',
    'content': '📝 Content Issue',
    'ui': '🎨 UI/UX Feedback',
    'general': '💬 General Feedback'
  };
  
  const typeLabel = typeLabels[data.type] || '💬 Feedback';
  
  let body = `## ${typeLabel}

### Description
${escapeMarkdown(data.description)}

### Page Information
- **Page URL**: ${data.pageUrl}
- **Page Type**: ${data.pageContext.pageType === 'topic' ? 'Topic Detail' : 'Index/Overview'}`;
  
  // Add topic information if available
  if (data.pageContext.topicId) {
    body += `\n- **Topic ID**: ${data.pageContext.topicId}`;
    if (data.pageContext.topicTitle) {
      body += `\n- **Topic Title**: ${data.pageContext.topicTitle}`;
    }
  }
  
  body += `\n\n### Technical Details
- **Submitted**: ${new Date(data.timestamp).toLocaleString('cs-CZ')}
- **User Agent**: ${data.userAgent}`;
  
  // Add attachments section if images are present
  if (data.attachments && data.attachments.length > 0) {
    body += `\n\n### Attachments (${data.attachments.length} ${data.attachments.length === 1 ? 'file' : 'files'})`;
    data.attachments.forEach((attachment, index) => {
      // GitHub supports base64 data URLs in markdown
      body += `\n\n#### ${escapeMarkdown(attachment.name)}`;
      body += `\n![${escapeMarkdown(attachment.name)}](${attachment.base64})`;
    });
  }
  
  body += `\n\n---
*This feedback was submitted through the web application feedback form.*`;
  
  return body;
}

/**
 * Build GitHub "New Issue" URL with pre-filled content
 * @param {Object} params - URL parameters
 * @returns {string} GitHub issue URL
 */
function buildGitHubIssueUrl(params) {
  const baseUrl = `https://github.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/issues/new`;
  const urlParams = new URLSearchParams();
  
  // Add title
  if (params.title) {
    urlParams.append('title', params.title);
  }
  
  // Add body
  if (params.body) {
    urlParams.append('body', params.body);
  }
  
  // Add labels
  if (params.labels && params.labels.length > 0) {
    urlParams.append('labels', params.labels.join(','));
  }
  
  // Add template (if specified)
  if (params.template) {
    urlParams.append('template', params.template);
  }
  
  const queryString = urlParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Create GitHub Issue via API
 * @param {string} title - Issue title
 * @param {string} body - Issue body
 * @param {string} feedbackType - Type of feedback
 * @returns {Promise<string>} URL of created issue
 */
async function createGitHubIssue(title, body, feedbackType) {
  if (!FEEDBACK_CONFIG.githubToken || FEEDBACK_CONFIG.githubToken === 'YOUR_GITHUB_TOKEN_HERE') {
    throw new Error('GitHub Token není nastaven. Nastavte githubToken v scripts/feedback.js');
  }
  
  // Map feedback type to GitHub labels
  const typeToLabel = {
    'bug': 'bug',
    'feature': 'enhancement',
    'content': 'documentation',
    'ui': 'enhancement',
    'general': 'question'
  };
  
  // Prepare labels
  const labels = [...GITHUB_CONFIG.labels];
  if (typeToLabel[feedbackType]) {
    labels.push(typeToLabel[feedbackType]);
  }
  
  // Create issue via GitHub API
  // Support both classic tokens (ghp_*) and fine-grained tokens (github_pat_*)
  // Fine-grained tokens work with both "token" and "Bearer" authentication
  const authHeader = FEEDBACK_CONFIG.githubToken.startsWith('github_pat_') 
    ? `Bearer ${FEEDBACK_CONFIG.githubToken}` 
    : `token ${FEEDBACK_CONFIG.githubToken}`;
  
  const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/issues`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: title,
      body: body,
      labels: labels
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errorMessage = errorData.message || `GitHub API error: ${response.status} ${response.statusText}`;
    
    // Provide helpful error messages for common issues
    if (response.status === 404) {
      errorMessage = `Repozitář nebyl nalezen. Zkontrolujte:
1. Repozitář existuje: https://github.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}
2. Token má přístup k tomuto repozitáři
3. Název repozitáře je správný: "${GITHUB_CONFIG.repo}"
4. Owner je správný: "${GITHUB_CONFIG.owner}"`;
    } else if (response.status === 401) {
      errorMessage = `Neautorizováno. Token je neplatný nebo expiroval. Zkontrolujte token na https://github.com/settings/tokens`;
    } else if (response.status === 403) {
      errorMessage = `Přístup zamítnut. Token nemá oprávnění k vytváření issues. Zkontrolujte, že token má "Issues: Read and write" oprávnění.`;
    }
    
    throw new Error(errorMessage);
  }
  
  const issueData = await response.json();
  return issueData.html_url; // Return URL of created issue
}

/**
 * Send feedback via email using Web3Forms
 * @param {Object} feedbackData - Feedback data
 * @param {string} issueBody - Formatted issue body
 */
async function sendFeedbackEmail(feedbackData, issueBody) {
  if (!FEEDBACK_CONFIG.recipientEmail || FEEDBACK_CONFIG.recipientEmail === 'your-email@example.com') {
    throw new Error('Email adresa není nastavena. Nastavte recipientEmail v scripts/feedback.js');
  }
  
  if (!FEEDBACK_CONFIG.web3formsAccessKey || FEEDBACK_CONFIG.web3formsAccessKey === 'YOUR_ACCESS_KEY_HERE') {
    throw new Error('Web3Forms Access Key není nastaven. Získejte ho zdarma na https://web3forms.com a nastavte web3formsAccessKey v scripts/feedback.js');
  }
  
  // Prepare email content
  // Note: issueBody already includes attachments as embedded base64 images for GitHub
  // For email, these images are included in the body (may make emails large)
  const emailSubject = `Zpětná vazba: ${feedbackData.title}`;
  const emailBody = `
Typ zpětné vazby: ${feedbackData.type}
Uživatel: Anonymní

${issueBody}

---
Stránka: ${feedbackData.pageUrl}
Datum: ${new Date(feedbackData.timestamp).toLocaleString('cs-CZ')}
  `.trim();
  
  // Send via Web3Forms API
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      access_key: FEEDBACK_CONFIG.web3formsAccessKey,
      subject: emailSubject,
      from_name: 'Anonymní uživatel',
      from_email: FEEDBACK_CONFIG.recipientEmail,
      to_email: FEEDBACK_CONFIG.recipientEmail,
      message: emailBody,
      replyto: FEEDBACK_CONFIG.recipientEmail
    })
  });
  
  const result = await response.json();
  
  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Nepodařilo se odeslat email');
  }
  
  return result;
}

/**
 * Store feedback in localStorage
 * @param {Object} feedbackData - Feedback data to store
 */
function storeFeedbackLocally(feedbackData) {
  try {
    const storageKey = 'userFeedback';
    let feedbacks = JSON.parse(localStorage.getItem(storageKey) || '[]');
    feedbacks.push(feedbackData);
    // Keep only last 100 feedback entries to avoid storage issues
    if (feedbacks.length > 100) {
      feedbacks = feedbacks.slice(-100);
    }
    localStorage.setItem(storageKey, JSON.stringify(feedbacks));
    console.log('Feedback stored locally', feedbackData);
  } catch (error) {
    console.error('Failed to store feedback locally:', error);
  }
}

/**
 * Copy feedback to clipboard
 * @param {Object} feedbackData - Feedback data
 * @param {string} issueBody - Formatted issue body
 */
async function copyFeedbackToClipboard(feedbackData, issueBody) {
  try {
    const textToCopy = `${feedbackData.title}\n\n${issueBody}`;
    await navigator.clipboard.writeText(textToCopy);
    console.log('Feedback copied to clipboard');
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = `${feedbackData.title}\n\n${issueBody}`;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    } catch (fallbackError) {
      console.error('Clipboard fallback also failed:', fallbackError);
    }
  }
}

/**
 * Show success message
 * @param {string} message - Custom success message (optional)
 */
function showFeedbackSuccess(message) {
  const successMessage = document.getElementById('feedbackSuccess');
  if (successMessage) {
    const messageSpan = successMessage.querySelector('span');
    if (messageSpan) {
      messageSpan.textContent = message || 'Zpětná vazba byla úspěšně odeslána! Děkujeme.';
    }
    
    // Remove error class if present
    successMessage.classList.remove('error');
    successMessage.classList.add('show');
    setTimeout(() => {
      successMessage.classList.remove('show');
    }, 5000);
  }
}

/**
 * Show error message
 * @param {string} errorMessage - Error message to display
 */
function showFeedbackError(errorMessage) {
  const successMessage = document.getElementById('feedbackSuccess');
  if (successMessage) {
    const messageSpan = successMessage.querySelector('span');
    if (messageSpan) {
      messageSpan.textContent = errorMessage;
    }
    
    // Change style to error
    successMessage.classList.add('error');
    successMessage.classList.add('show');
    
    setTimeout(() => {
      successMessage.classList.remove('show');
      successMessage.classList.remove('error');
    }, 5000);
  }
}

/**
 * Escape markdown special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\n/g, '\n')
    .replace(/\*/g, '\\*')
    .replace(/#/g, '\\#')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

/**
 * Auto-fill page URL and user agent in form
 */
function autoFillPageUrl() {
  const pageUrlInput = document.getElementById('feedbackPageUrl');
  if (pageUrlInput) {
    pageUrlInput.value = window.location.href;
  }
  
  const userAgentInput = document.querySelector('input[name="userAgent"]');
  if (userAgentInput) {
    userAgentInput.value = navigator.userAgent;
  }
}

/**
 * Export all stored feedback as JSON (useful for viewing collected feedback)
 * Call this from browser console: exportFeedback()
 * @returns {Array} Array of all stored feedback
 */
function exportFeedback() {
  try {
    const storageKey = 'userFeedback';
    const feedbacks = JSON.parse(localStorage.getItem(storageKey) || '[]');
    console.log('Exported feedback:', feedbacks);
    console.log('Copy this JSON to use it elsewhere');
    return feedbacks;
  } catch (error) {
    console.error('Failed to export feedback:', error);
    return [];
  }
}

/**
 * Clear all stored feedback
 * Call this from browser console: clearFeedback()
 */
function clearFeedback() {
  try {
    const storageKey = 'userFeedback';
    localStorage.removeItem(storageKey);
    console.log('All feedback cleared');
  } catch (error) {
    console.error('Failed to clear feedback:', error);
  }
}

/**
 * Test GitHub repository access (for debugging)
 * Call this from browser console: testGitHubAccess()
 * @returns {Promise<Object>} Test results
 */
async function testGitHubAccess() {
  console.log('Testing GitHub repository access...');
  console.log(`Repository: ${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}`);
  console.log(`Token: ${FEEDBACK_CONFIG.githubToken.substring(0, 20)}...`);
  
  try {
    const authHeader = FEEDBACK_CONFIG.githubToken.startsWith('github_pat_') 
      ? `Bearer ${FEEDBACK_CONFIG.githubToken}` 
      : `token ${FEEDBACK_CONFIG.githubToken}`;
    
    // Test 1: Check if repository exists
    console.log('\n1. Testing repository access...');
    const repoResponse = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}`, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (repoResponse.ok) {
      const repoData = await repoResponse.json();
      console.log('✅ Repository found:', repoData.full_name);
      console.log('   - Private:', repoData.private);
      console.log('   - URL:', repoData.html_url);
    } else {
      const errorData = await repoResponse.json().catch(() => ({}));
      console.error('❌ Repository not found or no access');
      console.error('   Status:', repoResponse.status);
      console.error('   Error:', errorData.message || repoResponse.statusText);
      console.error(`   Check: https://github.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}`);
      return { success: false, error: 'Repository not found' };
    }
    
    // Test 2: Check token permissions
    console.log('\n2. Testing token permissions...');
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ Token is valid');
      console.log('   - User:', userData.login);
    } else {
      console.error('❌ Token is invalid or expired');
      return { success: false, error: 'Invalid token' };
    }
    
    // Test 3: Check if issues are enabled
    console.log('\n3. Testing issues access...');
    const issuesResponse = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/issues?state=all&per_page=1`, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (issuesResponse.ok) {
      console.log('✅ Issues API is accessible');
    } else {
      console.error('❌ Cannot access issues');
      console.error('   Status:', issuesResponse.status);
      const errorData = await issuesResponse.json().catch(() => ({}));
      console.error('   Error:', errorData.message || issuesResponse.statusText);
      return { success: false, error: 'Cannot access issues' };
    }
    
    console.log('\n✅ All tests passed! Repository is ready for feedback.');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Make functions available globally for console access
window.exportFeedback = exportFeedback;
window.clearFeedback = clearFeedback;
window.testGitHubAccess = testGitHubAccess;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initFeedback();
    autoFillPageUrl();
  });
} else {
  initFeedback();
  autoFillPageUrl();
}

