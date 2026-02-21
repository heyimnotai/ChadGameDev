import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  useWindowDimensions,
  Platform,
  Animated,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// =============================================================================
// BLOCK FIT - Satisfying Block Puzzle Game
// =============================================================================
// Place randomized shapes onto a grid. Complete rows or columns to clear them
// with explosive effects. Last as long as you can!
//
// Features:
// - 8x8 grid with satisfying block placement
// - Multiple shape types (tetrominoes and more)
// - Row/column clearing with particles and screen shake
// - Combo system for consecutive clears
// - Haptic feedback throughout
// =============================================================================

// Types
type GameMode = 'menu' | 'playing' | 'gameover';
type Cell = string | null; // color string or null for empty
type Grid = Cell[][];

interface Shape {
  id: string;
  blocks: number[][]; // [row, col] offsets from origin
  color: string;
  used: boolean;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface ClearEffect {
  id: string;
  cells: { row: number; col: number }[];
  progress: number;
}

// Constants
const GRID_SIZE = 8;
const COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#FF8C42', // Orange
  '#98D8C8', // Mint
];

// Shape definitions (relative positions from origin at [0,0])
const SHAPE_TEMPLATES = [
  // Single block
  { blocks: [[0, 0]], name: 'dot' },
  // 2-blocks
  { blocks: [[0, 0], [0, 1]], name: 'h2' },
  { blocks: [[0, 0], [1, 0]], name: 'v2' },
  // 3-blocks
  { blocks: [[0, 0], [0, 1], [0, 2]], name: 'h3' },
  { blocks: [[0, 0], [1, 0], [2, 0]], name: 'v3' },
  { blocks: [[0, 0], [0, 1], [1, 0]], name: 'L' },
  { blocks: [[0, 0], [0, 1], [1, 1]], name: 'Lr' },
  { blocks: [[0, 0], [1, 0], [1, 1]], name: 'Ld' },
  { blocks: [[0, 1], [1, 0], [1, 1]], name: 'Ldr' },
  // 4-blocks
  { blocks: [[0, 0], [0, 1], [0, 2], [0, 3]], name: 'h4' },
  { blocks: [[0, 0], [1, 0], [2, 0], [3, 0]], name: 'v4' },
  { blocks: [[0, 0], [0, 1], [1, 0], [1, 1]], name: 'square' },
  { blocks: [[0, 0], [0, 1], [0, 2], [1, 0]], name: 'T1' },
  { blocks: [[0, 0], [0, 1], [0, 2], [1, 2]], name: 'T2' },
  { blocks: [[0, 0], [1, 0], [1, 1], [1, 2]], name: 'T3' },
  { blocks: [[0, 2], [1, 0], [1, 1], [1, 2]], name: 'T4' },
  // 5-blocks (rare)
  { blocks: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], name: 'h5' },
  { blocks: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], name: 'v5' },
  // Big square (rare, powerful)
  { blocks: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]], name: 'bigSquare' },
];

// Utility functions
const createEmptyGrid = (): Grid => {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
};

