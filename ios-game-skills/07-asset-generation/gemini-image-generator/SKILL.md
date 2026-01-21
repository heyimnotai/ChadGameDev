---
name: gemini-image-generator
description: Use when generating game sprites, backgrounds, icons, or UI assets. Triggers when art-style.json exists and image assets are needed. Supports web automation (free quota) and API fallback.
---

# Gemini Image Generator

## Purpose

Generate game assets using Gemini AI while maintaining visual consistency through art-style.json. Primary method is web automation via Playwright to preserve free quota.

## When to Use

- art-style.json exists for the project
- Asset generation requested (sprites, backgrounds, icons, UI)
- Called by asset-generator orchestrator

## Core Process

1. **Load Style**: Read art-style.json for prompt prefix/suffix, colors
2. **Build Prompt**: Combine asset description with style template
3. **Generate**: Use Playwright to interact with gemini.google.com
4. **Post-Process**: Ensure transparency, resize if needed
5. **Log**: Record generation in .generation-log.json
6. **New Chat**: Start fresh Gemini chat between unrelated assets

## Key Rules

- Always include style prefix and suffix in prompts
- Specify exact pixel dimensions in prompt
- Request transparent background for sprites
- Start new chat between unrelated assets (prevents style bleed)
- Fall back to API if web method fails 3 times
- Log all generations for debugging

## Quick Reference

**Asset Type Sizes**:
- Sprites: 64x64 (default) or as specified
- Backgrounds: 960x540
- Icons: 1024x1024
- Sprite sheets: 4 frames horizontal

**Generation Methods**:
1. Web (primary): Playwright + gemini.google.com
2. API (fallback): GEMINI_API_KEY required

See `references/code-patterns.md` for prompt templates and automation code.
See `references/api-reference.md` for asset specifications and error handling.

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `art-director` | Provides art-style.json |
| `asset-generator` | Orchestrates calling this skill |
| `visual-validator` | Validates generated assets |
| `sound-sourcer` | Parallel skill for audio |
