import Phaser from 'phaser';

export default class Portal extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, type = 'entry', linkedPortal = null) {
        // type: 'entry' or 'exit'
        super(scene.matter.world, x, y, type === 'entry' ? 'portal_entry' : 'portal_exit');
        scene.add.existing(this);
        
        this.portalType = type;
        this.linkedPortal = linkedPortal;
        this.isActive = true;
        this.cooldown = 0;
        
        this.setDisplaySize(80, 80);
        this.setCircle(30);
        this.setSensor(true);
        this.setStatic(true);
        
        // Gentle rotation
        scene.tweens.add({
            targets: this,
            angle: type === 'entry' ? 360 : -360,
            duration: 4000,
            repeat: -1,
            ease: 'Linear'
        });
        
        // Idle floating
        scene.tweens.add({
            targets: this,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.cooldown > 0) {
            this.cooldown -= delta;
            if (this.cooldown < 0) this.cooldown = 0;
        }
    }

    triggerTeleport(ball) {
        if (!this.isActive || this.cooldown > 0 || !this.linkedPortal) return;
        
        // Put both portals on cooldown to prevent looping
        this.cooldown = 500;
        this.linkedPortal.cooldown = 500;
        
        const scene = this.scene;
        
        // Play sound
        if (scene.sound) {
            // AudioManager.playSFX('portal'); // assume we have it or reuse bounce
        }

        // Store velocity to maintain it
        const currentVel = { x: ball.body.velocity.x, y: ball.body.velocity.y };
        const currentSpeed = ball.body.speed;
        
        const originalScaleX = ball.scaleX;
        const originalScaleY = ball.scaleY;

        // Disable ball physics during transition
        ball.setCollisionCategory(0);
        
        // Suck in animation
        scene.tweens.add({
            targets: ball,
            x: this.x,
            y: this.y,
            scaleX: 0,
            scaleY: 0,
            duration: 150,
            ease: 'Back.in',
            onComplete: () => {
                // Teleport
                ball.setPosition(this.linkedPortal.x, this.linkedPortal.y);
                
                // Reset trail
                if (ball.lastEmitPos) {
                    ball.lastEmitPos.set(this.linkedPortal.x, this.linkedPortal.y);
                }
                
                // Shoot out animation
                scene.tweens.add({
                    targets: ball,
                    scaleX: originalScaleX,
                    scaleY: originalScaleY,
                    duration: 150,
                    ease: 'Back.out',
                    onComplete: () => {
                        ball.setCollisionCategory(1); // default
                        ball.setVelocity(currentVel.x, currentVel.y);
                    }
                });
            }
        });
    }
}
