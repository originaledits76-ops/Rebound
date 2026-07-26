import Phaser from 'phaser';

export default class Ball extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y) {
        super(scene.matter.world, x, y, 'ball_blue_large');
        scene.add.existing(this);
        
        this.setDisplaySize(60, 60);
        this.setCircle(30);
        this.setBounce(0.85); // Retain more energy for longer bounces
        this.setFriction(0.001, 0.001, 0.001); // Minimal friction for smooth rolling
        this.setFrictionAir(0.004); // Very gradual momentum decay
        this.setMass(1);
        
        // Debug Color: Yellow (Spawn/Ball)
        this.setTint(0xeab308);

        this.setDepth(10);
        
        // Bright, smooth trail
        this.trailEmitter = scene.add.particles(0, 0, 'ball_blue_large', {
            speed: 0,
            scale: { start: 0.6, end: 0 },
            alpha: { start: 0.4, end: 0 },
            blendMode: 'ADD',
            lifespan: 250,
            tint: 0xffe680,
            frequency: -1, // We will emit manually based on speed
        });
        this.trailEmitter.setDepth(5);
        this.lastEmitPos = new Phaser.Math.Vector2(x, y);
    }
    
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        
        if (!this.active) return;
        
        const speed = this.body.speed;
        
        if (speed > 1) {
            // Emit trail particles based on distance to ensure smooth continuous line
            const dist = Phaser.Math.Distance.Between(this.x, this.y, this.lastEmitPos.x, this.lastEmitPos.y);
            if (dist > 4) {
                // Lifespan based on speed for dynamic tail length
                this.trailEmitter.lifespan = Math.max(100, Math.min(400, speed * 25));
                this.trailEmitter.emitParticleAt(this.x, this.y);
                this.lastEmitPos.set(this.x, this.y);
            }
        }
        
        if (this.scene.state !== 'PLAYING') return;
        
        // Roll to a smooth stop naturally
        if (speed < 0.15 && speed > 0) {
            this.setVelocity(0, 0);
            this.setAngularVelocity(0);
            
            // Tiny bounce when stopping
            this.scene.tweens.add({
                targets: this,
                scaleY: 0.92,
                scaleX: 1.08,
                duration: 120,
                yoyo: true,
                ease: 'Sine.inOut'
            });
            this.scene.onBallStopped();
        }
    }
    
    cleanup() {
        if (this.trailEmitter) this.trailEmitter.destroy();
        this.destroy();
    }
}

