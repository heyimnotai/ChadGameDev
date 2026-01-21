# Gemini Image Generator - Code Patterns

## Build Generation Prompt

```javascript
function buildPrompt(assetType, description, style) {
  const templates = {
    sprite: `${style.promptPrefix}${description}, ${style.defaultSize}${style.promptSuffix}`,
    background: `${style.spriteStyle} game background of ${description},
      color palette: ${Object.values(style.colors).join(', ')},
      960x540 pixels, landscape orientation`,
    icon: `${style.spriteStyle} game icon of ${description},
      ${style.colors.accent} accent color,
      1024x1024 pixels, app icon style, square format`,
    ui: `${style.promptPrefix}game UI ${description},
      clean edges, ${style.colors.primary} primary color,
      ${style.promptSuffix}`,
    spriteSheet: `${style.promptPrefix}sprite sheet of ${description},
      4 animation frames in horizontal row,
      consistent character across all frames,
      ${style.defaultSize} per frame${style.promptSuffix}`
  };
  return templates[assetType] || templates.sprite;
}
```

## Web Automation Method

```javascript
async function generateViaWeb(prompt, outputPath) {
  // 1. Navigate to Gemini
  await mcp__playwright__browser_navigate({ url: "https://gemini.google.com" });
  await mcp__playwright__browser_wait_for({ time: 2 });

  // 2. Verify login
  const snapshot = await mcp__playwright__browser_snapshot();
  if (!snapshot.includes('textbox')) {
    throw new Error('Not logged into Gemini');
  }

  // 3. Type prompt and submit
  await mcp__playwright__browser_click({ element: "Chat input", ref: "[ref]" });
  await mcp__playwright__browser_type({
    element: "Chat input",
    ref: "[ref]",
    text: prompt,
    submit: true
  });

  // 4. Wait for generation (15-30s)
  await mcp__playwright__browser_wait_for({ time: 25 });

  // 5. Screenshot the result
  await mcp__playwright__browser_take_screenshot({
    element: "Generated image",
    ref: "[img ref]",
    filename: outputPath,
    type: "png"
  });
}
```

## API Fallback

```python
import os
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ['GEMINI_API_KEY'])

response = client.models.generate_content(
    model="gemini-3-pro-image-preview",
    contents=prompt,
    config=types.GenerateContentConfig(response_modalities=['Text', 'Image'])
)

for part in response.candidates[0].content.parts:
    if part.inline_data is not None:
        with open(output_path, "wb") as f:
            f.write(part.inline_data.data)
```

## Post-Processing

```javascript
async function postProcess(imagePath, options = {}) {
  const { ensureTransparent = true, targetSize = null } = options;

  // Ensure transparency
  if (ensureTransparent) {
    await bash(`convert "${imagePath}" -alpha on "${imagePath}"`);
  }

  // Resize if needed
  if (targetSize) {
    const [width, height] = targetSize.split('x');
    const filter = options.pixelArt ? 'point' : 'lanczos';
    await bash(`convert "${imagePath}" -filter ${filter} -resize ${width}x${height} "${imagePath}"`);
  }
}
```

## Retry with Fallback

```javascript
async function generateWithRetry(prompt, outputPath, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await generateViaWeb(prompt, outputPath);
    } catch (error) {
      if (attempt === maxRetries) {
        return await generateViaAPI(prompt, outputPath);
      }
      await sleep(5000 * attempt);
    }
  }
}
```
