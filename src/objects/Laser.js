import Phaser from 'phaser';

export default class Laser {
    constructor(scene, x, y, length, axis) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.length = length;
        this.axis = axis; // 'x' or 'y'

        // Create emitter visuals
        this.emitter1 = scene.add.sprite(x, y, 'laser_shooter');
        
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

        // Create Beam
        const beamX = x + (endX - x) / 2;
        const beamY = y + (endY - y) / 2;
        const beamWidth = axis === 'x' ? length : 8;
        const beamHeight = axis === 'y' ? length : 8;

        this.beam = scene.add.tileSprite(beamX, beamY, beamWidth, beamHeight, 'laser');
        this.beam.setDepth(5);
        this.beam.setBlendMode('ADD');
        
        // Beam physics sensor
        this.sensor = scene.matter.add.rectangle(beamX, beamY, beamWidth, beamHeight, {
            isStatic: true,
            isSensor: true,
            label: 'laser'
        });

        // Glowing effect
        scene.tweens.add({
            targets: this.beam,
            alpha: 0.6,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });
    }

    cleanup() {
        this.emitter1.destroy();
        this.emitter2.destroy();
        this.beam.destroy();
        this.scene.matter.world.remove(this.sensor);
    }
}
