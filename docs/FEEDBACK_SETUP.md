# Feedback System Setup Guide

## GitHub Token Configuration

The feedback system supports two ways to configure your GitHub token:

### Option 1: External Config File (Recommended)

This keeps your token in a separate file that's not committed to git.

1. **Copy the example config file:**
   ```bash
   cp scripts/feedback.config.example.js scripts/feedback.config.js
   ```

2. **Edit `scripts/feedback.config.js`** and replace `YOUR_GITHUB_TOKEN_HERE` with your actual GitHub token:
   ```javascript
   githubToken: 'github_pat_xxxxxxxxxxxxx', // or 'ghp_xxxxxxxxxxxxx'
   ```

3. **Update your HTML files** to load the config before feedback.js:
   
   In `index.html` and `pages/topic_template.html`, add the config script before feedback.js:
   ```html
   <script src="scripts/feedback.config.js"></script>
   <script src="scripts/feedback.js"></script>
   ```

4. **Verify it's gitignored:** The file `scripts/feedback.config.js` is already in `.gitignore`, so it won't be committed.

### Option 2: Inline Configuration

If you prefer, you can set the token directly in `scripts/feedback.js`:

1. Open `scripts/feedback.js`
2. Find the `FEEDBACK_CONFIG_DEFAULT` object (around line 25)
3. Replace `'YOUR_GITHUB_TOKEN_HERE'` with your actual token:
   ```javascript
   githubToken: 'github_pat_xxxxxxxxxxxxx', // or 'ghp_xxxxxxxxxxxxx'
   ```

**Note:** This method will expose your token in the committed code, which is less secure.

## Getting a GitHub Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)" or "Generate new token (fine-grained)"
3. For classic tokens: Select scopes: `repo` (full control of private repositories)
4. For fine-grained tokens: Select repository access and permissions: `Issues: Read and write`
5. Copy the token (it starts with `ghp_` for classic or `github_pat_` for fine-grained)
6. Paste it into your config file

## Testing the Configuration

After setting up your token, you can test it by:

1. Opening your browser's developer console (F12)
2. Running: `testGitHubAccess()`
3. This will verify:
   - Repository access
   - Token validity
   - Issues API access

## GitHub Pages Deployment

**Important:** The `feedback.config.js` file is gitignored and won't be deployed to GitHub Pages automatically.

### Option A: Manual Upload (Recommended for GitHub Pages)

1. After deploying to GitHub Pages, go to your repository on GitHub
2. Navigate to the `scripts/` folder
3. Click "Add file" → "Create new file"
4. Name it `feedback.config.js`
5. Copy the content from `feedback.config.example.js` and add your token
6. Commit directly to the repository

**Note:** This will make the token visible in the repository, but for static sites, the token is visible in client-side code anyway.

### Option B: Use Inline Configuration

Alternatively, you can set the token directly in `scripts/feedback.js` (line 35) for GitHub Pages deployment. However, GitHub's push protection may block commits containing tokens.

## Current Configuration

- **Method:** GitHub Issues (automatic creation)
- **Repository:** `IvanaF/DejinyTance`
- **Labels:** `feedback`, `user-submitted`
- **Local Storage Backup:** Enabled (last 100 entries)

