/**
 * Ralph Loop Game Renderer
 *
 * Provides SpriteKit/SwiftUI-like abstractions for HTML5 Canvas
 * Used for rapid iOS game preview before native compilation
 */

// ==========================================
// Core Types & Constants
// ==========================================

const GameRenderer = {
    // iPhone 15 dimensions at 3x scale
    SCREEN_WIDTH: 1179,
    SCREEN_HEIGHT: 2556,
    SCALE: 3,

    // Safe area insets (Dynamic Island + Home Indicator)
    SAFE_AREA: {
        top: 162,      // Below Dynamic Island (54px * 3)
        bottom: 102,   // Above Home Indicator (34px * 3)
        left: 0,
        right: 0
    }
};

// ==========================================
// Vector2 - 2D Vector Operations
// ==========================================

class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    subtract(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    multiply(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const mag = this.magnitude();
        if (mag === 0) return new Vector2(0, 0);
        return new Vector2(this.x / mag, this.y / mag);
    }

    distance(v) {
        return this.subtract(v).magnitude();
    }

    static lerp(a, b, t) {
        return new Vector2(
            a.x + (b.x - a.x) * t,
            a.y + (b.y - a.y) * t
        );
    }
}

// ==========================================
// Color - SwiftUI-like Color System
// ==========================================

class Color {
    constructor(r, g, b, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toString() {
        return `rgba(${Math.round(this.r * 255)}, ${Math.round(this.g * 255)}, ${Math.round(this.b * 255)}, ${this.a})`;
    }

    withOpacity(opacity) {
        return new Color(this.r, this.g, this.b, opacity);
    }

    static lerp(a, b, t) {
        return new Color(
            a.r + (b.r - a.r) * t,
            a.g + (b.g - a.g) * t,
            a.b + (b.b - a.b) * t,
            a.a + (b.a - a.a) * t
        );
    }

    // System Colors (iOS 17)
    static get white() { return new Color(1, 1, 1); }
    static get black() { return new Color(0, 0, 0); }
    static get clear() { return new Color(0, 0, 0, 0); }
    static get red() { return new Color(1, 0.231, 0.188); }
    static get orange() { return new Color(1, 0.584, 0); }
    static get yellow() { return new Color(1, 0.8, 0); }
    static get green() { return new Color(0.204, 0.78, 0.349); }
    static get mint() { return new Color(0, 0.78, 0.745); }
    static get teal() { return new Color(0.188, 0.69, 0.78); }
    static get cyan() { return new Color(0.196, 0.678, 0.902); }
    static get blue() { return new Color(0, 0.478, 1); }
    static get indigo() { return new Color(0.345, 0.337, 0.839); }
    static get purple() { return new Color(0.686, 0.322, 0.871); }
    static get pink() { return new Color(1, 0.176, 0.333); }
    static get gray() { return new Color(0.557, 0.557, 0.576); }

    static fromHex(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            return new Color(
                parseInt(result[1], 16) / 255,
                parseInt(result[2], 16) / 255,
                parseInt(result[3], 16) / 255
            );
        }
        return Color.white;
    }
}

// ==========================================
// Node - Base SpriteKit-like Node
// ==========================================

class Node {
    constructor() {
        this.position = new Vector2(0, 0);
        this.zPosition = 0;
        this.alpha = 1;
        this.isHidden = false;
        this.scale = new Vector2(1, 1);
        this.rotation = 0;
        this.children = [];
        this.parent = null;
        this.name = '';
        this.userData = {};
    }

    addChild(node) {
        node.parent = this;
        this.children.push(node);
        this.children.sort((a, b) => a.zPosition - b.zPosition);
    }

    removeFromParent() {
        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index > -1) {
                this.parent.children.splice(index, 1);
            }
            this.parent = null;
        }
    }

    render(ctx) {
        if (this.isHidden || this.alpha <= 0) return;

        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale.x, this.scale.y);
        ctx.globalAlpha *= this.alpha;

        this.draw(ctx);

        for (const child of this.children) {
            child.render(ctx);
        }

        ctx.restore();
    }

    draw(ctx) {
        // Override in subclasses
    }

    contains(point) {
        return false;
    }
}

