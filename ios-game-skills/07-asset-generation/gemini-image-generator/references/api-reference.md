# Gemini Image Generator - API Reference

## Input Requirements

| Input | Source | Required |
|-------|--------|----------|
| Asset type | Caller request | Yes |
| Asset description | Caller request | Yes |
| art-style.json | `projects/{game}/art-style.json` | Yes |
| Output path | Default or specified | Optional |

## Output Specifications

| Output | Format | Location |
|--------|--------|----------|
| Generated image | PNG (transparent) | `assets/sprites/` |
| Generation log | JSON | `assets/.generation-log.json` |

## Model Selection

| Use Case | Model | Why |
|----------|-------|-----|
| Production | gemini-3-pro-image | 4K resolution, consistency |
| Iterations | gemini-2.0-flash-exp | Faster, sufficient for testing |
| Fallback | gemini-2.5-flash-image | Balanced quality/speed |

## Asset Type Prompts

### Character Sprites
- Clear silhouette at 32x32
- No cut-off limbs
- Facing right, idle pose
- Matches style guide colors

### Enemy Sprites
- Visually distinct from player
- Menacing appearance
- Threat level readable

### Collectibles
- Simple recognizable shape
- Glowing/shiny effect
- 32x32 pixels

### Backgrounds
- 960x540 pixels landscape
- Parallax-friendly layers
- Game elements readable on top

### App Icons
- 1024x1024 square
- No transparency
- Readable at 60x60

### Sprite Sheets
- Horizontal row
- Consistent character across frames
- Same proportions per frame

## Error Recovery

| Error | Cause | Recovery |
|-------|-------|----------|
| Not logged in | Session expired | Prompt manual login |
| Image not generated | Prompt blocked | Revise prompt |
| Timeout | Slow generation | Retry with longer wait |
| Style mismatch | Ambiguous prompt | Add style keywords |

## Generation Log Schema

```json
{
  "generations": [{
    "id": "gen_001",
    "timestamp": "2026-01-09T10:30:00Z",
    "assetType": "sprite",
    "description": "player knight",
    "prompt": "16-bit pixel art...",
    "outputPath": "assets/sprites/player.png",
    "method": "web",
    "success": true,
    "postProcessing": ["transparency", "resize:64x64"]
  }]
}
```