const generateShape = (id: string): Shape => {
  const template = SHAPE_TEMPLATES[Math.floor(Math.random() * SHAPE_TEMPLATES.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  return {
    id,
    blocks: template.blocks.map(b => [...b]),
    color,
    used: false,
  };
};

const generateShapeSet = (): Shape[] => {
  return [
    generateShape('shape-0'),
    generateShape('shape-1'),
    generateShape('shape-2'),
  ];
};

const canPlaceShape = (grid: Grid, shape: Shape, targetRow: number, targetCol: number): boolean => {
  for (const [dr, dc] of shape.blocks) {
    const r = targetRow + dr;
    const c = targetCol + dc;
    if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
    if (grid[r][c] !== null) return false;
  }
  return true;
};

const placeShape = (grid: Grid, shape: Shape, targetRow: number, targetCol: number): Grid => {
  const newGrid = grid.map(row => [...row]);
  for (const [dr, dc] of shape.blocks) {
    const r = targetRow + dr;
    const c = targetCol + dc;
    newGrid[r][c] = shape.color;
  }
  return newGrid;
};

const findLinesToClear = (grid: Grid): { rows: number[]; cols: number[] } => {
  const rows: number[] = [];
  const cols: number[] = [];

  // Check rows
  for (let r = 0; r < GRID_SIZE; r++) {
    if (grid[r].every(cell => cell !== null)) {
      rows.push(r);
    }
  }

  // Check columns
  for (let c = 0; c < GRID_SIZE; c++) {
    let full = true;
    for (let r = 0; r < GRID_SIZE; r++) {
      if (grid[r][c] === null) {
        full = false;
        break;
      }
    }
    if (full) cols.push(c);
  }

  return { rows, cols };
};

const clearLines = (grid: Grid, rows: number[], cols: number[]): Grid => {
  const newGrid = grid.map(row => [...row]);

  for (const r of rows) {
    for (let c = 0; c < GRID_SIZE; c++) {
      newGrid[r][c] = null;
    }
  }

  for (const c of cols) {
    for (let r = 0; r < GRID_SIZE; r++) {
      newGrid[r][c] = null;
    }
  }

  return newGrid;
};

const canPlaceAnyShape = (grid: Grid, shapes: Shape[]): boolean => {
  for (const shape of shapes) {
    if (shape.used) continue;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (canPlaceShape(grid, shape, r, c)) return true;
      }
    }
  }
  return false;
};

