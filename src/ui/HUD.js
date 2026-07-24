import Phaser from 'phaser';
import PauseMenuPanel from './PauseMenuPanel.js';

export default class HUD extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene, 0, 0);
        scene.add.existing(this);
        
        const width = scene.cameras.main.width;
        
        const paddingX = 40;
        const yPos = 60;
        
        // 1. Level Text
        this.levelText = scene.add.text(paddingX, yPos, `LEVEL ${scene.levelId}`, {
            fontFamily: 'Fredoka',
            fontSize: '48px',
            color: '#3a3a4a',
            fontStyle: '700',
            letterSpacing: 2
        }).setOrigin(0, 0.5);
        
        // 2. Pause Button (rounded square, no text, HD icon)
        const pauseSize = 72;
        this.pauseBtn = scene.add.container(width - paddingX - pauseSize/2, yPos);
        
        const shadow = scene.add.graphics();
        shadow.fillStyle(0xd0d0d8, 0.6);
        shadow.fillRoundedRect(-pauseSize/2, -pauseSize/2 + 6, pauseSize, pauseSize, 18);
        
        const bg = scene.add.graphics();
        bg.fillStyle(0xffffff, 1);
        bg.fillRoundedRect(-pauseSize/2, -pauseSize/2, pauseSize, pauseSize, 18);
        
        const stroke = scene.add.graphics();
        stroke.lineStyle(2, 0xe0e0e8, 1);
        stroke.strokeRoundedRect(-pauseSize/2, -pauseSize/2, pauseSize, pauseSize, 18);
        
        const icon = scene.add.image(0, 0, 'icon_pause');
        icon.setScale(0.7);
        
        this.pauseBtn.add([shadow, bg, stroke, icon]);
        this.pauseBtn.setSize(pauseSize, pauseSize);
        this.pauseBtn.setInteractive({ useHandCursor: true });
        
        this.pauseBtn.on('pointerdown', (pointer, localX, localY, event) => {
            event.stopPropagation();
            bg.y = 4;
            icon.y = 4;
            shadow.alpha = 0.2;
            scene.tweens.add({
                targets: this.pauseBtn,
                scaleX: 0.9,
                scaleY: 0.9,
                duration: 100,
                ease: 'Cubic.easeOut'
            });
            if (scene.state === 'PLAYING' || scene.state === 'IDLE') {
                if (scene.aimSystem && scene.aimSystem.isAiming) {
                    scene.aimSystem.cancelAim();
                }
                new PauseMenuPanel(scene);
            }
        });
        
        this.pauseBtn.on('pointerup', (pointer, localX, localY, event) => {
            event.stopPropagation();
            bg.y = 0;
            icon.y = 0;
            shadow.alpha = 0.6;
            scene.tweens.add({
                targets: this.pauseBtn,
                scaleX: 1,
                scaleY: 1,
                duration: 150,
                ease: 'Back.out'
            });
        });
        
        this.add([this.levelText, this.pauseBtn]);
        this.setDepth(200);
    }
}
