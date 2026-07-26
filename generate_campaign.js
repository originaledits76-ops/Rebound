import fs from 'fs';

const w = 1080;
const h = 1920;
const marginX = 80;
const marginY = 180;
const cx = w / 2;
const cy = h / 2;

const boundaryWalls = [
    { x: w / 2, y: marginY, w: w - marginX * 2 + 40, h: 40, isBoundary: true },
    { x: w / 2, y: h - marginY, w: w - marginX * 2 + 40, h: 40, isBoundary: true },
    { x: marginX, y: h / 2, w: 40, h: h - marginY * 2, isBoundary: true },
    { x: w - marginX, y: h / 2, w: 40, h: h - marginY * 2, isBoundary: true }
];

const createLevel = (num, title, spawn, hole, walls, portals = [], lasers = [], movingWalls = []) => ({
    id: `level_${String(num).padStart(3, '0')}`,
    levelNumber: num,
    title,
    spawn,
    hole,
    walls: [...boundaryWalls, ...walls],
    portals,
    lasers,
    movingWalls,
    metadata: {
        levelId: num,
        generatorVersion: "handcrafted"
    }
});

const levels = [];

// LEVEL 1
levels.push(createLevel(1, "Level 1: The Basics", { x: cx, y: h - 300 }, { x: cx, y: 300 }, []));

// LEVEL 2
levels.push(createLevel(2, "Level 2: The Block", 
    { x: cx, y: h - 300 }, 
    { x: cx, y: 300 }, 
    [ { x: cx, y: cy, w: 600, h: 40 } ]
));

// LEVEL 3
levels.push(createLevel(3, "Level 3: Ricochet", 
    { x: cx, y: h - 300 }, 
    { x: cx, y: 300 }, 
    [ 
        { x: cx, y: cy, w: 800, h: 40 },
        { x: cx, y: cy - 200, w: 400, h: 40 }
    ]
));

// LEVEL 4
levels.push(createLevel(4, "Level 4: Zig Zag", 
    { x: cx, y: h - 300 }, 
    { x: cx, y: 300 }, 
    [ 
        { x: cx - 200, y: h - 600, w: 600, h: 40 },
        { x: cx + 200, y: h - 1000, w: 600, h: 40 },
        { x: cx - 200, y: h - 1400, w: 600, h: 40 }
    ]
));

// LEVEL 5
levels.push(createLevel(5, "Level 5: Squeeze", 
    { x: cx, y: h - 300 }, 
    { x: cx, y: 300 }, 
    [ 
        { x: cx - 150, y: cy + 300, w: 40, h: 600 },
        { x: cx + 150, y: cy + 300, w: 40, h: 600 },
        { x: cx - 150, y: cy - 300, w: 40, h: 600 },
        { x: cx + 150, y: cy - 300, w: 40, h: 600 },
        { x: cx, y: cy, w: 200, h: 40 }
    ]
));

// LEVEL 6
levels.push(createLevel(6, "Level 6: Moving Target", 
    { x: cx, y: h - 300 }, 
    { x: cx, y: 300 }, 
    [],
    [],
    [],
    [ { startX: cx - 300, startY: cy, endX: cx + 300, endY: cy, duration: 2000 } ]
));

// LEVEL 7
levels.push(createLevel(7, "Level 7: Double Doors", 
    { x: cx, y: h - 300 }, 
    { x: cx, y: 300 }, 
    [
        { x: marginX + 150, y: cy, w: 300, h: 40 },
        { x: w - marginX - 150, y: cy, w: 300, h: 40 },
    ],
    [],
    [],
    [
        { startX: cx, startY: cy - 100, endX: cx, endY: cy + 100, duration: 1500 }
    ]
));

// LEVEL 8
levels.push(createLevel(8, "Level 8: Laser Guard", 
    { x: cx, y: h - 300 }, 
    { x: cx, y: 300 }, 
    [ { x: cx, y: cy, w: 400, h: 40 } ],
    [],
    [ { x1: marginX + 40, y1: cy - 200, x2: w - marginX - 40, y2: cy - 200, onTime: 1500, offTime: 1000 } ]
));

