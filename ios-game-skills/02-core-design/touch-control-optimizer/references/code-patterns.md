# Touch Control Optimizer - Code Patterns

---

## React Native / Expo Patterns (Primary Stack)

These are the patterns to use in all Expo games. The Swift patterns below are for native SpriteKit reference only.

### Conditional Parent Responder (Drag + Tap Coexistence)

The most important pattern. The container View only claims the responder after a drag has started, so child Pressables can fire normally.

```tsx
export function DragAndSelectContainer({ children }: { children: React.ReactNode }) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <View
      style={StyleSheet.absoluteFill}
      // Only intercept when a drag is already in progress
      onStartShouldSetResponder={() => isDragging}
      onMoveShouldSetResponder={() => isDragging}
      onResponderMove={(e) => handleDragMove(e.nativeEvent.pageX, e.nativeEvent.pageY)}
      onResponderRelease={handleDragEnd}
      onResponderTerminate={handleDragEnd}
    >
      {children}
    </View>
  );
}

// Child Pressable — fires normally because parent doesn't steal idle touches
<Pressable
  style={styles.pieceSlot}  // always 90x90 minimum
  onPressIn={(e) => {
    setIsDragging(true);  // NOW the parent can intercept moves
    startDrag(piece, e.nativeEvent.pageX, e.nativeEvent.pageY);
  }}
/>
```

### Piece Selector Slot (Puzzle / Block Games)

The slot container is the hit target. The visual piece inside can be any size.

```tsx
const MIN_SLOT_SIZE = 90;  // never go below this

function PieceSlot({ piece, onDragStart }: PieceSlotProps) {
  const { minRow, maxRow, minCol, maxCol } = getBounds(piece.blocks);
  const maxDim = Math.max(maxRow - minRow + 1, maxCol - minCol + 1);
  const previewCellSize = Math.floor(70 / maxDim);  // fits inside 70pt safe zone
  const pieceWidth = (maxCol - minCol + 1) * previewCellSize;
  const pieceHeight = (maxRow - minRow + 1) * previewCellSize;

  return (
    <Pressable
      // Hit target is the full slot — never size to the visual piece
      style={{
        width: MIN_SLOT_SIZE,
        height: MIN_SLOT_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#151528',
        borderRadius: 12,
      }}
      onPressIn={(e) => onDragStart(piece, e.nativeEvent.pageX, e.nativeEvent.pageY)}
    >
      {/* Visual can be any size — the slot handles touch */}
      <View style={{ width: pieceWidth, height: pieceHeight }}>
        {piece.blocks.map(([r, c], i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: (c - minCol) * previewCellSize,
              top: (r - minRow) * previewCellSize,
              width: previewCellSize - 2,
              height: previewCellSize - 2,
              borderRadius: 3,
              backgroundColor: piece.color,
            }}
          />
        ))}
      </View>
    </Pressable>
  );
}
```

### hitSlop for Small Buttons

Use `hitSlop` whenever a tappable element is under 60pt in either dimension.

```tsx
// Pause button, close button, icon buttons
<Pressable
  hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
  style={{ width: 32, height: 32 }}
  onPress={togglePause}
>
  <PauseIcon />
</Pressable>

// Quick reference: hitSlop to reach minimum 44pt
// 32pt element → hitSlop: 6 per side → 44pt effective
// 24pt element → hitSlop: 10 per side → 44pt effective
// 16pt element → hitSlop: 14 per side → 44pt effective
```

### Drag Overlay Pattern

When dragging starts, mount a full-screen invisible overlay to reliably capture all pointer moves — avoids gaps between layout elements.

```tsx
return (
  <View style={styles.container}>
    {/* Game content */}
    <GameGrid />
    <PieceSelector onDragStart={startDrag} />

    {/* Drag overlay — only mounted when dragging */}
    {isDragging && (
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents="box-only"
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderMove={(e) => {
          moveDrag(e.nativeEvent.pageX, e.nativeEvent.pageY);
        }}
        onResponderRelease={endDrag}
        onResponderTerminate={cancelDrag}
      />
    )}

    {/* Dragging piece visual follows finger */}
    {isDragging && <DraggingPiece position={dragPosition} piece={draggingPiece} />}
  </View>
);
```

### Grid Cell Hit Targets

Grid cells in puzzle games need generous hit targets. Add padding to the grid and let cells expand to fill it.

```tsx
// ❌ WRONG — 1px gap between cells, finger lands in dead zone
<View style={{ width: cellSize - 2, height: cellSize - 2, margin: 1 }} />

// ✅ CORRECT — cell fills full slot, visual inset via borderRadius or inner View
<View style={{ width: cellSize, height: cellSize }}>
  <View style={{
    flex: 1,
    margin: 2,
    borderRadius: 4,
    backgroundColor: cell.color,
  }} />
</View>
```