// Main Game Component
function GameContent() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Game state
  const [mode, setMode] = useState<GameMode>('menu');
  const [grid, setGrid] = useState<Grid>(createEmptyGrid);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [totalLines, setTotalLines] = useState(0);
  const [round, setRound] = useState(1);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [clearEffects, setClearEffects] = useState<ClearEffect[]>([]);

  // Animation state
  const screenShake = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const comboScale = useRef(new Animated.Value(1)).current;
  const scoreScale = useRef(new Animated.Value(1)).current;

  // Score popup animation
  const [clearText, setClearText] = useState<string | null>(null);
  const clearTextOpacity = useRef(new Animated.Value(0)).current;
  const clearTextY = useRef(new Animated.Value(0)).current;

  // Haptic throttle - only fire when grid position changes
  const lastHapticCell = useRef<{ row: number; col: number } | null>(null);

  // Dragging state
  const [draggingShape, setDraggingShape] = useState<Shape | null>(null);
  const draggingShapeRef = useRef<Shape | null>(null); // ref for responder callbacks (state is stale inside them)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [previewPosition, setPreviewPosition] = useState<{ row: number; col: number } | null>(null);
  const [canPlace, setCanPlace] = useState(false);

  // Layout calculations
  const safeArea = {
    top: insets.top || 59, // Default for Dynamic Island
    bottom: insets.bottom || 34,
  };

  const gridPadding = 16;
  const maxGridWidth = Math.min(width - gridPadding * 2, 400);
  const cellSize = Math.floor(maxGridWidth / GRID_SIZE);
  const gridWidth = cellSize * GRID_SIZE;
  const gridLeft = (width - gridWidth) / 2;
  const hudHeight = 58; // SCORE label + value height
  const selectorHeight = 110;
  const selectorTopEdge = height - safeArea.bottom - 20 - selectorHeight;
  const availableSpace = selectorTopEdge - (safeArea.top + hudHeight);
  const deadSpace = Math.max(0, availableSpace - gridWidth);
  const gridTop = safeArea.top + hudHeight + Math.max(12, deadSpace * 0.12);

  // Load high score
  useEffect(() => {
    AsyncStorage.getItem('blockfit-highscore').then(saved => {
      if (saved) setHighScore(parseInt(saved, 10));
    });
  }, []);

  // Save high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      AsyncStorage.setItem('blockfit-highscore', score.toString());
    }
  }, [score, highScore]);

  // Particle animation loop
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prev => {
        const updated = prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.5, // gravity
          life: p.life - 1,
          size: p.size * 0.96,
        })).filter(p => p.life > 0);
        return updated;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [particles.length > 0]);

  // Clear effect animation
  useEffect(() => {
    if (clearEffects.length === 0) return;

    const interval = setInterval(() => {
      setClearEffects(prev => {
        const updated = prev.map(e => ({
          ...e,
          progress: e.progress + 0.1,
        })).filter(e => e.progress < 1);
        return updated;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [clearEffects.length > 0]);

  // Dev command handler for Chad testing
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'chad-dev') {
        switch (event.data.action) {
          case 'triggerWin':
            // Block puzzle doesn't have a "win" - just show high score
            setMode('gameover');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
          case 'triggerLose':
            setMode('gameover');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            break;
          case 'goToMenu':
            setMode('menu');
            break;
          case 'toggleDebug':
            // Could add debug overlay here
            break;
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Start game
  const startGame = useCallback(() => {
    setMode('playing');
    setGrid(createEmptyGrid());
    setShapes(generateShapeSet());
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setTotalLines(0);
    setRound(1);
    setParticles([]);
    setClearEffects([]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  // Screen shake effect
  const triggerScreenShake = useCallback((intensity: number = 1) => {
    const shakeSequence: Animated.CompositeAnimation[] = [];
    const count = 6;
    const duration = 40;

    for (let i = 0; i < count; i++) {
      const offset = (count - i) * 3 * intensity;
      shakeSequence.push(
        Animated.timing(screenShake, {
          toValue: {
            x: (Math.random() - 0.5) * offset,
            y: (Math.random() - 0.5) * offset,
          },
          duration,
          useNativeDriver: true,
        })
      );
    }

    shakeSequence.push(
      Animated.timing(screenShake, {
        toValue: { x: 0, y: 0 },
        duration: 50,
        useNativeDriver: true,
      })
    );

    Animated.sequence(shakeSequence).start();
  }, [screenShake]);

  // Spawn particles for cleared cells
  const spawnClearParticles = useCallback((cells: { row: number; col: number; color: string }[]) => {
    const newParticles: Particle[] = [];

    for (const { row, col, color } of cells) {
      const centerX = gridLeft + col * cellSize + cellSize / 2;
      const centerY = gridTop + row * cellSize + cellSize / 2;

      // Spawn multiple particles per cell
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.5;
        const speed = 3 + Math.random() * 5;

        newParticles.push({
          id: `p-${row}-${col}-${i}-${Date.now()}`,
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          color,
          size: 6 + Math.random() * 6,
          life: 30 + Math.random() * 20,
          maxLife: 50,
        });
      }
    }

    setParticles(prev => [...prev, ...newParticles]);
  }, [gridLeft, gridTop, cellSize]);

  // Animate combo pop
  const animateCombo = useCallback(() => {
    comboScale.setValue(1.5);
    Animated.spring(comboScale, {
      toValue: 1,
      friction: 4,
      tension: 150,
      useNativeDriver: true,
    }).start();
  }, [comboScale]);

  // Animate score pop
  const animateScore = useCallback(() => {
    scoreScale.setValue(1.3);
    Animated.spring(scoreScale, {
      toValue: 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [scoreScale]);

  // Show floating score popup
  const showClearText = useCallback((text: string) => {
    setClearText(text);
    clearTextOpacity.setValue(1);
    clearTextY.setValue(0);
    Animated.parallel([
      Animated.timing(clearTextOpacity, {
        toValue: 0,
        duration: 900,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(clearTextY, {
        toValue: -40,
        duration: 1300,
        useNativeDriver: true,
      }),
    ]).start(() => setClearText(null));
  }, [clearTextOpacity, clearTextY]);

  // Handle shape placement
  const handlePlaceShape = useCallback((shape: Shape, targetRow: number, targetCol: number) => {
    if (!canPlaceShape(grid, shape, targetRow, targetCol)) return;

    // Place the shape
    let newGrid = placeShape(grid, shape, targetRow, targetCol);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Check for lines to clear
    const { rows, cols } = findLinesToClear(newGrid);
    const linesCleared = rows.length + cols.length;

    if (linesCleared > 0) {
      // Collect cells to animate
      const cellsToClear: { row: number; col: number; color: string }[] = [];

      for (const r of rows) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (newGrid[r][c]) {
            cellsToClear.push({ row: r, col: c, color: newGrid[r][c]! });
          }
        }
      }

      for (const c of cols) {
        for (let r = 0; r < GRID_SIZE; r++) {
          if (newGrid[r][c] && !rows.includes(r)) {
            cellsToClear.push({ row: r, col: c, color: newGrid[r][c]! });
          }
        }
      }

      // Add clear effects
      setClearEffects(prev => [
        ...prev,
        {
          id: `clear-${Date.now()}`,
          cells: cellsToClear.map(c => ({ row: c.row, col: c.col })),
          progress: 0,
        },
      ]);

      // Spawn particles
      spawnClearParticles(cellsToClear);

      // Clear the lines
      newGrid = clearLines(newGrid, rows, cols);

      // Update combo and score
      const newCombo = combo + 1;
      setCombo(newCombo);
      setBestCombo(prev => Math.max(prev, newCombo));
      setTotalLines(prev => prev + linesCleared);
      animateCombo();

      // Score: base + combo bonus
      const baseScore = linesCleared * 10 * shape.blocks.length;
      const comboBonus = Math.floor(baseScore * newCombo * 0.5);
      const totalScore = baseScore + comboBonus;

      setScore(prev => prev + totalScore);
      animateScore();

      // Show score popup
      const popText = linesCleared >= 3
        ? `TRIPLE! +${totalScore}`
        : linesCleared >= 2
          ? `DOUBLE! +${totalScore}`
          : `+${totalScore}`;
      showClearText(popText);

      // Haptics based on lines cleared
      if (linesCleared >= 3) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        triggerScreenShake(1.5);
      } else if (linesCleared >= 2) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        triggerScreenShake(1);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        triggerScreenShake(0.5);
      }
    } else {
      // No lines cleared - reset combo
      setCombo(0);

      // Small score for placing shape
      setScore(prev => prev + shape.blocks.length);
    }

    setGrid(newGrid);

    // Mark shape as used
    const newShapes = shapes.map(s =>
      s.id === shape.id ? { ...s, used: true } : s
    );

    // Check if all shapes used - generate new set
    if (newShapes.every(s => s.used)) {
      setShapes(generateShapeSet());
      setRound(r => r + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      setShapes(newShapes);
    }

    // Check game over (after new shapes if applicable)
    setTimeout(() => {
      setShapes(currentShapes => {
        setGrid(currentGrid => {
          if (!canPlaceAnyShape(currentGrid, currentShapes)) {
            setMode('gameover');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }
          return currentGrid;
        });
        return currentShapes;
      });
    }, 100);
  }, [grid, shapes, combo, spawnClearParticles, animateCombo, animateScore, triggerScreenShake, showClearText]);

  // Calculate grid position from touch
  const getGridPosition = useCallback((x: number, y: number) => {
    const col = Math.floor((x - gridLeft) / cellSize);
    const row = Math.floor((y - gridTop) / cellSize);
    return { row, col };
  }, [gridLeft, gridTop, cellSize]);

  // Handle drag start
  const handleDragStart = useCallback((shape: Shape, startX: number, startY: number) => {
    draggingShapeRef.current = shape; // keep ref in sync so responder callbacks see fresh value
    setDraggingShape(shape);
    setDragPosition({ x: startX, y: startY - 60 }); // Offset up so finger doesn't cover piece
    Haptics.selectionAsync();
  }, []);

  // Handle drag move
  const handleDragMove = useCallback((x: number, y: number) => {
    if (!draggingShape) return;

    const adjustedY = y - 60;
    setDragPosition({ x, y: adjustedY });

    // Calculate preview position (snap to grid)
    const { row, col } = getGridPosition(x, adjustedY);
    const valid = canPlaceShape(grid, draggingShape, row, col);

    setPreviewPosition({ row, col });
    setCanPlace(valid);

    // Only trigger haptics when moving to a new grid cell
    const last = lastHapticCell.current;
    if (valid && (last?.row !== row || last?.col !== col)) {
      Haptics.selectionAsync();
      lastHapticCell.current = { row, col };
    }
    if (!valid) {
      lastHapticCell.current = null;
    }
  }, [draggingShape, getGridPosition, grid]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (draggingShape && previewPosition && canPlace) {
      handlePlaceShape(draggingShape, previewPosition.row, previewPosition.col);
    }

    draggingShapeRef.current = null;
    setDraggingShape(null);
    setPreviewPosition(null);
    setCanPlace(false);
  }, [draggingShape, previewPosition, canPlace, handlePlaceShape]);

  // Render grid cell
  const renderCell = (row: number, col: number) => {
    const color = grid[row][col];
    const isPreview = draggingShape && previewPosition &&
      draggingShape.blocks.some(([dr, dc]) =>
        previewPosition.row + dr === row && previewPosition.col + dc === col
      );

    const isClearEffect = clearEffects.some(e =>
      e.cells.some(c => c.row === row && c.col === col)
    );

    // Count filled cells in row and column for progress glow
    const rowFilled = grid[row].filter(Boolean).length;
    const colFilled = grid.filter(r => r[col]).length;
    const nearComplete = Math.max(rowFilled, colFilled) >= 6;
    const almostDone = Math.max(rowFilled, colFilled) >= 7;

    let cellStyle: any = {
      width: cellSize - 2,
      height: cellSize - 2,
      margin: 1,
      borderRadius: 4,
      backgroundColor: almostDone && !color ? '#2a2060' : nearComplete && !color ? '#22205a' : '#1e2040',
    };

    if (color) {
      cellStyle.backgroundColor = color;
      cellStyle.shadowColor = color;
      cellStyle.shadowOffset = { width: 0, height: 2 };
      cellStyle.shadowOpacity = 0.5;
      cellStyle.shadowRadius = 4;
    }

    if (isPreview) {
      cellStyle.backgroundColor = canPlace
        ? draggingShape!.color + '80' // Semi-transparent valid
        : '#FF000040'; // Red invalid
      cellStyle.borderWidth = 2;
      cellStyle.borderColor = canPlace ? draggingShape!.color : '#FF0000';
    }

    if (isClearEffect) {
      const effect = clearEffects.find(e =>
        e.cells.some(c => c.row === row && c.col === col)
      );
      if (effect) {
        const scale = 1 + effect.progress * 0.5;
        const opacity = 1 - effect.progress;
        cellStyle.transform = [{ scale }];
        cellStyle.opacity = opacity;
      }
    }

    return (
      <View key={`${row}-${col}`} style={cellStyle} />
    );
  };

  // Render shape in selector
  const renderShape = (shape: Shape, index: number) => {
    if (shape.used) {
      return (
        <View key={shape.id} style={styles.shapeSlotEmpty}>
          <Text style={{ fontSize: 20, color: '#1e1e38' }}>✓</Text>
        </View>
      );
    }

    // Calculate shape bounds
    const minRow = Math.min(...shape.blocks.map(b => b[0]));
    const maxRow = Math.max(...shape.blocks.map(b => b[0]));
    const minCol = Math.min(...shape.blocks.map(b => b[1]));
    const maxCol = Math.max(...shape.blocks.map(b => b[1]));
    const shapeRows = maxRow - minRow + 1;
    const shapeCols = maxCol - minCol + 1;

    const maxDim = Math.max(shapeRows, shapeCols);
    const previewCellSize = Math.floor(80 / maxDim);
    const shapeWidth = shapeCols * previewCellSize;
    const shapeHeight = shapeRows * previewCellSize;

    return (
      <Pressable
        key={shape.id}
        style={({ pressed }) => [
          styles.shapeSlot,
          draggingShape?.id === shape.id && styles.shapeSlotDragging,
          {
            opacity: draggingShape?.id === shape.id ? 0.25 : 1,
            transform: [{ scale: pressed ? 0.93 : 1 }],
          }
        ]}
        onPressIn={(e) => {
          const { pageX, pageY } = e.nativeEvent;
          handleDragStart(shape, pageX, pageY);
        }}
      >
        <View style={{ width: shapeWidth, height: shapeHeight }}>
          {shape.blocks.map(([r, c], i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                left: (c - minCol) * previewCellSize,
                top: (r - minRow) * previewCellSize,
                width: previewCellSize - 2,
                height: previewCellSize - 2,
                borderRadius: 3,
                backgroundColor: shape.color,
              }}
            />
          ))}
        </View>
      </Pressable>
    );
  };

  // Render dragging piece
  const renderDraggingPiece = () => {
    if (!draggingShape) return null;

    const minRow = Math.min(...draggingShape.blocks.map(b => b[0]));
    const maxRow = Math.max(...draggingShape.blocks.map(b => b[0]));
    const minCol = Math.min(...draggingShape.blocks.map(b => b[1]));
    const maxCol = Math.max(...draggingShape.blocks.map(b => b[1]));
    const shapeRows = maxRow - minRow + 1;
    const shapeCols = maxCol - minCol + 1;

    const dragCellSize = cellSize;
    const offsetX = -(shapeCols * dragCellSize) / 2;
    const offsetY = -(shapeRows * dragCellSize) / 2;

    return (
      <Animated.View
        style={{
          position: 'absolute',
          left: dragPosition.x + offsetX,
          top: dragPosition.y + offsetY,
          opacity: 0.9,
          transform: [{ scale: 1.1 }],
        }}
        pointerEvents="none"
      >
        {draggingShape.blocks.map(([r, c], i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: (c - minCol) * dragCellSize,
              top: (r - minRow) * dragCellSize,
              width: dragCellSize - 2,
              height: dragCellSize - 2,
              borderRadius: 6,
              backgroundColor: draggingShape.color,
              shadowColor: draggingShape.color,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.85,
              shadowRadius: 12,
            }}
          />
        ))}
      </Animated.View>
    );
  };

  // Render particles
  const renderParticles = () => {
    return particles.map(p => (
      <View
        key={p.id}
        style={{
          position: 'absolute',
          left: p.x - p.size / 2,
          top: p.y - p.size / 2,
          width: p.size,
          height: p.size,
          borderRadius: p.size / 2,
          backgroundColor: p.color,
          opacity: p.life / p.maxLife,
        }}
        pointerEvents="none"
      />
    ));
  };

  // Menu Screen
  if (mode === 'menu') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={[styles.safeContent, { paddingTop: safeArea.top + 40, paddingBottom: safeArea.bottom + 20 }]}>
          <Text style={styles.title}>BLOCK</Text>
          <Text style={styles.titleAccent}>FIT</Text>

          <Text style={styles.tagline}>Satisfying Block Puzzle</Text>

          <Pressable style={styles.playButton} onPress={startGame}>
            <Text style={styles.playButtonText}>PLAY</Text>
          </Pressable>

          {highScore > 0 && (
            <View style={styles.highScoreBox}>
              <Text style={styles.highScoreLabel}>BEST</Text>
              <Text style={styles.highScoreValue}>{highScore.toLocaleString()}</Text>
            </View>
          )}

          <Text style={styles.hint}>Drag shapes to the grid{'\n'}Complete rows or columns to clear</Text>
        </View>
      </View>
    );
  }

  // Game Over Screen
  if (mode === 'gameover') {
    const isNewHighScore = score === highScore && score > 0;

    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={[styles.safeContent, { paddingTop: safeArea.top + 40, paddingBottom: safeArea.bottom + 20 }]}>
          <Text style={styles.gameOverTitle}>GAME OVER</Text>

          {isNewHighScore && (
            <Text style={styles.newHighScore}>NEW HIGH SCORE!</Text>
          )}

          <View style={styles.scoreBox}>
            <Text style={styles.finalScoreLabel}>SCORE</Text>
            <Text style={styles.finalScoreValue}>{score.toLocaleString()}</Text>
          </View>

          <View style={styles.bestScoreBox}>
            <Text style={styles.bestScoreLabel}>BEST</Text>
            <Text style={styles.bestScoreValue}>{highScore.toLocaleString()}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalLines}</Text>
              <Text style={styles.statLabel}>LINES</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{round}</Text>
              <Text style={styles.statLabel}>ROUNDS</Text>
            </View>
            {bestCombo > 1 && (
              <>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: '#FFD700' }]}>×{bestCombo}</Text>
                  <Text style={styles.statLabel}>BEST COMBO</Text>
                </View>
              </>
            )}
          </View>

          <Pressable style={styles.retryButton} onPress={startGame}>
            <Text style={styles.retryButtonText}>PLAY AGAIN</Text>
          </Pressable>

          <Pressable style={styles.menuButton} onPress={() => setMode('menu')}>
            <Text style={styles.menuButtonText}>MENU</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Playing Screen
  return (
    <View
      style={styles.container}
      // Only claim the responder when a drag is already active.
      // When idle, child Pressables claim touches normally so piece selection works.
      // After onPressIn fires and draggingShapeRef is set, onMoveShouldSetResponder
      // returns true and the parent steals the responder for subsequent move/release.
      onStartShouldSetResponder={() => draggingShapeRef.current !== null}
      onMoveShouldSetResponder={() => draggingShapeRef.current !== null}
      onResponderMove={(e) => {
        const { pageX, pageY } = e.nativeEvent;
        handleDragMove(pageX, pageY);
      }}
      onResponderRelease={handleDragEnd}
      onResponderTerminate={handleDragEnd}
    >
      <StatusBar style="light" />

      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              { translateX: screenShake.x },
              { translateY: screenShake.y },
            ],
          },
        ]}
      >
        {/* HUD */}
        <View style={[styles.hud, { top: safeArea.top }]}>
          <View style={styles.hudItem}>
            <Text style={styles.hudLabel}>SCORE</Text>
            <Animated.Text style={[styles.hudValue, { transform: [{ scale: scoreScale }] }]}>
              {score.toLocaleString()}
            </Animated.Text>
          </View>

          {combo > 1 ? (
            <Animated.View style={[styles.comboContainer, { transform: [{ scale: comboScale }] }]}>
              <Text style={styles.comboText}>{combo}x COMBO</Text>
            </Animated.View>
          ) : (
            <View style={styles.hudItem}>
              <Text style={styles.hudLabel}>LINES</Text>
              <Text style={styles.hudValueSmall}>{totalLines}</Text>
            </View>
          )}

          <View style={styles.hudItem}>
            <Text style={styles.hudLabel}>BEST</Text>
            <Text style={styles.hudValueSmall}>{highScore.toLocaleString()}</Text>
          </View>
        </View>

        {/* Grid */}
        <View style={[styles.gridContainer, { left: gridLeft, top: gridTop }]}>
          <View style={[styles.grid, { width: gridWidth, height: gridWidth }]}>
            {Array(GRID_SIZE).fill(null).map((_, row) => (
              <View key={row} style={styles.gridRow}>
                {Array(GRID_SIZE).fill(null).map((_, col) => renderCell(row, col))}
              </View>
            ))}
          </View>
        </View>

        {/* Instruction hint + round */}
        <View style={[styles.hintContainer, { bottom: safeArea.bottom + selectorHeight + 18 }]}>
          <View style={styles.hintDivider} />
          <View style={styles.hintRow}>
            <Text style={styles.roundLabel}>ROUND {round}</Text>
            {bestCombo > 1 && (
              <Text style={styles.bestComboLabel}>BEST ×{bestCombo}</Text>
            )}
          </View>
          <Text style={styles.hintLabel}>
            {draggingShape ? '▲  DROP ON GRID  ▲' : 'DRAG A PIECE TO PLACE'}
          </Text>
        </View>

        {/* Shape Selector */}
        <View style={[styles.shapeSelector, { bottom: safeArea.bottom + 20 }]}>
          {shapes.map((shape, index) => renderShape(shape, index))}
        </View>

        {/* Score popup */}
        {clearText && (
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: gridTop + gridWidth / 2 - 30,
              alignItems: 'center',
              opacity: clearTextOpacity,
              transform: [{ translateY: clearTextY }],
            }}
            pointerEvents="none"
          >
            <Text style={styles.clearPopupText}>{clearText}</Text>
          </Animated.View>
        )}

        {/* Particles */}
        {renderParticles()}

        {/* Dragging piece */}
        {renderDraggingPiece()}
      </Animated.View>
    </View>
  );
}

