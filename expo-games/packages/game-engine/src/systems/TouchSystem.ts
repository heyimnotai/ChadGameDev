import { Vector2 } from '../types';

export type TouchEventType = 'began' | 'moved' | 'ended' | 'cancelled';

export interface TouchEvent {
  type: TouchEventType;
  position: Vector2;
  startPosition: Vector2;
  delta: Vector2;
  timestamp: number;
  duration: number;
}

export interface GestureEvent {
  type: 'tap' | 'doubleTap' | 'swipe' | 'drag' | 'hold';
  position: Vector2;
  direction?: 'up' | 'down' | 'left' | 'right';
  velocity?: Vector2;
}

interface TouchState {
  startPosition: Vector2;
  startTime: number;
  lastPosition: Vector2;
  lastTapTime: number;
}

type TouchHandler = (event: TouchEvent) => void;
type GestureHandler = (event: GestureEvent) => void;

class TouchSystemClass {
  private state: TouchState = {
    startPosition: new Vector2(),
    startTime: 0,
    lastPosition: new Vector2(),
    lastTapTime: 0,
  };

  private touchHandlers: TouchHandler[] = [];
  private gestureHandlers: GestureHandler[] = [];

  // Configuration
  private doubleTapThreshold = 300; // ms
  private tapDistanceThreshold = 30; // pixels
  private swipeDistanceThreshold = 50; // pixels
  private swipeVelocityThreshold = 0.3; // pixels/ms

  onTouch(handler: TouchHandler): () => void {
    this.touchHandlers.push(handler);
    return () => {
      this.touchHandlers = this.touchHandlers.filter(h => h !== handler);
    };
  }

  onGesture(handler: GestureHandler): () => void {
    this.gestureHandlers.push(handler);
    return () => {
      this.gestureHandlers = this.gestureHandlers.filter(h => h !== handler);
    };
  }

  handleTouchStart(x: number, y: number): void {
    const now = Date.now();
    this.state.startPosition = new Vector2(x, y);
    this.state.startTime = now;
    this.state.lastPosition = new Vector2(x, y);

    const event: TouchEvent = {
      type: 'began',
      position: new Vector2(x, y),
      startPosition: this.state.startPosition,
      delta: new Vector2(0, 0),
      timestamp: now,
      duration: 0,
    };

    this.touchHandlers.forEach(h => h(event));
  }

  handleTouchMove(x: number, y: number): void {
    const now = Date.now();
    const position = new Vector2(x, y);
    const delta = position.subtract(this.state.lastPosition);
    this.state.lastPosition = position;

    const event: TouchEvent = {
      type: 'moved',
      position,
      startPosition: this.state.startPosition,
      delta,
      timestamp: now,
      duration: now - this.state.startTime,
    };

    this.touchHandlers.forEach(h => h(event));
  }

  handleTouchEnd(x: number, y: number): void {
    const now = Date.now();
    const position = new Vector2(x, y);
    const duration = now - this.state.startTime;
    const distance = position.distance(this.state.startPosition);

    const event: TouchEvent = {
      type: 'ended',
      position,
      startPosition: this.state.startPosition,
      delta: position.subtract(this.state.lastPosition),
      timestamp: now,
      duration,
    };

    this.touchHandlers.forEach(h => h(event));

    // Detect gestures
    this.detectGestures(position, duration, distance, now);
  }

  private detectGestures(
    position: Vector2,
    duration: number,
    distance: number,
    now: number
  ): void {
    const delta = position.subtract(this.state.startPosition);
    const velocity = distance / duration;

    // Tap detection
    if (distance < this.tapDistanceThreshold && duration < 300) {
      if (now - this.state.lastTapTime < this.doubleTapThreshold) {
        this.gestureHandlers.forEach(h => h({
          type: 'doubleTap',
          position,
        }));
        this.state.lastTapTime = 0; // Reset
      } else {
        this.gestureHandlers.forEach(h => h({
          type: 'tap',
          position,
        }));
        this.state.lastTapTime = now;
      }
      return;
    }

    // Swipe detection
    if (distance > this.swipeDistanceThreshold && velocity > this.swipeVelocityThreshold) {
      const direction = this.getSwipeDirection(delta);
      this.gestureHandlers.forEach(h => h({
        type: 'swipe',
        position,
        direction,
        velocity: delta.multiply(1 / duration),
      }));
      return;
    }

    // Drag detection (moved but not fast enough for swipe)
    if (distance > this.tapDistanceThreshold) {
      this.gestureHandlers.forEach(h => h({
        type: 'drag',
        position,
        velocity: delta.multiply(1 / duration),
      }));
    }
  }

  private getSwipeDirection(delta: Vector2): 'up' | 'down' | 'left' | 'right' {
    if (Math.abs(delta.x) > Math.abs(delta.y)) {
      return delta.x > 0 ? 'right' : 'left';
    }
    return delta.y > 0 ? 'down' : 'up';
  }
}

export const TouchSystem = new TouchSystemClass();
