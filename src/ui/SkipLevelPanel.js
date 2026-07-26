import Phaser from 'phaser';
import Button from './Button.js';
import SceneManager from '../managers/SceneManager.js';
import GameManager from '../managers/GameManager.js';

export default class SkipLevelPanel extends Phaser.GameObjects.Container {
    constructor(scene, onClose) {
        const width = scene.cameras.main.width;
        const height = scene.cameras.main.height;
        super(scene, width / 2, height / 2);
        
        scene.add.existing(this);
        this.setDepth(350);
        
        // Dim background overlay
        this.overlay = scene.add.rectangle(0, 0, width * 2, height * 2, 0x1a1a2e, 0.7);
        this.add(this.overlay);

        // Panel dimensions
        const panelWidth = 560;
        const panelHeight = 520;
        const radius = 30;

        const shadow = scene.add.graphics();
        shadow.fillStyle(0x0a0a1a, 0.4);
        shadow.fillRoundedRect(-panelWidth/2, -panelHeight/2 + 15, panelWidth, panelHeight, radius);

        const bg = scene.add.graphics();
        bg.fillStyle(0xffffff, 1);
        bg.fillRoundedRect(-panelWidth/2, -panelHeight/2, panelWidth, panelHeight, radius);

        const stroke = scene.add.graphics();
        stroke.lineStyle(2, 0xe0e0e8, 1);
        stroke.strokeRoundedRect(-panelWidth/2, -panelHeight/2, panelWidth, panelHeight, radius);

        this.add([shadow, bg, stroke]);

        // Title
        const title = scene.add.text(0, -180, 'NEED A BOOST?', {
            fontFamily: 'Fredoka',
            fontSize: '48px',
            color: '#3a3a4a',
            fontStyle: '700'
        }).setOrigin(0.5);

        // Warning/hint text
        const warning = scene.add.text(0, -90, 'Stuck? You can also skip this level from the Pause menu later.', {
            fontFamily: 'Fredoka',
            fontSize: '26px',
            color: '#606070',
            align: 'center',
            fontStyle: '600',
            wordWrap: { width: 460, useAdvancedWrap: true }
        }).setOrigin(0.5);

        this.add([title, warning]);

        // Buttons
        const btnWidth = 420;

        const btnWatchAd = new Button(scene, 0, 30, 'WATCH AD TO SKIP', () => {
            this.playRewardedAd(scene);
        }, { width: btnWidth, height: 85, bgColor: 0x70b880, fontSize: '28px', icon: 'icon_fastforward' });

        const btnClose = new Button(scene, 0, 140, 'CLOSE', () => {
            this.close(onClose);
        }, { width: btnWidth, height: 75, bgColor: 0x9090a0, fontSize: '26px' });

        this.add([btnWatchAd, btnClose]);

        // Animate in
        this.setScale(0.8);
        this.setAlpha(0);
        scene.tweens.add({
            targets: this,
            scale: 1,
            alpha: 1,
            duration: 350,
            ease: 'Back.out',
            easeParams: [1.2]
        });
    }

    playRewardedAd(scene) {
        // Create full screen ad simulation overlay
        const width = scene.cameras.main.width;
        const height = scene.cameras.main.height;

        const adBg = scene.add.rectangle(0, 0, width * 2, height * 2, 0x000000, 0.92);
        const adTitle = scene.add.text(0, -60, 'REWARDED AD PLAYING...', {
            fontFamily: 'Fredoka',
            fontSize: '36px',
            color: '#ffffff',
            fontStyle: '700'
        }).setOrigin(0.5);

        const adTimerText = scene.add.text(0, 20, 'Reward in 2s', {
            fontFamily: 'Fredoka',
            fontSize: '30px',
            color: '#ffd700',
            fontStyle: '600'
        }).setOrigin(0.5);

        const adContainer = scene.add.container(0, 0, [adBg, adTitle, adTimerText]);
        this.add(adContainer);

        let countdown = 2;
        const interval = scene.time.addEvent({
            delay: 1000,
            repeat: 1,
            callback: () => {
                countdown--;
                if (countdown > 0) {
                    adTimerText.setText(`Reward in ${countdown}s`);
                } else {
                    adTimerText.setText('SKIPPING LEVEL...');
                    scene.time.delayedCall(500, () => {
                        GameManager.completeLevel(1);
                        SceneManager.transitionTo(scene, 'GameScene', { levelId: GameManager.currentLevel });
                    });
                }
            }
        });
    }

    close(callback) {
        this.scene.tweens.add({
            targets: this,
            scale: 0.8,
            alpha: 0,
            duration: 200,
            ease: 'Back.in',
            onComplete: () => {
                if (callback) callback();
                this.destroy();
            }
        });
    }
}