// LEVEL 9
levels.push(createLevel(9, "Level 9: Portals", 
    { x: cx, y: h - 300 }, 
    { x: cx, y: 300 }, 
    [ { x: cx, y: cy, w: w, h: 40 } ],
    [ { x1: cx, y1: h - 500, x2: cx, y2: 500 } ]
));

// LEVEL 10
levels.push(createLevel(10, "Level 10: Final Exam", 
    { x: cx, y: h - 300 }, 
    { x: cx, y: 300 }, 
    [ 
        { x: cx, y: cy + 300, w: 400, h: 40 },
        { x: cx, y: cy - 300, w: 400, h: 40 }
    ],
    [ { x1: cx - 300, y1: h - 450, x2: cx - 300, y2: 450 } ],
    [ { x1: cx - 200, y1: cy, x2: cx + 200, y2: cy } ],
    [ { startX: cx + 250, startY: cy + 300, endX: cx + 250, endY: cy - 300, duration: 2500 } ]
));

// LEVEL 11
levels.push(createLevel(11, "Level 11: Portal Chamber", 
    { x: cx, y: h - 300 }, 
    { x: cx, y: 300 }, 
    [ 
        { x: cx, y: h - 450, w: 600, h: 40 },
        { x: cx, y: 450, w: 600, h: 40 },
        { x: cx, y: cy, w: w, h: 40 }
    ],
    [ 
        { x1: cx - 300, y1: h - 550, x2: cx + 300, y2: 550 },
        { x1: cx + 300, y1: h - 550, x2: cx - 300, y2: 550 }
    ]
));

// LEVEL 12
levels.push(createLevel(12, "Level 12: Narrow Pass", 
    { x: cx, y: h - 200 }, 
    { x: cx, y: 250 }, 
    [
        { x: cx - 60, y: cy, w: 40, h: 1000 },
        { x: cx + 60, y: cy, w: 40, h: 1000 }
    ],
    [],
    [
        { x1: cx - 40, y1: cy + 200, x2: cx + 40, y2: cy + 200 },
        { x1: cx - 40, y1: cy - 200, x2: cx + 40, y2: cy - 200 }
    ]
));

// LEVEL 13
levels.push(createLevel(13, "Level 13: Funnel", 
    { x: cx, y: h - 250 }, 
    { x: cx, y: 300 }, 
    [
        { x: cx - 250, y: cy + 400, w: 500, h: 40, angle: 30 },
        { x: cx + 250, y: cy + 400, w: 500, h: 40, angle: -30 },
        { x: cx, y: cy, w: 400, h: 40 }
    ]
));

// LEVEL 14
levels.push(createLevel(14, "Level 14: Crushers", 
    { x: cx, y: h - 300 }, 
    { x: cx, y: 300 }, 
    [],
    [],
    [],
    [
        { startX: marginX + 150, startY: cy + 200, endX: cx - 50, endY: cy + 200, duration: 1000 },
        { startX: w - marginX - 150, startY: cy + 200, endX: cx + 50, endY: cy + 200, duration: 1000 },
        { startX: marginX + 150, startY: cy - 200, endX: cx - 50, endY: cy - 200, duration: 1000 },
        { startX: w - marginX - 150, startY: cy - 200, endX: cx + 50, endY: cy - 200, duration: 1000 }
    ]
));

// LEVEL 15
levels.push(createLevel(15, "Level 15: Crossfire", 
    { x: cx, y: h - 300 }, 
    { x: cx, y: 300 }, 
    [
        { x: cx - 200, y: cy, w: 40, h: 400 },
        { x: cx + 200, y: cy, w: 40, h: 400 }
    ],
    [],
    [
        { x1: marginX, y1: cy + 100, x2: w - marginX, y2: cy + 100 },
        { x1: marginX, y1: cy - 100, x2: w - marginX, y2: cy - 100 }
    ]
));

// LEVEL 16
levels.push(createLevel(16, "Level 16: The V", 
    { x: cx, y: h - 300 }, 
    { x: cx, y: 300 }, 
    [
        { x: cx - 150, y: cy, w: 400, h: 40, angle: 45 },
        { x: cx + 150, y: cy, w: 400, h: 40, angle: -45 },
        { x: cx, y: cy - 300, w: 300, h: 40 }
    ]
));

