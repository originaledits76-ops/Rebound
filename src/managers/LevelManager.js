import { getCampaignLevel } from '../firebase.js';

export default class LevelManager {
    static async getLevel(levelId, width, height) {
        const data = await getCampaignLevel(levelId);
        if (data) {
            return this.parseLevel(data, width, height);
        }
        return this.getFallbackLevel(width, height);
    }

    static parseLevel(data, width, height) {
        // Assume data contains spawn, hole, walls, portals, lasers arrays
        // with relative positions or absolute, we'll map them appropriately.
        // For now, if the structure matches we just return it.
        return data;
    }

    static getFallbackLevel(width, height) {
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
            
            // Simple obstacle
            { x: width / 2, y: height / 2, w: 300, h: 60 }
        ];

        const portals = [
            { id: 1, x: marginX + 100, y: height/2 + 200, type: 'entry', linkId: 2 },
            { id: 2, x: width - marginX - 100, y: marginY + 300, type: 'exit' }
        ];

        const lasers = [
            { x: width/2 - 150, y: height/2 - 200, length: 300, axis: 'x' }
        ];

        const movingWalls = [
            { x: width/2, y: height/2 + 250, w: 200, h: 40, axis: 'x', distance: 150, duration: 2000 }
        ];

        return { spawn, hole, walls, portals, lasers, movingWalls };
    }
}
