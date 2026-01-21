# Asset Generator - API Reference

## Pipeline Phases

```
Phase 1: Analysis
  Read Code → Extract Assets → Build Manifest

Phase 2: Art Direction
  art-director → User Picks Style → Save Guide

Phase 3: Image Generation
  Character → Enemies → Items → Backgrounds → UI

Phase 4: Sound Generation
  SFX → Music → Ambient

Phase 5: Validation
  visual-validator → Style Cohesion → Integration Test
```

## Input Requirements

| Input | Source | Required |
|-------|--------|----------|
| Game source | `expo-games/apps/{game}/src/Game.tsx` | Yes |
| Project config | `projects/{game}/project.json` | Yes |
| Quality report | `projects/{game}/quality-report.json` | Yes |

## Output Specifications

| Output | Format | Location |
|--------|--------|----------|
| Art style guide | JSON | `projects/{game}/art-style.json` |
| Sprites | PNG | `expo-games/apps/{game}/assets/sprites/` |
| Sounds | MP3 | `expo-games/apps/{game}/assets/sounds/` |
| App icon | PNG | `expo-games/apps/{game}/assets/icon.png` |
| Manifest | JSON | `projects/{game}/asset-manifest.json` |

## Generation Priority

| Priority | Asset | Reason |
|----------|-------|--------|
| 1 | Player sprite | Style reference for others |
| 2 | Enemy sprites | Must contrast with player |
| 3 | Collectibles | Must pop against background |
| 4 | Power-ups | Visibility critical |
| 5 | Background | Built after sprites |
| 6 | Icon | Uses established style |

## Manifest Schema

```json
{
  "project": "block-blast",
  "generatedAt": "2026-01-09T12:00:00Z",
  "style": "Retro Pixel",
  "status": "complete",
  "images": [{
    "id": "sprite_player",
    "type": "sprite",
    "status": "complete",
    "path": "assets/sprites/player.png"
  }],
  "sounds": [{
    "id": "sound_tap",
    "type": "sfx",
    "status": "complete",
    "path": "assets/sounds/tap.mp3",
    "source": "kenney",
    "license": "CC0"
  }],
  "totals": {
    "images": 3,
    "sounds": 2,
    "complete": 5,
    "failed": 0
  }
}
```

## Error Recovery

| Error | Phase | Recovery |
|-------|-------|----------|
| Quality gates not met | 1 | Return to optimization |
| Art director failed | 4 | Retry or use default style |
| Image generation failed | 5 | Retry, then placeholder |
| Sound sourcing failed | 6 | Use placeholder |
| Validation failed | 7 | Regenerate flagged assets |
