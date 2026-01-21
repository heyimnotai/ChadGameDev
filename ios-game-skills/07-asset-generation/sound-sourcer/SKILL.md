---
name: sound-sourcer
description: Use when sourcing game audio (SFX, music, ambient). Triggers when art-style.json exists with sound config. Searches open-source libraries first (Kenney, Freesound), falls back to AI generation (ElevenLabs, Suno).
---

# Sound Sourcer

## Purpose

Source game audio from open-source libraries first, then AI generation as fallback. Matches audio style to visual style using art-style.json sound configuration.

## When to Use

- art-style.json exists with sound configuration
- Sound assets requested (SFX, music, ambient)
- Called by asset-generator orchestrator

## Core Process

1. **Load Style**: Read sound config from art-style.json
2. **Build Queries**: Combine description with style search terms
3. **Search Local**: Check cached library first
4. **Search Kenney**: Check Kenney.nl packs (CC0)
5. **Search Freesound**: API search with CC0 filter
6. **AI Fallback**: Generate with ElevenLabs if not found
7. **Convert**: Ensure MP3 format for iOS compatibility
8. **Log**: Record source and license in .sound-log.json

## Key Rules

- Always search libraries before AI generation
- Only use CC0 or royalty-free licensed sounds
- Convert all sounds to MP3 for cross-platform
- Match sound style to visual style (pixel art = chiptune)
- Log all attributions for CC-BY sources
- Track licenses for compliance

## Quick Reference

**Search Priority**: Local cache > Kenney > Freesound > ElevenLabs > Suno

**Output Format**: MP3 (iOS/Android compatible)

**Style Mapping**:
- Retro Pixel = 8-bit chiptune
- Modern Minimal = Minimal electronic
- Neon Cyber = Synthwave
- Cute Kawaii = Cute playful

See `references/code-patterns.md` for search and generation code.
See `references/api-reference.md` for sound mappings and event types.

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `art-director` | Provides sound style config |
| `asset-generator` | Orchestrates calling this skill |
| `gemini-image-generator` | Parallel skill for visuals |
