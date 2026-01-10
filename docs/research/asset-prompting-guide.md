# Game Asset Prompting Guide

**Date:** 2026-01-09
**Status:** Complete

---

## Executive Summary

Effective game asset prompting requires specific structure: art style, subject, context, technical requirements. This guide provides proven templates for different asset types optimized for Gemini and other AI image generators.

---

## Prompt Structure

### Basic Template

```
[ART STYLE] [SUBJECT] [CONTEXT/ACTION] [TECHNICAL SPECS]
```

### Full Template

```
Generate a [ART STYLE] game [ASSET TYPE] of [SUBJECT DESCRIPTION].
[ACTION/POSE if applicable]
Style: [detailed style requirements]
Colors: [color palette or mood]
Technical: [size, transparency, format requirements]
```

---

## Art Style Keywords

### Pixel Art

| Keyword | Effect |
|---------|--------|
| `pixel art` | Generic pixel style |
| `8-bit` | NES-era, limited colors |
| `16-bit` | SNES-era, richer palette |
| `32-bit` | PS1-era, more detail |
| `1px black outline` | Clean sprite edges |
| `dithering` | Gradient simulation |
| `indexed colors` | Limited palette feel |

**Example:**
```
16-bit pixel art game sprite of a warrior knight,
idle pose facing right, 1px black outline,
64x64 pixels, transparent background
```

### Modern Styles

| Keyword | Effect |
|---------|--------|
| `flat design` | No gradients, solid colors |
| `vector art` | Clean scalable shapes |
| `cel shaded` | Anime-like shading |
| `hand-drawn` | Sketchy, organic lines |
| `low poly` | Geometric, faceted |
| `isometric` | 2.5D angled view |

**Example:**
```
Flat design game icon of a golden coin,
bold yellow and orange colors, minimal shading,
perfect circle, game UI style, transparent background
```

### Stylized

| Keyword | Effect |
|---------|--------|
| `kawaii` | Cute, rounded, pastel |
| `chibi` | Big head, small body |
| `neon` | Glowing edges, dark bg |
| `synthwave` | 80s retro futurism |
| `vaporwave` | Pink/cyan, glitchy |

---

## Asset Type Templates

### 1. Character Sprites

```
[STYLE] game character sprite of [CHARACTER DESCRIPTION],
[POSE/ACTION], facing [DIRECTION],
[OUTFIT/EQUIPMENT details],
clean silhouette, readable at small size,
[SIZE] pixels, transparent background
```

**Examples:**

```
16-bit pixel art game character sprite of a female archer,
idle stance facing right, brown leather armor, wooden bow,
clean silhouette, 64x64 pixels, transparent background
```

```
Flat vector game character of a cute robot mascot,
happy expression, waving pose, blue and silver colors,
chibi proportions, 128x128 pixels, transparent PNG
```

### 2. Enemies/Obstacles

```
[STYLE] game enemy sprite of [ENEMY TYPE],
[THREATENING/MENACING] appearance,
[ATTACK POSE or IDLE],
contrasts with player character,
[SIZE] pixels, transparent background
```

**Example:**
```
8-bit pixel art game enemy sprite of a slime monster,
angry expression with small fangs, bouncing pose,
green and purple colors, 32x32 pixels, transparent background
```

### 3. Items/Collectibles

```
[STYLE] game item sprite of [ITEM],
[GLOWING/SHINY] effect for visibility,
simple recognizable shape,
[SIZE] pixels, transparent background
```

**Examples:**

```
Pixel art game collectible coin, golden with shine effect,
star emblem in center, 16x16 pixels, transparent background
```

```
Flat design health potion icon, red liquid in glass bottle,
heart symbol, glowing outline, 64x64, transparent PNG
```

### 4. Backgrounds

```
[STYLE] game background of [SCENE],
[TIME OF DAY], [MOOD/ATMOSPHERE],
suitable for [GAME TYPE] game,
tileable/seamless if needed,
[RESOLUTION] pixels, [ORIENTATION]
```

**Example:**
```
Pixel art game background of a fantasy forest,
evening lighting with orange sunset, mystical atmosphere,
suitable for platformer game, parallax layers,
960x540 pixels, landscape orientation
```

### 5. UI Elements

```
[STYLE] game UI [ELEMENT TYPE],
[STATE: normal/pressed/disabled],
readable text area if needed,
matches [GAME STYLE] aesthetic,
[SIZE] pixels, transparent background
```

**Example:**
```
Pixel art game UI button, blue rounded rectangle,
pressed state with darker shade,
space for text label, retro arcade style,
120x40 pixels, transparent background
```

### 6. App Icons

```
[STYLE] mobile game app icon featuring [MAIN ELEMENT],
[MOOD: exciting/cute/mysterious],
instantly recognizable, works at small sizes,
1024x1024 pixels, no transparency, rounded corners OK
```

**Example:**
```
Vibrant cartoon mobile game app icon featuring a golden treasure chest,
exciting adventure mood, sparkling gems visible,
bold colors, instantly recognizable at small sizes,
1024x1024 pixels, square format
```

---

