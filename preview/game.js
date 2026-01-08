/**
 * Block Blast - Puzzle Game
 *
 * Place block shapes onto the grid to clear rows and columns.
 * Clear lines to score points and keep playing!
 */

class BlockBlast {
    constructor() {
        // Screen dimensions
        this.width = GameRenderer.SCREEN_WIDTH;
        this.height = GameRenderer.SCREEN_HEIGHT;

        // Safe areas
        this.safeTop = GameRenderer.SAFE_AREA.top;
        this.safeBottom = GameRenderer.SAFE_AREA.bottom;

        // Grid configuration
        this.gridSize = 8;
        this.cellSize = 120; // Size of each cell in pixels
        this.gridPadding = 30;

        // Calculate grid position (centered)
        this.gridWidth = this.gridSize * this.cellSize;
        this.gridHeight = this.gridSize * this.cellSize;
        this.gridX = (this.width - this.gridWidth) / 2;
        this.gridY = this.safeTop + 280;

        // Game state
        this.score = 0;
        this.highScore = 0;
        this.gameOver = false;
        this.grid = this.createEmptyGrid();
        this.comboCount = 0; // Track consecutive line clears

        // Block colors
        this.colors = [
            Color.cyan,
            Color.blue,
            Color.orange,
            Color.yellow,
            Color.green,
            Color.purple,
            Color.red
        ];

        // Available block shapes (relative positions)
        this.shapes = [
            // Single
            [[0, 0]],
            // Line 2
            [[0, 0], [1, 0]],
            [[0, 0], [0, 1]],
            // Line 3
            [[0, 0], [1, 0], [2, 0]],
            [[0, 0], [0, 1], [0, 2]],
            // Line 4
            [[0, 0], [1, 0], [2, 0], [3, 0]],
            [[0, 0], [0, 1], [0, 2], [0, 3]],
            // L shapes
            [[0, 0], [1, 0], [0, 1]],
            [[0, 0], [1, 0], [1, 1]],
            [[0, 0], [0, 1], [1, 1]],
            [[1, 0], [0, 1], [1, 1]],
            // Square
            [[0, 0], [1, 0], [0, 1], [1, 1]],
            // T shape
            [[0, 0], [1, 0], [2, 0], [1, 1]],
            // Big L
            [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]],
            // 3x3 square
            [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]]
        ];

        // Current draggable blocks
        this.blockSlots = [];
        this.selectedBlock = null;
        this.dragOffset = new Vector2(0, 0);

        // Shadow and ghost preview elements
        this.shadowNode = null;
        this.ghostCells = [];

        // Screen shake state
        this.shakeOffset = new Vector2(0, 0);
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.shakeElapsed = 0;

        // Floating score labels
        this.floatingLabels = [];

        // Combo UI elements
        this.comboLabel = null;
        this.gridGlow = null;

        // Create scene
        this.scene = new Scene({ width: this.width, height: this.height });
        this.scene.backgroundColor = new Color(0.08, 0.08, 0.12);

        // Particle emitter
        this.particles = new ParticleEmitter();
        this.particles.particleColor = Color.yellow;
        this.particles.particleSize = 18;
        this.particles.particleLifetime = 600;
        this.particles.particleSpeed = 400;
        this.particles.particleSpeedRange = 200;

        this.setupGame();
    }

    createEmptyGrid() {
        const grid = [];
        for (let y = 0; y < this.gridSize; y++) {
            grid[y] = [];
            for (let x = 0; x < this.gridSize; x++) {
                grid[y][x] = null;
            }
        }
        return grid;
    }

    setupGame() {
        this.createBackground();
        this.createUI();
        this.createGrid();
        this.spawnNewBlocks();
        this.scene.addChild(this.particles);
    }

    createBackground() {
        // Gradient background layers
        const colors = [
            new Color(0.05, 0.05, 0.10),
            new Color(0.08, 0.08, 0.14),
            new Color(0.06, 0.06, 0.11)
        ];

        const layerHeight = this.height / 3;
        for (let i = 0; i < 3; i++) {
            const bg = new SpriteNode(colors[i], { width: this.width, height: layerHeight + 10 });
            bg.position = new Vector2(this.width / 2, layerHeight * i + layerHeight / 2);
            bg.zPosition = -10;
            this.scene.addChild(bg);
        }
    }

    createUI() {
        // Title - explicitly set alignment to ensure centering
        this.titleLabel = new LabelNode('BLOCK BLAST');
        this.titleLabel.fontSize = 72;
        this.titleLabel.fontColor = Color.white;
        this.titleLabel.horizontalAlignment = 'center';
        this.titleLabel.position = new Vector2(this.width / 2, this.safeTop + 60);
        this.scene.addChild(this.titleLabel);

        // Score
        this.scoreLabel = new LabelNode('0');
        this.scoreLabel.fontSize = 120;
        this.scoreLabel.fontColor = Color.white;
        this.scoreLabel.position = new Vector2(this.width / 2, this.safeTop + 170);
        this.scene.addChild(this.scoreLabel);

        // High score
        this.highScoreLabel = new LabelNode('BEST: 0');
        this.highScoreLabel.fontSize = 36;
        this.highScoreLabel.fontColor = Color.gray;
        this.highScoreLabel.position = new Vector2(this.width / 2, this.safeTop + 240);
        this.scene.addChild(this.highScoreLabel);

        // Combo label (hidden initially)
        this.comboLabel = new LabelNode('');
        this.comboLabel.fontSize = 48;
        this.comboLabel.fontColor = Color.yellow;
        this.comboLabel.position = new Vector2(this.width / 2, this.safeTop + 210);
        this.comboLabel.isHidden = true;
        this.comboLabel.zPosition = 20;
        this.scene.addChild(this.comboLabel);

        // Game over label (hidden initially)
        this.gameOverLabel = new LabelNode('GAME OVER');
        this.gameOverLabel.fontSize = 96;
        this.gameOverLabel.fontColor = Color.red;
        this.gameOverLabel.position = new Vector2(this.width / 2, this.height / 2);
        this.gameOverLabel.isHidden = true;
        this.gameOverLabel.zPosition = 100;
        this.scene.addChild(this.gameOverLabel);

        // Tap to restart label
        this.restartLabel = new LabelNode('TAP TO RESTART');
        this.restartLabel.fontSize = 48;
        this.restartLabel.fontColor = Color.white.withOpacity(0.7);
        this.restartLabel.position = new Vector2(this.width / 2, this.height / 2 + 100);
        this.restartLabel.isHidden = true;
        this.restartLabel.zPosition = 100;
        this.scene.addChild(this.restartLabel);
    }

    createGrid() {
        // Grid glow (for combo feedback) - positioned behind the grid background
        this.gridGlow = new SpriteNode(Color.yellow.withOpacity(0), {
            width: this.gridWidth + this.gridPadding * 2 + 20,
            height: this.gridHeight + this.gridPadding * 2 + 20
        });
        this.gridGlow.cornerRadius = 32;
        this.gridGlow.position = new Vector2(
            this.gridX + this.gridWidth / 2,
            this.gridY + this.gridHeight / 2
        );
        this.gridGlow.zPosition = -1;
        this.scene.addChild(this.gridGlow);

        // Grid background
        const gridBg = new SpriteNode(new Color(0.12, 0.12, 0.18), {
            width: this.gridWidth + this.gridPadding * 2,
            height: this.gridHeight + this.gridPadding * 2
        });
        gridBg.cornerRadius = 24;
        gridBg.position = new Vector2(
            this.gridX + this.gridWidth / 2,
            this.gridY + this.gridHeight / 2
        );
        gridBg.zPosition = 0;
        this.scene.addChild(gridBg);

        // Grid cells
        this.gridCells = [];
        for (let y = 0; y < this.gridSize; y++) {
            this.gridCells[y] = [];
            for (let x = 0; x < this.gridSize; x++) {
                const cell = new SpriteNode(new Color(0.15, 0.15, 0.22), {
                    width: this.cellSize - 6,
                    height: this.cellSize - 6
                });
                cell.cornerRadius = 12;
                cell.position = new Vector2(
                    this.gridX + x * this.cellSize + this.cellSize / 2,
                    this.gridY + y * this.cellSize + this.cellSize / 2
                );
                cell.zPosition = 1;
                this.scene.addChild(cell);
                this.gridCells[y][x] = cell;
            }
        }

        // Placed blocks container (will hold colored blocks)
        this.placedBlocks = [];
    }

    spawnNewBlocks() {
        // Clear old block slots
        for (const slot of this.blockSlots) {
            if (slot.node) {
                slot.node.removeFromParent();
            }
        }
        this.blockSlots = [];

        // Spawn 3 new random blocks
        const slotY = this.gridY + this.gridHeight + 180;
        const slotSpacing = this.width / 4;

        for (let i = 0; i < 3; i++) {
            const shape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            const slotX = slotSpacing * (i + 1);

            const block = this.createBlockShape(shape, color, 0.6);
            block.position = new Vector2(slotX, slotY);
            block.zPosition = 10;
            this.scene.addChild(block);

            this.blockSlots.push({
                shape,
                color,
                node: block,
                originalPosition: new Vector2(slotX, slotY),
                placed: false,
                scale: 0.6
            });
        }
    }

    createBlockShape(shape, color, scale = 1) {
        const container = new Node();

        // Calculate bounds
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        for (const [x, y] of shape) {
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }

        const width = maxX - minX + 1;
        const height = maxY - minY + 1;
        const offsetX = -width * this.cellSize * scale / 2 + this.cellSize * scale / 2;
        const offsetY = -height * this.cellSize * scale / 2 + this.cellSize * scale / 2;

        for (const [x, y] of shape) {
            const cell = new SpriteNode(color, {
                width: (this.cellSize - 8) * scale,
                height: (this.cellSize - 8) * scale
            });
            cell.cornerRadius = 10 * scale;
            cell.position = new Vector2(
                (x - minX) * this.cellSize * scale + offsetX,
                (y - minY) * this.cellSize * scale + offsetY
            );
            container.addChild(cell);

            // Inner highlight
            const highlight = new SpriteNode(Color.white.withOpacity(0.2), {
                width: (this.cellSize - 24) * scale,
                height: (this.cellSize - 24) * scale
            });
            highlight.cornerRadius = 6 * scale;
            highlight.position = new Vector2(0, -4 * scale);
            cell.addChild(highlight);
        }

        container.shapeData = { shape, color, width, height };
        return container;
    }

    getGridPosition(screenX, screenY) {
        const gridLocalX = screenX - this.gridX;
        const gridLocalY = screenY - this.gridY;

        const cellX = Math.floor(gridLocalX / this.cellSize);
        const cellY = Math.floor(gridLocalY / this.cellSize);

        return { x: cellX, y: cellY };
    }

    createShadow(slot) {
        // Create a dark semi-transparent copy of the block for shadow effect
        const { shape, color } = slot;
        const shadowColor = Color.black.withOpacity(0.3);
        const container = new Node();

        // Calculate bounds (same as createBlockShape)
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        for (const [x, y] of shape) {
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }

        const width = maxX - minX + 1;
        const height = maxY - minY + 1;
        const scale = 1; // Shadow uses full scale when picked up
        const offsetX = -width * this.cellSize * scale / 2 + this.cellSize * scale / 2;
        const offsetY = -height * this.cellSize * scale / 2 + this.cellSize * scale / 2;

        for (const [x, y] of shape) {
            const cell = new SpriteNode(shadowColor, {
                width: (this.cellSize - 8) * scale,
                height: (this.cellSize - 8) * scale
            });
            cell.cornerRadius = 10 * scale;
            cell.position = new Vector2(
                (x - minX) * this.cellSize * scale + offsetX,
                (y - minY) * this.cellSize * scale + offsetY
            );
            container.addChild(cell);
        }

        return container;
    }

    updateGhostPreview(slot, gridX, gridY) {
        // Clear existing ghost cells
        this.clearGhostCells();

        // Only show ghost if placement is valid
        if (!this.canPlaceBlock(slot.shape, gridX, gridY)) {
            return;
        }

        // Create ghost cells at ~30% opacity
        const ghostColor = slot.color.withOpacity(0.3);

        for (const [dx, dy] of slot.shape) {
            const x = gridX + dx;
            const y = gridY + dy;

            const ghostCell = new SpriteNode(ghostColor, {
                width: this.cellSize - 8,
                height: this.cellSize - 8
            });
            ghostCell.cornerRadius = 10;
            ghostCell.position = new Vector2(
                this.gridX + x * this.cellSize + this.cellSize / 2,
                this.gridY + y * this.cellSize + this.cellSize / 2
            );
            ghostCell.zPosition = 4; // Between grid cells (1) and placed blocks (5)
            this.scene.addChild(ghostCell);
            this.ghostCells.push(ghostCell);
        }
    }

    clearGhostCells() {
        for (const ghost of this.ghostCells) {
            ghost.removeFromParent();
        }
        this.ghostCells = [];
    }

    canPlaceBlock(shape, gridX, gridY) {
        for (const [dx, dy] of shape) {
            const x = gridX + dx;
            const y = gridY + dy;

            if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) {
                return false;
            }

            if (this.grid[y][x] !== null) {
                return false;
            }
        }
        return true;
    }

    placeBlock(slot, gridX, gridY) {
        const { shape, color } = slot;

        // Place each cell
        for (const [dx, dy] of shape) {
            const x = gridX + dx;
            const y = gridY + dy;

            this.grid[y][x] = color;

            // Create visual block
            const cell = new SpriteNode(color, {
                width: this.cellSize - 8,
                height: this.cellSize - 8
            });
            cell.cornerRadius = 10;
            cell.position = new Vector2(
                this.gridX + x * this.cellSize + this.cellSize / 2,
                this.gridY + y * this.cellSize + this.cellSize / 2
            );
            cell.zPosition = 5;
            cell.alpha = 0;
            this.scene.addChild(cell);
            this.placedBlocks.push({ node: cell, x, y });

            // Fade in animation
            const fadeIn = Action.fadeIn(150);
            this.scene.run(cell, fadeIn);
        }

        // Remove the slot
        slot.node.removeFromParent();
        slot.placed = true;

        // Add score for placing
        this.addScore(shape.length * 10);

        // Check for completed lines and update combo
        const linesCleared = this.checkAndClearLines();
        if (linesCleared) {
            this.comboCount++;
            this.updateComboUI();
        } else {
            // Reset combo when no lines cleared
            if (this.comboCount > 0) {
                this.hideComboUI();
            }
            this.comboCount = 0;
        }

        // Check if we need new blocks
        const allPlaced = this.blockSlots.every(s => s.placed);
        if (allPlaced) {
            setTimeout(() => this.spawnNewBlocks(), 300);
        }

        // Check for game over
        this.checkGameOver();

        HapticFeedback.impact('medium');
    }

    checkAndClearLines() {
        const rowsToClear = [];
        const colsToClear = [];

        // Check rows
        for (let y = 0; y < this.gridSize; y++) {
            let full = true;
            for (let x = 0; x < this.gridSize; x++) {
                if (this.grid[y][x] === null) {
                    full = false;
                    break;
                }
            }
            if (full) rowsToClear.push(y);
        }

        // Check columns
        for (let x = 0; x < this.gridSize; x++) {
            let full = true;
            for (let y = 0; y < this.gridSize; y++) {
                if (this.grid[y][x] === null) {
                    full = false;
                    break;
                }
            }
            if (full) colsToClear.push(x);
        }

        // Clear lines with animation
        const cellsToClear = new Set();

        for (const y of rowsToClear) {
            for (let x = 0; x < this.gridSize; x++) {
                cellsToClear.add(`${x},${y}`);
            }
        }

        for (const x of colsToClear) {
            for (let y = 0; y < this.gridSize; y++) {
                cellsToClear.add(`${x},${y}`);
            }
        }

        if (cellsToClear.size > 0) {
            // Score based on lines cleared with combo multiplier
            const linesCleared = rowsToClear.length + colsToClear.length;
            const bonus = linesCleared > 1 ? linesCleared * 50 : 0;
            const baseScore = cellsToClear.size * 20 + bonus;
            // Combo multiplier: comboCount will be incremented after this, so next combo is comboCount + 1
            const comboMultiplier = Math.max(1, this.comboCount + 1);
            const scoreGained = baseScore * comboMultiplier;
            this.addScore(scoreGained);

            // Screen shake on line clear - intensity scales with lines cleared
            const shakeIntensity = 6 + linesCleared * 2; // 6-10px based on lines
            this.screenShake(Math.min(shakeIntensity, 10), 250);

            // Collect colors from cells being cleared for particle colors
            const clearedColors = [];
            for (const key of cellsToClear) {
                const [x, y] = key.split(',').map(Number);
                const color = this.grid[y][x];
                if (color && !clearedColors.includes(color)) {
                    clearedColors.push(color);
                }
            }

            // Calculate center of cleared cells for floating score
            let centerX = 0, centerY = 0;

            // Clear cells
            for (const key of cellsToClear) {
                const [x, y] = key.split(',').map(Number);
                const cellColor = this.grid[y][x];
                this.grid[y][x] = null;

                const cellCenterX = this.gridX + x * this.cellSize + this.cellSize / 2;
                const cellCenterY = this.gridY + y * this.cellSize + this.cellSize / 2;
                centerX += cellCenterX;
                centerY += cellCenterY;

                // Enhanced particles at cleared cell
                // Burst 8-10 particles per cell with varied colors and sizes
                const particleCount = 8 + Math.floor(Math.random() * 3); // 8-10 particles
                this.particles.position = new Vector2(cellCenterX, cellCenterY);

                // Use the color of the cell being cleared, or pick random from cleared colors
                const particleColor = cellColor || (clearedColors.length > 0
                    ? clearedColors[Math.floor(Math.random() * clearedColors.length)]
                    : Color.yellow);

                // Temporarily set particle properties for variety
                const originalSize = this.particles.particleSize;
                for (let i = 0; i < particleCount; i++) {
                    // Randomize particle size (14-22px)
                    this.particles.particleSize = 14 + Math.random() * 8;
                    this.particles.particleColor = particleColor;
                    this.particles.burst(1);
                }
                this.particles.particleSize = originalSize;
            }

            // Create floating score text at center of cleared area
            centerX /= cellsToClear.size;
            centerY /= cellsToClear.size;
            // Show multiplier in floating text if combo is active
            const floatingText = comboMultiplier > 1 ? `+${scoreGained} x${comboMultiplier}` : `+${scoreGained}`;
            this.createFloatingScore(floatingText, new Vector2(centerX, centerY));

            // Remove visual blocks
            for (let i = this.placedBlocks.length - 1; i >= 0; i--) {
                const block = this.placedBlocks[i];
                if (cellsToClear.has(`${block.x},${block.y}`)) {
                    const fadeOut = Action.sequence([
                        Action.scaleTo(1.2, 100),
                        Action.fadeOut(150)
                    ]);
                    this.scene.run(block.node, fadeOut);
                    setTimeout(() => block.node.removeFromParent(), 300);
                    this.placedBlocks.splice(i, 1);
                }
            }

            HapticFeedback.notification('success');
            return true; // Lines were cleared
        }
        return false; // No lines cleared
    }

    checkGameOver() {
        // Check if any remaining block can be placed
        const remainingSlots = this.blockSlots.filter(s => !s.placed);

        for (const slot of remainingSlots) {
            for (let y = 0; y < this.gridSize; y++) {
                for (let x = 0; x < this.gridSize; x++) {
                    if (this.canPlaceBlock(slot.shape, x, y)) {
                        return; // At least one block can be placed
                    }
                }
            }
        }

        // No valid moves - game over
        if (remainingSlots.length > 0) {
            this.triggerGameOver();
        }
    }

    triggerGameOver() {
        this.gameOver = true;

        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreLabel.text = `BEST: ${this.highScore}`;
        }

        // Show game over UI
        this.gameOverLabel.isHidden = false;
        this.restartLabel.isHidden = false;

        // Animate
        this.gameOverLabel.scale = new Vector2(0.5, 0.5);
        const scaleUp = Action.scaleTo(1, 300);
        scaleUp.timingFunction = Action.easeOut;
        this.scene.run(this.gameOverLabel, scaleUp);

        HapticFeedback.notification('error');
    }

    addScore(points) {
        this.score += points;
        this.scoreLabel.text = this.score.toString();

        // Pop animation
        const pop = Action.sequence([
            Action.scaleTo(1.2, 100),
            Action.scaleTo(1, 150)
        ]);
        this.scene.run(this.scoreLabel, pop);
    }

    /**
     * Get combo color based on combo level
     */
    getComboColor(comboLevel) {
        if (comboLevel >= 4) {
            // Rainbow effect for 4x+ - cycle through colors
            const colors = [Color.red, new Color(1, 0.5, 0), Color.yellow, Color.green, Color.cyan, Color.purple];
            return colors[Math.floor(Date.now() / 200) % colors.length];
        } else if (comboLevel === 3) {
            return new Color(1, 0.5, 0); // Orange
        } else {
            return Color.yellow;
        }
    }

    /**
     * Update combo UI when combo increases
     */
    updateComboUI() {
        const comboLevel = this.comboCount + 1; // Will be incremented after checkAndClearLines

        if (comboLevel >= 2) {
            // Show combo label
            this.comboLabel.isHidden = false;
            this.comboLabel.text = `X${comboLevel} COMBO!`;

            // Set color based on combo level
            const comboColor = this.getComboColor(comboLevel);
            this.comboLabel.fontColor = comboColor;

            // Scale pop animation
            this.comboLabel.scale = new Vector2(0.5, 0.5);
            const popAnim = Action.sequence([
                Action.scaleTo(1.3, 100),
                Action.scaleTo(1, 150)
            ]);
            this.scene.run(this.comboLabel, popAnim);

            // Update grid glow
            this.updateGridGlow(comboColor);
        }
    }

    /**
     * Hide combo UI when combo breaks
     */
    hideComboUI() {
        // Fade out combo label
        const fadeOut = Action.fadeOut(300);
        this.scene.run(this.comboLabel, fadeOut);
        setTimeout(() => {
            this.comboLabel.isHidden = true;
            this.comboLabel.alpha = 1;
        }, 300);

        // Fade out grid glow
        this.hideGridGlow();
    }

    /**
     * Update grid glow color and visibility
     */
    updateGridGlow(color) {
        if (this.gridGlow) {
            this.gridGlow.color = color.withOpacity(0.4);
            // Pulse animation
            const pulse = Action.sequence([
                Action.fadeIn(150),
                Action.fadeTo(0.6, 200)
            ]);
            this.scene.run(this.gridGlow, pulse);
        }
    }

    /**
     * Hide the grid glow
     */
    hideGridGlow() {
        if (this.gridGlow) {
            const fadeOut = Action.fadeOut(300);
            this.scene.run(this.gridGlow, fadeOut);
        }
    }

    /**
     * Screen shake effect with sinusoidal decay
     * @param {number} intensity - Shake intensity in pixels (5-8 recommended)
     * @param {number} duration - Duration in milliseconds (200-300 recommended)
     */
    screenShake(intensity, duration) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
        this.shakeElapsed = 0;
    }

    /**
     * Create floating score text that animates upward and fades out
     * @param {string} text - Text to display (e.g., "+100")
     * @param {Vector2} position - Starting position
     */
    createFloatingScore(text, position) {
        const label = new LabelNode(text);
        label.fontSize = 60;
        label.fontColor = Color.white;
        label.position = new Vector2(position.x, position.y);
        label.zPosition = 90;
        this.scene.addChild(label);

        // Store for cleanup
        this.floatingLabels.push({
            node: label,
            startY: position.y,
            elapsed: 0,
            duration: 600
        });
    }

    updateScreenShake(deltaTime) {
        if (this.shakeElapsed < this.shakeDuration) {
            this.shakeElapsed += deltaTime;
            const progress = this.shakeElapsed / this.shakeDuration;
            // Ease out decay
            const decay = 1 - progress * progress;
            // Sinusoidal shake
            const frequency = 30; // Shake frequency
            const offsetX = Math.sin(this.shakeElapsed * frequency / 100) * this.shakeIntensity * decay;
            const offsetY = Math.cos(this.shakeElapsed * frequency / 100) * this.shakeIntensity * decay;
            this.shakeOffset = new Vector2(offsetX, offsetY);
        } else {
            this.shakeOffset = new Vector2(0, 0);
        }
    }

    updateFloatingLabels(deltaTime) {
        for (let i = this.floatingLabels.length - 1; i >= 0; i--) {
            const fl = this.floatingLabels[i];
            fl.elapsed += deltaTime;
            const progress = fl.elapsed / fl.duration;

            if (progress >= 1) {
                // Remove completed label
                fl.node.removeFromParent();
                this.floatingLabels.splice(i, 1);
            } else {
                // Ease out movement and fade
                const easeOut = 1 - (1 - progress) * (1 - progress);
                // Move up ~100px
                fl.node.position = new Vector2(
                    fl.node.position.x,
                    fl.startY - 100 * easeOut
                );
                // Fade out
                fl.node.alpha = 1 - easeOut;
            }
        }
    }

    handleTouch(type, x, y) {
        if (this.gameOver) {
            if (type === 'began') {
                this.restart();
            }
            return;
        }

        const touchPoint = new Vector2(x, y);

        if (type === 'began') {
            // Check if touching a block slot
            for (const slot of this.blockSlots) {
                if (slot.placed) continue;

                // Simple hit test
                const dist = touchPoint.distance(slot.node.position);
                if (dist < 150) {
                    this.selectedBlock = slot;
                    this.dragOffset = slot.node.position.subtract(touchPoint);

                    // Scale up when picked up
                    slot.node.scale = new Vector2(1.2, 1.2);
                    slot.node.zPosition = 50;

                    // Create and add drop shadow
                    this.shadowNode = this.createShadow(slot);
                    this.shadowNode.scale = new Vector2(1.2, 1.2);
                    this.shadowNode.zPosition = 49; // Just below the block
                    // Offset shadow down and right
                    this.shadowNode.position = slot.node.position.add(new Vector2(15, 15));
                    this.scene.addChild(this.shadowNode);

                    HapticFeedback.selection();
                    break;
                }
            }
        } else if (type === 'moved' && this.selectedBlock) {
            // Move block with touch
            const newPos = touchPoint.add(this.dragOffset);
            this.selectedBlock.node.position = newPos;

            // Update shadow position (offset down and right)
            if (this.shadowNode) {
                this.shadowNode.position = newPos.add(new Vector2(15, 15));
            }

            // Update ghost preview
            const gridPos = this.getGridPosition(newPos.x, newPos.y);
            this.updateGhostPreview(this.selectedBlock, gridPos.x, gridPos.y);
        } else if (type === 'ended' && this.selectedBlock) {
            // Clean up shadow
            if (this.shadowNode) {
                this.shadowNode.removeFromParent();
                this.shadowNode = null;
            }

            // Clean up ghost cells
            this.clearGhostCells();

            // Try to place block
            const gridPos = this.getGridPosition(
                this.selectedBlock.node.position.x,
                this.selectedBlock.node.position.y
            );

            if (this.canPlaceBlock(this.selectedBlock.shape, gridPos.x, gridPos.y)) {
                this.placeBlock(this.selectedBlock, gridPos.x, gridPos.y);
            } else {
                // Return to original position
                const moveBack = Action.moveTo(this.selectedBlock.originalPosition, 200);
                moveBack.timingFunction = Action.easeOut;
                this.scene.run(this.selectedBlock.node, moveBack);

                this.selectedBlock.node.scale = new Vector2(0.6, 0.6);
                this.selectedBlock.node.zPosition = 10;
            }

            this.selectedBlock = null;
        }
    }

    update(deltaTime) {
        this.scene.update(deltaTime);
        this.particles.update(deltaTime);
        this.updateScreenShake(deltaTime);
        this.updateFloatingLabels(deltaTime);
    }

    render(ctx, width, height) {
        // Apply screen shake offset
        ctx.save();
        ctx.translate(this.shakeOffset.x, this.shakeOffset.y);
        this.scene.render(ctx, width, height);
        ctx.restore();
    }

    getScore() {
        return this.score;
    }

    getObjectCount() {
        return this.scene.children.length + this.placedBlocks.length + this.particles.particles.length;
    }

    restart() {
        // Reset game state
        this.score = 0;
        this.scoreLabel.text = '0';
        this.gameOver = false;
        this.grid = this.createEmptyGrid();
        this.comboCount = 0;

        // Hide game over UI
        this.gameOverLabel.isHidden = true;
        this.restartLabel.isHidden = true;

        // Hide combo UI
        this.comboLabel.isHidden = true;
        this.hideGridGlow();

        // Clear placed blocks
        for (const block of this.placedBlocks) {
            block.node.removeFromParent();
        }
        this.placedBlocks = [];

        // Spawn new blocks
        this.spawnNewBlocks();
    }

    reset() {
        this.restart();
        this.highScore = 0;
        this.highScoreLabel.text = 'BEST: 0';
    }
}

// Initialize game
window.gameInstance = new BlockBlast();
window.preview.log('Block Blast game loaded!', 'info');
