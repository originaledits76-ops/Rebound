import fs from 'fs';
import path from 'path';
import LevelGenerator from '../src/systems/LevelGenerator.js';

// Base handcrafted intro levels (1-4)
const baseLevels = {
    1: {
        id: "level_001",
        levelNumber: 1,
        title: "Level 1: First Shot",
        spawn: { x: 540, y: 1550 },
        hole: { x: 540, y: 350 },
        walls: [
            { x: 540, y: 180, w: 960, h: 40, isBoundary: true },
            { x: 540, y: 1740, w: 960, h: 40, isBoundary: true },
            { x: 80, y: 960, w: 40, h: 1560, isBoundary: true },
            { x: 1000, y: 960, w: 40, h: 1560, isBoundary: true }
        ],
        movingWalls: [], portals: [], lasers: [],
        metadata: { levelId: 1, difficulty: 5, requiredBounces: 0, mechanicsUsed: [], generatorVersion: "handcrafted" }
    },
    2: {
        id: "level_002",
        levelNumber: 2,
        title: "Level 2: Center Block",
        spawn: { x: 540, y: 1550 },
        hole: { x: 540, y: 350 },
        walls: [
            { x: 540, y: 180, w: 960, h: 40, isBoundary: true },
            { x: 540, y: 1740, w: 960, h: 40, isBoundary: true },
            { x: 80, y: 960, w: 40, h: 1560, isBoundary: true },
            { x: 1000, y: 960, w: 40, h: 1560, isBoundary: true },
            { x: 540, y: 950, w: 500, h: 60 }
        ],
        movingWalls: [], portals: [], lasers: [],
        metadata: { levelId: 2, difficulty: 10, requiredBounces: 1, mechanicsUsed: [], generatorVersion: "handcrafted" }
    },
    3: {
        id: "level_003",
        levelNumber: 3,
        title: "Level 3: Double Bank",
        spawn: { x: 250, y: 1550 },
        hole: { x: 830, y: 350 },
        walls: [
            { x: 540, y: 180, w: 960, h: 40, isBoundary: true },
            { x: 540, y: 1740, w: 960, h: 40, isBoundary: true },
            { x: 80, y: 960, w: 40, h: 1560, isBoundary: true },
            { x: 1000, y: 960, w: 40, h: 1560, isBoundary: true },
            { x: 250, y: 1100, w: 340, h: 60 },
            { x: 830, y: 700, w: 340, h: 60 }
        ],
        movingWalls: [], portals: [], lasers: [],
        metadata: { levelId: 3, difficulty: 15, requiredBounces: 1, mechanicsUsed: [], generatorVersion: "handcrafted" }
    },
    4: {
        id: "level_004",
        levelNumber: 4,
        title: "Level 4: Zig Zag",
        spawn: { x: 540, y: 1650 },
        hole: { x: 540, y: 250 },
        walls: [
            { x: 540, y: 180, w: 960, h: 40, isBoundary: true },
            { x: 540, y: 1740, w: 960, h: 40, isBoundary: true },
            { x: 80, y: 960, w: 40, h: 1560, isBoundary: true },
            { x: 1000, y: 960, w: 40, h: 1560, isBoundary: true },
            { x: 300, y: 1250, w: 440, h: 60 },
            { x: 780, y: 850, w: 440, h: 60 },
            { x: 300, y: 450, w: 440, h: 60 }
        ],
        movingWalls: [], portals: [], lasers: [],
        metadata: { levelId: 4, difficulty: 18, requiredBounces: 2, mechanicsUsed: [], generatorVersion: "handcrafted" }
    }
};

const fullCampaign = {};

console.log("Generating campaign levels 1 to 100 with Reverse Constraint-Solver pipeline...");

for (let num = 1; num <= 100; num++) {
    if (baseLevels[num]) {
        fullCampaign[num] = baseLevels[num];
    } else {
        const diff = Math.min(100, num);
        const generated = LevelGenerator.generateLevel({
            difficulty: diff,
            levelNumber: num,
            referenceLevels: Object.values(fullCampaign),
            seed: 88000 + num * 41337
        });
        fullCampaign[num] = generated;
    }
}

const fileContent = `export interface LevelDataStructure {
    id: string | number;
    levelNumber: number;
    title: string;
    spawn: { x: number; y: number };
    hole: { x: number; y: number };
    walls?: Array<{ x: number; y: number; w: number; h: number; angle?: number; isBoundary?: boolean; isReflector?: boolean; isBlocker?: boolean; isDecoy?: boolean }>;
    movingWalls?: Array<{
        type?: string;
        x: number;
        y: number;
        width?: number;
        w?: number;
        height?: number;
        h?: number;
        movement?: string;
        axis?: string;
        start?: number;
        end?: number;
        speed?: number;
        pause?: number;
        mode?: string;
    }>;
    portals?: Array<{
        type?: string;
        id: string;
        pair: string;
        x: number;
        y: number;
    }>;
    lasers?: Array<{
        type?: string;
        direction: string;
        mode?: string;
        x: number;
        y: number;
        length: number;
        onTime?: number;
        offTime?: number;
    }>;
    metadata?: {
        levelId?: number;
        difficulty?: number;
        measuredDifficulty?: number;
        requiredBounces?: number;
        puzzleConcept?: string;
        mechanicsUsed?: string[];
        solutionLength?: number;
        similarityScore?: number;
        estimatedAttempts?: number;
        generationTimeMs?: number;
        generationAttempts?: number;
        generatorVersion?: string;
    };
    debugInfo?: {
        difficulty?: number;
        measuredDifficulty?: number;
        requiredBounces?: number;
        puzzleConcept?: string;
        trajectoryNodes?: Array<{ x: number; y: number; type: string; index?: number }>;
        trajectorySegments?: any[];
        launchAngleDeg?: number;
        similarityScore?: number;
        estimatedAttempts?: number;
        mechanicsUsed?: string[];
        generationTimeMs?: number;
        generationAttempts?: number;
        rejectionHistory?: string[];
    };
}

export const campaignLevels: Record<number, LevelDataStructure> = ${JSON.stringify(fullCampaign, null, 4)};

export const defaultCampaignArray = Object.values(campaignLevels);
export default defaultCampaignArray;
`;

const outputPath = path.resolve('src/data/levels.ts');
fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log(`Successfully generated and saved all 100 levels to ${outputPath}`);
