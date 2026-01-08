# Setup - Install Dependencies

Run this command before using Ralph to ensure all dependencies are installed.

## Usage

```
/setup
```

---

## Prerequisites Check

Before doing anything, verify the following are working:

### 1. Install Playwright Browser via Bash

**IMPORTANT: Do NOT use mcp__playwright__browser_install - it hangs.**

Use the Bash tool to run:
```bash
npx playwright install chromium
```

Set timeout to 300000 (5 minutes) as first-time install downloads ~165MB.

**Expected output:**
```
Chromium 143.x.x downloaded to /home/user/.cache/ms-playwright/chromium-xxxx
```

If it says "already installed" or shows the download progress, it's working.

### 2. Test Browser Launch

After installation, verify it works:

```
1. Call mcp__playwright__browser_navigate with url: "about:blank"
2. If successful, browser is working
3. Call mcp__playwright__browser_close to clean up
```

### 3. Preview Files Exist

Check that the preview system files exist:
- `preview/index.html`
- `preview/game-renderer.js`
- `preview/game.js`

---

## Setup Workflow

Execute these steps in order:

### Step 1: Install Playwright Browser

```
Use tool: mcp__playwright__browser_install

Expected: Browser downloads and installs (may take 1-2 minutes)
```

### Step 2: Test Browser

```
Use tool: mcp__playwright__browser_navigate
Parameters: url = "about:blank"

Expected: Browser opens successfully
```

### Step 3: Verify Preview Path

```
Check file exists: preview/index.html

If missing: Report error - preview system not set up
```

### Step 4: Test Full Preview

```
1. Get absolute path to preview/index.html
2. Navigate browser to: file:///[absolute-path]/preview/index.html
3. Take a test screenshot
4. Verify screenshot shows iPhone frame
```

### Step 5: Clean Up

```
Use tool: mcp__playwright__browser_close
```

---

## Output Format

### Success
```
Setup Complete

Playwright browser: Installed and working
Preview system: Found at preview/index.html
Test screenshot: Captured successfully

You're ready to run /ralph
```

### Failure
```
Setup Failed

Issue: [specific problem]
Fix: [how to resolve]

Common fixes:
- Run /setup again after fixing the issue
- Check internet connection for browser download
- Ensure preview/ directory exists
```

---

## Troubleshooting

### "Browser not installed"
Run `/setup` - it will install Chromium automatically.

### "Browser launch timeout"
- Check if another browser instance is hanging
- Try: `pkill -f chromium` or `pkill -f chrome`
- Run `/setup` again

### "Cannot find preview/index.html"
The preview system files are missing. Check that you're in the correct directory.

### "Screenshot shows blank page"
The preview loaded but game.js may have errors. Check browser console with `mcp__playwright__browser_console_messages`.
