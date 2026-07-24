export default class AssetLoader {
    /**
     * Helper to load multiple images seamlessly.
     * @param {Phaser.Scene} scene 
     * @param {Object} images - { key: path }
     */
    static loadImages(scene, images) {
        for (const [key, path] of Object.entries(images)) {
            scene.load.image(key, path);
        }
    }

    /**
     * Helper to load multiple audio files.
     * @param {Phaser.Scene} scene 
     * @param {Object} audio - { key: path }
     */
    static loadAudio(scene, audio) {
        for (const [key, path] of Object.entries(audio)) {
            scene.load.audio(key, path);
        }
    }

    /**
     * Helper to load sprite sheets.
     * @param {Phaser.Scene} scene 
     * @param {Object} sheets - { key: { path, width, height } }
     */
    static loadSpritesheets(scene, sheets) {
        for (const [key, config] of Object.entries(sheets)) {
            scene.load.spritesheet(key, config.path, {
                frameWidth: config.width,
                frameHeight: config.height
            });
        }
    }
}