### Pressable Press Feedback

Always give immediate visual feedback on press — no user should wonder if their tap registered.

```tsx
<Pressable
  style={({ pressed }) => ({
    ...styles.button,
    transform: [{ scale: pressed ? 0.93 : 1 }],
    opacity: pressed ? 0.85 : 1,
  })}
  onPress={handlePress}
>
  <Text style={styles.label}>TAP ME</Text>
</Pressable>
```

### Touch Target Audit Checklist

Run this mentally before shipping any game screen:

```
□ Are ALL Pressables at least 44x44pt? (90pt for game piece slots)
□ Does any parent View have onStartShouldSetResponder: () => true unconditionally?
□ Do small buttons (<60pt) have hitSlop?
□ Are piece selectors/card selectors sized to the slot, not the visual?
□ Does pressing any interactive element give immediate visual feedback?
□ Can you click every element without pixel-perfect accuracy?
□ When dragging, do taps on non-dragged elements still work?
```

---

## Swift / SpriteKit Patterns (Native Reference)

## Tap and Swipe Configuration

```swift
struct TapConfig {
    static let maxDuration: TimeInterval = 0.3
    static let maxMovement: CGFloat = 10
    static let multiTapWindow: TimeInterval = 0.3
}

struct SwipeConfig {
    static let minDistance: CGFloat = 50
    static let maxDuration: TimeInterval = 0.3
    static let directionTolerance: CGFloat = 30 // degrees
    static let minVelocity: CGFloat = 300 // points/second
}
```

## Input Buffer

```swift
struct InputBuffer {
    var jumpPressed: Bool = false
    var jumpBufferTime: TimeInterval = 0
    static let jumpBufferDuration: TimeInterval = 0.15

    mutating func update(deltaTime: TimeInterval) {
        if jumpBufferTime > 0 {
            jumpBufferTime -= deltaTime
            if jumpBufferTime <= 0 { jumpPressed = false }
        }
    }

    mutating func bufferJump() {
        jumpPressed = true
        jumpBufferTime = Self.jumpBufferDuration
    }

    mutating func consumeJump() -> Bool {
        if jumpPressed {
            jumpPressed = false
            jumpBufferTime = 0
            return true
        }
        return false
    }
}
```

## Coyote Time (Edge Forgiveness)

```swift
struct CoyoteTime {
    var isGrounded: Bool = false
    var wasGrounded: Bool = false
    var airTime: TimeInterval = 0
    static let coyoteDuration: TimeInterval = 0.1

    var canJump: Bool {
        return isGrounded || (wasGrounded && airTime < Self.coyoteDuration)
    }

    mutating func update(deltaTime: TimeInterval, grounded: Bool) {
        wasGrounded = isGrounded
        isGrounded = grounded
        if isGrounded { airTime = 0 } else { airTime += deltaTime }
    }
}
```

## Virtual Joystick

```swift
final class VirtualJoystick: UIView {
    struct Config {
        var outerRadius: CGFloat = 60
        var innerRadius: CGFloat = 25
        var deadZone: CGFloat = 0.15
        var isFloating: Bool = true
        var responsesCurve: ResponseCurve = .sCurve

        enum ResponseCurve { case linear, quadratic, sCurve }
    }

    private let config: Config
    private var currentOffset: CGPoint = .zero

    var output: CGPoint {
        let normalized = CGPoint(
            x: currentOffset.x / config.outerRadius,
            y: currentOffset.y / config.outerRadius
        )
        return applyResponseCurve(normalized)
    }

    private func applyResponseCurve(_ input: CGPoint) -> CGPoint {
        let magnitude = hypot(input.x, input.y)
        guard magnitude > config.deadZone else { return .zero }

        let remapped = (magnitude - config.deadZone) / (1 - config.deadZone)
        let curved: CGFloat
        switch config.responsesCurve {
        case .linear: curved = remapped
        case .quadratic: curved = remapped * remapped
        case .sCurve: curved = 3 * pow(remapped, 2) - 2 * pow(remapped, 3)
        }

        let scale = curved / magnitude
        return CGPoint(x: input.x * scale, y: input.y * scale)
    }
}
```

## Gyroscope Controller (Super Monkey Ball Style)

