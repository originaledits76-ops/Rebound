/**
 * Ricochet Minigolf - Handcrafted Level Runtime Engine
 * Complete self-contained Phaser 3 Implementation
 */

import Phaser from 'phaser';

// =======================================================
// SPECIFICATION 1: THE LEVEL DATASET (HANDCRAFTED_LEVELS_DATA - 20 Handcrafted Levels)
// Padded Arena Box (Inner Boundary: X: 50 to 550, Y: 90 to 750)
// =======================================================
export const HANDCRAFTED_LEVELS_DATA = [
  {
    levelNumber: 1,
    title: "The Basics",
    difficulty: "easy",
    instruction: "Drag and release to aim & shoot!",
    startPos: { x: 300, y: 680 },
    holePos: { x: 300, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 }
    ],
    portals: [],
    lasers: [],
    movingWalls: []
  },
  {
    levelNumber: 2,
    title: "First Bounce",
    difficulty: "easy",
    instruction: "Bounce the ball off walls to reach the hole.",
    startPos: { x: 300, y: 680 },
    holePos: { x: 300, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 420, width: 260, height: 20, angle: 0 }
    ],
    portals: [],
    lasers: [],
    movingWalls: []
  },
  {
    levelNumber: 3,
    title: "Double Reflection",
    difficulty: "easy",
    instruction: "Plan your bounce angles carefully.",
    startPos: { x: 180, y: 680 },
    holePos: { x: 420, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 200, y: 500, width: 220, height: 20, angle: 0 },
      { x: 400, y: 320, width: 220, height: 20, angle: 0 }
    ],
    portals: [],
    lasers: [],
    movingWalls: []
  },
  {
    levelNumber: 4,
    title: "Corridors",
    difficulty: "medium",
    instruction: "Thread the needle through tight spaces.",
    startPos: { x: 300, y: 680 },
    holePos: { x: 300, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 230, y: 420, width: 20, height: 320, angle: 0 },
      { x: 370, y: 420, width: 20, height: 320, angle: 0 }
    ],
    portals: [],
    lasers: [],
    movingWalls: []
  },
  {
    levelNumber: 5,
    title: "Danger Zone",
    difficulty: "medium",
    instruction: "Avoid deadly lasers!",
    startPos: { x: 300, y: 680 },
    holePos: { x: 300, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 320, width: 180, height: 20, angle: 0 }
    ],
    portals: [],
    lasers: [
      { x1: 60, y1: 480, x2: 440, y2: 480 }
    ],
    movingWalls: []
  },
  {
    levelNumber: 6,
    title: "Laser Passage",
    difficulty: "medium",
    instruction: "Bounce around the laser hazard.",
    startPos: { x: 180, y: 680 },
    holePos: { x: 420, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 220, y: 520, width: 220, height: 20, angle: 0 },
      { x: 380, y: 300, width: 220, height: 20, angle: 0 }
    ],
    portals: [],
    lasers: [
      { x1: 120, y1: 410, x2: 380, y2: 410 }
    ],
    movingWalls: []
  },
  {
    levelNumber: 7,
    title: "Warp Space",
    difficulty: "medium-hard",
    instruction: "Shoot into portals to warp across the arena!",
    startPos: { x: 180, y: 680 },
    holePos: { x: 420, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 420, width: 480, height: 20, angle: 0 }
    ],
    portals: [
      { x1: 180, y1: 540, x2: 420, y2: 280, angle1: 0, angle2: 0 }
    ],
    lasers: [],
    movingWalls: []
  },
  {
    levelNumber: 8,
    title: "Portal & Bounce",
    difficulty: "hard",
    instruction: "Combine portals and bounces.",
    startPos: { x: 300, y: 680 },
    holePos: { x: 180, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 450, width: 360, height: 20, angle: 0 },
      { x: 280, y: 260, width: 20, height: 160, angle: 0 }
    ],
    portals: [
      { x1: 300, y1: 580, x2: 440, y2: 260, angle1: 0, angle2: 0 }
    ],
    lasers: [],
    movingWalls: []
  },
  {
    levelNumber: 9,
    title: "Timing",
    difficulty: "hard",
    instruction: "Time your shot when the path clears!",
    startPos: { x: 300, y: 680 },
    holePos: { x: 300, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 140, y: 420, width: 140, height: 20, angle: 0 },
      { x: 460, y: 420, width: 140, height: 20, angle: 0 }
    ],
    portals: [],
    lasers: [],
    movingWalls: [
      { startX: 180, startY: 420, endX: 420, endY: 420, duration: 1800 }
    ]
  },
  {
    levelNumber: 10,
    title: "Grand Puzzle",
    difficulty: "expert",
    instruction: "Use everything you've learned!",
    startPos: { x: 150, y: 680 },
    holePos: { x: 450, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 220, y: 550, width: 180, height: 20, angle: 0 },
      { x: 380, y: 320, width: 180, height: 20, angle: 0 }
    ],
    portals: [
      { x1: 480, y1: 620, x2: 120, y2: 260, angle1: 0, angle2: 0 }
    ],
    lasers: [
      { x1: 150, y1: 420, x2: 450, y2: 420 }
    ],
    movingWalls: [
      { startX: 220, startY: 260, endX: 380, endY: 260, duration: 2000 }
    ]
  },

  // =======================================================
  // EXPANSION: hand-crafted levels 11 TO 20 (No Lasers, No Portals)
  // =======================================================
  {
    levelNumber: 11,
    title: "Dual Bounce",
    difficulty: "medium",
    instruction: "Navigate wide channels with clean ricochets!",
    startPos: { x: 180, y: 680 },
    holePos: { x: 420, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 220, y: 500, width: 240, height: 20, angle: 0 },
      { x: 380, y: 320, width: 240, height: 20, angle: 0 }
    ],
    portals: [],
    lasers: [],
    movingWalls: []
  },
  {
    levelNumber: 12,
    title: "Zig Zag",
    difficulty: "medium",
    instruction: "Zig-zag your way to the target!",
    startPos: { x: 150, y: 680 },
    holePos: { x: 450, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 200, y: 540, width: 220, height: 20, angle: 0 },
      { x: 400, y: 380, width: 220, height: 20, angle: 0 },
      { x: 200, y: 240, width: 220, height: 20, angle: 0 }
    ],
    portals: [],
    lasers: [],
    movingWalls: []
  },
  {
    levelNumber: 13,
    title: "Gatekeeper",
    difficulty: "medium-hard",
    instruction: "Wait for the moving gate to open!",
    startPos: { x: 300, y: 680 },
    holePos: { x: 300, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 140, y: 420, width: 140, height: 20, angle: 0 },
      { x: 460, y: 420, width: 140, height: 20, angle: 0 }
    ],
    portals: [],
    lasers: [],
    movingWalls: [
      { startX: 200, startY: 420, endX: 400, endY: 420, duration: 2200 }
    ]
  },
  {
    levelNumber: 14,
    title: "Moving Barrier",
    difficulty: "medium-hard",
    instruction: "Time your bounce off the side walls.",
    startPos: { x: 180, y: 680 },
    holePos: { x: 420, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 480, width: 220, height: 20, angle: 0 }
    ],
    portals: [],
    lasers: [],
    movingWalls: [
      { startX: 200, startY: 320, endX: 400, endY: 320, duration: 2400 }
    ]
  },
  {
    levelNumber: 15,
    title: "Chamber Run",
    difficulty: "hard",
    instruction: "Bank the ball through the inner chambers!",
    startPos: { x: 150, y: 680 },
    holePos: { x: 450, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 250, y: 520, width: 260, height: 20, angle: 0 },
      { x: 350, y: 340, width: 260, height: 20, angle: 0 }
    ],
    portals: [],
    lasers: [],
    movingWalls: []
  },
  {
    levelNumber: 16,
    title: "Ricochet Alley",
    difficulty: "hard",
    instruction: "Angles are key to navigating the alley.",
    startPos: { x: 300, y: 680 },
    holePos: { x: 300, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 180, y: 460, width: 20, height: 200, angle: 0 },
      { x: 420, y: 460, width: 20, height: 200, angle: 0 },
      { x: 300, y: 290, width: 140, height: 20, angle: 0 }
    ],
    portals: [],
    lasers: [],
    movingWalls: []
  },
  {
    levelNumber: 17,
    title: "Cross Motion",
    difficulty: "hard",
    instruction: "Watch the movement of both gates!",
    startPos: { x: 300, y: 680 },
    holePos: { x: 300, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 120, y: 480, width: 100, height: 20, angle: 0 },
      { x: 480, y: 480, width: 100, height: 20, angle: 0 },
      { x: 120, y: 300, width: 100, height: 20, angle: 0 },
      { x: 480, y: 300, width: 100, height: 20, angle: 0 }
    ],
    portals: [],
    lasers: [],
    movingWalls: [
      { startX: 180, startY: 480, endX: 420, endY: 480, duration: 2000 },
      { startX: 420, startY: 300, endX: 180, endY: 300, duration: 2000 }
    ]
  },
  {
    levelNumber: 18,
    title: "Precision Timing",
    difficulty: "expert",
    instruction: "Find the moment when both paths align.",
    startPos: { x: 150, y: 680 },
    holePos: { x: 450, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 450, width: 220, height: 20, angle: 0 }
    ],
    portals: [],
    lasers: [],
    movingWalls: [
      { startX: 140, startY: 560, endX: 300, endY: 560, duration: 2500 },
      { startX: 300, startY: 300, endX: 460, endY: 300, duration: 2500 }
    ]
  },
  {
    levelNumber: 19,
    title: "The Fortress",
    difficulty: "expert",
    instruction: "Bypass the fortress defenses!",
    startPos: { x: 300, y: 680 },
    holePos: { x: 300, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 420, width: 180, height: 20, angle: 0 },
      { x: 180, y: 420, width: 20, height: 160, angle: 0 },
      { x: 420, y: 420, width: 20, height: 160, angle: 0 }
    ],
    portals: [],
    lasers: [],
    movingWalls: [
      { startX: 200, startY: 260, endX: 400, endY: 260, duration: 2500 }
    ]
  },
  {
    levelNumber: 20,
    title: "Master Ricochet",
    difficulty: "expert",
    instruction: "Show your total mastery of ricochet physics!",
    startPos: { x: 150, y: 680 },
    holePos: { x: 450, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 200, y: 540, width: 180, height: 20, angle: 0 },
      { x: 400, y: 340, width: 180, height: 20, angle: 0 }
    ],
    portals: [],
    lasers: [],
    movingWalls: [
      { startX: 180, startY: 440, endX: 420, endY: 440, duration: 2400 },
      { startX: 420, startY: 240, endX: 180, endY: 240, duration: 2800 }
    ]
  },
  {
    levelNumber: 21,
    title: "Warp Transit",
    difficulty: "medium",
    instruction: "Teleport past the moving barrier.",
    startPos: { x: 180, y: 680 },
    holePos: { x: 420, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 440, width: 340, height: 20, angle: 0 }
    ],
    portals: [
      { x1: 180, y1: 560, x2: 420, y2: 280, angle1: 0, angle2: 0 }
    ],
    lasers: [],
    movingWalls: [
      { startX: 280, startY: 200, endX: 440, endY: 200, duration: 2800 }
    ]
  },
  {
    levelNumber: 22,
    title: "Laser Portal",
    difficulty: "medium",
    instruction: "Bypass the beam using space warping.",
    startPos: { x: 300, y: 680 },
    holePos: { x: 300, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 440, width: 340, height: 20, angle: 0 }
    ],
    portals: [
      { x1: 180, y1: 580, x2: 420, y2: 280, angle1: 0, angle2: 0 }
    ],
    lasers: [],
    movingWalls: []
  },
  {
    levelNumber: 23,
    title: "Shifting Beams",
    difficulty: "medium",
    instruction: "Combine timing with precise bouncing.",
    startPos: { x: 150, y: 680 },
    holePos: { x: 450, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 220, y: 500, width: 220, height: 20, angle: 0 }
    ],
    portals: [],
    lasers: [
      { x1: 200, y1: 360, x2: 480, y2: 360 }
    ],
    movingWalls: [
      { startX: 160, startY: 240, endX: 360, endY: 240, duration: 2600 }
    ]
  },
  {
    levelNumber: 24,
    title: "Orbiting Warp",
    difficulty: "medium",
    instruction: "Portal through to the moving corridor.",
    startPos: { x: 300, y: 680 },
    holePos: { x: 180, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 440, width: 240, height: 20, angle: 0 }
    ],
    portals: [
      { x1: 420, y1: 580, x2: 180, y2: 320, angle1: 0, angle2: 0 }
    ],
    lasers: [],
    movingWalls: [
      { startX: 200, startY: 220, endX: 400, endY: 220, duration: 2500 }
    ]
  },
  {
    levelNumber: 25,
    title: "Double Ricochet Gate",
    difficulty: "medium-hard",
    instruction: "Bounce off the side walls to bypass the central barrier.",
    startPos: { x: 300, y: 680 },
    holePos: { x: 300, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 420, width: 280, height: 20, angle: 0 }
    ],
    portals: [],
    lasers: [],
    movingWalls: [
      { startX: 160, startY: 280, endX: 300, endY: 280, duration: 2200 }
    ]
  },
  {
    levelNumber: 26,
    title: "Sliding Guard",
    difficulty: "medium-hard",
    instruction: "Dodge the laser and time the sliding barrier.",
    startPos: { x: 300, y: 680 },
    holePos: { x: 300, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 140, y: 450, width: 120, height: 20, angle: 0 },
      { x: 460, y: 450, width: 120, height: 20, angle: 0 }
    ],
    portals: [],
    lasers: [
      { x1: 180, y1: 550, x2: 420, y2: 550 }
    ],
    movingWalls: [
      { startX: 200, startY: 320, endX: 400, endY: 320, duration: 2400 }
    ]
  },
  {
    levelNumber: 27,
    title: "Double Warp Relay",
    difficulty: "medium-hard",
    instruction: "Portal bounce into the dynamic target zone.",
    startPos: { x: 150, y: 680 },
    holePos: { x: 450, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 480, width: 260, height: 20, angle: 0 }
    ],
    portals: [
      { x1: 150, y1: 580, x2: 450, y2: 360, angle1: 0, angle2: 0 }
    ],
    lasers: [],
    movingWalls: [
      { startX: 240, startY: 240, endX: 420, endY: 240, duration: 2300 }
    ]
  },
  {
    levelNumber: 28,
    title: "Laser Gate Portal",
    difficulty: "hard",
    instruction: "Shoot through the portal gap past laser lines.",
    startPos: { x: 300, y: 680 },
    holePos: { x: 180, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 440, width: 300, height: 20, angle: 0 }
    ],
    portals: [
      { x1: 420, y1: 580, x2: 420, y2: 260, angle1: 0, angle2: 0 }
    ],
    lasers: [
      { x1: 120, y1: 340, x2: 320, y2: 340 }
    ],
    movingWalls: []
  },
  {
    levelNumber: 29,
    title: "Dual Motion Hazard",
    difficulty: "hard",
    instruction: "Time your shot past moving walls and lasers.",
    startPos: { x: 180, y: 680 },
    holePos: { x: 420, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 500, width: 220, height: 20, angle: 0 }
    ],
    portals: [],
    lasers: [
      { x1: 140, y1: 360, x2: 460, y2: 360 }
    ],
    movingWalls: [
      { startX: 180, startY: 240, endX: 420, endY: 240, duration: 2200 }
    ]
  },
  {
    levelNumber: 30,
    title: "Grand Portal Matrix",
    difficulty: "hard",
    instruction: "Time your portal shot into the moving exit zone!",
    startPos: { x: 180, y: 680 },
    holePos: { x: 420, y: 160 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 200, y: 520, width: 220, height: 20, angle: 0 },
      { x: 400, y: 380, width: 220, height: 20, angle: 0 },
      { x: 200, y: 260, width: 180, height: 20, angle: 0 }
    ],
    portals: [
      { x1: 150, y1: 600, x2: 280, y2: 320, angle1: 0, angle2: 0 }
    ],
    lasers: [],
    movingWalls: [
      { startX: 220, startY: 240, endX: 380, endY: 240, duration: 2400 }
    ]
  },
  {
    levelNumber: 31,
    title: "The Setup",
    difficultyTier: 3,
    instruction: "Warp through the portal behind the wall to reach the hole.",
    startPos: { x: 300, y: 680 },
    holePos: { x: 500, y: 150 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 120, y: 400, width: 20, height: 400, angle: 0 }
    ],
    portals: [
      { x1: 160, y1: 650, x2: 500, y2: 300, angle1: 0, angle2: 0 }
    ],
    lasers: [],
    movingWalls: []
  },
  {
    levelNumber: 32,
    title: "The Timed Squeeze",
    difficultyTier: 3,
    instruction: "Time your shot precisely as the central walls pull apart.",
    startPos: { x: 300, y: 680 },
    holePos: { x: 300, y: 150 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 }
    ],
    portals: [],
    lasers: [],
    movingWalls: [
      { startX: 100, startY: 400, endX: 250, endY: 400, width: 200, height: 30, duration: 1800 },
      { startX: 500, startY: 400, endX: 350, endY: 400, width: 200, height: 30, duration: 1800 }
    ]
  },
  {
    levelNumber: 33,
    title: "The V-Bounce",
    difficultyTier: 3,
    instruction: "Bank off the top V-walls to bounce over the central divider.",
    startPos: { x: 120, y: 680 },
    holePos: { x: 480, y: 680 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 550, width: 20, height: 300, angle: 0 },
      { x: 250, y: 200, width: 160, height: 20, angle: 45 },
      { x: 350, y: 200, width: 160, height: 20, angle: -45 }
    ],
    portals: [],
    lasers: [],
    movingWalls: []
  },
  {
    levelNumber: 34,
    title: "Laser Timing",
    difficultyTier: 3,
    instruction: "Time your shot past the pulsing laser and bank off the deflectors.",
    startPos: { x: 300, y: 680 },
    holePos: { x: 300, y: 140 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 200, y: 280, width: 140, height: 20, angle: 30 },
      { x: 400, y: 280, width: 140, height: 20, angle: -30 }
    ],
    portals: [],
    lasers: [
      { x1: 50, y1: 400, x2: 550, y2: 400 }
    ],
    movingWalls: []
  },
  {
    levelNumber: 35,
    title: "Portal Shield",
    difficultyTier: 4,
    instruction: "Teleport to the right flank to bypass the moving shield.",
    startPos: { x: 460, y: 680 },
    holePos: { x: 140, y: 150 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 420, width: 20, height: 500, angle: 0 }
    ],
    portals: [
      { x1: 140, y1: 650, x2: 460, y2: 250, angle1: 0, angle2: 0 }
    ],
    lasers: [],
    movingWalls: [
      { startX: 140, startY: 220, endX: 140, endY: 380, width: 20, height: 120, duration: 2000 }
    ]
  },
  {
    levelNumber: 36,
    title: "The Zig-Zag",
    difficultyTier: 4,
    instruction: "Snake your way through the triple zig-zag corridor.",
    startPos: { x: 300, y: 710 },
    holePos: { x: 300, y: 130 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 220, y: 560, width: 370, height: 20, angle: 0 },
      { x: 380, y: 400, width: 370, height: 20, angle: 0 },
      { x: 220, y: 240, width: 370, height: 20, angle: 0 }
    ],
    portals: [],
    lasers: [],
    movingWalls: []
  },
  {
    levelNumber: 37,
    title: "The Pinhole",
    difficultyTier: 4,
    instruction: "Thread the needle through the exact 35px gap in the central wall.",
    startPos: { x: 300, y: 680 },
    holePos: { x: 300, y: 140 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 157, y: 400, width: 232, height: 20, angle: 0 },
      { x: 443, y: 400, width: 232, height: 20, angle: 0 }
    ],
    portals: [],
    lasers: [],
    movingWalls: [
      { startX: 200, startY: 250, endX: 400, endY: 250, width: 120, height: 20, duration: 1800 }
    ]
  },
  {
    levelNumber: 38,
    title: "The Portal Box",
    difficultyTier: 4,
    instruction: "Warp into the closed box, bounce off the inner angled wall to hit Portal B!",
    startPos: { x: 300, y: 680 },
    holePos: { x: 300, y: 140 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 300, width: 320, height: 20, angle: 0 },
      { x: 300, y: 500, width: 320, height: 20, angle: 0 },
      { x: 140, y: 400, width: 20, height: 220, angle: 0 },
      { x: 460, y: 400, width: 20, height: 220, angle: 0 },
      { x: 250, y: 400, width: 100, height: 20, angle: -45 }
    ],
    portals: [
      { x1: 100, y1: 650, x2: 200, y2: 450, angle1: 0, angle2: 0 },
      { x1: 350, y1: 350, x2: 480, y2: 200, angle1: 0, angle2: 0 }
    ],
    lasers: [],
    movingWalls: []
  },
  {
    levelNumber: 39,
    title: "The Crusher",
    difficultyTier: 4,
    instruction: "Dodge three fast crushing sweepers to reach the top right exit.",
    startPos: { x: 140, y: 680 },
    holePos: { x: 460, y: 140 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 }
    ],
    portals: [],
    lasers: [],
    movingWalls: [
      { startX: 160, startY: 550, endX: 440, endY: 550, width: 30, height: 120, duration: 1500 },
      { startX: 440, startY: 380, endX: 160, endY: 380, width: 30, height: 120, duration: 1400 },
      { startX: 200, startY: 210, endX: 400, endY: 210, width: 30, height: 120, duration: 1300 }
    ]
  },
  {
    levelNumber: 40,
    title: "The Gauntlet",
    difficultyTier: 4,
    instruction: "Choose the right portal, dodge the laser, and time the shield!",
    startPos: { x: 300, y: 680 },
    holePos: { x: 300, y: 140 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 480, width: 280, height: 20, angle: 0 }
    ],
    portals: [
      { x1: 130, y1: 620, x2: 470, y2: 330, angle1: 0, angle2: 0 },
      { x1: 470, y1: 620, x2: 130, y2: 330, angle1: 0, angle2: 0 }
    ],
    lasers: [
      { x1: 100, y1: 450, x2: 500, y2: 450 }
    ],
    movingWalls: [
      { startX: 200, startY: 220, endX: 400, endY: 220, width: 120, height: 20, duration: 1800 }
    ]
  },
  {
    levelNumber: 41,
    title: "The Safe Zone",
    difficultyTier: 5,
    instruction: "Bounce off the side wall and time the sweeper to clear the gap.",
    startPos: { x: 150, y: 680 },
    holePos: { x: 450, y: 150 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 500, y: 450, width: 20, height: 100, angle: 0 }
    ],
    portals: [],
    lasers: [],
    movingWalls: [
      { startX: 200, startY: 450, endX: 380, endY: 450, width: 280, height: 20, duration: 1200 }
    ]
  },
  {
    levelNumber: 42,
    title: "Isolation Chambers",
    difficultyTier: 5,
    instruction: "Teleport room by room and bank off the angle pad to reach the exit.",
    startPos: { x: 140, y: 680 },
    holePos: { x: 460, y: 150 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 530, width: 500, height: 20, angle: 0 },
      { x: 300, y: 310, width: 500, height: 20, angle: 0 },
      { x: 450, y: 420, width: 100, height: 20, angle: -45 }
    ],
    portals: [
      { x1: 460, y1: 650, x2: 140, y2: 420, angle1: 0, angle2: 0 },
      { x1: 450, y1: 360, x2: 140, y2: 200, angle1: 0, angle2: 0 }
    ],
    lasers: [],
    movingWalls: []
  },
  {
    levelNumber: 43,
    title: "Dual Orbits",
    difficultyTier: 5,
    instruction: "Move to the portal for clearance and time your shot past the slow barrier.",
    startPos: { x: 300, y: 680 },
    holePos: { x: 300, y: 150 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 420, width: 360, height: 20, angle: 0 }
    ],
    portals: [
      { x1: 150, y1: 520, x2: 450, y2: 250, angle1: 0, angle2: 0 }
    ],
    lasers: [],
    movingWalls: [
      { startX: 360, startY: 250, endX: 520, endY: 250, width: 90, height: 20, duration: 3200 }
    ]
  },
  {
    levelNumber: 44,
    title: "The Descending Staircase",
    difficultyTier: 5,
    instruction: "Bounce tightly down the stair steps. Do not hit the ceiling laser!",
    startPos: { x: 100, y: 150 },
    holePos: { x: 500, y: 680 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 120, y: 240, width: 140, height: 20, angle: 0 },
      { x: 210, y: 340, width: 140, height: 20, angle: 0 },
      { x: 300, y: 440, width: 140, height: 20, angle: 0 },
      { x: 390, y: 540, width: 140, height: 20, angle: 0 },
      { x: 480, y: 620, width: 100, height: 20, angle: 0 }
    ],
    portals: [],
    lasers: [
      { x1: 50, y1: 110, x2: 550, y2: 110 }
    ],
    movingWalls: []
  },
  {
    levelNumber: 45,
    title: "The Bank Shot",
    difficultyTier: 5,
    instruction: "Bank off outer bounce pads and thread over the center block when the laser clears.",
    startPos: { x: 300, y: 680 },
    holePos: { x: 300, y: 150 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 400, width: 250, height: 20, angle: 0 },
      { x: 100, y: 500, width: 100, height: 20, angle: 45 },
      { x: 500, y: 250, width: 100, height: 20, angle: -45 }
    ],
    portals: [],
    lasers: [
      { x1: 50, y1: 300, x2: 550, y2: 300 }
    ],
    movingWalls: []
  },
  {
    levelNumber: 46,
    title: "The Staggered Drop",
    difficultyTier: 5,
    instruction: "Shoot into the top portal and time your drop past the moving barrier below.",
    startPos: { x: 150, y: 680 },
    holePos: { x: 450, y: 680 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 500, width: 20, height: 400, angle: 0 }
    ],
    portals: [
      { x1: 150, y1: 150, x2: 450, y2: 150, angle1: 0, angle2: 0 }
    ],
    lasers: [],
    movingWalls: [
      { startX: 380, startY: 300, endX: 500, endY: 300, width: 100, height: 20, duration: 1500 }
    ]
  },
  {
    levelNumber: 47,
    title: "The Guillotine",
    difficultyTier: 5,
    instruction: "Shoot up the middle when the side crushers retract and the top laser clears.",
    startPos: { x: 300, y: 680 },
    holePos: { x: 300, y: 150 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 }
    ],
    portals: [],
    lasers: [
      { x1: 50, y1: 200, x2: 550, y2: 200 }
    ],
    movingWalls: [
      { startX: 150, startY: 450, endX: 250, endY: 450, width: 140, height: 400, duration: 1500 },
      { startX: 450, startY: 450, endX: 350, endY: 450, width: 140, height: 400, duration: 1500 }
    ]
  },
  {
    levelNumber: 48,
    title: "The Twin Gates",
    difficultyTier: 5,
    instruction: "Bank off side walls to control speed and slip through both shifting gate gaps.",
    startPos: { x: 300, y: 680 },
    holePos: { x: 300, y: 150 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 }
    ],
    portals: [],
    lasers: [],
    movingWalls: [
      { startX: 160, startY: 500, endX: 240, endY: 500, width: 220, height: 20, duration: 2000 },
      { startX: 440, startY: 500, endX: 520, endY: 500, width: 220, height: 20, duration: 2000 },
      { startX: 240, startY: 300, endX: 160, endY: 300, width: 220, height: 20, duration: 2000 },
      { startX: 520, startY: 300, endX: 440, endY: 300, width: 220, height: 20, duration: 2000 }
    ]
  },
  {
    levelNumber: 49,
    title: "The Fortress",
    difficultyTier: 5,
    instruction: "Bounce off two outer walls into the portal to breach the fortress.",
    startPos: { x: 120, y: 680 },
    holePos: { x: 300, y: 380 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 300, y: 310, width: 180, height: 20, angle: 0 },
      { x: 300, y: 450, width: 180, height: 20, angle: 0 },
      { x: 210, y: 380, width: 20, height: 160, angle: 0 },
      { x: 390, y: 380, width: 20, height: 160, angle: 0 },
      { x: 480, y: 560, width: 100, height: 20, angle: -45 },
      { x: 480, y: 220, width: 100, height: 20, angle: 45 }
    ],
    portals: [
      { x1: 450, y1: 140, x2: 300, y2: 420, angle1: 0, angle2: 0 }
    ],
    lasers: [],
    movingWalls: [
      { startX: 120, startY: 250, endX: 380, endY: 250, width: 100, height: 20, duration: 3500 }
    ]
  },
  {
    levelNumber: 50,
    title: "The Grandmaster",
    difficultyTier: 5,
    instruction: "Dodge the laser, time the sweeper, thread the gap, and hit the portal!",
    startPos: { x: 300, y: 680 },
    holePos: { x: 500, y: 150 },
    walls: [
      { x: 35, y: 420, width: 30, height: 690, angle: 0 },
      { x: 565, y: 420, width: 30, height: 690, angle: 0 },
      { x: 300, y: 75, width: 560, height: 30, angle: 0 },
      { x: 300, y: 765, width: 560, height: 30, angle: 0 },
      { x: 80, y: 250, width: 70, height: 20, angle: 0 },
      { x: 360, y: 250, width: 390, height: 20, angle: 0 }
    ],
    portals: [
      { x1: 100, y1: 150, x2: 500, y2: 300, angle1: 0, angle2: 0 }
    ],
    lasers: [
      { x1: 80, y1: 550, x2: 520, y2: 550 }
    ],
    movingWalls: [
      { startX: 180, startY: 400, endX: 420, endY: 400, width: 140, height: 20, duration: 1500 }
    ]
  }
];