// LEVEL 17
levels.push(createLevel(17, "Level 17: Window Shopping", 
    { x: cx, y: h - 300 }, 
    { x: cx, y: 300 }, 
    [
        { x: cx - 200, y: cy + 200, w: 400, h: 40 },
        { x: cx + 200, y: cy - 200, w: 400, h: 40 }
    ],
    [
        { x1: cx - 350, y1: cy + 200, x2: cx + 350, y2: cy - 200 }
    ],
    [
        { x1: cx - 300, y1: cy + 300, x2: cx + 100, y2: cy + 300 }
    ]
));

// LEVEL 18
levels.push(createLevel(18, "Level 18: Spin Cycle", 
    { x: cx, y: h - 200 }, 
    { x: cx, y: 250 }, 
    [
        { x: cx, y: cy + 400, w: 600, h: 40 },
        { x: cx, y: cy - 400, w: 600, h: 40 }
    ],
    [],
    [],
    [
        { startX: cx - 300, startY: cy + 200, endX: cx + 300, endY: cy + 200, duration: 1800 },
        { startX: cx + 300, startY: cy, endX: cx - 300, endY: cy, duration: 1800 },
        { startX: cx - 300, startY: cy - 200, endX: cx + 300, endY: cy - 200, duration: 1800 }
    ]
));

// LEVEL 19
levels.push(createLevel(19, "Level 19: Diamond", 
    { x: cx, y: h - 250 }, 
    { x: cx, y: 300 }, 
    [
        { x: cx - 200, y: cy + 200, w: 300, h: 40, angle: 45 },
        { x: cx + 200, y: cy + 200, w: 300, h: 40, angle: -45 },
        { x: cx - 200, y: cy - 200, w: 300, h: 40, angle: -45 },
        { x: cx + 200, y: cy - 200, w: 300, h: 40, angle: 45 },
        { x: cx, y: cy, w: 100, h: 100 }
    ]
));

// LEVEL 20
levels.push(createLevel(20, "Level 20: The Gauntlet", 
    { x: cx, y: h - 250 }, 
    { x: cx, y: 300 }, 
    [
        { x: cx, y: cy + 500, w: w, h: 40 },
        { x: cx, y: cy - 500, w: w, h: 40 }
    ],
    [
        { x1: marginX + 100, y1: cy + 600, x2: w - marginX - 100, y2: cy - 600 }
    ],
    [
        { x1: marginX, y1: cy + 300, x2: cx - 100, y2: cy + 300 },
        { x1: cx + 100, y1: cy + 100, x2: w - marginX, y2: cy + 100 },
        { x1: marginX, y1: cy - 100, x2: cx - 100, y2: cy - 100 },
        { x1: cx + 100, y1: cy - 300, x2: w - marginX, y2: cy - 300 }
    ]
));

// LEVEL 21
levels.push(createLevel(21, "Level 21: Ricochet Master", 
    { x: cx, y: h - 250 }, 
    { x: cx, y: 250 }, 
    [
        { x: marginX + 200, y: cy + 400, w: 400, h: 40 },
        { x: w - marginX - 200, y: cy + 200, w: 400, h: 40 },
        { x: marginX + 200, y: cy, w: 400, h: 40 },
        { x: w - marginX - 200, y: cy - 200, w: 400, h: 40 },
        { x: marginX + 200, y: cy - 400, w: 400, h: 40 }
    ]
));

// LEVEL 22
levels.push(createLevel(22, "Level 22: Precision", 
    { x: cx, y: h - 250 }, 
    { x: cx, y: 250 }, 
    [
        { x: cx, y: cy, w: 800, h: 40 },
        { x: cx, y: cy + 300, w: 400, h: 40 },
        { x: cx, y: cy - 300, w: 400, h: 40 }
    ],
    [],
    [
        { x1: marginX, y1: cy + 150, x2: w - marginX, y2: cy + 150 },
        { x1: marginX, y1: cy - 150, x2: w - marginX, y2: cy - 150 }
    ],
    [
        { startX: cx - 200, startY: cy + 450, endX: cx + 200, endY: cy + 450, duration: 1200 },
        { startX: cx + 200, startY: cy - 450, endX: cx - 200, endY: cy - 450, duration: 1200 }
    ]
));

