import Phaser from 'phaser';

export default class MovingWall extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, width, height, axis, distance, duration, pause = 500) {
        const texture = width > height ? 'wall_thick_large' : 'wall_narrow_thin';
        super(scene.matter.world, x, y, texture);
        scene.add.existing(this);
        
        this.setDisplaySize(width, height);
        this.setStatic(true);
        this.setFriction(0, 0, 0);
        this.setBounce(1);

        // Add drop shadow
        this.shadow = scene.add.tileSprite(x, y + 12, width, height, texture);
        this.shadow.setTint(0xd0d0d8);
        this.shadow.setAlpha(0.6);
        this.shadow.setDepth(-6);

        this.axis = axis; // 'x' or 'y'
        this.distance = distance;
        this.duration = duration;
        this.pause = pause;

        this.startX = x;
        this.startY = y;

        this.startMovement();
    }

    startMovement() {
        const targetProps = {};
        if (this.axis === 'x') {
            targetProps.x = this.startX + this.distance;
        } else {
            targetProps.y = this.startY + this.distance;
        }

        this.scene.tweens.add({
            targets: this,
            ...targetProps,
            duration: this.duration,
            yoyo: true,
            repeat: -1,
            hold: this.pause,        // Pause at the end before yoyo
            repeatDelay: this.pause, // Pause at the start before repeat
            ease: 'Sine.inOut',
            onUpdate: () => {
                if (this.shadow) {
                    this.shadow.setPosition(this.x, this.y + 12);
                }
            }
        });
    }

    cleanup() {
        if (this.shadow) this.shadow.destroy();
        this.destroy();
    }
}