// ==========================================
// SpriteNode - SKSpriteNode equivalent
// ==========================================

class SpriteNode extends Node {
    constructor(color = Color.white, size = { width: 100, height: 100 }) {
        super();
        this.color = color;
        this.size = size;
        this.anchorPoint = { x: 0.5, y: 0.5 };
        this.texture = null;
        this.cornerRadius = 0;
    }

    draw(ctx) {
        const x = -this.size.width * this.anchorPoint.x;
        const y = -this.size.height * this.anchorPoint.y;

        if (this.texture) {
            ctx.drawImage(this.texture, x, y, this.size.width, this.size.height);
        } else {
            ctx.fillStyle = this.color.toString();
            if (this.cornerRadius > 0) {
                this.roundRect(ctx, x, y, this.size.width, this.size.height, this.cornerRadius);
                ctx.fill();
            } else {
                ctx.fillRect(x, y, this.size.width, this.size.height);
            }
        }
    }

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    contains(point) {
        const localX = point.x - this.position.x;
        const localY = point.y - this.position.y;
        const halfW = this.size.width * this.anchorPoint.x;
        const halfH = this.size.height * this.anchorPoint.y;
        return localX >= -halfW && localX <= this.size.width - halfW &&
               localY >= -halfH && localY <= this.size.height - halfH;
    }
}

// ==========================================
// ShapeNode - SKShapeNode equivalent
// ==========================================

class ShapeNode extends Node {
    constructor() {
        super();
        this.fillColor = Color.clear;
        this.strokeColor = Color.white;
        this.lineWidth = 1;
        this.path = null;
    }

    static circle(radius) {
        const node = new ShapeNode();
        node.radius = radius;
        node.shapeType = 'circle';
        return node;
    }

    static rect(size, cornerRadius = 0) {
        const node = new ShapeNode();
        node.rectSize = size;
        node.cornerRadius = cornerRadius;
        node.shapeType = 'rect';
        return node;
    }

    draw(ctx) {
        ctx.beginPath();

        if (this.shapeType === 'circle') {
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        } else if (this.shapeType === 'rect') {
            const x = -this.rectSize.width / 2;
            const y = -this.rectSize.height / 2;
            if (this.cornerRadius > 0) {
                this.roundRect(ctx, x, y, this.rectSize.width, this.rectSize.height, this.cornerRadius);
            } else {
                ctx.rect(x, y, this.rectSize.width, this.rectSize.height);
            }
        }

        if (this.fillColor.a > 0) {
            ctx.fillStyle = this.fillColor.toString();
            ctx.fill();
        }

        if (this.strokeColor.a > 0 && this.lineWidth > 0) {
            ctx.strokeStyle = this.strokeColor.toString();
            ctx.lineWidth = this.lineWidth;
            ctx.stroke();
        }
    }

    roundRect(ctx, x, y, width, height, radius) {
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
    }

    contains(point) {
        if (this.shapeType === 'circle') {
            const dist = new Vector2(point.x, point.y).distance(this.position);
            return dist <= this.radius;
        }
        return false;
    }
}

// ==========================================
// LabelNode - SKLabelNode equivalent
// ==========================================

class LabelNode extends Node {
    constructor(text = '') {
        super();
        this.text = text;
        this.fontName = '-apple-system, SF Pro Display, Helvetica';
        this.fontSize = 48;
        this.fontColor = Color.white;
        this.horizontalAlignment = 'center';
        this.verticalAlignment = 'center';
    }

    draw(ctx) {
        ctx.font = `${this.fontSize}px ${this.fontName}`;
        ctx.fillStyle = this.fontColor.toString();
        ctx.textAlign = this.horizontalAlignment;
        ctx.textBaseline = this.verticalAlignment === 'center' ? 'middle' : this.verticalAlignment;
        ctx.fillText(this.text, 0, 0);
    }
}

