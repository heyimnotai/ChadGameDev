import React, { useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, PanResponder, useWindowDimensions } from 'react-native';
import { GameEngine as RNGameEngine } from 'react-native-game-engine';
import { SkiaRenderer } from './renderer';
import { TouchSystem } from './systems';
import { AnimationSystem } from './systems/AnimationSystem';
import { AudioManager } from './systems/AudioSystem';
import { GameEntity } from './entities';

export interface GameState {
  entities: Record<string, GameEntity>;
}

export type UpdateFunction = (
  state: GameState,
  deltaTime: number
) => GameState;

interface EngineProps {
  initialEntities: Record<string, GameEntity>;
  update: UpdateFunction;
  backgroundColor?: string;
  onReady?: () => void;
}

export function Engine({
  initialEntities,
  update,
  backgroundColor = '#000000',
  onReady,
}: EngineProps) {
  const { width, height } = useWindowDimensions();
  const entitiesRef = useRef(initialEntities);
  const lastTimeRef = useRef(Date.now());

  // Initialize audio on mount
  useEffect(() => {
    AudioManager.initialize();
    onReady?.();
    return () => {
      AudioManager.cleanup();
    };
  }, []);

  // Create pan responder for touch handling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        TouchSystem.handleTouchStart(locationX, locationY);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        TouchSystem.handleTouchMove(locationX, locationY);
      },
      onPanResponderRelease: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        TouchSystem.handleTouchEnd(locationX, locationY);
      },
    })
  ).current;

  // Game loop system for RNGE
  const gameLoopSystem = useCallback((
    entities: Record<string, GameEntity>,
    { time }: { time: { delta: number } }
  ) => {
    const deltaTime = time.delta;

    // Update animations
    AnimationSystem.update(entities, deltaTime);

    // Call user update function
    const newState = update({ entities }, deltaTime);

    return newState.entities;
  }, [update]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <RNGameEngine
        style={[styles.engine, { width, height }]}
        systems={[gameLoopSystem]}
        entities={entitiesRef.current}
        running={true}
        renderer={(entities: Record<string, GameEntity>) => (
          <SkiaRenderer
            entities={entities}
            backgroundColor={backgroundColor}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  engine: {
    flex: 1,
  },
});
