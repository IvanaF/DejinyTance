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
    const topicIds = ['T01', 'T02', 'T12']; // List of available topics
    
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
      
      // Load materials from external file if materialsSource is specified
      if (topic.materialsSource) {
        try {
          const materialsUrl = topic.materialsSource;
          console.log(`Načítání materiálů z ${materialsUrl}...`);
          const materialsResponse = await fetch(materialsUrl);
          if (materialsResponse.ok) {
            const materialsData = await materialsResponse.json();
            // Merge materials sections into topic.materials
            if (materialsData.sections) {
              if (!topic.materials) {
                topic.materials = {};
              }
              topic.materials.sections = materialsData.sections;
              // Preserve summary if it exists in topic, otherwise use empty string
              if (!topic.materials.summary) {
                topic.materials.summary = '';
              }
              console.log(`Materiály načteny: ${materialsData.sections.length} sekcí`);
            }
          } else {
            console.warn(`Nepodařilo se načíst materiály z ${materialsUrl}: ${materialsResponse.status}`);
          }
        } catch (materialsError) {
          console.warn(`Chyba při načítání materiálů pro ${topicId}:`, materialsError);
          // Continue without external materials - topic will use inline materials if available
        }
      }
      
      // Load summary from external file if summarySource is specified
      if (topic.summarySource) {
        try {
          const summaryUrl = topic.summarySource;
          console.log(`Načítání osnovy z ${summaryUrl}...`);
          const summaryResponse = await fetch(summaryUrl);
          if (summaryResponse.ok) {
            const summaryText = await summaryResponse.text();
            topic.summary = summaryText.trim();
            console.log(`Shrnutí načteno (${summaryText.length} znaků)`);
          } else {
            console.warn(`Nepodařilo se načíst osnovu z ${summaryUrl}: ${summaryResponse.status}`);
          }
        } catch (summaryError) {
          console.warn(`Chyba při načítání osnovy pro ${topicId}:`, summaryError);
          // Continue without external summary - topic will use inline summary if available
        }
      }
      
      // Load quiz from external file if quizSource is specified
      if (topic.quizSource) {
        try {
          const quizUrl = topic.quizSource;
          console.log(`Načítání kvízu z ${quizUrl}...`);
          const quizResponse = await fetch(quizUrl);
          if (quizResponse.ok) {
            const quizData = await quizResponse.json();
            // Merge quiz questions into topic.quiz
            if (quizData.questions) {
              topic.quiz = {
                questions: quizData.questions
              };
              console.log(`Kvíz načten: ${quizData.questions.length} otázek`);
            }
          } else {
            console.warn(`Nepodařilo se načíst kvíz z ${quizUrl}: ${quizResponse.status}`);
          }
        } catch (quizError) {
          console.warn(`Chyba při načítání kvízu pro ${topicId}:`, quizError);
          // Continue without external quiz - topic will use inline quiz if available
        }
      }
      
      // Load flashcards from external file if flashcardSource is specified
      if (topic.flashcardSource) {
        try {
          const flashcardUrl = topic.flashcardSource;
          console.log(`Načítání flashcards z ${flashcardUrl}...`);
          const flashcardResponse = await fetch(flashcardUrl);
          if (flashcardResponse.ok) {
            const flashcardData = await flashcardResponse.json();
            // Merge flashcards into topic.flashcards
            if (flashcardData.flashcards) {
              topic.flashcards = flashcardData.flashcards;
              console.log(`Flashcards načteny: ${flashcardData.flashcards.length} kartiček`);
            }
          } else {
            console.warn(`Nepodařilo se načíst flashcards z ${flashcardUrl}: ${flashcardResponse.status}`);
          }
        } catch (flashcardError) {
          console.warn(`Chyba při načítání flashcards pro ${topicId}:`, flashcardError);
          // Continue without external flashcards - topic will use inline flashcards if available
        }
      }
      
      // Load resources from external file if resourcesSource is specified
      if (topic.resourcesSource) {
        try {
          const resourcesUrl = topic.resourcesSource;
          console.log(`Načítání zdrojů z ${resourcesUrl}...`);
          const resourcesResponse = await fetch(resourcesUrl);
          if (resourcesResponse.ok) {
            const resourcesData = await resourcesResponse.json();
            // Merge resources sections into topic.resources
            if (resourcesData.sections) {
              topic.resources = resourcesData.sections;
              console.log(`Zdroje načteny: ${resourcesData.sections.length} sekcí`);
            }
          } else {
            console.warn(`Nepodařilo se načíst zdroje z ${resourcesUrl}: ${resourcesResponse.status}`);
          }
        } catch (resourcesError) {
          console.warn(`Chyba při načítání zdrojů pro ${topicId}:`, resourcesError);
          // Continue without external resources - topic will use inline resources if available
        }
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

