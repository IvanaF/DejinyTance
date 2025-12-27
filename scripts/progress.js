/**
 * Progress Tracker
 * Handles topic completion tracking
 * Architecture allows replacement with synced storage later
 */

class ProgressTracker {
  constructor() {
    this.storage = new LocalStorageProgress();
    // Future: Could swap to SyncedStorageProgress() for backend sync
  }

  /**
   * Check if a topic is completed
   * @param {string} topicId - The topic ID
   * @returns {boolean} True if completed
   */
  isCompleted(topicId) {
    return this.storage.isCompleted(topicId);
  }

  /**
   * Mark a topic as completed
   * @param {string} topicId - The topic ID
   * @param {boolean} completed - Completion status
   */
  setCompleted(topicId, completed) {
    this.storage.setCompleted(topicId, completed);
  }

  /**
   * Get all completed topic IDs
   * @returns {Array<string>} Array of completed topic IDs
   */
  getCompletedTopics() {
    return this.storage.getCompletedTopics();
  }

  /**
   * Get completion count
   * @param {number} totalTopics - Total number of topics
   * @returns {number} Number of completed topics
   */
  getCompletionCount(totalTopics) {
    return this.storage.getCompletedTopics().length;
  }
}

/**
 * LocalStorage implementation (MVP)
 * Can be replaced with API-backed storage later
 */
class LocalStorageProgress {
  constructor() {
    this.storageKey = 'danceHistoryProgress';
    this.init();
  }

  init() {
    if (!this.getStorage()) {
      this.setStorage({});
    }
  }

  getStorage() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading progress from localStorage:', error);
      return null;
    }
  }

  setStorage(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error writing progress to localStorage:', error);
    }
  }

  isCompleted(topicId) {
    const storage = this.getStorage();
    return storage && storage[topicId] === true;
  }

  setCompleted(topicId, completed) {
    const storage = this.getStorage() || {};
    storage[topicId] = completed;
    this.setStorage(storage);
    
    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('progressUpdated', {
      detail: { topicId, completed }
    }));
  }

  getCompletedTopics() {
    const storage = this.getStorage() || {};
    return Object.keys(storage).filter(id => storage[id] === true);
  }
}

// Export singleton instance
const progressTracker = new ProgressTracker();

