import { HANDCRAFTED_LEVELS_DATA } from '../RicochetGame.js';

export default class LevelManager {
    static get levels() {
        return HANDCRAFTED_LEVELS_DATA;
    }

    static async getLevel(levelId, width = 1080, height = 1920) {
        let targetNum = 1;
        if (typeof levelId === 'number') {
            targetNum = levelId;
        } else if (typeof levelId === 'string') {
            const cleaned = levelId.replace('level_', '');
            const parsed = parseInt(cleaned, 10);
            if (!isNaN(parsed)) {
                targetNum = parsed;
            }
        }

        let levelIndex = targetNum - 1;
        if (levelIndex < 0 || levelIndex >= HANDCRAFTED_LEVELS_DATA.length) {
            levelIndex = 0;
        }

        const rawData = HANDCRAFTED_LEVELS_DATA[levelIndex];
        return this.scaleLevelData(rawData, width, height);
    }

    static loadLevel(index, width = 1080, height = 1920) {
        let levelIndex = index;
        if (levelIndex < 0 || levelIndex >= HANDCRAFTED_LEVELS_DATA.length) {
            levelIndex = 0;
        }
        return this.scaleLevelData(HANDCRAFTED_LEVELS_DATA[levelIndex], width, height);
    }

    static scaleLevelData(rawLevel, targetWidth, targetHeight) {
        const deep = JSON.parse(JSON.stringify(rawLevel));
        const scaleX = targetWidth / 600;
        const scaleY = targetHeight / 800;

        deep.id = `level_${String(deep.levelNumber).padStart(3, '0')}`;
        deep.instruction = rawLevel.instruction || '';

        // Scale startPos -> spawn & startPos
        if (deep.startPos) {
            deep.startPos = {
                x: deep.startPos.x * scaleX,
                y: deep.startPos.y * scaleY
            };
            deep.spawn = { ...deep.startPos };
        }

        // Scale holePos -> hole & holePos
        if (deep.holePos) {
            deep.holePos = {
                x: deep.holePos.x * scaleX,
                y: deep.holePos.y * scaleY
            };
            deep.hole = { ...deep.holePos };
        }

        // Scale static walls
        if (deep.walls) {
            deep.walls = deep.walls.map(w => ({
                x: w.x * scaleX,
                y: w.y * scaleY,
                width: w.width * scaleX,
                height: w.height * scaleY,
                w: w.width * scaleX,
                h: w.height * scaleY,
                angle: w.angle || 0
            }));
        }

        // Scale portals
        if (deep.portals) {
            deep.portals = deep.portals.map(p => ({
                x1: p.x1 * scaleX,
                y1: p.y1 * scaleY,
                x2: p.x2 * scaleX,
                y2: p.y2 * scaleY,
                angle1: p.angle1 || 0,
                angle2: p.angle2 || 0
            }));
        }

        // Scale lasers
        if (deep.lasers) {
            deep.lasers = deep.lasers.map(l => ({
                x1: l.x1 * scaleX,
                y1: l.y1 * scaleY,
                x2: l.x2 * scaleX,
                y2: l.y2 * scaleY
            }));
        }

        // Scale moving walls
        if (deep.movingWalls) {
            deep.movingWalls = deep.movingWalls.map(mw => {
                const isHoriz = Math.abs(mw.endX - mw.startX) >= Math.abs(mw.endY - mw.startY);
                const defaultW = isHoriz ? 140 : 20;
                const defaultH = isHoriz ? 20 : 140;
                return {
                    startX: mw.startX * scaleX,
                    startY: mw.startY * scaleY,
                    endX: mw.endX * scaleX,
                    endY: mw.endY * scaleY,
                    duration: mw.duration || 2000,
                    width: (mw.width || defaultW) * scaleX,
                    height: (mw.height || defaultH) * scaleY
                };
            });
        }

        return deep;
    }
}
