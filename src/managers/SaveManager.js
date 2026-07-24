const SAVE_KEY = 'puzzle_game_save_data_v1';

class SaveManager {
    constructor() {
        this.data = {
            settings: {
                music: true,
                sfx: true,
                vibration: true
            },
            progress: {
                level: 1,
                highScore: 0
            }
        };
        this.load();
    }

    load() {
        try {
            const saved = localStorage.getItem(SAVE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge loaded data with default structure
                this.data = { 
                    ...this.data, 
                    ...parsed,
                    settings: { ...this.data.settings, ...(parsed.settings || {}) },
                    progress: { ...this.data.progress, ...(parsed.progress || {}) }
                };
            }
        } catch (e) {
            console.warn('SaveManager: Could not load save data', e);
        }
    }

    save() {
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.warn('SaveManager: Could not save data', e);
        }
    }

    get(key) {
        return this.data[key];
    }

    set(key, value) {
        this.data[key] = value;
        this.save();
    }
}

export default new SaveManager();
