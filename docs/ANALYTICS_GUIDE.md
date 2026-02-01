# Analytics Tracking Guide

This guide explains how to use the analytics tracking system in your project.

## Overview

The analytics system automatically tracks:
- **Page views** - How many times each page is accessed
- **Load times** - Page load performance metrics
- **Performance metrics** - Web Vitals (LCP, FID, CLS)
- **Scroll depth** - How far users scroll on each page
- **Time on page** - How long users spend on each page
- **Device information** - Browser, screen size, connection type

## Quick Start

### 1. Include the Analytics Script

Add the analytics script to your HTML files (before closing `</body>` tag):

```html
<!-- In index.html and pages/topic_template.html -->
<script src="scripts/analytics.js"></script>
```

### 2. View Analytics Data

Open your browser's console and type:

```javascript
// Get all statistics
Analytics.getStats()

// Get page views
Analytics.getPageViews()

// Get specific events
Analytics.getEvents('page_view')
Analytics.getEvents('load_time')
Analytics.getEvents('scroll')
```

### 3. Export Data

To export all analytics data:

```javascript
const data = Analytics.exportData()
console.log(data)
// Or download as JSON
const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = 'analytics-data.json'
a.click()
```

## Tracked Metrics

### Page Views

Tracks every page visit with:
- URL and path
- Page title
- Referrer
- Topic ID (if on topic page)
- Timestamp

**Access:**
```javascript
Analytics.getPageViews()
// Returns: { total: 150, "/": 50, "/pages/topic_template.html?id=T01": 25, ... }
```

### Load Times

Tracks various load time metrics:
- DNS lookup time
- Connection time
- Time to first byte (TTFB)
- Download time
- DOM processing time
- Full page load time
- Time to interactive

**Access:**
```javascript
Analytics.getEvents('load_time')
```

### Performance Metrics (Web Vitals)

Tracks Core Web Vitals:
- **LCP** (Largest Contentful Paint) - Loading performance
- **FID** (First Input Delay) - Interactivity
- **CLS** (Cumulative Layout Shift) - Visual stability

**Access:**
```javascript
Analytics.getEvents('web_vital')
```

### Scroll Depth

Tracks when users reach 25%, 50%, 75%, 90%, and 100% scroll depth.

**Access:**
```javascript
Analytics.getEvents('scroll')
```

### Time on Page

Tracks time spent on page, reported every 5 seconds and on page exit.

**Access:**
```javascript
Analytics.getEvents('time_on_page')
```

### Device Information

Tracks once per session:
- User agent
- Language
- Platform
- Screen dimensions
- Window dimensions
- Device pixel ratio
- Network connection info

**Access:**
```javascript
Analytics.getEvents('device_info')
```

## Configuration

Edit `scripts/analytics.js` to customize tracking:

```javascript
const CONFIG = {
  // Enable/disable specific tracking
  TRACK_PAGE_VIEWS: true,
  TRACK_LOAD_TIME: true,
  TRACK_PERFORMANCE: true,
  TRACK_SCROLL: true,
  TRACK_TIME_ON_PAGE: true,
  TRACK_DEVICE_INFO: true,
  
  // Scroll tracking thresholds
  SCROLL_THRESHOLDS: [25, 50, 75, 90, 100],
  
  // Time tracking interval (milliseconds)
  TIME_TRACKING_INTERVAL: 5000,
  
  // Maximum events to store
  MAX_LOCAL_EVENTS: 1000,
  
  // Debug mode
  DEBUG: false
};
```

## Integration Options

### Option 1: Local Storage Only (Current)

Data is stored in browser's localStorage. Perfect for:
- Personal projects
- Development/testing
- Privacy-focused applications

**Limitations:**
- Data is per-browser/device
- Limited storage space
- No cross-device tracking

### Option 2: Google Analytics

To integrate with Google Analytics, add this to your HTML:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
  
  // Send custom events
  Analytics.onEvent = function(event) {
    gtag('event', event.type, event.data);
  };
</script>
```

### Option 3: Plausible Analytics (Privacy-Friendly)

Add to your HTML:

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

### Option 4: Custom Backend API

Send events to your own backend:

```javascript
// In analytics.js, modify the recordEvent function or add:
Analytics.onEvent = function(event) {
  // Send to your API
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  }).catch(err => console.error('Analytics error:', err));
};
```

## Creating an Analytics Dashboard

You can create a simple dashboard page to view analytics. Here's a basic example:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Analytics Dashboard</title>
</head>
<body>
  <h1>Analytics Dashboard</h1>
  <div id="stats"></div>
  
  <script src="scripts/analytics.js"></script>
  <script>
    function displayStats() {
      const stats = Analytics.getStats();
      const pageViews = stats.pageViews;
      
      let html = '<h2>Page Views</h2>';
      html += `<p>Total: ${pageViews.total || 0}</p>`;
      html += '<ul>';
      
      Object.keys(pageViews).forEach(path => {
        if (path !== 'total') {
          html += `<li>${path}: ${pageViews[path]}</li>`;
        }
      });
      
      html += '</ul>';
      
      // Load times
      const loadTimes = Analytics.getEvents('load_time');
      if (loadTimes.length > 0) {
        const avgLoadTime = loadTimes.reduce((sum, e) => sum + e.data.loadTime, 0) / loadTimes.length;
        html += `<h2>Average Load Time</h2>`;
        html += `<p>${Math.round(avgLoadTime)}ms</p>`;
      }
      
      document.getElementById('stats').innerHTML = html;
    }
    
    displayStats();
  </script>
</body>
</html>
```

## Privacy Considerations

- All data is stored locally by default
- No data is sent to external servers unless you configure it
- Visitor IDs are randomly generated and stored locally
- Session IDs expire after 30 minutes of inactivity
- Users can clear their data by clearing browser storage

## Troubleshooting

### Enable Debug Mode

Set `DEBUG: true` in the CONFIG object to see console logs:

```javascript
const CONFIG = {
  DEBUG: true,
  // ... other config
};
```

### Check Storage

```javascript
// Check if data is being stored
localStorage.getItem('analytics_pageViews')
localStorage.getItem('analytics_events')
```

### Clear Data

```javascript
Analytics.clearData()
```

## Advanced Usage

### Custom Event Tracking

You can track custom events:

```javascript
Analytics.recordEvent('custom_event', {
  action: 'button_click',
  buttonId: 'helpButton',
  timestamp: Date.now()
});
```

### Filter Events by Date

```javascript
const today = new Date();
today.setHours(0, 0, 0, 0);

const events = Analytics.getEvents().filter(event => {
  return new Date(event.timestamp) >= today;
});
```

### Calculate Average Metrics

```javascript
// Average load time
const loadTimes = Analytics.getEvents('load_time');
const avgLoadTime = loadTimes.reduce((sum, e) => sum + e.data.loadTime, 0) / loadTimes.length;

// Average scroll depth
const scrolls = Analytics.getEvents('scroll').filter(e => e.data.final);
const avgScroll = scrolls.reduce((sum, e) => sum + e.data.scrollPercent, 0) / scrolls.length;
```

## Next Steps

1. **Add analytics script** to your HTML files
2. **Test it** by visiting pages and checking console
3. **View data** using `Analytics.getStats()`
4. **Optional**: Create a dashboard page
5. **Optional**: Integrate with external analytics service

