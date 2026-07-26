import Phaser from 'phaser';

export default class Portal extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, id, pairId, textureKey = 'portal_entry') {
        super(scene.matter.world, x, y, textureKey);
        scene.add.existing(this);
        
        this.id = id;
        this.pairId = pairId;
        this.linkedPortal = null;
        this.isActive = true;
        this.cooldown = 0;
        
        this.setDisplaySize(80, 80);
        this.setCircle(25); // Slightly smaller collision box for better feel
        this.setSensor(true);
        this.setStatic(true);
        this.label = 'portal'; // for collision detection
        
        // Debug Color: Purple
        this.setTint(0xa855f7);
        
        // Visuals
        const color = textureKey === 'portal_entry' ? 0x6085e0 : 0xe0b060;
        
        // Glow effect
        this.glow = scene.add.pointlight(x, y, color, 120, 0.4, 0.05);
        this.glow.setDepth(this.depth - 1);
        
        // Particles
        this.particles = scene.add.particles(x, y, 'ball_blue_small', {
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.4, end: 0 },
            tint: color,
            lifespan: 1500,
            frequency: 400,
            blendMode: 'ADD'
        });
        this.particles.setDepth(this.depth - 1);

        // Gentle rotation
        const direction = textureKey === 'portal_entry' ? 1 : -1;
        scene.tweens.add({
            targets: this,
            angle: 360 * direction,
            duration: 5000,
            repeat: -1,
            ease: 'Linear'
        });
        
        // Pulse softly
        scene.tweens.add({
            targets: this,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.cooldown > 0) {
            this.cooldown -= delta;
            if (this.cooldown <= 0) {
                this.cooldown = 0;
                this.setAlpha(1);
            } else {
                this.setAlpha(0.6 + Math.sin(time / 50) * 0.2); // Visual feedback during cooldown
            }
        }
    }

    triggerTeleport(ball) {
        if (!this.isActive || this.cooldown > 0 || !this.linkedPortal) return;
        
        // Put both portals on cooldown to prevent looping (approx 300ms + animation time)
        this.cooldown = 450;
        this.linkedPortal.cooldown = 450;
        
        const scene = this.scene;
        
        // Play sound hooks
        if (scene.sound && scene.sound.get('portal_enter')) {
            scene.sound.play('portal_enter');
        }
        
        // Store velocity to maintain momentum
        const currentVel = { x: ball.body.velocity.x, y: ball.body.velocity.y };
        
        // Temporarily disable ball physics and make invisible
        ball.isTeleporting = true;
        ball.setStatic(true);
        ball.setVisible(false);
        ball.setVelocity(0, 0); // Stop it moving while static
        
        // Create a visual clone for the suck-in animation
        const visualClone = scene.add.sprite(ball.x, ball.y, ball.texture.key);
        visualClone.setScale(ball.scaleX, ball.scaleY);
        visualClone.setTint(ball.tintTopLeft);
        
        // Suck in animation
        scene.tweens.add({
            targets: visualClone,
            x: this.x,
            y: this.y,
            scaleX: 0,
            scaleY: 0,
            duration: 150,
            ease: 'Back.in',
            onComplete: () => {
                visualClone.destroy();
                
                // Teleport real ball
                ball.setPosition(this.linkedPortal.x, this.linkedPortal.y);
                
                // Reset trail to prevent streaking across screen
                if (ball.lastEmitPos) {
                    ball.lastEmitPos.set(this.linkedPortal.x, this.linkedPortal.y);
                }
                
                // Play exit sound hook
                if (scene.sound && scene.sound.get('portal_exit')) {
                    scene.sound.play('portal_exit');
                }
                
                // Create a new clone for exit animation
                const exitClone = scene.add.sprite(this.linkedPortal.x, this.linkedPortal.y, ball.texture.key);
                exitClone.setScale(0, 0);
                exitClone.setTint(ball.tintTopLeft);
                
                // Shoot out animation
                scene.tweens.add({
                    targets: exitClone,
                    scaleX: ball.scaleX, // scale to ball's original scale
                    scaleY: ball.scaleY,
                    duration: 150,
                    ease: 'Back.out',
                    onComplete: () => {
                        exitClone.destroy();
                        
                        ball.setVisible(true);
                        ball.setStatic(false); 
                        // It is crucial to set velocity AFTER making it non-static
                        ball.setVelocity(currentVel.x, currentVel.y);
                        ball.isTeleporting = false;
                    }
                });
            }
        });
    }

    destroy(fromScene) {
        if (this.glow) this.glow.destroy();
        if (this.particles) this.particles.destroy();
        super.destroy(fromScene);
    }
}
