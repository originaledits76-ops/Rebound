import Phaser from 'phaser';

export default class LevelGenerator {
    static generate(levelIndex, width = 1080, height = 1920) {
        // Return a simple static fallback level since random generation is removed.
        const marginX = 80;
        const marginY = 180;
        
        const spawn = { x: width / 2, y: height - marginY - 120 };
        const hole = { x: width / 2, y: marginY + 120 };
        
        const walls = [
            // Outer Bounds
            { x: width/2, y: marginY, w: width - marginX * 2 + 40, h: 40 },
            { x: width/2, y: height - marginY, w: width - marginX * 2 + 40, h: 40 },
            { x: marginX, y: height/2, w: 40, h: height - marginY * 2 },
            { x: width - marginX, y: height/2, w: 40, h: height - marginY * 2 },
            
            // Simple obstacle in the middle
            { x: width / 2, y: height / 2, w: 300, h: 60 }
        ];

        return { spawn, hole, walls, portals: [], lasers: [], movingWalls: [] };
    }
}
