// Reset any previous game state
if (window.preview && window.preview.resetGameState) {
    window.preview.resetGameState();
}

/**
 * Hyper Tetris - Ultra-optimized, juicy Tetris game
 *
 * Core Loop:
 * ACTION: Rotate/move piece (instant response)
 * FEEDBACK: Visual/haptic within 16ms
 * REWARD: Line clear with celebration
 * PROGRESSION: Score accumulation, level increase
 */

class HyperTetris {
    constructor() {
        // Screen dimensions
        this.width = GameRenderer.SCREEN_WIDTH;
        this.height = GameRenderer.SCREEN_HEIGHT;
        this.safeTop = GameRenderer.SAFE_AREA.top;
        this.safeBottom = GameRenderer.SAFE_AREA.bottom;

        // Grid configuration - sized to fit iPhone 15 screen
        this.GRID_COLS = 10;
        this.GRID_ROWS = 20;
        // Calculate cell size to fit: available height = screen height - safe areas - UI space
        // Available: 2556 - 162(top safe) - 102(bottom safe) - 180(top UI) - 200(bottom space) = ~1912px
        this.CELL_SIZE = 90;
        this.GRID_WIDTH = this.GRID_COLS * this.CELL_SIZE; // 900px
        this.GRID_HEIGHT = this.GRID_ROWS * this.CELL_SIZE; // 1800px
        this.GRID_OFFSET_X = (this.width - this.GRID_WIDTH) / 2;
        this.GRID_OFFSET_Y = this.safeTop + 180;

        // Tetromino definitions
        this.TETROMINOES = {
            I: { shape: [[1,1,1,1]], color: Color.cyan },
            O: { shape: [[1,1],[1,1]], color: Color.yellow },
            T: { shape: [[0,1,0],[1,1,1]], color: Color.purple },
            S: { shape: [[0,1,1],[1,1,0]], color: Color.green },
            Z: { shape: [[1,1,0],[0,1,1]], color: Color.red },
            J: { shape: [[1,0,0],[1,1,1]], color: Color.blue },
            L: { shape: [[0,0,1],[1,1,1]], color: Color.orange }
        };
        this.PIECE_TYPES = Object.keys(this.TETROMINOES);

        // Game state
        this.gameState = 'playing';
        this.grid = [];
        this.currentPiece = null;
        this.currentPieceX = 0;
        this.currentPieceY = 0;
        this.currentPieceType = '';
        this.nextPieceType = '';
        this.heldPieceType = null;
        this.canHold = true; // Can only hold once per piece
        this.score = 0;
        this.level = 1;
        this.linesCleared = 0;
        this.dropTimer = 0;
        this.dropInterval = 1000;

        // Combo system
        this.combo = 0;
        this.comboTimer = 0;
        this.comboTimeout = 3000; // Reset combo after 3 seconds of no line clears
        this.maxCombo = 0;

        // Screen shake
        this.shakeTrauma = 0;
        this.shakeOffset = new Vector2(0, 0);

        // Visual feedback
        this.flashAlpha = 0;
        this.flashColor = Color.white;
        this.scorePopups = [];

        // Landing effect
        this.landingEffect = null; // { cells: [...], timer: 0, duration: 200 }

        // Piece pulse animation
        this.pulseTimer = 0;
        this.pulseSpeed = 3; // cycles per second

        // Spawn animation
        this.spawnAnimTimer = 0;
        this.spawnAnimDuration = 200; // ms

        // Danger zone (when stack is high)
        this.dangerLevel = 0; // 0-1, based on highest piece
        this.dangerPulse = 0; // Animation timer

        // Background animation
        this.bgTime = 0;

        // Line clear animation
        this.lineClearEffect = null; // { rows: [...], timer: 0, duration: 300 }

        // Motion trail for falling piece
        this.trailPositions = []; // Array of { x, y, alpha } for trail effect

        // Game statistics
        this.piecesPlayed = 0;
        this.perfectClears = 0;

        // Controls hint (first time help)
        this.showControlsHint = true;
        this.controlsHintAlpha = 1.0;

        // Soft drop state
        this.isSoftDropping = false;

        // Lock delay (grace period before piece locks)
        this.lockDelay = 500; // ms grace period when piece lands
        this.lockTimer = 0;
        this.isLanding = false;

        // Touch tracking
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchStartTime = 0;
        this.lastTapTime = 0;

        // Particle emitter
        this.particles = new ParticleEmitter();
        this.particles.particleLifetime = 800;
        this.particles.particleSize = 20;
        this.particles.particleSpeed = 400;
        this.particles.particleSpeedRange = 200;

        // Create scene for UI (transparent - we handle background ourselves)
        this.scene = new Scene({ width: this.width, height: this.height });
        this.scene.backgroundColor = new Color(0, 0, 0, 0); // Transparent

        this.setupGame();
    }

    setupGame() {
        // Load best score from localStorage
        this.bestScore = parseInt(localStorage.getItem('hyperTetrisBestScore') || '0');

        this.initGrid();
        this.createUI();
        this.updateBestScoreDisplay();
        this.nextPieceType = this.getRandomPieceType();
        this.spawnPiece();
    }

    updateBestScoreDisplay() {
        this.bestScoreGameLabel.text = `BEST: ${this.bestScore.toLocaleString()}`;
    }