// ==========================================
// Action - SKAction equivalent
// ==========================================

class Action {
    constructor(type, duration, params = {}) {
        this.type = type;
        this.duration = duration;
        this.params = params;
        this.elapsed = 0;
        this.isComplete = false;
        this.timingFunction = Action.linear;
    }

    static linear(t) { return t; }
    static easeIn(t) { return t * t; }
    static easeOut(t) { return 1 - (1 - t) * (1 - t); }
    static easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

    static moveTo(position, duration) {
        return new Action('moveTo', duration, { target: position });
    }

    static moveBy(delta, duration) {
        return new Action('moveBy', duration, { delta });
    }

    static scaleTo(scale, duration) {
        return new Action('scaleTo', duration, { target: scale });
    }

    static fadeIn(duration) {
        return new Action('fadeTo', duration, { target: 1 });
    }

    static fadeOut(duration) {
        return new Action('fadeTo', duration, { target: 0 });
    }

    static rotateTo(angle, duration) {
        return new Action('rotateTo', duration, { target: angle });
    }

    static rotateBy(delta, duration) {
        return new Action('rotateBy', duration, { delta });
    }

    static sequence(actions) {
        const action = new Action('sequence', 0, { actions, currentIndex: 0 });
        return action;
    }

    static repeatForever(action) {
        return new Action('repeatForever', 0, { action: action });
    }

    static wait(duration) {
        return new Action('wait', duration, {});
    }

    static run(callback) {
        return new Action('run', 0, { callback });
    }

    update(node, dt) {
        if (this.isComplete) return;

        this.elapsed += dt;

        switch (this.type) {
            case 'moveTo':
                this.updateMoveTo(node);
                break;
            case 'moveBy':
                this.updateMoveBy(node);
                break;
            case 'scaleTo':
                this.updateScaleTo(node);
                break;
            case 'fadeTo':
                this.updateFadeTo(node);
                break;
            case 'rotateTo':
                this.updateRotateTo(node);
                break;
            case 'rotateBy':
                this.updateRotateBy(node);
                break;
            case 'sequence':
                this.updateSequence(node, dt);
                break;
            case 'repeatForever':
                this.updateRepeatForever(node, dt);
                break;
            case 'wait':
                if (this.elapsed >= this.duration) this.isComplete = true;
                break;
            case 'run':
                this.params.callback();
                this.isComplete = true;
                break;
        }
    }

    updateMoveTo(node) {
        if (!this.params.start) {
            this.params.start = new Vector2(node.position.x, node.position.y);
        }
        const t = Math.min(this.elapsed / this.duration, 1);
        const eased = this.timingFunction(t);
        node.position = Vector2.lerp(this.params.start, this.params.target, eased);
        if (t >= 1) this.isComplete = true;
    }

    updateMoveBy(node) {
        if (!this.params.start) {
            this.params.start = new Vector2(node.position.x, node.position.y);
            this.params.target = node.position.add(this.params.delta);
        }
        const t = Math.min(this.elapsed / this.duration, 1);
        const eased = this.timingFunction(t);
        node.position = Vector2.lerp(this.params.start, this.params.target, eased);
        if (t >= 1) this.isComplete = true;
    }

    updateScaleTo(node) {
        if (!this.params.start) {
            this.params.start = new Vector2(node.scale.x, node.scale.y);
        }
        const t = Math.min(this.elapsed / this.duration, 1);
        const eased = this.timingFunction(t);
        const target = typeof this.params.target === 'number'
            ? new Vector2(this.params.target, this.params.target)
            : this.params.target;
        node.scale = Vector2.lerp(this.params.start, target, eased);
        if (t >= 1) this.isComplete = true;
    }

    updateFadeTo(node) {
        if (this.params.start === undefined) {
            this.params.start = node.alpha;
        }
        const t = Math.min(this.elapsed / this.duration, 1);
        const eased = this.timingFunction(t);
        node.alpha = this.params.start + (this.params.target - this.params.start) * eased;
        if (t >= 1) this.isComplete = true;
    }

