import ProgressManager from './ProgressManager.js';

class GameManager {
    constructor() {
        this.activeLevelId = 1;
    }

    get currentLevel() {
        return this.activeLevelId || ProgressManager.getLastPlayed();
    }

    setCurrentLevel(levelId) {
        this.activeLevelId = levelId;
    }

    completeLevel(shotsTaken = 1) {
        if (typeof this.activeLevelId === 'number') {
            ProgressManager.recordLevelComplete(this.activeLevelId, shotsTaken);
            this.activeLevelId++;
        }
    }
}

export default new GameManager();
