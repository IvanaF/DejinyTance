/**
 * Topic Loader
 * Handles loading topic data from JSON files
 */

class TopicLoader {
  constructor() {
    this.topics = [];
    this.currentTopicId = null;
  }

  /**
   * Load all topics from the data/topics directory
   * @returns {Promise<Array>} Array of topic objects
   */
  async loadAllTopics() {
    // For Phase A, we'll use a hardcoded list of available topics
    // In Phase B/C, this could scan the directory or use a manifest
    const topicIds = ['T01', 'T02']; // Placeholder for now
    
    try {
      // Load topics individually so one failure doesn't break everything
      const topicPromises = topicIds.map(async (id) => {
        try {
          return await this.loadTopic(id);
        } catch (error) {
          console.error(`Chyba při načítání otázky ${id}:`, error);
          return null; // Return null for failed topics
        }
      });
      
      const loadedTopics = await Promise.all(topicPromises);
      
      // Filter out null values (failed loads)
      this.topics = loadedTopics.filter(topic => topic !== null);
      
      // Sort by order field
      this.topics.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      if (this.topics.length === 0) {
        console.error('Nepodařilo se načíst žádné otázky. Zkontrolujte, zda existují soubory v data/topics/');
      }
      
      return this.topics;
    } catch (error) {
      console.error('Chyba při načítání otázek:', error);
      return [];
    }
  }

  /**
   * Load a single topic by ID
   * @param {string} topicId - The topic ID (e.g., 'T01')
   * @returns {Promise<Object>} Topic object
   */
  async loadTopic(topicId) {
    const url = `data/topics/${topicId}.json`;
    console.log(`Načítání otázky ${topicId} z ${url}...`);
    try {
      const response = await fetch(url);
      console.log(`Odpověď pro ${topicId}:`, response.status, response.statusText);
      if (!response.ok) {
        throw new Error(`Nepodařilo se načíst otázku ${topicId}: ${response.status} ${response.statusText}`);
      }
      const topic = await response.json();
      console.log(`Otázka ${topicId} úspěšně načtena:`, topic.title);
      
      // Validate topic structure
      if (!topic.id || !topic.title) {
        throw new Error(`Otázka ${topicId} má neplatnou strukturu: chybí id nebo title`);
      }
      
      return topic;
    } catch (error) {
      console.error(`Chyba při načítání otázky ${topicId}:`, error);
      throw error;
    }
  }

  /**
   * Get topic by ID
   * @param {string} topicId - The topic ID
   * @returns {Object|null} Topic object or null
   */
  getTopic(topicId) {
    return this.topics.find(t => t.id === topicId) || null;
  }

  /**
   * Get next topic in sequence
   * @param {string} topicId - Current topic ID
   * @returns {Object|null} Next topic or null
   */
  getNextTopic(topicId) {
    const currentIndex = this.topics.findIndex(t => t.id === topicId);
    if (currentIndex === -1 || currentIndex === this.topics.length - 1) {
      return null;
    }
    return this.topics[currentIndex + 1];
  }

  /**
   * Get previous topic in sequence
   * @param {string} topicId - Current topic ID
   * @returns {Object|null} Previous topic or null
   */
  getPreviousTopic(topicId) {
    const currentIndex = this.topics.findIndex(t => t.id === topicId);
    if (currentIndex <= 0) {
      return null;
    }
    return this.topics[currentIndex - 1];
  }

  /**
   * Get topic URL
   * @param {string} topicId - The topic ID
   * @returns {string} URL to topic page
   */
  getTopicUrl(topicId) {
    return `topic.html?id=${topicId}`;
  }
}

// Export singleton instance
const topicLoader = new TopicLoader();