    updateRotateTo(node) {
        if (this.params.start === undefined) {
            this.params.start = node.rotation;
        }
        const t = Math.min(this.elapsed / this.duration, 1);
        const eased = this.timingFunction(t);
        node.rotation = this.params.start + (this.params.target - this.params.start) * eased;
        if (t >= 1) this.isComplete = true;
    }

    updateRotateBy(node) {
        if (this.params.start === undefined) {
            this.params.start = node.rotation;
            this.params.target = node.rotation + this.params.delta;
        }
        const t = Math.min(this.elapsed / this.duration, 1);
        const eased = this.timingFunction(t);
        node.rotation = this.params.start + (this.params.target - this.params.start) * eased;
        if (t >= 1) this.isComplete = true;
    }

    updateSequence(node, dt) {
        const current = this.params.actions[this.params.currentIndex];
        if (current) {
            current.update(node, dt);
            if (current.isComplete) {
                this.params.currentIndex++;
                if (this.params.currentIndex >= this.params.actions.length) {
                    this.isComplete = true;
                }
            }
        }
    }

    updateRepeatForever(node, dt) {
        this.params.action.update(node, dt);
        if (this.params.action.isComplete) {
            // Reset the action
            this.params.action = this.cloneAction(this.params.action);
        }
    }

    cloneAction(action) {
        const clone = new Action(action.type, action.duration, { ...action.params });
        clone.timingFunction = action.timingFunction;
        return clone;
    }
}

// ==========================================
// Scene - SKScene equivalent
// ==========================================

class Scene extends Node {
    constructor(size) {
        super();
        this.size = size;
        this.backgroundColor = Color.black;
        this.actions = new Map();
    }

    run(node, action, key = null) {
        if (!this.actions.has(node)) {
            this.actions.set(node, []);
        }
        const actionEntry = { action, key };
        this.actions.get(node).push(actionEntry);
    }

    removeAction(node, key) {
        if (this.actions.has(node)) {
            const actions = this.actions.get(node);
            const index = actions.findIndex(a => a.key === key);
            if (index > -1) actions.splice(index, 1);
        }
    }

    removeAllActions(node) {
        this.actions.delete(node);
    }

    update(deltaTime) {
        // Update all actions
        for (const [node, actionList] of this.actions) {
            for (let i = actionList.length - 1; i >= 0; i--) {
                const { action } = actionList[i];
                action.update(node, deltaTime);
                if (action.isComplete && action.type !== 'repeatForever') {
                    actionList.splice(i, 1);
                }
            }
        }

        // Override in subclass for game logic
        this.didUpdate(deltaTime);
    }

    didUpdate(deltaTime) {
        // Override in subclass
    }

    render(ctx, width, height) {
        // Fill background
        ctx.fillStyle = this.backgroundColor.toString();
        ctx.fillRect(0, 0, width, height);

        // Render all children
        super.render(ctx);
    }
}

// ==========================================
// Physics Body (Simple)
// ==========================================

class PhysicsBody {
    constructor(shape, size) {
        this.shape = shape;
        this.size = size;
        this.velocity = new Vector2(0, 0);
        this.isDynamic = true;
        this.affectedByGravity = false;
        this.categoryBitMask = 0xFFFFFFFF;
        this.collisionBitMask = 0xFFFFFFFF;
        this.contactTestBitMask = 0;
    }

    static circle(radius) {
        return new PhysicsBody('circle', { radius });
    }

    static rectangle(size) {
        return new PhysicsBody('rectangle', size);
    }
}

// ==========================================
// Audio (Web Audio API wrapper)
// ==========================================

class AudioManager {
    constructor() {
        this.context = null;
        this.sounds = new Map();
        this.musicVolume = 1.0;
        this.sfxVolume = 1.0;
    }

