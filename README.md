# Dance History Study Platform

A modern, responsive self-study platform for learning dance history. Built as a static website with client-side functionality.

## Project Structure

```
/
├── index.html                 # Topics overview/index page
├── topic.html                 # Topic detail page template
├── assets/
│   ├── audio/                 # Audio files (placeholder for now)
│   ├── images/                # Images (if needed)
│   └── styles/
│       ├── design-tokens.css  # CSS variables (colors, spacing, typography)
│       ├── base.css           # Base/reset styles
│       ├── layout.css         # Layout components (sidebar, main content)
│       └── components.css     # UI components (topic cards, flashcards, etc.)
├── data/
│   └── topics/
│       ├── T01.json          # Individual topic files
│       ├── T02.json
│       └── ...                # More topics to be added
├── scripts/
│   ├── topic-loader.js        # Handles loading topic data
│   ├── progress.js            # Progress tracking (abstracted storage)
│   ├── flashcards.js          # Flashcard interactions
│   └── app.js                 # Main application logic
└── README.md                  # This file
```

## How to Run Locally

### Option 1: Using Python (Recommended)

```bash
# Python 3
python -m http.server 8000

# Then open http://localhost:8000 in your browser
```

### Option 2: Using Node.js (http-server)

```bash
# Install http-server globally (if not already installed)
npm install -g http-server

# Run the server
http-server -p 8000

# Then open http://localhost:8000 in your browser
```

### Option 3: Using VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

**Note:** The site must be served via HTTP (not opened directly as `file://`) because it uses `fetch()` to load JSON files.

## How Topics Are Added

### Phase 0: Preparing Topic Content

1. Extract content from your PDF master file (`Dějiny tance a baletu.pdf`)
2. For each chapter/topic, create a JSON file in `data/topics/` named `T##.json` (e.g., `T01.json`, `T02.json`)

### Topic JSON Schema

Each topic file should follow this structure:

```json
{
  "id": "T01",
  "order": 1,
  "title": "Topic Title",
  "estimated_time": "30-45 min",
  "difficulty": "beginner",
  "objectives": [
    "Objective 1",
    "Objective 2"
  ],
  "materials": {
    "summary": "Brief summary of the topic...",
    "sections": [
      {
        "heading": "Section Heading",
        "content": "Content here. Can include **bold** and *italic* markdown formatting.\n\nMultiple paragraphs supported."
      }
    ]
  },
  "audio": {
    "title": "Audio Title",
    "src": "assets/audio/T01.mp3",
    "transcript": "Optional transcript text"
  },
  "resources": [
    {
      "title": "Resource Title",
      "url": "https://example.com",
      "reason": "Why this resource is helpful"
    }
  ],
  "flashcards": [
    {
      "q": "Question?",
      "a": "Answer with **bold** support."
    }
  ]
}
```

### Field Descriptions

- **id**: Unique topic identifier (e.g., "T01", "T02")
- **order**: Numeric order for sequencing (used for next/previous navigation)
- **title**: Display title of the topic
- **estimated_time**: Optional time estimate (for display only)
- **difficulty**: Optional difficulty level (beginner/intermediate/advanced)
- **objectives**: Array of learning objectives
- **materials**: 
  - `summary`: Brief overview (supports markdown)
  - `sections`: Array of content sections with headings
- **audio**: Optional audio content
  - `title`: Audio title
  - `src`: Path to audio file (relative to root)
  - `transcript`: Optional transcript (collapsible in UI)
- **resources**: Array of external links with explanations
- **flashcards**: Array of question/answer pairs (supports markdown in answers)

### Markdown Support

The following markdown is supported in content fields:
- **Bold text**: `**text**`
- *Italic text*: `*text*`
- Line breaks (preserved)

### Updating the Topic List

Currently (Phase A), topics are hardcoded in `scripts/topic-loader.js`:
```javascript
const topicIds = ['T01', 'T02']; // Add more IDs here
```

In Phase B/C, this will be automatically scanned from the `data/topics/` directory.

## Features

### ✅ Implemented (Phase A)

- Responsive layout (desktop sidebar, mobile drawer)
- Topic index page
- Topic detail pages
- Progress tracking (localStorage)
- Navigation (next/previous topics)
- Flashcard interactions
- Audio player (placeholder)
- Modern CSS variable-based design system

### 🚧 Architecture Ready (Not Yet Implemented)

- Notes functionality (Option A - architecture ready, UI disabled)
- Content extraction from PDF (you'll prepare JSON files manually)
- Automatic topic scanning (Phase B/C)

## Design Customization

All design tokens are centralized in `assets/styles/design-tokens.css`. To customize:

- **Colors**: Modify `--color-*` variables
- **Typography**: Modify `--font-*` and `--font-size-*` variables
- **Spacing**: Modify `--spacing-*` variables
- **Layout**: Modify `--container-max-width`, `--sidebar-width`, etc.

Changes to these variables will update the entire site automatically.

## Browser Support

Targets modern browsers (last 2 versions of Chrome, Firefox, Safari, Edge). Uses:
- ES6+ JavaScript
- CSS Custom Properties (variables)
- Fetch API
- LocalStorage

## Development Notes

- **No build step required** - works as static files
- **No backend needed** - all functionality is client-side
- **Progress storage**: Currently localStorage (can be swapped for API-based storage later)
- **Content format**: JSON files (Markdown supported in content strings)

## Next Steps (Phase B)

1. Extract content from PDF → create topic JSON files
2. Test with 2 real topics
3. Verify all features work with real content
4. Proceed to Phase C for scaling to ~30 topics

## License

Private project - all rights reserved.

