---
name: art-director
description: Use when game reaches 90%+ quality on all core categories and is ready for asset generation. Triggers on quality gate unlock, analyzes game code, generates 5 style options with previews, saves chosen style to art-style.json.
---

# Art Director

## Purpose

Analyze game code to generate cohesive art direction with 5 distinct style options and preview images. Selected style becomes the style guide for all subsequent asset generation.

## When to Use

- All quality categories (Renders, Layout, Interaction, Logic, Polish) reach 90+
- No art-style.json exists yet (or regenerating)
- Called before image/sound generation begins

## Core Process

1. **Analyze Game**: Read App.tsx, extract entities, mechanics, mood, colors
2. **Infer Genre**: Map code patterns to game genre
3. **Generate 5 Styles**: Adapt base styles to match genre
4. **Create Previews**: Generate preview image for each style via Gemini
5. **User Selects**: Present options, user picks style
6. **Save Guide**: Write art-style.json with colors, prompts, sound style

## Key Rules

- Always generate exactly 5 style options
- Each style includes: color palette, prompt prefix, sound style
- Adapt styles to genre (don't offer Neon Cyber for relaxation games)
- Ensure sufficient color contrast (primary vs accent)
- Sound style must match visual style (pixel art = chiptune)

## Quick Reference

**Style Options**: Retro Pixel, Modern Minimal, Hand-Drawn, Neon Cyber, Cute Kawaii

**Output**: `projects/{game}/art-style.json` containing:
- Color palette (primary, secondary, accent, highlight, background, text)
- Sprite config (style, outline, size, scaling method)
- Prompt prefix/suffix for Gemini
- Sound search terms

See `references/code-patterns.md` for palette values and prompt templates.
See `references/api-reference.md` for genre mappings and mood analysis.

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `gemini-image-generator` | Uses style guide to generate sprites |
| `sound-sourcer` | Uses sound.searchTerms for audio |
| `asset-generator` | Orchestrates full pipeline |
| `visual-validator` | Validates assets match guide |
