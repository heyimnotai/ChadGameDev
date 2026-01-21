---
name: asset-generator
description: Use when all quality gates reach 90+ and game is ready for asset generation. Triggers on quality unlock. Orchestrates full pipeline: analyzes game, runs art-director, coordinates image/sound generation, validates output.
---

# Asset Generator (Orchestrator)

## Purpose

Orchestrate the complete asset generation pipeline. Analyzes game code, triggers style selection, coordinates image and sound generation, validates results for cohesion.

## When to Use

- All quality gates (Renders, Layout, Interaction, Logic, Polish) reach 90+
- User confirms readiness to generate assets
- No art-style.json exists (or regenerating)

## Core Process

1. **Verify Gates**: Confirm all quality categories at 90+
2. **Analyze Game**: Extract entities, events, genre from code
3. **Build Manifest**: List all needed images and sounds
4. **Art Direction**: Invoke art-director for style selection
5. **Generate Images**: Call gemini-image-generator in priority order
6. **Source Sounds**: Call sound-sourcer for each event
7. **Validate**: Run visual-validator for cohesion check
8. **Integrate**: Update game code to use new assets

## Key Rules

- Generate player sprite first (establishes style reference)
- Start new Gemini chat between unrelated images
- Track all asset statuses in manifest
- Retry failed generations before giving up
- Validate all assets match style guide
- Log attribution for any CC-BY sounds

## Quick Reference

**Generation Order**: Player > Enemies > Items > Background > Icon

**Quality Gate**: All categories must be 90+ before triggering

**Outputs**:
- `art-style.json` (style guide)
- `asset-manifest.json` (tracking)
- `assets/sprites/*.png`
- `assets/sounds/*.mp3`

See `references/code-patterns.md` for analysis and pipeline code.
See `references/api-reference.md` for manifest schema and error handling.

## Adjacent Skills

| Skill | Role in Pipeline |
|-------|------------------|
| `art-director` | Phase 4: Style selection |
| `gemini-image-generator` | Phase 5: Image generation |
| `sound-sourcer` | Phase 6: Sound sourcing |
| `visual-validator` | Phase 7: Quality validation |
