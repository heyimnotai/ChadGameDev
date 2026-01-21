# Visual Validator - API Reference

## Validation Categories

| Category | Weight | Description |
|----------|--------|-------------|
| Color Adherence | 25% | Colors match palette |
| Size Compliance | 20% | Correct dimensions |
| Transparency | 15% | Proper alpha channel |
| Style Match | 25% | Matches style description |
| Cohesion | 15% | Assets work together |

## Quality Thresholds

| Score | Status | Action |
|-------|--------|--------|
| 90-100 | Excellent | Ship ready |
| 80-89 | Good | Minor fixes recommended |
| 60-79 | Acceptable | Review issues |
| 40-59 | Poor | Regenerate problem assets |
| 0-39 | Failed | Full regeneration needed |

## Per-Asset Checks

- Correct file format (PNG)
- Correct dimensions
- Proper transparency (if required)
- Colors within palette tolerance
- Style-specific requirements (pixel art = no anti-aliasing)

## Cross-Asset Checks

- Consistent brightness levels
- Sprites contrast with background (20% minimum)
- Outline style consistent
- Color palette usage consistent

## Validation Report Schema

```json
{
  "project": "block-blast",
  "timestamp": "2026-01-09T13:00:00Z",
  "passed": true,
  "categories": {
    "colorAdherence": { "passed": true, "score": 95 },
    "sizeCompliance": { "passed": true, "score": 100 },
    "transparency": { "passed": true, "score": 100 },
    "styleMatch": { "passed": true, "score": 85 },
    "cohesion": { "passed": true, "score": 90 }
  },
  "overallScore": 93.5,
  "issues": [{
    "asset": "sprite_enemy",
    "type": "missing_outline",
    "severity": "medium"
  }],
  "autoFixable": []
}
```

## Auto-Fixable Issues

| Issue Type | Fix Method |
|------------|------------|
| size_mismatch | Resize with ImageMagick |
| missing_transparency | Remove white background |
| unused_transparency | Add fuzz transparent |
| color_mismatch | Remap to palette |

## Style-Specific Checks

**Pixel Art**:
- No anti-aliasing (color count check)
- Nearest-neighbor scaling
- 1px outline if specified

**Modern Minimal**:
- Clean edges
- Limited color palette
- No gradients (unless specified)