## Sprite Sheet Prompts

### Animation Strip

```
[STYLE] sprite sheet of [CHARACTER] [ACTION],
[N] animation frames in horizontal row,
consistent character across all frames,
[SIZE] pixels per frame, transparent background
```

**Example:**
```
16-bit pixel art sprite sheet of a knight running,
8 animation frames in horizontal row,
consistent character design across all frames,
64x64 pixels per frame, transparent background
```

### Multi-Pose Sheet

```
[STYLE] character sheet for [CHARACTER],
poses: [LIST POSES],
arranged in grid format,
consistent style and proportions,
transparent background
```

**Example:**
```
Pixel art character sheet for a wizard character,
poses: idle, walking, casting spell, hurt, victory,
arranged in 2 rows, consistent blue robe design,
48x48 pixels per pose, transparent background
```

---

## Color Palette Integration

### Specifying Colors

```
Color palette: [HEX1], [HEX2], [HEX3], [HEX4], [HEX5]
Primary: [HEX1] for main elements
Accent: [HEX3] for highlights and details
```

**Example:**
```
16-bit pixel art hero character,
Color palette: #1a1c2c (dark), #5d275d (purple), #b13e53 (red),
#ef7d57 (orange), #ffcd75 (gold)
Primary: dark purple armor
Accent: gold trim and highlights
64x64 pixels, transparent background
```

### Mood-Based Colors

| Mood | Palette Description |
|------|---------------------|
| Retro Arcade | Neon pink, cyan, purple on black |
| Forest/Nature | Greens, browns, sky blue |
| Desert/Adventure | Sand, orange, terracotta |
| Ice/Winter | White, light blue, silver |
| Fire/Danger | Red, orange, yellow, black |
| Ocean/Water | Blues, teals, white foam |
| Night/Mystery | Dark purple, deep blue, silver |
| Cute/Kawaii | Pastels, pink, light blue, cream |

---

## Transparent Background Tips

### In Prompt

Always include one of:
- `transparent background`
- `transparent PNG`
- `no background`
- `isolated on transparent`

### Post-Processing (If Needed)

If Gemini doesn't produce clean transparency:

1. **remove.bg** - Best for complex subjects
2. **Pixelcut** - Great for pixel art, preserves hard edges
3. **Leonardo.AI** - Native transparency generation

### Pixelcut for Pixel Art

> "Their AI background remover is specifically designed to handle the unique look of pixel art. It automatically detects and removes the background in seconds, preserving the sharp, aliased edges of sprites and 8-bit designs."

---

## Common Mistakes to Avoid

### 1. Too Vague

```
❌ "A character sprite"
✅ "16-bit pixel art knight character sprite, idle pose, 64x64, transparent"
```

### 2. Missing Technical Specs

```
❌ "Pixel art sword"
✅ "Pixel art sword weapon sprite, 32x32 pixels, transparent background"
```

### 3. Conflicting Styles

```
❌ "Realistic pixel art" (contradiction)
✅ "Detailed 16-bit pixel art" or "Realistic painted style"
```

### 4. Forgetting Transparency

```
❌ "Game character sprite" (may have white background)
✅ "Game character sprite, transparent PNG background"
```

### 5. Unrealistic Size Requests

```
❌ "8-bit style sprite, 1024x1024 pixels" (too large for style)
✅ "8-bit style sprite, 32x32 pixels" (appropriate for style)
```

---

## Iteration Strategy

### First Pass: Core Concept
Generate basic sprite to verify style direction.

### Second Pass: Refine Details
Add specific details, colors, poses.

### Third Pass: Variations
Generate alternatives, pick best.

### Fourth Pass: Consistency
Use successful prompt as template for related assets.

---

## Style Consistency Across Assets

### 1. Create Style Reference
Generate main character first, save prompt as template.

### 2. Reference in Subsequent Prompts
```
Same art style as previous: 16-bit pixel art, 1px black outline,
[NEW SUBJECT], matching color palette
```

### 3. Start New Chat Strategically
- Same chat: Related assets (character + their items)
- New chat: Unrelated assets (character vs background)

### 4. Document Working Prompts
Save successful prompts in `art-style.json`:
```json
{
  "promptPrefix": "16-bit pixel art game sprite, 1px black outline, ",
  "colorPalette": ["#1a1c2c", "#5d275d", "#b13e53"],
  "sizeDefault": "64x64 pixels",
  "suffix": ", transparent background"
}
```

---

## Sources

- [How to Create Sprite Sheets with AI](https://lab.rosebud.ai/blog/how-to-create-a-sprite-sheet-with-ai)
- [AI Sprite Generator - Dzine](https://www.dzine.ai/tools/ai-sprite-generator/)
- [5 Best AI Pixel Art Generators in 2025](https://mspoweruser.com/ai-pixel-art-generator/)
- [PixelLab - AI Generator for Pixel Art](https://www.pixellab.ai/)
- [Pixelcut Pixel Art Transparent Background](https://www.pixelcut.ai/create/pixel-art-transparent-background)
- [OpenArt Sprite Generator](https://openart.ai/generator/sprite)