// Root component
export default function App() {
  return (
    <SafeAreaProvider>
      <GameContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  safeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Menu styles
  title: {
    fontSize: 72,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 8,
  },
  titleAccent: {
    fontSize: 72,
    fontWeight: '900',
    color: '#4ECDC4',
    letterSpacing: 8,
    marginTop: -15,
  },
  tagline: {
    fontSize: 14,
    color: '#7788aa',
    marginTop: 16,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  playButton: {
    marginTop: 52,
    paddingVertical: 20,
    paddingHorizontal: 80,
    backgroundColor: '#4ECDC4',
    borderRadius: 36,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  playButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a0a1a',
    letterSpacing: 4,
  },
  highScoreBox: {
    marginTop: 50,
    alignItems: 'center',
  },
  highScoreLabel: {
    fontSize: 12,
    color: '#8888aa',
    letterSpacing: 2,
  },
  highScoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
  },
  hint: {
    fontSize: 13,
    color: '#5566aa',
    textAlign: 'center',
    marginTop: 36,
    lineHeight: 22,
    letterSpacing: 0.5,
  },
  // Game Over styles
  gameOverTitle: {
    fontSize: 44,
    fontWeight: '900',
    color: '#FF6B6B',
    letterSpacing: 4,
  },
  newHighScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 16,
    letterSpacing: 2,
  },
  scoreBox: {
    marginTop: 40,
    alignItems: 'center',
  },
  finalScoreLabel: {
    fontSize: 14,
    color: '#8888aa',
    letterSpacing: 3,
  },
  finalScoreValue: {
    fontSize: 72,
    fontWeight: '900',
    color: '#4ECDC4',
    marginTop: 4,
  },
  bestScoreBox: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: '#1a1a35',
    borderRadius: 16,
  },
  bestScoreLabel: {
    fontSize: 11,
    color: '#7788aa',
    letterSpacing: 2,
  },
  bestScoreValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#aaaacc',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#111128',
    borderRadius: 16,
    gap: 0,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#aaaacc',
  },
  statLabel: {
    fontSize: 9,
    color: '#555577',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#252545',
  },
  retryButton: {
    marginTop: 32,
    paddingVertical: 18,
    paddingHorizontal: 56,
    backgroundColor: '#4ECDC4',
    borderRadius: 32,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  retryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a0a1a',
    letterSpacing: 2,
  },
  menuButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  menuButtonText: {
    fontSize: 16,
    color: '#7788aa',
    letterSpacing: 2,
  },
  // Playing styles
  hud: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  hudItem: {
    alignItems: 'center',
  },
  hudLabel: {
    fontSize: 10,
    color: '#8888aa',
    letterSpacing: 1,
  },
  hudValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 2,
  },
  hudValueSmall: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#aaaacc',
    marginTop: 2,
  },
  comboContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFD700',
    borderRadius: 20,
  },
  comboText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a0a1a',
  },
  gridContainer: {
    position: 'absolute',
  },
  grid: {
    backgroundColor: '#0d0d20',
    borderRadius: 14,
    padding: 4,
    borderWidth: 2,
    borderColor: '#2a2a50',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  hintContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  hintDivider: {
    width: 40,
    height: 1,
    backgroundColor: '#252545',
    marginBottom: 10,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 6,
  },
  roundLabel: {
    fontSize: 10,
    color: '#5577aa',
    letterSpacing: 3,
    fontWeight: '700',
  },
  bestComboLabel: {
    fontSize: 10,
    color: '#FFD700',
    letterSpacing: 2,
    fontWeight: '700',
  },
  clearPopupText: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 2,
  },
  hintLabel: {
    fontSize: 11,
    color: '#5566aa',
    letterSpacing: 2,
    fontWeight: '600',
  },
  gridRow: {
    flexDirection: 'row',
  },
  shapeSelector: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 110,
  },
  shapeSlot: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151528',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#252545',
  },
  shapeSlotDragging: {
    borderColor: '#4466aa',
    backgroundColor: '#0d0d25',
    borderStyle: 'dashed',
  },
  shapeSlotEmpty: {
    width: 90,
    height: 90,
    backgroundColor: '#0a0a1c',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e1e38',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
