# Gemini Web Automation Research

**Date:** 2026-01-09
**Status:** Complete

---

## Executive Summary

Gemini has evolved significantly in 2025-2026 with multiple image generation models. For game asset generation, **Gemini 3 Pro Image (Nano Banana Pro)** is the best choice due to its 4K output, character consistency, and game-specific optimizations. Web automation via Playwright is viable but the **API approach is recommended** for reliability.

---

## Available Models (January 2026)

| Model | Resolution | Best For | Access |
|-------|------------|----------|--------|
| Gemini 2.0 Flash | 1024px | Quick iterations, prototypes | Free tier |
| Gemini 2.5 Flash Image (Nano Banana) | 1024px | Standard quality, editing | Free tier |
| **Gemini 3 Pro Image (Nano Banana Pro)** | 4096px | Production assets, game sprites | Free (US), Pro tier |
| Imagen 4 | High-res | Photorealistic images | Built into Gemini app |

### Recommendation: Gemini 3 Pro Image

> "Gemini 3 Pro maintains clean silhouettes and controlled detail that remain clear even at small sizes, making it ideal for mobile UI assets, icons, and in-game character art."

> "Gemini 3 Pro Image generates crisp, readable assets with strong shape language, making characters, environments, and in-game items easy to interpret at any size."

Key advantages for games:
- **4096x4096 native resolution** (vs 1024px for 2.5 Flash)
- **Character consistency** across multiple generations
- **Batch style consistency** for content packs
- **Advanced reasoning** for complex multi-turn prompts

---

## Access Methods

### Option 1: Web Interface (gemini.google.com)

**Pros:**
- Uses free quota
- No API key needed
- Full model access

**Cons:**
- Requires maintaining login session
- DOM selectors may change
- Rate limits unclear
- Less reliable than API

### Option 2: API (Recommended)

**Pros:**
- Reliable, documented
- Programmatic control
- Clear rate limits
- Easier error handling

**Cons:**
- Requires API key
- May have costs at scale

### API Code Example

```python
from google import genai
from google.genai import types
import os

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

prompt = "16-bit pixel art game sprite of a knight character, transparent background, 64x64 pixels"

response = client.models.generate_content(
    model="gemini-3-pro-image-preview",  # or "gemini-2.0-flash-exp"
    contents=prompt,
    config=types.GenerateContentConfig(response_modalities=['Text', 'Image'])
)

for part in response.candidates[0].content.parts:
    if part.inline_data is not None:
        with open("knight-sprite.png", "wb") as file:
            file.write(part.inline_data.data)
```

---

## Web Automation Flow (Playwright)

If using web automation to preserve free quota:

### Step 1: Browser Setup with Persistent Profile

```javascript
// Use persistent context to maintain Google login
// Profile stored at ~/.gemini-playwright-profile

mcp__playwright__browser_navigate({ url: "https://gemini.google.com" })

// Verify logged in - look for chat input or user avatar
mcp__playwright__browser_snapshot()
```

### Step 2: Generate Image

```javascript
// 1. Find chat input field
mcp__playwright__browser_snapshot()
// Look for: textbox "Enter a prompt here"

// 2. Type prompt
mcp__playwright__browser_type({
  element: "Chat input",
  ref: "[ref from snapshot]",
  text: "Generate a 16-bit pixel art game sprite of a knight..."
})

// 3. Submit
mcp__playwright__browser_press_key({ key: "Enter" })

// 4. Wait for image generation (15-30 seconds)
mcp__playwright__browser_wait_for({ time: 20 })

// 5. Get snapshot to find generated image
mcp__playwright__browser_snapshot()
// Look for: img with generated content
```

### Step 3: Download Image

```javascript
// Option A: Screenshot the image element directly
mcp__playwright__browser_take_screenshot({
  element: "Generated image",
  ref: "[ref]",
  filename: "sprite.png"
})

// Option B: Right-click and save (more complex)
// Would need to handle file dialog
```

### Step 4: Start New Chat (Prevent Style Drift)

```javascript
// Click "New chat" button between unrelated assets
mcp__playwright__browser_click({
  element: "New chat button",
  ref: "[ref]"
})
```

---

## Key Capabilities for Game Assets

### 1. Sprite Generation

Gemini can generate:
- Character sprites
- Enemy sprites
- Item/collectible sprites
- UI elements
- Backgrounds
- App icons (1024x1024)

### 2. Sprite Sheets

> "You can define your animation frames, generate a complete sprite sheet with AI, refine the output, export clean PNGs, and import everything into your game engine."

Prompt example:
```
Generate a pixel art sprite sheet of a running knight character.
4 animation frames in a horizontal row.
16-bit style, 64x64 pixels per frame.
Transparent background.
```

### 3. Style Consistency

> "A fundamental challenge in image generation is maintaining the appearance of a character or object across multiple prompts. You can now place the same character into different environments."

Strategy:
- Define detailed style in first prompt
- Reference previous outputs in subsequent prompts
- Use same color palette across prompts
- Start new chat between unrelated assets

### 4. Pixel Art Support

Gemini understands pixel art prompts:
- "16-bit pixel art"
- "8-bit retro style"
- "pixel art with 1px black outline"
- "NES-style sprite"

---

## Limitations

1. **No Size/Aspect Ratio Control**: Cannot specify exact dimensions. Must request in prompt (e.g., "landscape orientation") but not guaranteed.

2. **Transparent Backgrounds**: Must explicitly request. May need post-processing with background removal tools.

3. **Rate Limits**: Unclear for web interface. API has documented limits.

4. **SynthID Watermark**: All generated images include invisible watermark.

---

## Recommended Approach for Chad Loop

### Primary: Gemini API
- Use `gemini-3-pro-image-preview` for production assets
- Fall back to `gemini-2.0-flash-exp` for quick iterations
- Store API key in environment variable

### Fallback: Web Automation
- Only if API costs are concern
- Maintain persistent browser profile
- Handle login state carefully
- Implement retry logic for failures

### Post-Processing Pipeline

1. Generate image via Gemini
2. If not transparent, run through remove.bg or Pixelcut API
3. Resize if needed (imagemagick or sharp)
4. Save to `assets/sprites/`

---

## Sources

- [Gemini 3 Pro Image for Game Studios](https://www.layer.ai/models/google--gemini-3-pro-image)
- [How to Create Sprite Sheets with AI using Gemini](https://lab.rosebud.ai/blog/how-to-create-a-sprite-sheet-with-ai-using-google-gemini-and-nano-banana-easy-guide)
- [Introducing Gemini 2.5 Flash Image](https://developers.googleblog.com/en/introducing-gemini-2-5-flash-image/)
- [Gemini 3 Developer Guide](https://ai.google.dev/gemini-api/docs/gemini-3)
- [How to Use Gemini 3 Pro to Create Images](https://www.glbgpt.com/hub/how-to-use-gemini-3-pro-to-create-images/)
- [Nano Banana Pro Overview](https://gemini.google/overview/image-generation/)
