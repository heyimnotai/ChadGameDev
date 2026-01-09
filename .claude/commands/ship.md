# Ship Completed Game

Save a completed game to the chadcompletedGames repository for archival.

## Workflow

### 1. Select Game to Ship

Ask the user which game to ship:

```
Which game would you like to ship?

[List games from expo-games/apps/]
```

### 2. Verify Game is Ready

Check that the game has required files:

- [ ] `src/Game.tsx` exists
- [ ] `app.json` has proper metadata
- [ ] `assets/icon.png` exists (1024x1024)
- [ ] Game runs without errors

If missing required files, warn user and offer to continue anyway.

### 3. Clone/Update Completed Games Repo

```bash
# Clone or update the completed games repo
COMPLETED_REPO="/tmp/chadcompletedGames"
if [ -d "$COMPLETED_REPO" ]; then
  cd "$COMPLETED_REPO" && git pull
else
  git clone https://github.com/heyimnotai/chadcompletedGames.git "$COMPLETED_REPO"
fi
```

### 4. Copy Game to Repository

```bash
GAME_NAME="[selected-game]"
SOURCE="expo-games/apps/$GAME_NAME"
DEST="$COMPLETED_REPO/games/$GAME_NAME"

# Copy game files
rm -rf "$DEST"
cp -r "$SOURCE" "$DEST"

# Create game README if it doesn't exist
if [ ! -f "$DEST/README.md" ]; then
  # Generate README from app.json
fi
```

### 5. Update Main README

Update the games table in the main README.md:

```markdown
| [Game Name] | [Description from app.json] | Shipped |
```

### 6. Commit and Push

```bash
cd "$COMPLETED_REPO"
git add .
git commit -m "Ship: [game-name] - [brief description]"
git push origin main
```

### 7. Report Success

```
✅ Game shipped successfully!

Repository: https://github.com/heyimnotai/chadcompletedGames
Game: games/[game-name]/

The game is now archived in the completed games collection.
```

## Notes

- Games are copied, not moved (original stays in expo-games/apps/)
- Each ship overwrites the previous version of that game
- App Store submission should be done via `/submit` before shipping
