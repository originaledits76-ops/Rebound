export default class InputManager {
    static init(scene) {
        this.scene = scene;
        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    static isPointerDown() {
        if (!this.scene) return false;
        return this.scene.input.activePointer.isDown;
    }

    static getPointerPosition() {
        if (!this.scene) return { x: 0, y: 0 };
        return {
            x: this.scene.input.activePointer.x,
            y: this.scene.input.activePointer.y
        };
    }
    
    // Future expansion: Swipe detection, gamepad support, etc.
}
