import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Engine,
  GameState,
  createSprite,
  createText,
  Vector2,
  Color,
  TouchSystem,
  HapticManager,
} from '@expo-games/game-engine';

// Create initial game entities
function createInitialEntities() {
  return {
    background: createSprite('background', {
      position: new Vector2(200, 400),
      width: 400,
      height: 800,
      color: new Color(0.1, 0.1, 0.15),
    }),
    player: createSprite('player', {
      position: new Vector2(200, 600),
      width: 80,
      height: 80,
      color: Color.cyan,
      cornerRadius: 16,
    }),
    title: createText('title', 'Game Template', {
      position: new Vector2(200, 100),
      fontSize: 48,
      color: Color.white,
      align: 'center',
    }),
    instructions: createText('instructions', 'Tap anywhere to move', {
      position: new Vector2(200, 160),
      fontSize: 24,
      color: Color.gray,
      align: 'center',
    }),
  };
}

export default function App() {
  const [entities] = useState(createInitialEntities);

  // Set up touch handling
  React.useEffect(() => {
    const unsubscribe = TouchSystem.onGesture((event) => {
      if (event.type === 'tap') {
        const player = entities.player;
        player.position = event.position;
        HapticManager.impact('light');
      }
    });
    return unsubscribe;
  }, [entities]);

  // Game update function
  const update = useCallback((state: GameState, deltaTime: number): GameState => {
    // Add game logic here
    return state;
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Engine
        initialEntities={entities}
        update={update}
        backgroundColor="#000000"
      />
    </SafeAreaProvider>
  );
}
