# Art Director - Code Patterns

## Entity Extraction Pattern

```javascript
const entityPatterns = {
  player: /player|hero|character|avatar/i,
  enemy: /enemy|obstacle|hazard|threat/i,
  collectible: /coin|gem|star|collectible|pickup/i,
  powerup: /powerup|power-up|boost|ability/i,
  background: /background|backdrop|scene/i,
  ui: /score|button|menu|hud|ui/i
};
```

## Color Palettes by Style

```javascript
const palettesByStyle = {
  "Retro Pixel": {
    primary: "#1a1c2c",
    secondary: "#5d275d",
    accent: "#b13e53",
    highlight: "#ef7d57",
    background: "#ffcd75",
    text: "#ffffff"
  },
  "Modern Minimal": {
    primary: "#2d3436",
    secondary: "#636e72",
    accent: "#0984e3",
    highlight: "#00b894",
    background: "#ffffff",
    text: "#2d3436"
  },
  "Hand-Drawn": {
    primary: "#4a4a4a",
    secondary: "#8b7355",
    accent: "#e74c3c",
    highlight: "#f39c12",
    background: "#f5f0e1",
    text: "#2c2c2c"
  },
  "Neon Cyber": {
    primary: "#0a0a1a",
    secondary: "#1a1a3e",
    accent: "#ff00ff",
    highlight: "#00ffff",
    background: "#0f0f23",
    text: "#ffffff"
  },
  "Cute Kawaii": {
    primary: "#ffb6c1",
    secondary: "#87ceeb",
    accent: "#98fb98",
    highlight: "#fffacd",
    background: "#fff0f5",
    text: "#4a4a4a"
  }
};
```

## Prompt Prefixes

```javascript
const promptPrefixes = {
  "Retro Pixel": "16-bit pixel art game sprite, 1px black outline, retro arcade style, ",
  "Modern Minimal": "flat vector game asset, bold colors, clean geometric shapes, minimal shading, ",
  "Hand-Drawn": "hand-drawn sketch style game sprite, pencil texture, organic lines, ",
  "Neon Cyber": "neon glowing game sprite on dark background, cyberpunk style, bright edges, ",
  "Cute Kawaii": "cute kawaii game character, rounded shapes, pastel colors, friendly expression, "
};
```

## Style Guide Schema

```json
{
  "name": "Retro Pixel",
  "description": "16-bit pixel art with CRT nostalgic feel",
  "colors": {
    "primary": "#1a1c2c",
    "secondary": "#5d275d",
    "accent": "#b13e53",
    "highlight": "#ef7d57",
    "background": "#0f0f23",
    "text": "#ffffff"
  },
  "sprites": {
    "style": "16-bit pixel art",
    "outline": "1px black",
    "defaultSize": "64x64",
    "scalingMethod": "nearest-neighbor"
  },
  "background": {
    "style": "Parallax layers with scanline overlay",
    "layers": 3,
    "effects": ["scanlines", "vignette", "crt-curve"]
  },
  "ui": {
    "fontStyle": "Pixel/blocky",
    "buttonStyle": "Rounded rectangles with glow",
    "animations": ["bounce", "flash", "pulse"]
  },
  "sound": {
    "style": "8-bit chiptune",
    "searchTerms": ["8bit", "chiptune", "retro", "NES", "arcade"]
  },
  "promptPrefix": "16-bit pixel art game sprite, 1px black outline, retro arcade style, ",
  "promptSuffix": ", transparent background"
}
```

## Analysis Functions

```javascript
async function analyzeGame(projectPath) {
  const appTsx = await read(`${projectPath}/App.tsx`);
  const projectJson = await read(`projects/${projectName}/project.json`);

  return {
    entities: extractEntities(appTsx),
    mechanics: extractMechanics(appTsx),
    mood: inferMood(appTsx),
    currentColors: extractColors(appTsx),
    description: projectJson.description,
    genre: inferGenre(appTsx, projectJson)
  };
}
```