// =======================================================
// SPECIFICATION 2: LEVEL MANAGER CLASS
// =======================================================
export class LevelManager {
  constructor(dataset = HANDCRAFTED_LEVELS_DATA) {
    this.dataset = dataset;
    this.currentIndex = 0;
  }

  getCurrentLevel() {
    return this.dataset[this.currentIndex];
  }

  loadLevel(index) {
    if (index >= 0 && index < this.dataset.length) {
      this.currentIndex = index;
    }
    return this.getCurrentLevel();
  }

  restartLevel() {
    return this.getCurrentLevel();
  }

  nextLevel() {
    if (this.currentIndex + 1 < this.dataset.length) {
      this.currentIndex++;
      return this.getCurrentLevel();
    }
    // Loop back to level 1
    this.currentIndex = 0;
    return this.getCurrentLevel();
  }
}

// =======================================================
// SPECIFICATION 3: PHASER 3 GAME SCENE
// =======================================================
export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'RicochetGameScene' });
    this.levelManager = new LevelManager();
    this.portalCooldown = 0;
    this.isBallInMotion = false;
  }

  create() {
    this.cameras.main.setBackgroundColor('#1a1a2e');
    
    // UI HUD elements
    this.hudText = this.add.text(20, 20, '', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setDepth(100);

    // Create Aim Vector Graphic
    this.aimGraphic = this.add.graphics().setDepth(50);

    // Setup Aim Pointer Input Handlers
    this.input.on('pointerdown', this.onPointerDown, this);
    this.input.on('pointermove', this.onPointerMove, this);
    this.input.on('pointerup', this.onPointerUp, this);

    // Load initial level
    this.loadCurrentLevelData();
  }

  loadCurrentLevelData() {
    // 1. Clear old groups and objects
    if (this.wallsGroup) this.wallsGroup.clear(true, true);
    if (this.movingWallsGroup) this.movingWallsGroup.clear(true, true);
    if (this.ball) this.ball.destroy();
    if (this.hole) this.hole.destroy();
    if (this.laserGraphics) this.laserGraphics.destroy();
    if (this.portalGraphics) this.portalGraphics.destroy();
    if (this.winUI) this.winUI.destroy();
    if (this.retryBtn) this.retryBtn.destroy();
    if (this.instructionContainer) this.instructionContainer.destroy();
    if (this.movingTweens) {
      this.movingTweens.forEach(t => t.stop());
    }

    const level = this.levelManager.getCurrentLevel();
    this.hudText.setText(`Level ${level.levelNumber}: ${level.title} [${level.difficulty.toUpperCase()}]`);

    // 2. Physics Groups
    this.wallsGroup = this.physics.add.staticGroup();
    this.movingWallsGroup = this.physics.add.group({ immovable: true, allowGravity: false });
    this.movingTweens = [];

    // 3. Build Walls (outer boundary & interior)
    level.walls.forEach(w => {
      const wallObj = this.add.rectangle(w.x, w.y, w.width, w.height, 0x4a4e69);
      wallObj.setStrokeStyle(2, 0x6c757d);
      if (w.angle) wallObj.setAngle(w.angle);
      this.physics.add.existing(wallObj, true);
      this.wallsGroup.add(wallObj);
    });

    // 4. Build Moving Walls
    level.movingWalls.forEach(mw => {
      const mwWidth = mw.width !== undefined ? mw.width : 120;
      const mwHeight = mw.height !== undefined ? mw.height : 20;
      const wallObj = this.add.rectangle(mw.startX, mw.startY, mwWidth, mwHeight, 0x9a8c98);
      wallObj.setStrokeStyle(2, 0xc8b6ff);
      if (mw.angle) wallObj.setAngle(mw.angle);
      this.physics.add.existing(wallObj);
      wallObj.body.setImmovable(true);
      wallObj.body.setAllowGravity(false);
      this.movingWallsGroup.add(wallObj);

      const tween = this.tweens.add({
        targets: wallObj,
        x: mw.endX,
        y: mw.endY,
        duration: mw.duration || 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        onUpdate: () => {
          if (wallObj.body) {
            wallObj.body.updateFromGameObject();
          }
        }
      });
      this.movingTweens.push(tween);
    });

    // 5. Build Portals
    this.portalsData = level.portals || [];
    this.portalGraphics = this.add.graphics().setDepth(10);
    this.portalsData.forEach(p => {
      this.portalGraphics.fillStyle(0x00f5d4, 0.8);
      this.portalGraphics.fillCircle(p.x1, p.y1, 18);
      this.portalGraphics.fillStyle(0x7000ff, 0.8);
      this.portalGraphics.fillCircle(p.x2, p.y2, 18);

      this.portalGraphics.lineStyle(3, 0xffffff, 0.9);
      this.portalGraphics.strokeCircle(p.x1, p.y1, 18);
      this.portalGraphics.strokeCircle(p.x2, p.y2, 18);
    });

    // 6. Build Lasers
    this.lasersData = level.lasers || [];
    this.laserGraphics = this.add.graphics().setDepth(10);
    this.lasersData.forEach(l => {
      this.laserGraphics.lineStyle(4, 0xff0055, 1);
      this.laserGraphics.lineBetween(l.x1, l.y1, l.x2, l.y2);
      this.laserGraphics.fillStyle(0xff5588, 1);
      this.laserGraphics.fillCircle(l.x1, l.y1, 6);
      this.laserGraphics.fillCircle(l.x2, l.y2, 6);
    });

    // 7. Build Hole Zone
    this.hole = this.add.circle(level.holePos.x, level.holePos.y, 20, 0x11111a);
    this.add.circle(level.holePos.x, level.holePos.y, 24, 0x00f5d4, 0.3);

    // 8. Build Ball
    this.startPos = level.startPos;
    this.ball = this.add.circle(level.startPos.x, level.startPos.y, 12, 0xf72585);
    this.physics.add.existing(this.ball);
    this.ball.body.setCollideWorldBounds(true);
    this.ball.body.setBounce(0.98, 0.98);
    this.ball.body.setDamping(true);
    this.ball.body.setDrag(0.995, 0.995);

    // 9. Setup Colliders
    this.physics.add.collider(this.ball, this.wallsGroup);
    this.physics.add.collider(this.ball, this.movingWallsGroup);

    // 10. Setup UI Buttons & Tutorial Banner
    this.retryBtn = this.add.text(520, 20, '🔄 Retry', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#ffdd53',
      backgroundColor: '#2b2d42',
      padding: { x: 10, y: 5 }
    }).setInteractive().setDepth(100);

    this.retryBtn.on('pointerdown', () => this.resetBall());

    this.renderInstructionText(level.instruction);

    this.isAiming = false;
    this.isBallInMotion = false;
    this.portalCooldown = 0;
  }

  renderInstructionText(text) {
    if (!text) return;

    this.instructionContainer = this.add.container(300, 720).setDepth(80);

    const txt = this.add.text(0, 0, text, {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);

    const bounds = txt.getBounds();
    const bg = this.add.graphics();
    bg.fillStyle(0x16213e, 0.9);
    bg.fillRoundedRect(-bounds.width / 2 - 16, -bounds.height / 2 - 10, bounds.width + 32, bounds.height + 20, 12);
    bg.lineStyle(2, 0x4cc9f0, 1);
    bg.strokeRoundedRect(-bounds.width / 2 - 16, -bounds.height / 2 - 10, bounds.width + 32, bounds.height + 20, 12);

    this.instructionContainer.add([bg, txt]);

    this.tweens.add({
      targets: this.instructionContainer,
      y: 715,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  hideInstructionText() {
    if (this.instructionContainer) {
      this.tweens.add({
        targets: this.instructionContainer,
        alpha: 0,
        duration: 300,
        onComplete: () => {
          if (this.instructionContainer) this.instructionContainer.destroy();
        }
      });
    }
  }

  onPointerDown(pointer) {
    this.hideInstructionText();
    if (this.isBallInMotion) return;
    const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.ball.x, this.ball.y);
    if (dist < 60) {
      this.isAiming = true;
    }
  }

  onPointerMove(pointer) {
    if (!this.isAiming || this.isBallInMotion) return;
    this.aimGraphic.clear();
    this.aimGraphic.lineStyle(3, 0x4cc9f0, 0.8);
    this.aimGraphic.lineBetween(this.ball.x, this.ball.y, pointer.x, pointer.y);

    const dx = this.ball.x - pointer.x;
    const dy = this.ball.y - pointer.y;
    this.aimGraphic.lineStyle(2, 0xf72585, 0.5);
    this.aimGraphic.lineBetween(this.ball.x, this.ball.y, this.ball.x + dx, this.ball.y + dy);
  }

  onPointerUp(pointer) {
    if (!this.isAiming || this.isBallInMotion) return;
    this.isAiming = false;
    this.aimGraphic.clear();

    const dx = this.ball.x - pointer.x;
    const dy = this.ball.y - pointer.y;
    const forceMultiplier = 2.5;

    this.ball.body.setVelocity(dx * forceMultiplier, dy * forceMultiplier);
    this.isBallInMotion = true;
    this.hideInstructionText();
  }

  resetBall() {
    this.ball.body.setVelocity(0, 0);
    this.ball.x = this.startPos.x;
    this.ball.y = this.startPos.y;
    this.isBallInMotion = false;
    if (this.winUI) {
      this.winUI.destroy();
      this.winUI = null;
    }
  }

  update(time, delta) {
    if (!this.ball || !this.ball.body) return;

    // Check if ball slowed down to stop
    if (this.isBallInMotion && this.ball.body.speed < 5) {
      this.ball.body.setVelocity(0, 0);
      this.isBallInMotion = false;
    }

    // Portal cooldown timer
    if (this.portalCooldown > 0) {
      this.portalCooldown -= delta;
    }

    // Check Portals
    if (this.portalCooldown <= 0 && this.portalsData.length > 0) {
      this.portalsData.forEach(p => {
        const d1 = Phaser.Math.Distance.Between(this.ball.x, this.ball.y, p.x1, p.y1);
        const d2 = Phaser.Math.Distance.Between(this.ball.x, this.ball.y, p.x2, p.y2);

        if (d1 < 22) {
          this.ball.x = p.x2;
          this.ball.y = p.y2;
          this.portalCooldown = 500;
        } else if (d2 < 22) {
          this.ball.x = p.x1;
          this.ball.y = p.y1;
          this.portalCooldown = 500;
        }
      });
    }

    // Check Lasers
    if (this.lasersData.length > 0) {
      this.lasersData.forEach(l => {
        const line = new Phaser.Geom.Line(l.x1, l.y1, l.x2, l.y2);
        const circle = new Phaser.Geom.Circle(this.ball.x, this.ball.y, 12);
        if (Phaser.Geom.Intersects.LineToCircle(line, circle)) {
          this.resetBall();
        }
      });
    }

    // Check Hole Victory
    const holeDist = Phaser.Math.Distance.Between(this.ball.x, this.ball.y, this.hole.x, this.hole.y);
    if (holeDist < 18) {
      this.onLevelComplete();
    }
  }

  onLevelComplete() {
    this.ball.body.setVelocity(0, 0);
    this.isBallInMotion = false;

    if (this.winUI) return;

    this.winUI = this.add.container(300, 400).setDepth(200);

    const bg = this.add.rectangle(0, 0, 320, 200, 0x111122, 0.95);
    bg.setStrokeStyle(3, 0x00f5d4);

    const winText = this.add.text(0, -50, 'HOLE IN ONE!', {
      fontFamily: 'sans-serif',
      fontSize: '28px',
      color: '#00f5d4',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const nextBtn = this.add.text(0, 30, 'NEXT LEVEL ▶', {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#7000ff',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    nextBtn.on('pointerdown', () => {
      this.levelManager.nextLevel();
      this.loadCurrentLevelData();
    });

    this.winUI.add([bg, winText, nextBtn]);
  }
}

// =======================================================
// PHASER GAME CONFIGURATION & INITIALIZATION
// =======================================================
export const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 800,
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: [GameScene]
};

export default config;
