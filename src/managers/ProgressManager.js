import SaveManager from './SaveManager.js';

class ProgressManager {
    constructor() {
        this.STORAGE_KEY = 'puzzle_journey_player_progress_v2';
        this.data = {
            highestUnlockedLevel: 1,
            completedLevels: [],
            starsEarned: {},
            lastPlayedLevel: 1,
            playCount: 0
        };
        this.load();
    }

    load() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                this.data = {
                    highestUnlockedLevel: parsed.highestUnlockedLevel || 1,
                    completedLevels: Array.isArray(parsed.completedLevels) ? parsed.completedLevels : [],
                    starsEarned: parsed.starsEarned || {},
                    lastPlayedLevel: parsed.lastPlayedLevel || 1,
                    playCount: parsed.playCount || 0
                };
            }
        } catch (e) {
            console.warn('ProgressManager: Failed to load progress from localStorage', e);
        }
    }

    save() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.warn('ProgressManager: Failed to save progress to localStorage', e);
        }
    }

    isLevelUnlocked(levelId) {
        if (typeof levelId !== 'number') {
            // String IDs or custom levels are unlocked by default
            return true;
        }
        if (levelId <= 1) return true;
        return levelId <= this.data.highestUnlockedLevel || this.data.completedLevels.includes(levelId);
    }

    isLevelCompleted(levelId) {
        return this.data.completedLevels.includes(levelId);
    }

    getStarsForLevel(levelId) {
        return this.data.starsEarned[levelId] || 0;
    }

    recordLevelComplete(levelId, shotsTaken = 1) {
        this.data.playCount++;
        if (typeof levelId === 'number') {
            this.data.lastPlayedLevel = levelId;
            if (!this.data.completedLevels.includes(levelId)) {
                this.data.completedLevels.push(levelId);
            }

            // Calculate stars: 3 for 1-2 shots, 2 for 3-4 shots, 1 for 5+
            let stars = 3;
            if (shotsTaken >= 5) stars = 1;
            else if (shotsTaken >= 3) stars = 2;

            const prevStars = this.data.starsEarned[levelId] || 0;
            if (stars > prevStars) {
                this.data.starsEarned[levelId] = stars;
            }

            const nextLevel = levelId + 1;
            if (nextLevel > this.data.highestUnlockedLevel) {
                this.data.highestUnlockedLevel = nextLevel;
            }
        }
        this.save();
    }

    recordPlaySession(levelId) {
        this.data.playCount++;
        if (typeof levelId === 'number') {
            this.data.lastPlayedLevel = levelId;
        }
        this.save();
    }

    getTotalStars() {
        return Object.values(this.data.starsEarned).reduce((sum, val) => sum + val, 0);
    }

    getHighestUnlocked() {
        return this.data.highestUnlockedLevel || 1;
    }

    getLastPlayed() {
        return this.data.lastPlayedLevel || 1;
    }
}

export default new ProgressManager();
