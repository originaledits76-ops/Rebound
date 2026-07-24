import SettingsManager from './SettingsManager.js';

class AudioManager {
    constructor() {
        this.scene = null;
        this.music = null;
    }

    init(scene) {
        this.scene = scene;
    }

    playMusic(key, volume = 0.5) {
        if (!SettingsManager.musicEnabled) return;
        if (this.music && this.music.key === key && this.music.isPlaying) return;

        if (this.music) {
            this.music.stop();
        }

        // Uncomment when actual audio is loaded
        // this.music = this.scene.sound.add(key, { loop: true, volume });
        // this.music.play();
    }

    playSFX(key, volume = 1) {
        if (!SettingsManager.sfxEnabled) return;
        if (!this.scene) return;
        
        if (this.scene.cache.audio.exists(key)) {
            this.scene.sound.play(key, { volume });
        }
    }

    stopMusic() {
        if (this.music) {
            this.music.stop();
        }
    }
}

export default new AudioManager();