    async init() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
    }

    async loadSound(name, url) {
        if (!this.context) await this.init();
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
        this.sounds.set(name, audioBuffer);
    }

    playSound(name, volume = 1.0) {
        const buffer = this.sounds.get(name);
        if (buffer && this.context) {
            const source = this.context.createBufferSource();
            const gainNode = this.context.createGain();
            source.buffer = buffer;
            gainNode.gain.value = volume * this.sfxVolume;
            source.connect(gainNode);
            gainNode.connect(this.context.destination);
            source.start(0);
        }
    }
}

// ==========================================
// Haptic Feedback (Vibration API wrapper)
// ==========================================

class HapticFeedback {
    static impact(style = 'medium') {
        if ('vibrate' in navigator) {
            const patterns = {
                light: 10,
                medium: 20,
                heavy: 40,
                rigid: 15,
                soft: 25
            };
            navigator.vibrate(patterns[style] || 20);
        }
    }

    static notification(type = 'success') {
        if ('vibrate' in navigator) {
            const patterns = {
                success: [20, 50, 20],
                warning: [20, 100, 20, 100, 20],
                error: [50, 50, 50, 50, 50]
            };
            navigator.vibrate(patterns[type] || [20]);
        }
    }

    static selection() {
        if ('vibrate' in navigator) {
            navigator.vibrate(5);
        }
    }
}

// ==========================================
// Particle System (Simple)
// ==========================================

class Particle {
    constructor(position, velocity, color, size, lifetime) {
        this.position = position;
        this.velocity = velocity;
        this.color = color;
        this.size = size;
        this.lifetime = lifetime;
        this.age = 0;
    }

    update(dt) {
        this.age += dt;
        this.position = this.position.add(this.velocity.multiply(dt / 1000));
    }

    get isAlive() {
        return this.age < this.lifetime;
    }

    get alpha() {
        return 1 - (this.age / this.lifetime);
    }
}

class ParticleEmitter extends Node {
    constructor() {
        super();
        this.particles = [];
        this.emissionRate = 10;
        this.particleLifetime = 1000;
        this.particleColor = Color.white;
        this.particleSize = 10;
        this.particleSpeed = 100;
        this.particleSpeedRange = 50;
        this.emissionAngle = 0;
        this.emissionAngleRange = Math.PI * 2;
        this.isEmitting = false;
        this.timeSinceEmit = 0;
    }

    update(dt) {
        // Update existing particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(dt);
            if (!this.particles[i].isAlive) {
                this.particles.splice(i, 1);
            }
        }

        // Emit new particles
        if (this.isEmitting) {
            this.timeSinceEmit += dt;
            const emitInterval = 1000 / this.emissionRate;
            while (this.timeSinceEmit >= emitInterval) {
                this.emitParticle();
                this.timeSinceEmit -= emitInterval;
            }
        }
    }

    emitParticle() {
        const angle = this.emissionAngle + (Math.random() - 0.5) * this.emissionAngleRange;
        const speed = this.particleSpeed + (Math.random() - 0.5) * this.particleSpeedRange;
        const velocity = new Vector2(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        const particle = new Particle(
            new Vector2(this.position.x, this.position.y),
            velocity,
            this.particleColor,
            this.particleSize,
            this.particleLifetime
        );
        this.particles.push(particle);
    }

    burst(count) {
        for (let i = 0; i < count; i++) {
            this.emitParticle();
        }
    }

    draw(ctx) {
        for (const particle of this.particles) {
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = particle.color.toString();
            ctx.beginPath();
            ctx.arc(
                particle.position.x - this.position.x,
                particle.position.y - this.position.y,
                particle.size / 2,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
}

// ==========================================
// Export for use in games
// ==========================================

window.GameRenderer = GameRenderer;
window.Vector2 = Vector2;
window.Color = Color;
window.Node = Node;
window.SpriteNode = SpriteNode;
window.ShapeNode = ShapeNode;
window.LabelNode = LabelNode;
window.Action = Action;
window.Scene = Scene;
window.PhysicsBody = PhysicsBody;
window.AudioManager = AudioManager;
window.HapticFeedback = HapticFeedback;
window.ParticleEmitter = ParticleEmitter;
window.Particle = Particle;