```swift
import CoreMotion

final class GyroscopeController {
    struct Config {
        var updateInterval: TimeInterval = 1.0 / 60.0
        var deadZone: Double = 0.05
        var maxTilt: Double = 0.7
        var sensitivity: Double = 1.0
        var smoothingAlpha: Double = 0.2
        var invertX: Bool = false
        var invertY: Bool = false
    }

    struct Calibration {
        var neutralX: Double = 0
        var neutralY: Double = 0
        var neutralZ: Double = -1
    }

    struct TiltOutput {
        let x: Double, y: Double, magnitude: Double, angle: Double
    }

    private let motionManager = CMMotionManager()
    private var config: Config
    private var calibration: Calibration
    private var smoothedX: Double = 0
    private var smoothedY: Double = 0
    var onTiltUpdate: ((TiltOutput) -> Void)?

    func start() {
        motionManager.deviceMotionUpdateInterval = config.updateInterval
        motionManager.startDeviceMotionUpdates(using: .xArbitraryZVertical, to: .main) { [weak self] motion, _ in
            guard let self = self, let motion = motion else { return }
            self.processMotion(motion)
        }
    }

    func calibrate() {
        guard let motion = motionManager.deviceMotion else { return }
        calibration.neutralX = motion.gravity.x
        calibration.neutralY = motion.gravity.y
        calibration.neutralZ = motion.gravity.z
        smoothedX = 0; smoothedY = 0
    }

    private func processMotion(_ motion: CMDeviceMotion) {
        var rawX = (motion.gravity.x - calibration.neutralX) * config.sensitivity
        var rawY = (motion.gravity.y - calibration.neutralY) * config.sensitivity
        if config.invertX { rawX = -rawX }
        if config.invertY { rawY = -rawY }

        // Low-pass filter
        smoothedX = config.smoothingAlpha * rawX + (1 - config.smoothingAlpha) * smoothedX
        smoothedY = config.smoothingAlpha * rawY + (1 - config.smoothingAlpha) * smoothedY

        let x = clamp(applyDeadZone(smoothedX) / config.maxTilt, -1, 1)
        let y = clamp(applyDeadZone(smoothedY) / config.maxTilt, -1, 1)

        onTiltUpdate?(TiltOutput(x: x, y: y, magnitude: min(1, hypot(x, y)), angle: atan2(y, x)))
    }

    private func applyDeadZone(_ value: Double) -> Double {
        if abs(value) < config.deadZone { return 0 }
        let sign = value > 0 ? 1.0 : -1.0
        return sign * (abs(value) - config.deadZone) / (1 - config.deadZone)
    }

    private func clamp(_ v: Double, _ min: Double, _ max: Double) -> Double {
        Swift.max(min, Swift.min(max, v))
    }
}
```

## React Native/Expo Gyroscope Hook

```typescript
import { DeviceMotion } from 'expo-sensors';
import { useEffect, useRef, useState, useCallback } from 'react';

interface TiltOutput { x: number; y: number; magnitude: number; angle: number; }

export function useGyroscope(config = {}, onTilt?: (output: TiltOutput) => void) {
  const [calibration, setCalibration] = useState({ neutralX: 0, neutralY: -1, neutralZ: 0 });
  const [isActive, setIsActive] = useState(false);
  const smoothedX = useRef(0);
  const smoothedY = useRef(0);

  const calibrate = useCallback(() => {
    const sub = DeviceMotion.addListener(({ rotation }) => {
      if (rotation) {
        setCalibration({ neutralX: rotation.gamma || 0, neutralY: rotation.beta || 0, neutralZ: rotation.alpha || 0 });
        sub.remove();
      }
    });
    setTimeout(() => sub.remove(), 100);
  }, []);

  useEffect(() => {
    if (!isActive) return;
    DeviceMotion.setUpdateInterval(16);
    const sub = DeviceMotion.addListener(({ rotation }) => {
      if (!rotation) return;
      // Process tilt (see full implementation in skill)
    });
    return () => sub.remove();
  }, [isActive, calibration]);

  return { isActive, start: () => setIsActive(true), stop: () => setIsActive(false), calibrate };
}
```

## Multi-Touch Manager

```swift
class MultiTouchManager {
    var movementTouch: UITouch?
    var actionTouches: [UITouch] = []

    func touchBegan(_ touch: UITouch, at location: CGPoint) {
        if isInJoystickZone(location) && movementTouch == nil {
            movementTouch = touch
        } else {
            actionTouches.append(touch)
            processActionTouch(touch, at: location)
        }
    }

    func touchEnded(_ touch: UITouch) {
        if touch === movementTouch {
            movementTouch = nil
            resetJoystick()
        } else {
            actionTouches.removeAll { $0 === touch }
        }
    }
}
```

## Button Animation

```swift
struct ButtonAnimation {
    static let pressScale: CGFloat = 0.93
    static let releaseScale: CGFloat = 1.08
    static let pressDuration: TimeInterval = 0.05
    static let releaseDuration: TimeInterval = 0.1
    static let returnDuration: TimeInterval = 0.08
}
```
