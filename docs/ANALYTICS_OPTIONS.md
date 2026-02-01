# Analytics Options Summary

This document provides an overview of all analytics tracking options available for your project.

## ✅ What's Already Implemented

A comprehensive analytics system has been added that tracks:

### 📊 Metrics Tracked

1. **Page Views**
   - Total page views
   - Views per page/path
   - Topic-specific views
   - Referrer information

2. **Load Times**
   - DNS lookup time
   - Connection time
   - Time to First Byte (TTFB)
   - Download time
   - DOM processing time
   - Full page load time
   - Time to interactive

3. **Performance Metrics (Web Vitals)**
   - **LCP** (Largest Contentful Paint) - Loading performance
   - **FID** (First Input Delay) - Interactivity
   - **CLS** (Cumulative Layout Shift) - Visual stability

4. **User Engagement**
   - Scroll depth (25%, 50%, 75%, 90%, 100%)
   - Time spent on page
   - Final scroll position

5. **Device Information**
   - Browser and user agent
   - Screen dimensions
   - Window dimensions
   - Device pixel ratio
   - Network connection type

### 📁 Files Added

- `scripts/analytics.js` - Analytics tracking script
- `analytics-dashboard.html` - Dashboard to view analytics data
- `docs/ANALYTICS_GUIDE.md` - Complete usage guide
- `docs/ANALYTICS_OPTIONS.md` - This file

### 🔧 Integration

The analytics script has been added to:
- `index.html`
- `pages/topic_template.html`

## 📈 How to Use

### View Analytics in Console

Open browser console and type:

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

### View Analytics Dashboard

Open `analytics-dashboard.html` in your browser to see:
- Total page views
- Average load times
- Performance metrics
- User engagement statistics
- Page-by-page breakdown

### Export Data

```javascript
// Export all data as JSON
const data = Analytics.exportData()
```

Or use the "Exportovat data" button in the dashboard.

## 🔄 Additional Options

### Option 1: Google Analytics (Most Popular)

**Pros:**
- Industry standard
- Comprehensive reports
- Real-time data
- Free tier available
- Easy integration

**Cons:**
- Privacy concerns
- Requires Google account
- Data stored on Google servers

**Setup:**
1. Create Google Analytics account
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to HTML:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
  
  // Send custom events from our analytics
  Analytics.onEvent = function(event) {
    gtag('event', event.type, event.data);
  };
