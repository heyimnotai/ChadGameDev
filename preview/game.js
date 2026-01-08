/**
 * Tap the Circle - Demo Game
 *
 * A simple game demonstrating the Ralph Loop preview system.
 * Tap the circle to score points. The circle moves to a random
 * position after each tap.
 */

class TapTheCircle {
    constructor() {
        // Screen dimensions
        this.width = GameRenderer.SCREEN_WIDTH;
        this.height = GameRenderer.SCREEN_HEIGHT;

        // Safe areas
        this.safeTop = GameRenderer.SAFE_AREA.top;
        this.safeBottom = GameRenderer.SAFE_AREA.bottom;

        // Game state
        this.score = 0;
        this.highScore = 0;
        this.circleRadius = 90;  // 30pt at 3x
        this.isAnimating = false;

        // Create scene
        this.scene = new Scene({ width: this.width, height: this.height });
        this.scene.backgroundColor = new Color(0.1, 0.1, 0.15);

        // Particle emitter for tap effects
        this.particles = new ParticleEmitter();
        this.particles.particleColor = Color.cyan;
        this.particles.particleSize = 12;
        this.particles.particleLifetime = 500;
        this.particles.particleSpeed = 300;
        this.particles.particleSpeedRange = 150;

        this.setupGame();
    }

    setupGame() {
        // Background gradient (simulated with rectangles)
        this.createBackground();

        // Create the tappable circle
        this.circle = ShapeNode.circle(this.circleRadius);
        this.circle.fillColor = Color.cyan;
        this.circle.strokeColor = Color.white;
        this.circle.lineWidth = 6;
        this.circle.position = this.getRandomPosition();
        this.scene.addChild(this.circle);

        // Add inner glow effect
        this.innerCircle = ShapeNode.circle(this.circleRadius * 0.6);
        this.innerCircle.fillColor = Color.white.withOpacity(0.3);
        this.innerCircle.strokeColor = Color.clear;
        this.circle.addChild(this.innerCircle);

        // Score label
        this.scoreLabel = new LabelNode('0');
        this.scoreLabel.fontSize = 144;
        this.scoreLabel.fontColor = Color.white;
        this.scoreLabel.position = new Vector2(this.width / 2, this.safeTop + 150);
        this.scene.addChild(this.scoreLabel);

        // Score title
        this.scoreTitleLabel = new LabelNode('SCORE');
        this.scoreTitleLabel.fontSize = 42;
        this.scoreTitleLabel.fontColor = Color.gray;
        this.scoreTitleLabel.position = new Vector2(this.width / 2, this.safeTop + 60);
        this.scene.addChild(this.scoreTitleLabel);

        // High score
        this.highScoreLabel = new LabelNode('BEST: 0');
        this.highScoreLabel.fontSize = 36;
        this.highScoreLabel.fontColor = Color.gray;
        this.highScoreLabel.position = new Vector2(this.width / 2, this.height - this.safeBottom - 80);
        this.scene.addChild(this.highScoreLabel);

        // Instructions
        this.instructionLabel = new LabelNode('TAP THE CIRCLE');
        this.instructionLabel.fontSize = 48;
        this.instructionLabel.fontColor = Color.white.withOpacity(0.5);
        this.instructionLabel.position = new Vector2(this.width / 2, this.height - this.safeBottom - 150);
        this.scene.addChild(this.instructionLabel);

        // Add particles to scene
        this.scene.addChild(this.particles);

        // Start idle animation
        this.startIdleAnimation();
    }

    createBackground() {
        // Create subtle gradient effect with multiple layers
        const colors = [
            new Color(0.05, 0.05, 0.12),
            new Color(0.08, 0.08, 0.18),
            new Color(0.1, 0.1, 0.2)
        ];

        const layerHeight = this.height / 3;

        for (let i = 0; i < 3; i++) {
            const bg = new SpriteNode(colors[i], { width: this.width, height: layerHeight + 10 });
            bg.position = new Vector2(this.width / 2, layerHeight * i + layerHeight / 2);
            bg.zPosition = -10;
            this.scene.addChild(bg);
        }
    }