// LEVEL 23
levels.push(createLevel(23, "Level 23: Optical Illusion", 
    { x: cx, y: h - 300 }, 
    { x: cx, y: 300 }, 
    [
        { x: cx - 200, y: cy + 200, w: 200, h: 40, angle: 45 },
        { x: cx + 200, y: cy + 200, w: 200, h: 40, angle: -45 },
        { x: cx - 200, y: cy - 200, w: 200, h: 40, angle: -45 },
        { x: cx + 200, y: cy - 200, w: 200, h: 40, angle: 45 },
        { x: cx, y: cy, w: 400, h: 40 }
    ],
    [
        { x1: cx, y1: cy + 400, x2: cx, y2: cy - 400 }
    ]
));

// LEVEL 24
levels.push(createLevel(24, "Level 24: Time Dilation", 
    { x: cx, y: h - 200 }, 
    { x: cx, y: 200 }, 
    [
        { x: cx - 150, y: cy + 300, w: 40, h: 400 },
        { x: cx + 150, y: cy + 300, w: 40, h: 400 },
        { x: cx - 150, y: cy - 300, w: 40, h: 400 },
        { x: cx + 150, y: cy - 300, w: 40, h: 400 }
    ],
    [],
    [
        { x1: cx - 150, y1: cy, x2: cx + 150, y2: cy, onTime: 800, offTime: 1200 },
        { x1: cx - 150, y1: cy + 600, x2: cx + 150, y2: cy + 600, onTime: 1200, offTime: 800 },
        { x1: cx - 150, y1: cy - 600, x2: cx + 150, y2: cy - 600, onTime: 1200, offTime: 800 }
    ]
));

// LEVEL 25
levels.push(createLevel(25, "Level 25: The Finale", 
    { x: cx, y: h - 200 }, 
    { x: cx, y: 200 }, 
    [
        { x: cx - 300, y: cy + 400, w: 200, h: 40 },
        { x: cx + 300, y: cy + 400, w: 200, h: 40 },
        { x: cx - 300, y: cy - 400, w: 200, h: 40 },
        { x: cx + 300, y: cy - 400, w: 200, h: 40 },
        { x: cx, y: cy, w: 400, h: 40 }
    ],
    [
        { x1: cx - 300, y1: cy + 200, x2: cx + 300, y2: cy - 200 },
        { x1: cx + 300, y1: cy + 200, x2: cx - 300, y2: cy - 200 }
    ],
    [
        { x1: marginX, y1: cy + 600, x2: w - marginX, y2: cy + 600, onTime: 2000, offTime: 1000 },
        { x1: marginX, y1: cy - 600, x2: w - marginX, y2: cy - 600, onTime: 2000, offTime: 1000 }
    ],
    [
        { startX: cx, startY: cy + 200, endX: cx, endY: cy - 200, duration: 3000 }
    ]
));

const levelsObject = {};
levels.forEach(l => {
    levelsObject[l.levelNumber] = l;
});

const tsContent = `export interface LevelDataStructure {
    id: string | number;
    levelNumber: number;
    title: string;
    spawn: { x: number; y: number };
    hole: { x: number; y: number };
    walls?: Array<{ x: number; y: number; w: number; h: number; angle?: number; isBoundary?: boolean; }>;
    movingWalls?: Array<{ startX?: number; startY?: number; endX?: number; endY?: number; duration?: number; x?: number; y?: number; w?: number; h?: number; movement?: string; axis?: string; start?: number; end?: number; speed?: number; }>;
    portals?: Array<{ x1?: number; y1?: number; x2?: number; y2?: number; id?: string; pair?: string; x?: number; y?: number; }>;
    lasers?: Array<{ x1?: number; y1?: number; x2?: number; y2?: number; onTime?: number; offTime?: number; direction?: string; x?: number; y?: number; length?: number; }>;
    metadata?: any;
}

export const campaignLevels: Record<number, LevelDataStructure> = ${JSON.stringify(levelsObject, null, 4)};

export const defaultCampaignArray: LevelDataStructure[] = Object.values(campaignLevels);
`;

fs.writeFileSync('src/data/levels.ts', tsContent);
