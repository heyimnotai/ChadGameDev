# Art Director - API Reference

## Analysis Inputs

| File | Extract |
|------|---------|
| `App.tsx` | Entities, mechanics, interactions, current colors |
| `project.json` | Game name, description, genre hints |
| `known-issues.json` | Visual issues to address |
| Current screenshots | Placeholder art style |

## Mood Analysis Patterns

| Code Pattern | Inferred Mood |
|--------------|---------------|
| Fast timer, rapid scoring | Energetic, urgent |
| Relaxed pace, no timer | Calm, meditative |
| Lives system, game over | Challenging, tense |
| Stars/ratings | Achievement-focused |
| Combo multipliers | Exciting, rewarding |
| Simple tap mechanics | Casual, accessible |

## Default Style Options

| # | Style | Description | Best For |
|---|-------|-------------|----------|
| 1 | **Retro Pixel** | 16-bit pixel art, CRT nostalgic feel | Arcade, action |
| 2 | **Modern Minimal** | Flat design, bold colors, clean shapes | Puzzle, casual |
| 3 | **Hand-Drawn** | Sketchy lines, organic textures | Indie, artistic |
| 4 | **Neon Cyber** | Dark backgrounds, glowing edges | Fast-paced, tech |
| 5 | **Cute Kawaii** | Rounded shapes, pastels, friendly | Kids, casual |

## Genre-Specific Adaptations

**For Puzzle Games:**
- Replace Neon Cyber with "Soft Gradient" (smooth colors, gentle transitions)
- Emphasize clarity and readability

**For Action Games:**
- Replace Cute Kawaii with "Bold Comic" (strong outlines, dynamic poses)
- Emphasize impact and energy

**For Relaxation Games:**
- Replace Retro Pixel with "Watercolor" (soft edges, natural tones)
- Replace Neon Cyber with "Zen Minimal" (white space, muted palette)

## Genre to Style Emphasis

| Genre | Emphasize | De-emphasize |
|-------|-----------|--------------|
| Arcade/Action | Retro Pixel, Neon Cyber, Bold Comic | Watercolor, Zen Minimal |
| Puzzle/Match | Modern Minimal, Soft Gradient, Cute Kawaii | Neon Cyber, Bold Comic |
| Casual | Modern Minimal, Cute Kawaii, Hand-Drawn | Neon Cyber |
| Relaxation | Watercolor, Zen Minimal, Soft Gradient | Retro Pixel, Neon Cyber |
| Kids | Cute Kawaii, Hand-Drawn, Bold Colors | Neon Cyber, Retro Pixel |

## Mood to Color Temperature

| Mood | Color Temperature | Notes |
|------|-------------------|-------|
| Energetic/Fast | Warm (oranges, reds, yellows) | High contrast, saturated |
| Calm/Relaxing | Cool (blues, greens, purples) | Low contrast, muted/pastel |
| Challenging/Tense | Dark + bright accents | Red for danger, green for safety |
| Playful/Fun | Bright, varied | Rounded shapes, candy-colored |
| Mysterious | Dark, desaturated | Purple, blue, teal tones |
