import SaveManager from './SaveManager.js';

class CreditManager {
    constructor() {
        this.progress = SaveManager.get('progress');
        if (this.progress.credits === undefined) {
            this.progress.credits = 10; // Starting credits
            SaveManager.set('progress', this.progress);
        }
    }

    getCredits() {
        return this.progress.credits;
    }

    has(amount) {
        return this.progress.credits >= amount;
    }

    spend(amount) {
        if (this.has(amount)) {
            this.progress.credits -= amount;
            SaveManager.set('progress', this.progress);
            return true;
        }
        return false;
    }

    add(amount) {
        this.progress.credits += amount;
        SaveManager.set('progress', this.progress);
    }
}

export default new CreditManager();
