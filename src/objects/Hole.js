import Phaser from 'phaser';

export default class Hole extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y) {
        super(scene.matter.world, x, y, 'hole_goal');
        scene.add.existing(this);
        
        this.setDisplaySize(90, 90); // Slightly larger than hitbox
        
        // Slightly larger circle for forgiveness
        this.setCircle(35); 
        this.setSensor(true);
        this.setStatic(true);
        this.setDepth(-2);
        
        // Debug Color: Orange
        this.setTint(0xf97316);
        
        // Soft pulse animation
        scene.tweens.add({
            targets: this,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });
    }
}
