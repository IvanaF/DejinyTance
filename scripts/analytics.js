/**
 * Analytics Tracking System
 * 
 * Tracks:
 * - Page views and unique visitors
 * - Page load times
 * - Performance metrics (Web Vitals)
 * - User interactions (scroll depth, time on page)
 * - Device and browser information
 * 
 * Data is stored in localStorage by default.
 * Can be extended to send to a backend API or analytics service.
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    // Storage key prefix
    STORAGE_PREFIX: 'analytics_',
    
    // Enable/disable specific tracking
    TRACK_PAGE_VIEWS: true,
    TRACK_LOAD_TIME: true,
    TRACK_PERFORMANCE: true,
    TRACK_SCROLL: true,
    TRACK_TIME_ON_PAGE: true,
    TRACK_DEVICE_INFO: true,
    
    // Scroll tracking thresholds (percentages)
    SCROLL_THRESHOLDS: [25, 50, 75, 90, 100],
    
    // Time on page tracking interval (milliseconds)
    TIME_TRACKING_INTERVAL: 5000, // 5 seconds
    
    // Maximum number of events to store locally
    MAX_LOCAL_EVENTS: 1000,
    
    // Enable console logging for debugging
    DEBUG: false
  };

  // Storage keys
  const STORAGE_KEYS = {
    PAGE_VIEWS: CONFIG.STORAGE_PREFIX + 'pageViews',
    EVENTS: CONFIG.STORAGE_PREFIX + 'events',
    VISITOR_ID: CONFIG.STORAGE_PREFIX + 'visitorId',
    SESSION_ID: CONFIG.STORAGE_PREFIX + 'sessionId',
    STATS: CONFIG.STORAGE_PREFIX + 'stats'
  };

  // Analytics object
  const Analytics = {
    // Initialize analytics
    init: function() {
      if (this.isInitialized) return;
      this.isInitialized = true;
      
      this.log('Analytics initialized');
      
      // Generate visitor and session IDs if needed
      this.ensureVisitorId();
      this.ensureSessionId();
      
      // Track page view
      if (CONFIG.TRACK_PAGE_VIEWS) {
        this.trackPageView();
      }
      
      // Track load time
      if (CONFIG.TRACK_LOAD_TIME) {
        this.trackLoadTime();
      }
      
      // Track performance metrics
      if (CONFIG.TRACK_PERFORMANCE) {
        this.trackPerformanceMetrics();
      }
      
      // Track scroll depth
      if (CONFIG.TRACK_SCROLL) {
        this.trackScrollDepth();
      }
      
      // Track time on page
      if (CONFIG.TRACK_TIME_ON_PAGE) {
        this.trackTimeOnPage();
      }
      
      // Track device info (once per session)
      if (CONFIG.TRACK_DEVICE_INFO && !this.hasTrackedDeviceInfo()) {
        this.trackDeviceInfo();
      }
    },

    // Logging helper
    log: function(...args) {
      if (CONFIG.DEBUG) {
        console.log('[Analytics]', ...args);
      }
    },

    // Generate unique ID
    generateId: function() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Ensure visitor ID exists
    ensureVisitorId: function() {
      let visitorId = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
      if (!visitorId) {
        visitorId = this.generateId();
        localStorage.setItem(STORAGE_KEYS.VISITOR_ID, visitorId);
      }
      this.visitorId = visitorId;
    },

    // Ensure session ID exists
    ensureSessionId: function() {
      // Session expires after 30 minutes of inactivity
      const SESSION_TIMEOUT = 30 * 60 * 1000;
      let sessionData = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
      
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData);
          const now = Date.now();
          if (now - parsed.timestamp < SESSION_TIMEOUT) {
            this.sessionId = parsed.id;
            return;
          }
        } catch (e) {
          // Invalid session data, create new
        }
      }
      
      // Create new session
      const sessionId = this.generateId();
      sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, JSON.stringify({
        id: sessionId,
        timestamp: Date.now()
      }));
      this.sessionId = sessionId;
    },

    // Track page view
    trackPageView: function() {
      const pageData = {
        url: window.location.href,
        path: window.location.pathname,
        title: document.title,
        referrer: document.referrer || 'direct',
        timestamp: Date.now(),
        visitorId: this.visitorId,
        sessionId: this.sessionId
      };

      // Extract topic ID if on topic page
      const urlParams = new URLSearchParams(window.location.search);
      const topicId = urlParams.get('id');
      if (topicId) {
        pageData.topicId = topicId;
      }

      this.recordEvent('page_view', pageData);
      this.incrementPageView(pageData.path);
      
      this.log('Page view tracked:', pageData);
    },

    // Track page load time
    trackLoadTime: function() {
      // Wait for page to fully load
      if (document.readyState === 'complete') {
        this.measureLoadTime();
      } else {
        window.addEventListener('load', () => {
          this.measureLoadTime();
        });
      }
    },

    // Measure load time
    measureLoadTime: function() {
      const perfData = window.performance;
      if (!perfData || !perfData.timing) {
        this.log('Performance timing not available');
        return;
      }

      const timing = perfData.timing;
      const navigation = perfData.navigation;

      const metrics = {
        // DNS lookup time
        dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
        
        // Connection time
        connectionTime: timing.connectEnd - timing.connectStart,
        
        // Time to first byte
        ttfb: timing.responseStart - timing.requestStart,
        
        // Download time
        downloadTime: timing.responseEnd - timing.responseStart,
        
        // DOM processing time
        domProcessingTime: timing.domComplete - timing.domInteractive,
        
        // DOM content loaded
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        
        // Full page load time
        loadTime: timing.loadEventEnd - timing.navigationStart,
        
        // Time to interactive (approximate)
        timeToInteractive: timing.domInteractive - timing.navigationStart,
        
        // Navigation type
        navigationType: navigation ? navigation.type : 'unknown'
      };

      this.recordEvent('load_time', {
        ...metrics,
        timestamp: Date.now(),
        url: window.location.href,
        path: window.location.pathname
      });

      this.log('Load time tracked:', metrics);
    },

    // Track Web Vitals performance metrics
    trackPerformanceMetrics: function() {
      // Check if browser supports PerformanceObserver
      if (!window.PerformanceObserver) {
        this.log('PerformanceObserver not supported');
        return;
      }

      // Track Largest Contentful Paint (LCP)
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          this.recordEvent('web_vital', {
            name: 'LCP',
            value: lastEntry.renderTime || lastEntry.loadTime,
            timestamp: Date.now(),
            url: window.location.href
          });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        this.log('LCP tracking not supported:', e);
      }

      // Track First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            this.recordEvent('web_vital', {
              name: 'FID',
              value: entry.processingStart - entry.startTime,
              timestamp: Date.now(),
              url: window.location.href
            });
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        this.log('FID tracking not supported:', e);
      }

      // Track Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          
          // Report CLS when page is hidden (user navigating away)
          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden' && clsValue > 0) {
              this.recordEvent('web_vital', {
                name: 'CLS',
                value: clsValue,
                timestamp: Date.now(),
                url: window.location.href
              });
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        this.log('CLS tracking not supported:', e);
      }
    },

    // Track scroll depth
    trackScrollDepth: function() {
      const thresholds = CONFIG.SCROLL_THRESHOLDS;
      const tracked = new Set();
      
      let ticking = false;
      
      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((scrollTop / docHeight) * 100);
            
            thresholds.forEach(threshold => {
              if (scrollPercent >= threshold && !tracked.has(threshold)) {
                tracked.add(threshold);
                this.recordEvent('scroll', {
                  depth: threshold,
                  scrollPercent: scrollPercent,
                  timestamp: Date.now(),
                  url: window.location.href,
                  path: window.location.pathname
                });
                this.log(`Scroll depth ${threshold}% reached`);
              }
            });
            
            ticking = false;
          });
          ticking = true;
        }
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Track when user leaves page
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercent = Math.round((scrollTop / docHeight) * 100);
          
          this.recordEvent('scroll', {
            depth: scrollPercent,
            scrollPercent: scrollPercent,
            timestamp: Date.now(),
            url: window.location.href,
            path: window.location.pathname,
            final: true
          });
        }
      });
    },

    // Track time on page
    trackTimeOnPage: function() {
      const startTime = Date.now();
      let lastReportTime = startTime;
      
      const interval = setInterval(() => {
        const currentTime = Date.now();
        const timeOnPage = currentTime - startTime;
        const timeSinceLastReport = currentTime - lastReportTime;
        
        // Report every interval
        this.recordEvent('time_on_page', {
          timeOnPage: timeOnPage,
          timeSinceLastReport: timeSinceLastReport,
          timestamp: currentTime,
          url: window.location.href,
          path: window.location.pathname
        });
        
        lastReportTime = currentTime;
      }, CONFIG.TIME_TRACKING_INTERVAL);
      
      // Report final time when leaving page
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          clearInterval(interval);
          const finalTime = Date.now() - startTime;
          this.recordEvent('time_on_page', {
            timeOnPage: finalTime,
            timestamp: Date.now(),
            url: window.location.href,
            path: window.location.pathname,
            final: true
          });
        }
      });
    },

    // Track device and browser information
    trackDeviceInfo: function() {
      const deviceInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
        connection: this.getConnectionInfo(),
        timestamp: Date.now()
      };

      this.recordEvent('device_info', deviceInfo);
      sessionStorage.setItem(CONFIG.STORAGE_PREFIX + 'deviceInfoTracked', 'true');
      
      this.log('Device info tracked:', deviceInfo);
    },

    // Check if device info has been tracked this session
    hasTrackedDeviceInfo: function() {
      return sessionStorage.getItem(CONFIG.STORAGE_PREFIX + 'deviceInfoTracked') === 'true';
    },

    // Get network connection info
    getConnectionInfo: function() {
      if (navigator.connection) {
        return {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt,
          saveData: navigator.connection.saveData
        };
      }
      return null;
    },

    // Record an event
    recordEvent: function(eventType, eventData) {
      const event = {
        type: eventType,
        data: eventData,
        timestamp: Date.now()
      };

      // Get existing events
      let events = [];
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
        if (stored) {
          events = JSON.parse(stored);
        }
      } catch (e) {
        this.log('Error reading events from storage:', e);
        events = [];
      }

      // Add new event
      events.push(event);

      // Limit number of stored events
      if (events.length > CONFIG.MAX_LOCAL_EVENTS) {
        events = events.slice(-CONFIG.MAX_LOCAL_EVENTS);
      }

      // Save events
      try {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
      } catch (e) {
        this.log('Error saving event to storage:', e);
      }

      // Call custom handler if defined
      if (typeof this.onEvent === 'function') {
        this.onEvent(event);
      }
    },

    // Increment page view counter
    incrementPageView: function(path) {
      let pageViews = {};
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.PAGE_VIEWS);
        if (stored) {
          pageViews = JSON.parse(stored);
        }
      } catch (e) {
        this.log('Error reading page views:', e);
        pageViews = {};
      }

      // Increment total
      pageViews.total = (pageViews.total || 0) + 1;

      // Increment for specific path
      pageViews[path] = (pageViews[path] || 0) + 1;

      // Save
      try {
        localStorage.setItem(STORAGE_KEYS.PAGE_VIEWS, JSON.stringify(pageViews));
      } catch (e) {
        this.log('Error saving page views:', e);
      }
    },

    // Get statistics
    getStats: function() {
      const stats = {
        pageViews: this.getPageViews(),
        events: this.getEvents(),
        visitorId: this.visitorId,
        sessionId: this.sessionId
      };

      return stats;
    },

    // Get page views
    getPageViews: function() {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.PAGE_VIEWS);
        return stored ? JSON.parse(stored) : { total: 0 };
      } catch (e) {
        return { total: 0 };
      }
    },

    // Get events
    getEvents: function(filterType = null) {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
        const events = stored ? JSON.parse(stored) : [];
        
        if (filterType) {
          return events.filter(e => e.type === filterType);
        }
        
        return events;
      } catch (e) {
        return [];
      }
    },

    // Export data (for downloading or sending to backend)
    exportData: function() {
      return {
        visitorId: this.visitorId,
        sessionId: this.sessionId,
        pageViews: this.getPageViews(),
        events: this.getEvents(),
        exportedAt: new Date().toISOString()
      };
    },

    // Clear all analytics data
    clearData: function() {
      localStorage.removeItem(STORAGE_KEYS.PAGE_VIEWS);
      localStorage.removeItem(STORAGE_KEYS.EVENTS);
      localStorage.removeItem(STORAGE_KEYS.VISITOR_ID);
      sessionStorage.removeItem(STORAGE_KEYS.SESSION_ID);
      sessionStorage.removeItem(CONFIG.STORAGE_PREFIX + 'deviceInfoTracked');
      this.log('Analytics data cleared');
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Analytics.init());
  } else {
    Analytics.init();
  }

  // Expose Analytics to window for debugging and custom handlers
  window.Analytics = Analytics;

})();

