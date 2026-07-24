import Phaser from 'phaser';

export default class Wall extends Phaser.GameObjects.TileSprite {
    constructor(scene, x, y, width, height) {
        // Choose texture based on orientation
        const texture = width > height ? 'wall_thick_large' : 'wall_narrow_thin';
        
        // Add drop shadow
        const shadow = scene.add.tileSprite(x, y + 12, width, height, texture);
        shadow.setTint(0xd0d0d8);
        shadow.setAlpha(0.6);
        shadow.setDepth(-6);

        super(scene, x, y, width, height, texture);
        scene.add.existing(this);
        
        scene.matter.add.gameObject(this, {
            isStatic: true,
            friction: 0,
            restitution: 1 // Full bounce from wall
        });
        
        this.setDepth(-5);
    }
}
