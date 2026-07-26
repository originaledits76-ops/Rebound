import Phaser from 'phaser';

export default class Wall extends Phaser.GameObjects.TileSprite {
    constructor(scene, x, y, width, height, angle = 0) {
        // Use seamless texture so adjacent/touching walls visually merge with zero seams
        super(scene, x, y, width, height, 'wall_seamless');
        scene.add.existing(this);
        
        if (angle) {
            this.setAngle(angle);
        }

        scene.matter.add.gameObject(this, {
            isStatic: true,
            friction: 0,
            restitution: 1 // Full bounce from wall
        });
        
        // Debug Color: Blue
        this.setTint(0x3b82f6);
        this.setDepth(-5);
    }
}
