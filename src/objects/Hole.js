import Phaser from 'phaser';

export default class Hole extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y) {
        super(scene.matter.world, x, y, 'portal_exit');
        scene.add.existing(this);
        
        this.setDisplaySize(90, 90); // Slightly larger than hitbox
        
        // Shadow for hole
        const shadow = scene.add.circle(x, y + 15, 45, 0xd0d0d8, 0.6);
        shadow.setDepth(-3);
        
        // Slightly larger circle for forgiveness
        this.setCircle(35); 
        this.setSensor(true);
        this.setStatic(true);
        this.setDepth(-2);
        
        // Soft pulse animation
        scene.tweens.add({
            targets: [this, shadow],
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });
    }
}