    getRandomPosition() {
        // Keep circle within safe playable area
        const padding = this.circleRadius + 60;
        const minY = this.safeTop + 300;  // Below score display
        const maxY = this.height - this.safeBottom - 200;  // Above instructions

        const x = padding + Math.random() * (this.width - padding * 2);
        const y = minY + Math.random() * (maxY - minY);

        return new Vector2(x, y);
    }

    startIdleAnimation() {
        // Subtle pulsing animation
        const scaleUp = Action.scaleTo(1.1, 800);
        scaleUp.timingFunction = Action.easeInOut;

        const scaleDown = Action.scaleTo(1.0, 800);
        scaleDown.timingFunction = Action.easeInOut;

        const pulse = Action.sequence([scaleUp, scaleDown]);
        const repeatPulse = Action.repeatForever(pulse);

        this.scene.run(this.circle, repeatPulse, 'idle');
    }

    handleTouch(type, x, y) {
        if (type !== 'began') return;
        if (this.isAnimating) return;

        const touchPoint = new Vector2(x, y);

        // Check if circle was tapped
        if (this.circle.contains(touchPoint)) {
            this.onCircleTapped(touchPoint);
        }
    }

    onCircleTapped(touchPoint) {
        this.isAnimating = true;

        // Update score
        this.score++;
        this.scoreLabel.text = this.score.toString();

        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreLabel.text = `BEST: ${this.highScore}`;
        }

        // Particle burst at tap location
        this.particles.position = touchPoint;
        this.particles.burst(15);

        // Haptic feedback (in real iOS)
        HapticFeedback.impact('medium');

        // Circle tap animation
        this.scene.removeAllActions(this.circle);

        const shrink = Action.scaleTo(0.8, 100);
        shrink.timingFunction = Action.easeIn;

        const grow = Action.scaleTo(1.2, 150);
        grow.timingFunction = Action.easeOut;

        const normalize = Action.scaleTo(1.0, 100);

        // Get new position
        const newPosition = this.getRandomPosition();

        // Animate to new position
        const moveAction = Action.moveTo(newPosition, 300);
        moveAction.timingFunction = Action.easeOut;

        const sequence = Action.sequence([
            shrink,
            grow,
            Action.run(() => {
                this.scene.run(this.circle, moveAction, 'move');
            }),
            normalize,
            Action.wait(300),
            Action.run(() => {
                this.isAnimating = false;
                this.startIdleAnimation();
            })
        ]);

        this.scene.run(this.circle, sequence, 'tap');

        // Score pop animation
        const scoreGrow = Action.scaleTo(1.3, 100);
        scoreGrow.timingFunction = Action.easeOut;

        const scoreShrink = Action.scaleTo(1.0, 200);
        scoreShrink.timingFunction = Action.easeInOut;

        this.scene.run(this.scoreLabel, Action.sequence([scoreGrow, scoreShrink]), 'scorePop');

        // Flash the circle color
        const originalColor = this.circle.fillColor;
        this.circle.fillColor = Color.white;
        setTimeout(() => {
            this.circle.fillColor = originalColor;
        }, 50);
    }

    update(deltaTime) {
        // Update scene actions
        this.scene.update(deltaTime);

        // Update particles
        this.particles.update(deltaTime);
    }

    render(ctx, width, height) {
        this.scene.render(ctx, width, height);
    }

    getScore() {
        return this.score;
    }

    getObjectCount() {
        return this.scene.children.length + this.particles.particles.length;
    }

    restart() {
        this.score = 0;
        this.scoreLabel.text = '0';
        this.circle.position = this.getRandomPosition();
        this.isAnimating = false;
        this.scene.removeAllActions(this.circle);
        this.startIdleAnimation();
    }

    reset() {
        this.restart();
        this.highScore = 0;
        this.highScoreLabel.text = 'BEST: 0';
    }
}

// Initialize game
window.gameInstance = new TapTheCircle();
window.preview.log('Tap the Circle game loaded!', 'info');
