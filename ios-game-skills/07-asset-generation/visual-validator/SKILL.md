---
name: visual-validator
description: Use when validating generated assets match art-style.json specifications. Triggers after asset generation completes. Checks color palette adherence, dimensions, transparency, style consistency, and visual cohesion.
---

# Visual Validator

## Purpose

Validate all generated game assets match the art-style.json specifications. Checks color palette, dimensions, transparency, style consistency, and cross-asset cohesion. Reports issues and auto-fixes where possible.

## When to Use

- Asset generation phase completes
- Called by asset-generator orchestrator
- Manual validation requested

## Core Process

1. **Load Context**: Read art-style.json and asset-manifest.json
2. **Color Check**: Compare dominant colors to palette (ImageMagick)
3. **Size Check**: Verify dimensions match spec
4. **Transparency Check**: Verify alpha channel exists and is used
5. **Style Check**: Verify style-specific rules (e.g., no AA for pixel art)
6. **Cohesion Check**: Verify sprites contrast with background
7. **Auto-Fix**: Apply fixes for auto-fixable issues
8. **Report**: Generate validation-report.json

## Key Rules

- Pass threshold is 80+ overall score
- High-severity issues block shipping
- Auto-fix size and transparency issues
- Regenerate assets with unresolvable style issues
- Sprites must have 20%+ contrast with background
- Pixel art must not have anti-aliasing

## Quick Reference

**Categories** (weighted):
- Color Adherence: 25%
- Size Compliance: 20%
- Transparency: 15%
- Style Match: 25%
- Cohesion: 15%

**Pass**: 80+ score with no high-severity issues

**Auto-Fixable**: Size mismatch, missing transparency, color remapping

See `references/code-patterns.md` for validation and fix functions.
See `references/api-reference.md` for report schema and thresholds.

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `asset-generator` | Calls validator after generation |
| `gemini-image-generator` | Provides images to validate |
| `art-director` | Provides style guide to validate against |
