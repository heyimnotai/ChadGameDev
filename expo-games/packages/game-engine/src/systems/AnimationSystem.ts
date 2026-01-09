import { Vector2 } from '../types';
import { BaseEntity } from '../entities';

type EasingFunction = (t: number) => number;

export const Easing = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => 1 - (1 - t) * (1 - t),
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeOutElastic: (t: number) => {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
  },
  bounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
};

interface Animation {
  id: string;
  entityId: string;
  property: string;
  startValue: any;
  endValue: any;
  duration: number;
  elapsed: number;
  easing: EasingFunction;
  onComplete?: () => void;
  loop?: boolean;
}

class AnimationSystemClass {
  private animations: Map<string, Animation> = new Map();
  private animationId = 0;

  moveTo(
    entity: BaseEntity,
    target: Vector2,
    duration: number,
    options: { easing?: EasingFunction; onComplete?: () => void } = {}
  ): string {
    const id = `anim_${++this.animationId}`;
    this.animations.set(id, {
      id,
      entityId: entity.id,
      property: 'position',
      startValue: new Vector2(entity.position.x, entity.position.y),
      endValue: target,
      duration,
      elapsed: 0,
      easing: options.easing ?? Easing.easeOut,
      onComplete: options.onComplete,
    });
    return id;
  }

  scaleTo(
    entity: BaseEntity,
    target: number | Vector2,
    duration: number,
    options: { easing?: EasingFunction; onComplete?: () => void } = {}
  ): string {
    const id = `anim_${++this.animationId}`;
    const endValue = typeof target === 'number' ? new Vector2(target, target) : target;
    this.animations.set(id, {
      id,
      entityId: entity.id,
      property: 'scale',
      startValue: new Vector2(entity.scale.x, entity.scale.y),
      endValue,
      duration,
      elapsed: 0,
      easing: options.easing ?? Easing.easeOut,
      onComplete: options.onComplete,
    });
    return id;
  }

  fadeTo(
    entity: BaseEntity,
    targetAlpha: number,
    duration: number,
    options: { easing?: EasingFunction; onComplete?: () => void } = {}
  ): string {
    const id = `anim_${++this.animationId}`;
    this.animations.set(id, {
      id,
      entityId: entity.id,
      property: 'alpha',
      startValue: entity.alpha,
      endValue: targetAlpha,
      duration,
      elapsed: 0,
      easing: options.easing ?? Easing.easeOut,
      onComplete: options.onComplete,
    });
    return id;
  }

  rotateTo(
    entity: BaseEntity,
    targetRotation: number,
    duration: number,
    options: { easing?: EasingFunction; onComplete?: () => void } = {}
  ): string {
    const id = `anim_${++this.animationId}`;
    this.animations.set(id, {
      id,
      entityId: entity.id,
      property: 'rotation',
      startValue: entity.rotation,
      endValue: targetRotation,
      duration,
      elapsed: 0,
      easing: options.easing ?? Easing.easeOut,
      onComplete: options.onComplete,
    });
    return id;
  }

  cancel(animationId: string): void {
    this.animations.delete(animationId);
  }

  cancelAll(entityId: string): void {
    for (const [id, anim] of this.animations) {
      if (anim.entityId === entityId) {
        this.animations.delete(id);
      }
    }
  }

  update(entities: Record<string, BaseEntity>, deltaTime: number): void {
    const completed: string[] = [];

    for (const [id, anim] of this.animations) {
      anim.elapsed += deltaTime;
      const t = Math.min(anim.elapsed / anim.duration, 1);
      const easedT = anim.easing(t);

      const entity = entities[anim.entityId];
      if (!entity) {
        completed.push(id);
        continue;
      }

      // Apply animation based on property type
      if (anim.property === 'position' || anim.property === 'scale') {
        const start = anim.startValue as Vector2;
        const end = anim.endValue as Vector2;
        (entity as any)[anim.property] = Vector2.lerp(start, end, easedT);
      } else {
        const start = anim.startValue as number;
        const end = anim.endValue as number;
        (entity as any)[anim.property] = start + (end - start) * easedT;
      }

      if (t >= 1) {
        completed.push(id);
        anim.onComplete?.();
      }
    }

    completed.forEach(id => this.animations.delete(id));
  }
}

export const AnimationSystem = new AnimationSystemClass();
