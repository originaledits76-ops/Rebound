import Phaser from 'phaser';

export default class MovingWall extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, width, height, movement = 'horizontal', startPos = 0, endPos = 0, speed = 120, pause = 0.5, mode = 'pingpong', delay = 0, direction = 1) {
        const texture = width > height ? 'wall_thick_large' : 'wall_narrow_thin';
        super(scene.matter.world, x, y, texture);
        scene.add.existing(this);
        
        this.setDisplaySize(width, height);
        this.setStatic(true);
        this.setFriction(0, 0, 0);
        this.setBounce(1);

        // Debug Color: Green
        this.setTint(0x22c55e);

        this.movement = movement;
        this.startPos = startPos;
        this.endPos = endPos;
        this.moveSpeed = speed;
        this.pauseTime = pause * 1000;
        this.mode = mode;
        this.delayTime = delay * 1000;
        this.direction = direction;

        // Position it correctly to start
        if (this.movement === 'horizontal') {
            this.setPosition(this.direction === 1 ? this.startPos : this.endPos, this.y);
        } else {
            this.setPosition(this.x, this.direction === 1 ? this.startPos : this.endPos);
        }

        // To prevent tunneling and stickiness with fast walls, we manually calculate physics velocity
        this.prevX = this.x;
        this.prevY = this.y;

        this.startMovement();
    }

    startMovement() {
        const distance = Math.abs(this.endPos - this.startPos);
        const duration = (distance / this.moveSpeed) * 1000;

        let targetProps = {};
        if (this.movement === 'horizontal') {
            targetProps.x = this.direction === 1 ? this.endPos : this.startPos;
        } else {
            targetProps.y = this.direction === 1 ? this.endPos : this.startPos;
        }

        if (this.mode === 'pingpong') {
            this.moveTween = this.scene.tweens.add({
                targets: this,
                ...targetProps,
                duration: duration,
                yoyo: true,
                repeat: -1,
                hold: this.pauseTime,
                repeatDelay: this.pauseTime,
                delay: this.delayTime,
                ease: 'Sine.inOut'
            });
        } else if (this.mode === 'loop') {
            // Loop goes from start to end, then instantly snaps back to start
            this.moveTween = this.scene.tweens.add({
                targets: this,
                ...targetProps,
                duration: duration,
                repeat: -1,
                hold: this.pauseTime,
                delay: this.delayTime,
                ease: 'Linear',
                onRepeat: () => {
                    if (this.movement === 'horizontal') {
                        this.x = this.direction === 1 ? this.startPos : this.endPos;
                    } else {
                        this.y = this.direction === 1 ? this.startPos : this.endPos;
                    }
                    this.prevX = this.x;
                    this.prevY = this.y;
                }
            });
        }
    }

    preUpdate(time, delta) {
        // Calculate velocity so the physics engine can impart momentum to the ball correctly
        // and resolve continuous collisions slightly better.
        // delta is in ms, we need velocity per tick for Matter
        const vx = this.x - this.prevX;
        const vy = this.y - this.prevY;
        
        // Use Phaser's built-in matter sprite method
        this.setVelocity(vx, vy);

        this.prevX = this.x;
        this.prevY = this.y;
    }

    cleanup() {
        if (this.moveTween) this.moveTween.stop();
        this.destroy();
    }
}
