---
name: asset-pipeline
description: Use when preparing textures, audio, asset catalogs, on-demand resources, or optimizing app size. Triggers on asset compression decisions, file format selection, or app thinning requirements.
---

# Asset Pipeline

## Purpose

Prepare and manage game assets optimally for iOS delivery: texture compression, audio formats, asset catalog organization, on-demand resources, and app thinning.

## When to Use

- Preparing texture atlases for iOS
- Converting audio to CAF/AAC formats
- Setting up asset catalogs
- Implementing on-demand resources
- Optimizing download/install size

## Core Process

1. Create organized asset catalog structure (by usage, not globally)
2. Set compression type in Contents.json (`gpu-optimized-best`)
3. Provide @1x, @2x, @3x image variants
4. Convert SFX to CAF (Linear PCM or IMA4)
5. Convert music to AAC (.m4a)
6. Tag assets for on-demand resources (if >200MB)
7. Validate with `validate_assets.sh` before build

## Key Rules

- **Textures**: Max 4096x4096, use ASTC 4x4 for UI, ASTC 8x8 for backgrounds
- **SFX**: CAF format, 44.1kHz/48kHz, mono, <20ms latency for critical sounds
- **Music**: AAC 256kbps stereo, streaming for >30s
- **ODR**: Initial install <200MB, prefetch after level 3

## Quick Reference

### Texture Compression

| Use Case | Format | Quality |
|----------|--------|---------|
| UI/characters | ASTC 4x4 | Highest |
| Detailed backgrounds | ASTC 6x6 | High |
| Large fills/skybox | ASTC 10x10 | Low |

### Audio Format

| Type | Format | Command |
|------|--------|---------|
| Critical SFX (<0.5s) | Linear PCM | `afconvert -f caff -d LEI16@44100 -c 1` |
| Standard SFX | IMA4 | `afconvert -f AIFC -d ima4 -c 1` |
| Music | AAC 256k | `afconvert -f m4af -d aac -b 256000` |

### Asset Catalog Structure

```
Assets.xcassets/
  UI/
    Buttons.spriteatlas/
  Characters/
    Player.spriteatlas/
  Environment/
    Level1.spriteatlas/
```

## Anti-Patterns

**Uncompressed textures**: Use ASTC, not raw PNG
**Shipping WAV files**: Convert to CAF or AAC
**One giant atlas**: Organize by usage for memory efficiency
**All assets at install**: Use ODR for level-specific content

## Adjacent Skills

- `spritekit-patterns` - Using atlases in code
- `performance-optimizer` - Memory management
- `audio-designer` - Audio playback implementation

## References

See `references/code-patterns.md` for scripts and implementation.
See `references/api-reference.md` for format specifications.
