import SaveManager from './SaveManager.js';

class SettingsManager {
    constructor() {
        this.settings = SaveManager.get('settings');
    }

    get musicEnabled() { return this.settings.music; }
    set musicEnabled(val) {
        this.settings.music = val;
        this.save();
    }

    get sfxEnabled() { return this.settings.sfx; }
    set sfxEnabled(val) {
        this.settings.sfx = val;
        this.save();
    }

    get vibrationEnabled() { return this.settings.vibration; }
    set vibrationEnabled(val) {
        this.settings.vibration = val;
        this.save();
    }

    save() {
        SaveManager.set('settings', this.settings);
    }
}

export default new SettingsManager();
