import Phaser from 'phaser';

export default class Laser {
    constructor(scene, x, y, length, axis, mode = 'always', onTime = 2, offTime = 1) {
        this.scene = scene;
        
        // Enforce 25px buffer from playfield inner edges (left:50, right:550, top:90, bottom:750)
        const minX = 75, maxX = 525, minY = 115, maxY = 725;
        if (axis === 'x') {
            x = Phaser.Math.Clamp(x, minX, maxX - 40);
            length = Math.min(length, maxX - x);
        } else {
            y = Phaser.Math.Clamp(y, minY, maxY - 40);
            length = Math.min(length, maxY - y);
        }

        this.x = x;
        this.y = y;
        this.length = length;
        this.axis = axis; // 'x' or 'y'
        this.mode = mode; // 'always', 'timed'
        this.onTime = onTime * 1000;
        this.offTime = offTime * 1000;
        this.isActive = true;

        // Create emitter visuals
        this.emitter1 = scene.add.sprite(x, y, 'laser_shooter');
        this.emitter1.setDepth(6);
        this.emitter1.setTint(0xef4444);
        
        // Emitter gentle animation
        scene.tweens.add({
            targets: this.emitter1,
            scale: 1.05,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
        
        let endX = x;
        let endY = y;
        
        if (axis === 'x') {
            endX = x + length;
            this.emitter1.setAngle(90); // Pointing right
            this.emitter2 = scene.add.sprite(endX, endY, 'laser_shooter');
            this.emitter2.setAngle(-90);
        } else {
            endY = y + length;
            this.emitter1.setAngle(180); // Pointing down
            this.emitter2 = scene.add.sprite(endX, endY, 'laser_shooter');
            this.emitter2.setAngle(0);
        }
        this.emitter2.setDepth(6);
        this.emitter2.setTint(0xef4444);

        scene.tweens.add({
            targets: this.emitter2,
            scale: 1.05,
            duration: 800,
            yoyo: true,
            repeat: -1,
            delay: 100
        });

        // Create Beam
        const beamX = x + (endX - x) / 2;
        const beamY = y + (endY - y) / 2;
        const beamWidth = axis === 'x' ? length : 16;
        const beamHeight = axis === 'y' ? length : 16;

        this.beam = scene.add.image(beamX, beamY, 'laser');
        this.beam.setDisplaySize(beamWidth, beamHeight);
        if (axis === 'y') this.beam.setAngle(90);
        this.beam.setDepth(5);
        this.beam.setBlendMode('ADD');
        this.beam.setTint(0xef4444);
        
        // Beam physics sensor
        this.sensor = scene.matter.add.rectangle(beamX, beamY, axis === 'x' ? length : 8, axis === 'y' ? length : 8, {
            isStatic: true,
            isSensor: true,
            label: 'laser'
        });
        this.sensor.laserInstance = this; // Attach reference for collision handling avoiding 'gameObject' which phaser expects to have .emit()

        // Glowing effect
        this.glowTween = scene.tweens.add({
            targets: this.beam,
            alpha: 0.6,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });

        if (this.mode === 'timed') {
            this.startTimedCycle();
        }
    }
    
    startTimedCycle() {
        if (!this.scene) return;
        
        this.timerEvent = this.scene.time.addEvent({
            delay: this.isActive ? this.onTime : this.offTime,
            callback: () => {
                this.isActive = !this.isActive;
                this.updateState();
                this.startTimedCycle(); // queue next toggle
            }
        });
    }
    
    updateState() {
        if (this.isActive) {
            this.beam.setVisible(true);
            this.sensor.isSensor = true;
            this.sensor.collisionFilter.mask = 0xFFFFFFFF;
            if (!this.glowTween.isPlaying()) this.glowTween.resume();
        } else {
            this.beam.setVisible(false);
            this.sensor.collisionFilter.mask = 0x00000000;
            if (this.glowTween.isPlaying()) this.glowTween.pause();
        }
    }

    cleanup() {
        if (this.timerEvent) {
            this.timerEvent.remove();
        }
        if (this.glowTween) {
            this.glowTween.stop();
        }
        this.emitter1.destroy();
        this.emitter2.destroy();
        this.beam.destroy();
        if (this.sensor) {
            this.scene.matter.world.remove(this.sensor);
        }
    }
}
