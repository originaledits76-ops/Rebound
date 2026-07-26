import Phaser from 'phaser';

export default class AimSystem {
    constructor(scene, ball) {
        this.scene = scene;
        this.ball = ball;
        this.isAiming = false;
        
        this.dragStart = new Phaser.Math.Vector2();
        this.dragCurrent = new Phaser.Math.Vector2();
        
        this.aimLine = scene.add.graphics();
        this.aimLine.setDepth(10);
        
        scene.input.on('pointerdown', this.onPointerDown, this);
        scene.input.on('pointermove', this.onPointerMove, this);
        scene.input.on('pointerup', this.onPointerUp, this);
    }
    
    onPointerDown(pointer, currentlyOver) {
        if (this.scene.state !== 'IDLE') return;
        if (currentlyOver && currentlyOver.length > 0) return;
        
        this.isAiming = true;
        this.dragStart.set(pointer.x, pointer.y);
        this.dragCurrent.set(pointer.x, pointer.y);
        this.scene.events.emit('aim_start');
        
        this.scene.tweens.add({
            targets: this.ball,
            scaleX: 0.9,
            scaleY: 0.9,
            duration: 200,
            ease: 'Sine.easeOut'
        });
    }
    
    onPointerMove(pointer) {
        if (!this.isAiming) return;
        this.dragCurrent.set(pointer.x, pointer.y);
        this.drawAimLine();
    }
    
    onPointerUp(pointer) {
        if (!this.isAiming) return;
        this.isAiming = false;
        this.aimLine.clear();
        
        const aimVector = new Phaser.Math.Vector2(this.dragStart.x - pointer.x, this.dragStart.y - pointer.y);
        const maxDrag = 400;
        if (aimVector.length() > maxDrag) {
            aimVector.setLength(maxDrag);
        }
        
        if (aimVector.length() > 20) {
            this.scene.shootBall(aimVector);
        }
        
        this.scene.tweens.add({
            targets: this.ball,
            scaleX: 1,
            scaleY: 1,
            duration: 200,
            ease: 'Back.out'
        });
    }
    
    drawAimLine() {
        this.aimLine.clear();
        const aimVector = new Phaser.Math.Vector2(this.dragStart.x - this.dragCurrent.x, this.dragStart.y - this.dragCurrent.y);
        
        const maxDrag = 400;
        if (aimVector.length() > maxDrag) {
            aimVector.setLength(maxDrag);
        }
        
        const dist = aimVector.length();
        if (dist < 20) {
            this.ball.setScale(1);
            this.ball.setRotation(0);
            return;
        }

        // Squash and stretch ball while aiming
        const stretch = 1 + (dist / maxDrag) * 0.15;
        const squash = 1 - (dist / maxDrag) * 0.15;
        this.ball.setScale(stretch, squash);
        this.ball.setRotation(aimVector.angle());

        // Forward Line (Predicted Launch Direction)
        this.aimLine.lineStyle(10, 0x6085e0, 0.8);
        this.aimLine.beginPath();
        this.aimLine.moveTo(this.ball.x, this.ball.y);
        this.aimLine.lineTo(this.ball.x + aimVector.x, this.ball.y + aimVector.y);
        this.aimLine.strokePath();
        
        // Forward Cap
        this.aimLine.fillStyle(0x6085e0, 0.8);
        this.aimLine.fillCircle(this.ball.x + aimVector.x, this.ball.y + aimVector.y, 5);

        // Backward Line (Drag Visualization)
        this.aimLine.lineStyle(6, 0xa0a0b0, 0.5);
        this.aimLine.beginPath();
        this.aimLine.moveTo(this.ball.x, this.ball.y);
        this.aimLine.lineTo(this.ball.x - aimVector.x, this.ball.y - aimVector.y);
        this.aimLine.strokePath();
        
        // Backward Cap
        this.aimLine.fillStyle(0xa0a0b0, 0.5);
        this.aimLine.fillCircle(this.ball.x - aimVector.x, this.ball.y - aimVector.y, 3);
    }

    cancelAim() {
        if (!this.isAiming) return;
        this.isAiming = false;
        this.aimLine.clear();
        this.scene.tweens.add({
            targets: this.ball,
            scaleX: 1,
            scaleY: 1,
            duration: 200,
            ease: 'Back.out'
        });
    }

    cleanup() {
        this.scene.input.off('pointerdown', this.onPointerDown, this);
        this.scene.input.off('pointermove', this.onPointerMove, this);
        this.scene.input.off('pointerup', this.onPointerUp, this);
        this.aimLine.destroy();
    }
}