</script>
```

### Option 2: Plausible Analytics (Privacy-Friendly)

**Pros:**
- Privacy-focused (GDPR compliant)
- No cookies
- Lightweight
- Simple dashboard
- Open source

**Cons:**
- Paid service (€9/month for 10k page views)
- Less features than Google Analytics

**Setup:**
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

### Option 3: Umami Analytics (Self-Hosted)

**Pros:**
- Free and open source
- Self-hosted (full control)
- Privacy-focused
- Lightweight
- Modern dashboard

**Cons:**
- Requires server setup
- Need to maintain infrastructure

**Setup:**
1. Deploy Umami (Docker, Vercel, etc.)
2. Add script tag:

```html
<script async defer data-website-id="your-id" src="https://umami.example.com/script.js"></script>
```

### Option 4: Custom Backend API

**Pros:**
- Full control over data
- Custom metrics
- No third-party dependencies
- Privacy-friendly

**Cons:**
- Need to build and maintain backend
- Server costs
- More complex setup

**Setup:**
Modify `analytics.js` to send events to your API:

```javascript
Analytics.onEvent = function(event) {
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  }).catch(err => console.error('Analytics error:', err));
};
```

### Option 5: Server Logs Analysis

**Pros:**
- No client-side code needed
- Works with any web server
- Privacy-friendly (no tracking scripts)

**Cons:**
- Less detailed metrics
- Need server access
- Requires log analysis tools

**Tools:**
- GoAccess (real-time web log analyzer)
- AWStats
- Webalizer

## 📊 Comparison Table

| Feature | Local Storage | Google Analytics | Plausible | Umami | Custom API |
|---------|--------------|------------------|-----------|-------|------------|
| **Cost** | Free | Free | €9/month | Free* | Varies |
| **Privacy** | High | Low | High | High | High |
| **Setup Complexity** | Easy | Easy | Easy | Medium | Hard |
| **Real-time** | No | Yes | Yes | Yes | Yes |
| **Data Ownership** | User | Google | You | You | You |
| **GDPR Compliant** | Yes | With setup | Yes | Yes | Yes |
| **Server Required** | No | No | No | Yes* | Yes |
| **Features** | Basic | Advanced | Basic | Medium | Custom |

*Umami can be self-hosted for free, but requires server

## 🎯 Recommendations

### For Development/Testing
- **Use Local Storage** (already implemented)
- Perfect for seeing how analytics work
- No external dependencies

### For Production (Privacy-Focused)
- **Plausible Analytics** or **Umami**
- GDPR compliant
- User-friendly
- Good balance of features and privacy

### For Production (Maximum Features)
- **Google Analytics**
- Most comprehensive
- Industry standard
- Free tier available

### For Maximum Control
- **Custom Backend API**
- Full control over data
- Custom metrics
- No third-party dependencies

## 🔒 Privacy Considerations

### Current Implementation (Local Storage)
- ✅ All data stored locally
- ✅ No external requests
- ✅ User controls data
- ✅ GDPR compliant
- ⚠️ Data is per-device/browser

### If Adding External Analytics
- Check GDPR requirements
- Add privacy policy
- Consider cookie consent
- Inform users about tracking

## 📝 Next Steps

1. **Test Current Implementation**
   - Visit pages on your site
   - Check console: `Analytics.getStats()`
   - Open `analytics-dashboard.html`

2. **Choose Additional Option** (if needed)
   - For simple projects: Local storage is enough
   - For production: Consider Plausible or Google Analytics
   - For full control: Build custom API

3. **Customize Tracking** (optional)
   - Edit `CONFIG` in `analytics.js`
   - Add custom events
   - Modify dashboard

4. **Deploy Dashboard** (optional)
   - Add `analytics-dashboard.html` to your site
   - Protect with authentication if needed
   - Or keep it local for your use only

## 🛠️ Customization

### Enable/Disable Tracking

Edit `scripts/analytics.js`:

```javascript
const CONFIG = {
  TRACK_PAGE_VIEWS: true,    // Track page views
  TRACK_LOAD_TIME: true,      // Track load times
  TRACK_PERFORMANCE: true,    // Track Web Vitals
  TRACK_SCROLL: true,         // Track scroll depth
  TRACK_TIME_ON_PAGE: true,   // Track time on page
  TRACK_DEVICE_INFO: true,     // Track device info
  DEBUG: false                // Enable debug logs
};
```

### Add Custom Events

```javascript
// Track button clicks
document.getElementById('helpButton').addEventListener('click', () => {
  Analytics.recordEvent('button_click', {
    buttonId: 'helpButton',
    timestamp: Date.now()
  });
});
```

## 📚 Documentation

- **Complete Guide**: See `docs/ANALYTICS_GUIDE.md`
- **Dashboard**: Open `analytics-dashboard.html`
- **Code**: See `scripts/analytics.js`

## ❓ FAQ

**Q: Will this slow down my site?**
A: No, the analytics script is lightweight and runs asynchronously. It doesn't block page rendering.

**Q: Can users see their data?**
A: Yes, all data is stored in their browser's localStorage. They can view it via console or dashboard.

**Q: How much data is stored?**
A: By default, up to 1000 events. This can be adjusted in the CONFIG.

**Q: Can I track specific user actions?**
A: Yes, you can add custom event tracking anywhere in your code.

**Q: Is this GDPR compliant?**
A: Yes, since all data is stored locally and not sent to external servers (unless you add external analytics).

**Q: Can I send data to my own server?**
A: Yes, modify the `onEvent` handler to send data to your API endpoint.

