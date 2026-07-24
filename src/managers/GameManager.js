import SaveManager from './SaveManager.js';

class GameManager {
    constructor() {
        this.progress = SaveManager.get('progress');
    }

    get currentLevel() { return this.progress.level; }
    
    completeLevel() {
        this.progress.level++;
        SaveManager.set('progress', this.progress);
    }

    resetProgress() {
        this.progress.level = 1;
        SaveManager.set('progress', this.progress);
    }
}

export default new GameManager();
