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
        
        // 2. Button sizes
        const btnSize = 72;
        const pauseSize = btnSize;
        const restartSize = 72;

        // 3. Center Top HUD Container (Timer)
        const hudCenter = scene.add.container(width / 2 + 30, yPos);
        
        // Timer Pill
        const timerBg = scene.add.graphics();
        timerBg.fillStyle(0xffffff, 1);
        timerBg.fillRoundedRect(-90, -28, 180, 56, 28);
        timerBg.lineStyle(2, 0xe0e0e8, 1);
        timerBg.strokeRoundedRect(-90, -28, 180, 56, 28);
        
        this.timerText = scene.add.text(0, 0, '⏱️ 15s', {
            fontFamily: 'Fredoka',
            fontSize: '28px',
            color: '#3a3a4a',
            fontStyle: '700'
        }).setOrigin(0.5);
        hudCenter.add([timerBg, this.timerText]);

        // 4. Restart Button (Small pill/square next to pause)
        this.restartBtn = scene.add.container(width - paddingX - pauseSize - 20 - restartSize/2, yPos);
        
        const rShadow = scene.add.graphics();
        rShadow.fillStyle(0xd0d0d8, 0.6);
        rShadow.fillRoundedRect(-restartSize/2, -restartSize/2 + 6, restartSize, restartSize, 18);
        
        const rBg = scene.add.graphics();
        rBg.fillStyle(0xffffff, 1);
        rBg.fillRoundedRect(-restartSize/2, -restartSize/2, restartSize, restartSize, 18);
        
        const rStroke = scene.add.graphics();
        rStroke.lineStyle(2, 0xe0e0e8, 1);
        rStroke.strokeRoundedRect(-restartSize/2, -restartSize/2, restartSize, restartSize, 18);
        
        const rIcon = scene.add.image(0, 0, 'icon_retry');
        rIcon.setDisplaySize(40, 40);
        
        this.restartBtn.add([rShadow, rBg, rStroke, rIcon]);
        this.restartBtn.setSize(restartSize, restartSize);
        this.restartBtn.setInteractive({ useHandCursor: true });

        this.restartBtn.on('pointerdown', (pointer, localX, localY, event) => {
            event.stopPropagation();
            rBg.y = 4;
            rIcon.y = 4;
            rShadow.alpha = 0.2;
            scene.tweens.add({
                targets: this.restartBtn,
                scaleX: 0.9,
                scaleY: 0.9,
                duration: 100,
                ease: 'Cubic.easeOut'
            });
            if (scene.handleHUDRestart) {
                scene.handleHUDRestart();
            }
        });

        this.restartBtn.on('pointerup', (pointer, localX, localY, event) => {
            event.stopPropagation();
            rBg.y = 0;
            rIcon.y = 0;
            rShadow.alpha = 0.6;
            scene.tweens.add({
                targets: this.restartBtn,
                scaleX: 1,
                scaleY: 1,
                duration: 150,
                ease: 'Back.out'
            });
        });

        // 5. Pause Button (rounded square, no text, HD icon)
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
        icon.setDisplaySize(42, 42);
        
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
        
        this.add([this.levelText, hudCenter, this.restartBtn, this.pauseBtn]);
        this.setDepth(200);
    }

    updateTimer(seconds) {
        if (!this.timerText) return;
        this.timerText.setText(`⏱️ ${seconds}s`);
        if (seconds <= 3 && seconds > 0) {
            this.timerText.setColor('#e63946');
        } else {
            this.timerText.setColor('#3a3a4a');
        }
    }
}