    saveBestScore() {
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('hyperTetrisBestScore', this.bestScore.toString());
            this.updateBestScoreDisplay();
            return true; // New best!
        }
        return false;
    }

    initGrid() {
        this.grid = [];
        for (let row = 0; row < this.GRID_ROWS; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.GRID_COLS; col++) {
                this.grid[row][col] = null;
            }
        }
    }

    createUI() {
        // Score label
        this.scoreLabel = new LabelNode('SCORE');
        this.scoreLabel.fontSize = 42;
        this.scoreLabel.fontColor = Color.gray;
        this.scoreLabel.position = new Vector2(this.GRID_OFFSET_X + 20, this.safeTop + 40);
        this.scoreLabel.horizontalAlignment = 'left';
        this.scene.addChild(this.scoreLabel);

        this.scoreValueLabel = new LabelNode('0');
        this.scoreValueLabel.fontSize = 72;
        this.scoreValueLabel.fontColor = Color.white;
        this.scoreValueLabel.position = new Vector2(this.GRID_OFFSET_X + 20, this.safeTop + 110);
        this.scoreValueLabel.horizontalAlignment = 'left';
        this.scene.addChild(this.scoreValueLabel);

        // Best score label (small, below score)
        this.bestScoreGameLabel = new LabelNode('BEST: 0');
        this.bestScoreGameLabel.fontSize = 30;
        this.bestScoreGameLabel.fontColor = Color.yellow.withOpacity(0.6);
        this.bestScoreGameLabel.position = new Vector2(this.GRID_OFFSET_X + 20, this.safeTop + 150);
        this.bestScoreGameLabel.horizontalAlignment = 'left';
        this.scene.addChild(this.bestScoreGameLabel);

        // Level label
        this.levelLabel = new LabelNode('LEVEL 1');
        this.levelLabel.fontSize = 42;
        this.levelLabel.fontColor = Color.cyan;
        this.levelLabel.position = new Vector2(this.width - this.GRID_OFFSET_X - 20, this.safeTop + 40);
        this.levelLabel.horizontalAlignment = 'right';
        this.scene.addChild(this.levelLabel);

        // Lines counter
        this.linesLabel = new LabelNode('LINES: 0');
        this.linesLabel.fontSize = 36;
        this.linesLabel.fontColor = Color.green;
        this.linesLabel.position = new Vector2(this.width - this.GRID_OFFSET_X - 20, this.safeTop + 100);
        this.linesLabel.horizontalAlignment = 'right';
        this.scene.addChild(this.linesLabel);

        // Combo indicator (shown below score, hidden when no combo)
        this.comboLabel = new LabelNode('');
        this.comboLabel.fontSize = 48;
        this.comboLabel.fontColor = Color.orange;
        this.comboLabel.position = new Vector2(this.GRID_OFFSET_X + 20, this.safeTop + 160);
        this.comboLabel.horizontalAlignment = 'left';
        this.comboLabel.isHidden = true;
        this.scene.addChild(this.comboLabel);

        // Hold label (left side)
        this.holdLabel = new LabelNode('HOLD');
        this.holdLabel.fontSize = 36;
        this.holdLabel.fontColor = Color.gray;
        this.holdLabel.position = new Vector2(this.GRID_OFFSET_X + 20, this.GRID_OFFSET_Y + this.GRID_HEIGHT + 80);
        this.holdLabel.horizontalAlignment = 'left';
        this.scene.addChild(this.holdLabel);

        // Hold piece preview container
        this.holdPiecePreview = new Node();
        this.holdPiecePreview.position = new Vector2(this.GRID_OFFSET_X + 20, this.GRID_OFFSET_Y + this.GRID_HEIGHT + 130);
        this.scene.addChild(this.holdPiecePreview);

        // Next label
        this.nextLabel = new LabelNode('NEXT');
        this.nextLabel.fontSize = 36;
        this.nextLabel.fontColor = Color.gray;
        this.nextLabel.position = new Vector2(this.width - this.GRID_OFFSET_X - 20, this.GRID_OFFSET_Y + this.GRID_HEIGHT + 80);
        this.nextLabel.horizontalAlignment = 'right';
        this.scene.addChild(this.nextLabel);

        // Next piece preview container
        this.nextPiecePreview = new Node();
        this.nextPiecePreview.position = new Vector2(this.width - this.GRID_OFFSET_X - 140, this.GRID_OFFSET_Y + this.GRID_HEIGHT + 130);
        this.scene.addChild(this.nextPiecePreview);

        // Game Over overlay
        this.gameOverOverlay = new SpriteNode(new Color(0, 0, 0, 0.8), { width: this.width, height: this.height });
        this.gameOverOverlay.anchorPoint = { x: 0, y: 0 };
        this.gameOverOverlay.position = new Vector2(0, 0);
        this.gameOverOverlay.isHidden = true;
        this.gameOverOverlay.zPosition = 100;
        this.scene.addChild(this.gameOverOverlay);

        this.gameOverLabel = new LabelNode('GAME OVER');
        this.gameOverLabel.fontSize = 96;
        this.gameOverLabel.fontColor = Color.red;
        this.gameOverLabel.position = new Vector2(this.width / 2, this.height / 2 - 300);
        this.gameOverOverlay.addChild(this.gameOverLabel);

        this.finalScoreLabel = new LabelNode('Score: 0');
        this.finalScoreLabel.fontSize = 72;
        this.finalScoreLabel.fontColor = Color.white;
        this.finalScoreLabel.position = new Vector2(this.width / 2, this.height / 2 - 150);
        this.gameOverOverlay.addChild(this.finalScoreLabel);

        this.bestScoreLabel = new LabelNode('Best: 0');
        this.bestScoreLabel.fontSize = 48;
        this.bestScoreLabel.fontColor = Color.yellow;
        this.bestScoreLabel.position = new Vector2(this.width / 2, this.height / 2 - 60);
        this.gameOverOverlay.addChild(this.bestScoreLabel);

        this.statsLabel = new LabelNode('Lines: 0  |  Level: 1');
        this.statsLabel.fontSize = 42;
        this.statsLabel.fontColor = Color.gray;
        this.statsLabel.position = new Vector2(this.width / 2, this.height / 2 + 30);
        this.gameOverOverlay.addChild(this.statsLabel);

        this.newBestLabel = new LabelNode('NEW BEST!');
        this.newBestLabel.fontSize = 54;
        this.newBestLabel.fontColor = Color.green;
        this.newBestLabel.position = new Vector2(this.width / 2, this.height / 2 + 120);
        this.newBestLabel.isHidden = true;
        this.gameOverOverlay.addChild(this.newBestLabel);

        this.restartLabel = new LabelNode('TAP TO RESTART');
        this.restartLabel.fontSize = 48;
        this.restartLabel.fontColor = Color.cyan;
        this.restartLabel.position = new Vector2(this.width / 2, this.height / 2 + 220);
        this.gameOverOverlay.addChild(this.restartLabel);
    }

    getRandomPieceType() {
        return this.PIECE_TYPES[Math.floor(Math.random() * this.PIECE_TYPES.length)];
    }

    spawnPiece() {
        this.currentPieceType = this.nextPieceType || this.getRandomPieceType();
        this.nextPieceType = this.getRandomPieceType();
        this.currentPiece = this.TETROMINOES[this.currentPieceType].shape.map(row => [...row]);
        this.currentPieceX = Math.floor((this.GRID_COLS - this.currentPiece[0].length) / 2);
        this.currentPieceY = 0;

        // Start spawn animation
        this.spawnAnimTimer = 0;

        // Clear motion trail
        this.trailPositions = [];

        // Reset hold ability for new piece
        this.canHold = true;
        this.updateHoldPiecePreview();

        this.updateNextPiecePreview();

        if (!this.isValidPosition(this.currentPiece, this.currentPieceX, this.currentPieceY)) {
            this.triggerGameOver();
        }
    }

    updateNextPiecePreview() {
        while (this.nextPiecePreview.children.length > 0) {
            this.nextPiecePreview.children[0].removeFromParent();
        }

        const nextPiece = this.TETROMINOES[this.nextPieceType];
        const shape = nextPiece.shape;
        const previewCellSize = 50;

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const cell = new SpriteNode(nextPiece.color, { width: previewCellSize - 4, height: previewCellSize - 4 });
                    cell.position = new Vector2(col * previewCellSize, row * previewCellSize);
                    cell.cornerRadius = 8;
                    this.nextPiecePreview.addChild(cell);
                }
            }
        }
    }

    updateHoldPiecePreview() {
        while (this.holdPiecePreview.children.length > 0) {
            this.holdPiecePreview.children[0].removeFromParent();
        }

        if (!this.heldPieceType) return;

        const holdPiece = this.TETROMINOES[this.heldPieceType];
        const shape = holdPiece.shape;
        const previewCellSize = 50;
        // Dim the hold piece if we can't use it yet
        const alpha = this.canHold ? 1.0 : 0.4;

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const cell = new SpriteNode(holdPiece.color.withOpacity(alpha), { width: previewCellSize - 4, height: previewCellSize - 4 });
                    cell.position = new Vector2(col * previewCellSize, row * previewCellSize);
                    cell.cornerRadius = 8;
                    this.holdPiecePreview.addChild(cell);
                }
            }
        }
    }

    holdPiece() {
        if (!this.canHold || this.gameState !== 'playing') return;

        HapticFeedback.impact('light');
        this.canHold = false;

        if (this.heldPieceType === null) {
            // First hold - just store current piece and spawn new
            this.heldPieceType = this.currentPieceType;
            this.spawnPiece();
        } else {
            // Swap current piece with held piece
            const temp = this.currentPieceType;
            this.currentPieceType = this.heldPieceType;
            this.heldPieceType = temp;

            // Reset current piece position
            this.currentPiece = this.TETROMINOES[this.currentPieceType].shape.map(row => [...row]);
            this.currentPieceX = Math.floor((this.GRID_COLS - this.currentPiece[0].length) / 2);
            this.currentPieceY = 0;
            this.spawnAnimTimer = 0;
        }

        this.updateHoldPiecePreview();
    }

    isValidPosition(piece, x, y) {
        for (let row = 0; row < piece.length; row++) {
            for (let col = 0; col < piece[row].length; col++) {
                if (piece[row][col]) {
                    const newX = x + col;
                    const newY = y + row;

                    if (newX < 0 || newX >= this.GRID_COLS || newY >= this.GRID_ROWS) {
                        return false;
                    }

                    if (newY >= 0 && this.grid[newY][newX]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    rotatePiece() {
        const rotated = this.currentPiece[0].map((_, i) =>
            this.currentPiece.map(row => row[i]).reverse()
        );

        const kicks = [0, -1, 1, -2, 2];
        for (const kick of kicks) {
            if (this.isValidPosition(rotated, this.currentPieceX + kick, this.currentPieceY)) {
                this.currentPiece = rotated;
                this.currentPieceX += kick;
                // Reset lock timer on rotate (gives player more time)
                if (this.isLanding) {
                    this.lockTimer = 0;
                }
                HapticFeedback.impact('light');
                return;
            }
        }
    }

    movePiece(dx) {
        if (this.isValidPosition(this.currentPiece, this.currentPieceX + dx, this.currentPieceY)) {
            this.currentPieceX += dx;
            // Reset lock timer on move (gives player more time to adjust)
            if (this.isLanding) {
                this.lockTimer = 0;
            }
            HapticFeedback.selection();
        }
    }

    dropPiece() {
        if (this.isValidPosition(this.currentPiece, this.currentPieceX, this.currentPieceY + 1)) {
            // Add trail position
            this.addTrailPosition();
            this.currentPieceY++;
            return true;
        }
        return false;
    }

    addTrailPosition() {
        // Add current position to trail
        this.trailPositions.unshift({
            x: this.currentPieceX,
            y: this.currentPieceY,
            alpha: 0.4,
            type: this.currentPieceType
        });
        // Keep only last 3 trail positions
        if (this.trailPositions.length > 3) {
            this.trailPositions.pop();
        }
    }

    updateTrail() {
        // Fade out trail positions
        for (let i = this.trailPositions.length - 1; i >= 0; i--) {
            this.trailPositions[i].alpha -= 0.03;
            if (this.trailPositions[i].alpha <= 0) {
                this.trailPositions.splice(i, 1);
            }
        }
    }

    hardDrop() {
        let dropDistance = 0;
        while (this.isValidPosition(this.currentPiece, this.currentPieceX, this.currentPieceY + 1)) {
            this.addTrailPosition();
            this.currentPieceY++;
            dropDistance++;
        }
        if (dropDistance > 0) {
            this.score += dropDistance * 2;
            HapticFeedback.impact('heavy');
            this.shakeTrauma = Math.min(this.shakeTrauma + 0.3, 1.0);
            this.flashAlpha = 0.3;
            this.flashColor = Color.white;
        }
        this.lockPiece();
    }

    lockPiece() {
        const pieceColor = this.TETROMINOES[this.currentPieceType].color;

        // Collect cells for landing animation
        const landedCells = [];

        for (let row = 0; row < this.currentPiece.length; row++) {
            for (let col = 0; col < this.currentPiece[row].length; col++) {
                if (this.currentPiece[row][col]) {
                    const gridY = this.currentPieceY + row;
                    const gridX = this.currentPieceX + col;
                    if (gridY >= 0) {
                        this.grid[gridY][gridX] = pieceColor;
                        landedCells.push({ x: gridX, y: gridY, color: pieceColor });
                    }
                }
            }
        }

        // Start landing effect
        this.landingEffect = {
            cells: landedCells,
            timer: 0,
            duration: 150
        };

        // Increment pieces played counter
        this.piecesPlayed++;

        // Small particle burst at landing
        for (const cell of landedCells) {
            this.particles.position = new Vector2(
                this.GRID_OFFSET_X + cell.x * this.CELL_SIZE + this.CELL_SIZE / 2,
                this.GRID_OFFSET_Y + cell.y * this.CELL_SIZE + this.CELL_SIZE / 2
            );
            this.particles.particleColor = pieceColor;
            this.particles.particleSize = 10;
            this.particles.particleSpeed = 100;
            this.particles.burst(3);
        }

        HapticFeedback.impact('medium');
        this.shakeTrauma = Math.min(this.shakeTrauma + 0.15, 1.0);
        this.checkLines();
        this.spawnPiece();
    }

    checkLines() {
        const linesToClear = [];

        for (let row = this.GRID_ROWS - 1; row >= 0; row--) {
            let full = true;
            for (let col = 0; col < this.GRID_COLS; col++) {
                if (!this.grid[row][col]) {
                    full = false;
                    break;
                }
            }
            if (full) {
                linesToClear.push(row);
            }
        }

        if (linesToClear.length > 0) {
            // Increment combo
            this.combo++;
            this.comboTimer = 0;
            if (this.combo > this.maxCombo) {
                this.maxCombo = this.combo;
            }

            // Start line clear visual effect
            this.lineClearEffect = {
                rows: [...linesToClear],
                timer: 0,
                duration: 200
            };

            this.triggerLineClearFeedback(linesToClear);

            for (const row of linesToClear) {
                this.grid.splice(row, 1);
                this.grid.unshift(new Array(this.GRID_COLS).fill(null));
            }

            // Score with combo multiplier
            const lineScores = [0, 100, 300, 500, 800];
            const baseScore = lineScores[linesToClear.length] * this.level;
            const comboMultiplier = 1 + (this.combo - 1) * 0.5; // 1x, 1.5x, 2x, 2.5x...
            const finalScore = Math.floor(baseScore * comboMultiplier);
            this.score += finalScore;
            this.linesCleared += linesToClear.length;

            // Show special text for line clears
            if (linesToClear.length === 4) {
                // TETRIS! - 4 lines
                this.addScorePopup('TETRIS!', linesToClear[0] - 1, Color.cyan);
                this.shakeTrauma = Math.min(this.shakeTrauma + 0.4, 1.0);
            } else if (linesToClear.length === 3) {
                this.addScorePopup('TRIPLE!', linesToClear[0] - 1, Color.magenta);
            } else if (linesToClear.length === 2) {
                this.addScorePopup('DOUBLE!', linesToClear[0] - 1, Color.yellow);
            }

            // Show combo popup if combo > 1
            if (this.combo > 1) {
                this.addScorePopup(`${this.combo}x COMBO!`, linesToClear[0] - 3, Color.orange);
            }

            const newLevel = Math.floor(this.linesCleared / 10) + 1;
            if (newLevel > this.level) {
                this.level = newLevel;
                this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
                this.levelLabel.text = `LEVEL ${this.level}`;
                this.triggerLevelUpFeedback();
            }

            // Check for perfect clear (all cells empty)
            this.checkPerfectClear();

            this.updateScoreDisplay();
        }
    }

    checkPerfectClear() {
        // Check if grid is completely empty
        for (let row = 0; row < this.GRID_ROWS; row++) {
            for (let col = 0; col < this.GRID_COLS; col++) {
                if (this.grid[row][col]) {
                    return; // Not empty
                }
            }
        }

        // PERFECT CLEAR!
        this.perfectClears++;
        const perfectBonus = 1000 * this.level;
        this.score += perfectBonus;

        // Big celebration
        this.addScorePopup('PERFECT CLEAR!', 8, Color.green);
        this.addScorePopup(`+${perfectBonus}`, 10, Color.yellow);
        this.shakeTrauma = 1.0;
        this.flashAlpha = 0.8;
        this.flashColor = Color.green;
        HapticFeedback.notification('success');

        // Particle explosion from center
        for (let i = 0; i < 30; i++) {
            this.particles.position = new Vector2(
                this.GRID_OFFSET_X + this.GRID_WIDTH / 2 + (Math.random() - 0.5) * this.GRID_WIDTH,
                this.GRID_OFFSET_Y + this.GRID_HEIGHT / 2 + (Math.random() - 0.5) * this.GRID_HEIGHT
            );
            this.particles.particleColor = new Color(Math.random(), 1, Math.random());
            this.particles.particleSize = 15;
            this.particles.particleSpeed = 200;
            this.particles.burst(3);
        }
    }

    getGhostY() {
        let ghostY = this.currentPieceY;
        while (this.isValidPosition(this.currentPiece, this.currentPieceX, ghostY + 1)) {
            ghostY++;
        }
        return ghostY;
    }

    triggerLineClearFeedback(lines) {
        const intensity = lines.length / 4;
        HapticFeedback.notification('success');
        this.shakeTrauma = Math.min(this.shakeTrauma + 0.2 + intensity * 0.3, 1.0);

        this.flashAlpha = 0.2 + intensity * 0.3;
        this.flashColor = lines.length >= 4 ? Color.cyan : Color.white;

        for (const row of lines) {
            this.particles.position = new Vector2(
                this.GRID_OFFSET_X + this.GRID_WIDTH / 2,
                this.GRID_OFFSET_Y + row * this.CELL_SIZE + this.CELL_SIZE / 2
            );
            this.particles.particleColor = Color.cyan;
            this.particles.emissionAngle = 0;
            this.particles.emissionAngleRange = Math.PI * 2;
            this.particles.burst(20 + lines.length * 10);
        }

        const lineScores = [0, 100, 300, 500, 800];
        const points = lineScores[lines.length] * this.level;
        this.addScorePopup(points, lines[0]);

        if (lines.length >= 4) {
            this.triggerTetrisCelebration();
        }
    }

    triggerTetrisCelebration() {
        this.flashAlpha = 0.6;
        this.flashColor = Color.cyan;
        this.shakeTrauma = 1.0;

        const colors = [Color.cyan, Color.purple, Color.yellow, Color.green];
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.particles.position = new Vector2(
                    this.GRID_OFFSET_X + Math.random() * this.GRID_WIDTH,
                    this.GRID_OFFSET_Y + Math.random() * this.GRID_HEIGHT
                );
                this.particles.particleColor = colors[Math.floor(Math.random() * colors.length)];
                this.particles.burst(30);
            }, i * 100);
        }
    }

    triggerLevelUpFeedback() {
        HapticFeedback.notification('success');
        this.flashAlpha = 0.4;
        this.flashColor = Color.green;
        this.shakeTrauma = 0.5;
        this.addScorePopup('LEVEL UP!', 10, Color.green);
    }

    addScorePopup(text, row, color = Color.yellow) {
        this.scorePopups.push({
            text: String(text),
            x: this.GRID_OFFSET_X + this.GRID_WIDTH / 2,
            y: this.GRID_OFFSET_Y + row * this.CELL_SIZE,
            alpha: 1,
            scale: 1.5,
            color: color
        });
    }

    triggerGameOver() {
        this.gameState = 'gameover';
        this.gameOverOverlay.isHidden = false;

        // Update game over screen
        this.finalScoreLabel.text = `Score: ${this.score.toLocaleString()}`;
        // Enhanced stats with pieces and max combo
        let statsText = `Lines: ${this.linesCleared}  |  Level: ${this.level}`;
        if (this.maxCombo > 1) {
            statsText += `\nPieces: ${this.piecesPlayed}  |  Best Combo: ${this.maxCombo}x`;
        } else {
            statsText += `\nPieces: ${this.piecesPlayed}`;
        }
        this.statsLabel.text = statsText;

        // Check for new best score
        const isNewBest = this.saveBestScore();
        this.bestScoreLabel.text = `Best: ${this.bestScore.toLocaleString()}`;
        this.newBestLabel.isHidden = !isNewBest;

        if (isNewBest) {
            // Extra celebration for new best
            HapticFeedback.notification('success');
            this.flashAlpha = 0.6;
            this.flashColor = Color.green;
        } else {
            HapticFeedback.notification('error');
            this.flashAlpha = 0.5;
            this.flashColor = Color.red;
        }

        this.shakeTrauma = 0.8;
    }

    updateScoreDisplay() {
        this.scoreValueLabel.text = this.score.toLocaleString();
        this.linesLabel.text = `LINES: ${this.linesCleared}`;
    }

    restart() {
        this.initGrid();
        this.score = 0;
        this.level = 1;
        this.linesCleared = 0;
        this.dropInterval = 1000;
        this.dropTimer = 0;
        this.combo = 0;
        this.comboTimer = 0;
        this.maxCombo = 0;
        this.piecesPlayed = 0;
        this.perfectClears = 0;
        this.heldPieceType = null;
        this.canHold = true;
        this.gameState = 'playing';
        this.gameOverOverlay.isHidden = true;
        this.scorePopups = [];
        this.shakeTrauma = 0;
        this.landingEffect = null;
        this.nextPieceType = this.getRandomPieceType();
        this.spawnPiece();
        this.updateScoreDisplay();
        this.updateHoldPiecePreview();
        this.levelLabel.text = 'LEVEL 1';
    }

    handleTouch(type, x, y) {
        if (this.gameState === 'gameover') {
            if (type === 'began') {
                this.restart();
            }
            return;
        }

        if (type === 'began') {
            this.touchStartX = x;
            this.touchStartY = y;
            this.touchStartTime = Date.now();

            // Hide controls hint on first interaction
            if (this.showControlsHint) {
                this.showControlsHint = false;
            }
        } else if (type === 'ended') {
            if (this.gameState !== 'playing') return;

            const dx = x - this.touchStartX;
            const dy = y - this.touchStartY;
            const dt = Date.now() - this.touchStartTime;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 30 && dt < 300) {
                const now = Date.now();
                if (now - this.lastTapTime < 300) {
                    this.hardDrop();
                } else {
                    this.rotatePiece();
                }
                this.lastTapTime = now;
                return;
            }

            if (dist > 50) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    this.movePiece(dx > 0 ? 1 : -1);
                } else if (dy > 50) {
                    // Swipe down - enable soft drop mode
                    this.isSoftDropping = true;
                    if (this.dropPiece()) {
                        this.score += 1;
                        this.updateScoreDisplay();
                    }
                } else if (dy < -50) {
                    // Swipe up - hold piece
                    this.holdPiece();
                }
            }
        } else if (type === 'moved') {
            if (this.gameState !== 'playing') return;

            const dx = x - this.touchStartX;

            if (Math.abs(dx) > this.CELL_SIZE) {
                const moves = Math.floor(Math.abs(dx) / this.CELL_SIZE);
                const dir = dx > 0 ? 1 : -1;

                for (let i = 0; i < moves; i++) {
                    this.movePiece(dir);
                }

                this.touchStartX = x - (dx % this.CELL_SIZE);
            }
        }
    }

    update(deltaTime) {
        if (this.gameState === 'playing') {
            // Soft drop uses faster interval (50ms vs normal)
            const currentInterval = this.isSoftDropping ? 50 : this.dropInterval;
            this.dropTimer += deltaTime;
            if (this.dropTimer >= currentInterval) {
                this.dropTimer = 0;
                if (!this.dropPiece()) {
                    // Piece can't move down - start or continue lock delay
                    if (!this.isLanding) {
                        this.isLanding = true;
                        this.lockTimer = 0;
                    }
                } else {
                    // Piece moved - reset landing state
                    this.isLanding = false;
                    this.lockTimer = 0;
                    if (this.isSoftDropping) {
                        // Award points for soft drop
                        this.score += 1;
                    }
                }
            }

            // Handle lock delay
            if (this.isLanding) {
                this.lockTimer += deltaTime;
                if (this.lockTimer >= this.lockDelay) {
                    this.lockPiece();
                    this.isSoftDropping = false;
                    this.isLanding = false;
                    this.lockTimer = 0;
                }
            }

            // Update combo timer
            if (this.combo > 0) {
                this.comboTimer += deltaTime;
                if (this.comboTimer >= this.comboTimeout) {
                    this.combo = 0;
                    this.comboTimer = 0;
                }
            }

            // Update pulse animation for current piece
            this.pulseTimer += deltaTime * 0.001 * this.pulseSpeed * Math.PI * 2;

            // Update spawn animation
            if (this.spawnAnimTimer < this.spawnAnimDuration) {
                this.spawnAnimTimer += deltaTime;
            }

            // Update danger level
            this.updateDangerLevel();
        }

        // Update danger pulse animation
        this.dangerPulse += deltaTime * 0.005;

        // Update background animation
        this.bgTime += deltaTime * 0.0002;

        // Update line clear effect
        if (this.lineClearEffect) {
            this.lineClearEffect.timer += deltaTime;
            if (this.lineClearEffect.timer >= this.lineClearEffect.duration) {
                this.lineClearEffect = null;
            }
        }

        // Update combo display
        this.updateComboDisplay();

        // Update motion trail
        this.updateTrail();

        this.particles.update(deltaTime);
        this.updateScreenShake(deltaTime);
        this.updateFlash(deltaTime);
        this.updateScorePopups(deltaTime);
        this.updateLandingEffect(deltaTime);
        this.scene.update(deltaTime / 1000);
    }

    updateDangerLevel() {
        // Find the highest occupied row (lowest row number = highest on screen)
        let highestRow = this.GRID_ROWS;
        for (let row = 0; row < this.GRID_ROWS; row++) {
            for (let col = 0; col < this.GRID_COLS; col++) {
                if (this.grid[row][col]) {
                    highestRow = row;
                    break;
                }
            }
            if (highestRow < this.GRID_ROWS) break;
        }

        // Danger starts when pieces reach the top 6 rows (30% of grid)
        const dangerThreshold = 6;
        if (highestRow <= dangerThreshold) {
            this.dangerLevel = 1 - (highestRow / dangerThreshold);
        } else {
            this.dangerLevel = 0;
        }
    }

    updateScreenShake(dt) {
        this.shakeTrauma = Math.max(0, this.shakeTrauma - dt * 0.003);
        const shake = this.shakeTrauma * this.shakeTrauma;
        this.shakeOffset = new Vector2(
            (Math.random() * 2 - 1) * shake * 20,
            (Math.random() * 2 - 1) * shake * 20
        );
    }

    updateFlash(dt) {
        this.flashAlpha = Math.max(0, this.flashAlpha - dt * 0.005);
    }

    updateScorePopups(dt) {
        for (let i = this.scorePopups.length - 1; i >= 0; i--) {
            const popup = this.scorePopups[i];
            popup.y -= dt * 0.15;
            popup.alpha -= dt * 0.002;
            popup.scale += dt * 0.001;

            if (popup.alpha <= 0) {
                this.scorePopups.splice(i, 1);
            }
        }
    }

    updateLandingEffect(dt) {
        if (this.landingEffect) {
            this.landingEffect.timer += dt;
            if (this.landingEffect.timer >= this.landingEffect.duration) {
                this.landingEffect = null;
            }
        }
    }

    updateComboDisplay() {
        if (this.combo > 1) {
            this.comboLabel.isHidden = false;
            const multiplier = 1 + (this.combo - 1) * 0.5;
            this.comboLabel.text = `${multiplier.toFixed(1)}x`;
            // Pulse the combo label based on combo timer (fade out as time runs out)
            const timeLeft = 1 - (this.comboTimer / this.comboTimeout);
            this.comboLabel.alpha = 0.5 + timeLeft * 0.5;
        } else {
            this.comboLabel.isHidden = true;
        }
    }

    render(ctx, width, height) {
        ctx.save();
        ctx.translate(this.shakeOffset.x, this.shakeOffset.y);

        // Animated gradient background
        const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
        const hueShift = Math.sin(this.bgTime) * 10;
        bgGradient.addColorStop(0, `hsl(${230 + hueShift}, 30%, 8%)`);
        bgGradient.addColorStop(0.5, `hsl(${240 + hueShift}, 25%, 5%)`);
        bgGradient.addColorStop(1, `hsl(${250 + hueShift}, 35%, 10%)`);
        ctx.fillStyle = bgGradient;
        ctx.fillRect(-this.shakeOffset.x, -this.shakeOffset.y, width, height);

        // Render grid and pieces first
        this.renderGrid(ctx);
        this.renderCurrentPiece(ctx);

        // Render line clear effect
        this.renderLineClearEffect(ctx);

        // Render UI elements (scene has transparent bg)
        this.scene.render(ctx, width, height);

        // Render overlays
        this.renderScorePopups(ctx);
        this.particles.draw(ctx);

        if (this.flashAlpha > 0) {
            ctx.globalAlpha = this.flashAlpha;
            ctx.fillStyle = this.flashColor.toString();
            ctx.fillRect(-this.shakeOffset.x, -this.shakeOffset.y, width, height);
            ctx.globalAlpha = 1;
        }

        // Render controls hint for new players
        if (this.showControlsHint && this.controlsHintAlpha > 0 && this.gameState === 'playing') {
            this.renderControlsHint(ctx);
        }

        ctx.restore();
    }

    renderControlsHint(ctx) {
        ctx.save();
        ctx.globalAlpha = this.controlsHintAlpha;

        // Semi-transparent background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(this.GRID_OFFSET_X, this.GRID_OFFSET_Y + this.GRID_HEIGHT * 0.35,
            this.GRID_WIDTH, this.GRID_HEIGHT * 0.3);

        // Controls text
        ctx.font = 'bold 36px -apple-system';
        ctx.fillStyle = Color.white.toString();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const centerX = this.width / 2;
        const startY = this.GRID_OFFSET_Y + this.GRID_HEIGHT * 0.42;

        ctx.fillText('CONTROLS', centerX, startY);

        ctx.font = '28px -apple-system';
        ctx.fillStyle = Color.cyan.toString();
        ctx.fillText('Tap: Rotate', centerX, startY + 50);
        ctx.fillText('Swipe Left/Right: Move', centerX, startY + 85);
        ctx.fillText('Swipe Down: Drop', centerX, startY + 120);
        ctx.fillText('Swipe Up: Hold', centerX, startY + 155);
        ctx.fillText('Double Tap: Hard Drop', centerX, startY + 190);

        ctx.font = '24px -apple-system';
        ctx.fillStyle = Color.gray.toString();
        ctx.fillText('Tap anywhere to start', centerX, startY + 240);

        ctx.restore();
    }

    renderGrid(ctx) {
        ctx.save();
        ctx.translate(this.GRID_OFFSET_X, this.GRID_OFFSET_Y);

        // Grid background - darker to contrast with pieces
        ctx.fillStyle = new Color(0.03, 0.03, 0.08).toString();
        ctx.fillRect(0, 0, this.GRID_WIDTH, this.GRID_HEIGHT);

        // Danger zone overlay - pulsing red gradient at top when danger > 0
        if (this.dangerLevel > 0) {
            const pulseAlpha = 0.15 + 0.1 * Math.sin(this.dangerPulse);
            const dangerAlpha = this.dangerLevel * pulseAlpha;
            const gradient = ctx.createLinearGradient(0, 0, 0, this.CELL_SIZE * 6);
            gradient.addColorStop(0, `rgba(255, 50, 50, ${dangerAlpha})`);
            gradient.addColorStop(1, 'rgba(255, 50, 50, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, this.GRID_WIDTH, this.CELL_SIZE * 6);
        }

        // Grid lines - more visible
        ctx.strokeStyle = new Color(0.18, 0.18, 0.28).toString();
        ctx.lineWidth = 2;

        for (let row = 0; row <= this.GRID_ROWS; row++) {
            ctx.beginPath();
            ctx.moveTo(0, row * this.CELL_SIZE);
            ctx.lineTo(this.GRID_WIDTH, row * this.CELL_SIZE);
            ctx.stroke();
        }

        for (let col = 0; col <= this.GRID_COLS; col++) {
            ctx.beginPath();
            ctx.moveTo(col * this.CELL_SIZE, 0);
            ctx.lineTo(col * this.CELL_SIZE, this.GRID_HEIGHT);
            ctx.stroke();
        }

        // Border color - turns red when in danger
        const borderColor = this.dangerLevel > 0
            ? Color.red.withOpacity(0.5 + 0.3 * Math.sin(this.dangerPulse))
            : Color.cyan.withOpacity(0.8);
        ctx.strokeStyle = borderColor.toString();
        ctx.lineWidth = 6;
        ctx.strokeRect(0, 0, this.GRID_WIDTH, this.GRID_HEIGHT);

        for (let row = 0; row < this.GRID_ROWS; row++) {
            for (let col = 0; col < this.GRID_COLS; col++) {
                if (this.grid[row][col]) {
                    // Check if this cell is part of the landing effect
                    let landingScale = null;
                    if (this.landingEffect) {
                        const isLandedCell = this.landingEffect.cells.some(
                            c => c.x === col && c.y === row
                        );
                        if (isLandedCell) {
                            const t = this.landingEffect.timer / this.landingEffect.duration;
                            // Squash at start, bounce back
                            const squash = 1 - Math.sin(t * Math.PI) * 0.15;
                            const stretch = 1 + Math.sin(t * Math.PI) * 0.1;
                            landingScale = { x: stretch, y: squash };
                        }
                    }
                    this.drawCell(ctx, col, row, this.grid[row][col], false, landingScale);
                }
            }
        }

        ctx.restore();
    }

    renderCurrentPiece(ctx) {
        if (!this.currentPiece || this.gameState !== 'playing') return;

        ctx.save();
        ctx.translate(this.GRID_OFFSET_X, this.GRID_OFFSET_Y);

        // Render motion trail first (behind piece)
        for (const trail of this.trailPositions) {
            const trailPiece = this.TETROMINOES[trail.type];
            if (!trailPiece) continue;
            ctx.globalAlpha = trail.alpha * 0.5;
            for (let row = 0; row < this.currentPiece.length; row++) {
                for (let col = 0; col < this.currentPiece[row].length; col++) {
                    if (this.currentPiece[row][col]) {
                        this.drawCell(ctx, trail.x + col, trail.y + row, trailPiece.color, true);
                    }
                }
            }
        }

        const ghostY = this.getGhostY();
        ctx.globalAlpha = 0.5; // Increased visibility
        const pieceColor = this.TETROMINOES[this.currentPieceType].color;

        for (let row = 0; row < this.currentPiece.length; row++) {
            for (let col = 0; col < this.currentPiece[row].length; col++) {
                if (this.currentPiece[row][col]) {
                    this.drawCell(ctx, this.currentPieceX + col, ghostY + row, pieceColor, true);
                }
            }
        }

        ctx.globalAlpha = 1;
        // Calculate pulse intensity for current piece glow
        let pulseIntensity = 0.5 + 0.5 * Math.sin(this.pulseTimer);

        // Flash faster when about to lock (urgency indicator)
        if (this.isLanding) {
            const lockProgress = this.lockTimer / this.lockDelay;
            // Faster pulse as lock approaches
            const urgencyPulse = Math.sin(this.pulseTimer * (1 + lockProgress * 3));
            pulseIntensity = 0.3 + 0.7 * Math.abs(urgencyPulse);
        }

        // Spawn animation: scale from 1.3 to 1.0 with bounce
        let spawnScale = null;
        if (this.spawnAnimTimer < this.spawnAnimDuration) {
            const t = this.spawnAnimTimer / this.spawnAnimDuration;
            // Elastic ease out: overshoot then settle
            const elasticT = 1 - Math.pow(2, -10 * t) * Math.cos(t * Math.PI * 2);
            const scale = 1 + 0.3 * (1 - elasticT);
            spawnScale = { x: scale, y: scale };
        }

        for (let row = 0; row < this.currentPiece.length; row++) {
            for (let col = 0; col < this.currentPiece[row].length; col++) {
                if (this.currentPiece[row][col]) {
                    this.drawCell(ctx, this.currentPieceX + col, this.currentPieceY + row, pieceColor, false, spawnScale, pulseIntensity);
                }
            }
        }

        ctx.restore();
    }

    renderLineClearEffect(ctx) {
        if (!this.lineClearEffect) return;

        ctx.save();
        ctx.translate(this.GRID_OFFSET_X, this.GRID_OFFSET_Y);

        const t = this.lineClearEffect.timer / this.lineClearEffect.duration;
        // Flash white then fade out
        const alpha = t < 0.3 ? 1 : 1 - ((t - 0.3) / 0.7);
        const expandX = 1 + t * 0.1; // Slight horizontal expansion

        for (const row of this.lineClearEffect.rows) {
            ctx.save();

            // Transform for expansion effect
            const centerX = this.GRID_WIDTH / 2;
            const centerY = row * this.CELL_SIZE + this.CELL_SIZE / 2;
            ctx.translate(centerX, centerY);
            ctx.scale(expandX, 1);
            ctx.translate(-centerX, -centerY);

            // White flash overlay
            ctx.globalAlpha = alpha * 0.8;
            ctx.fillStyle = Color.white.toString();
            ctx.fillRect(0, row * this.CELL_SIZE, this.GRID_WIDTH, this.CELL_SIZE);

            ctx.restore();
        }

        ctx.restore();
    }

    drawCell(ctx, col, row, color, isGhost = false, scale = null, pulseIntensity = 0) {
        const baseX = col * this.CELL_SIZE + 4;
        const baseY = row * this.CELL_SIZE + 4;
        const size = this.CELL_SIZE - 8;
        const radius = 12;

        // Apply scale transformation if provided (for landing effect)
        ctx.save();
        if (scale) {
            const centerX = baseX + size / 2;
            const centerY = baseY + size / 2;
            ctx.translate(centerX, centerY);
            ctx.scale(scale.x, scale.y);
            ctx.translate(-centerX, -centerY);
        }

        const x = baseX;
        const y = baseY;

        // Glow effect for non-ghost pieces
        if (!isGhost) {
            ctx.save();
            ctx.shadowColor = color.toString();
            // Pulse glow for current piece, extra glow on landing
            const baseGlow = scale ? 25 : 15;
            const pulseGlow = pulseIntensity * 12; // Add up to 12px extra glow when pulsing
            ctx.shadowBlur = baseGlow + pulseGlow;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillStyle = color.toString();
            ctx.beginPath();
            ctx.roundRect(x, y, size, size, radius);
            ctx.fill();
            ctx.restore();
        }

        // Main fill
        ctx.fillStyle = color.toString();
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, radius);
        ctx.fill();

        if (!isGhost) {
            // Highlight (top)
            ctx.fillStyle = new Color(1, 1, 1, 0.35).toString();
            ctx.beginPath();
            ctx.roundRect(x + 4, y + 4, size - 8, size / 3, radius / 2);
            ctx.fill();

            // Shadow (bottom)
            ctx.fillStyle = new Color(0, 0, 0, 0.25).toString();
            ctx.beginPath();
            ctx.roundRect(x + 4, y + size - size / 4, size - 8, size / 5, radius / 2);
            ctx.fill();

            // Inner border for depth
            ctx.strokeStyle = new Color(1, 1, 1, 0.1).toString();
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(x + 2, y + 2, size - 4, size - 4, radius - 2);
            ctx.stroke();
        } else {
            // Ghost piece - dashed outline with subtle fill
            ctx.fillStyle = color.withOpacity(0.15).toString();
            ctx.beginPath();
            ctx.roundRect(x, y, size, size, radius);
            ctx.fill();

            // Dashed border for ghost
            ctx.setLineDash([8, 6]);
            ctx.strokeStyle = color.withOpacity(0.7).toString();
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(x, y, size, size, radius);
            ctx.stroke();
            ctx.setLineDash([]); // Reset dash
        }

        ctx.restore(); // Restore from scale transform
    }

    renderScorePopups(ctx) {
        for (const popup of this.scorePopups) {
            ctx.save();
            ctx.globalAlpha = popup.alpha;
            ctx.font = `bold ${60 * popup.scale}px -apple-system`;
            ctx.fillStyle = popup.color.toString();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(popup.text, popup.x, popup.y);
            ctx.restore();
        }
    }

    getScore() {
        return this.score;
    }

    getObjectCount() {
        return this.scene.children.length + this.particles.particles.length;
    }
}

// Initialize game
window.gameInstance = new HyperTetris();
window.preview.log('Hyper Tetris game loaded!', 'info');
