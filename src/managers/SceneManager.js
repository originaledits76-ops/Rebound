export default class SceneManager {
    /**
     * Elegantly fades out the current scene and transitions to the next.
     */
    static transitionTo(currentScene, targetSceneKey, data = {}) {
        // Soft white fade out for a premium, clean feel (#fafafc)
        currentScene.cameras.main.fadeOut(300, 250, 250, 252);
        currentScene.cameras.main.once('camerafadeoutcomplete', () => {
            currentScene.scene.start(targetSceneKey, data);
        });
    }

    /**
     * Should be called in the create() method of scenes for a clean fade in.
     */
    static transitionIn(currentScene) {
        currentScene.cameras.main.fadeIn(300, 250, 250, 252);
    }
}
