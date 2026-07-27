import Phaser from 'phaser';
import Button from './Button.js';
import SceneManager from '../managers/SceneManager.js';
import GameManager from '../managers/GameManager.js';
import { gameplayStart, gameplayStop, playRewardedAd, trackGameActionForAds } from '../managers/CrazyGamesManager.js';

export default class PauseMenuPanel extends Phaser.GameObjects.Container {
    constructor(scene) {
        const width = scene.cameras.main.width;
        const height = scene.cameras.main.height;
        super(scene, width / 2, height / 2);
        
        scene.add.existing(this);
        this.setDepth(300);

        gameplayStop();
        
        // Blur/dim background
        this.overlay = scene.add.rectangle(0, 0, width * 2, height * 2, 0xfafafc, 0.85);
        this.add(this.overlay);

        // Panel Background
        const panelWidth = 560;
        const panelHeight = 760;
        const radius = 30;
        
        const shadow = scene.add.graphics();
        shadow.fillStyle(0xd0d0d8, 0.6);
        shadow.fillRoundedRect(-panelWidth/2, -panelHeight/2 + 20, panelWidth, panelHeight, radius);
        
        const bg = scene.add.graphics();
        bg.fillStyle(0xffffff, 1);
        bg.fillRoundedRect(-panelWidth/2, -panelHeight/2, panelWidth, panelHeight, radius);
        
        const stroke = scene.add.graphics();
        stroke.lineStyle(2, 0xf0f0f5, 1);
        stroke.strokeRoundedRect(-panelWidth/2, -panelHeight/2, panelWidth, panelHeight, radius);
        
        this.add([shadow, bg, stroke]);

        // Title
        const title = scene.add.text(0, -260, 'PAUSED', {
            fontFamily: 'Fredoka',
            fontSize: '56px',
            color: '#3a3a4a',
            fontStyle: '700'
        }).setOrigin(0.5);
        this.add(title);
        
        // Buttons
        const btnWidth = 420;
        
        const btnResume = new Button(scene, 0, -130, 'RESUME', () => {
            gameplayStart();
            this.close();
        }, { width: btnWidth, bgColor: 0x6085e0, icon: 'icon_play' });
        
        const btnRestart = new Button(scene, 0, -10, 'RESTART', () => {
            trackGameActionForAds(() => {
                this.close(() => {
                    const attempts = scene.registry.get('level_attempts_' + scene.levelId) || 0;
                    scene.registry.set('level_attempts_' + scene.levelId, attempts + 1);
                    SceneManager.transitionTo(scene, 'GameScene', { levelId: scene.overrideLevelId });
                });
            });
        }, { width: btnWidth, bgColor: 0x9090a0, icon: 'icon_retry' });
        
        const btnSkip = new Button(scene, 0, 110, 'SKIP LEVEL', () => {
            playRewardedAd(
                () => {
                    GameManager.completeLevel(1);
                    this.close(() => {
                        SceneManager.transitionTo(scene, 'GameScene', { levelId: scene.overrideLevelId ? null : GameManager.currentLevel });
                    });
                },
                (err) => {
                    console.warn("Rewarded ad failed or was dismissed:", err);
                }
            );
        }, { width: btnWidth, bgColor: 0xe0b060, icon: 'icon_fastforward' });

        const btnHome = new Button(scene, 0, 230, 'HOME', () => {
            trackGameActionForAds(() => {
                this.close(() => {
                    SceneManager.transitionTo(scene, 'MenuScene');
                });
            });
        }, { width: btnWidth, bgColor: 0x9090a0, icon: 'icon_home' });

        this.add([btnResume, btnRestart, btnSkip, btnHome]);
        
        // Pause game logic
        scene.matter.world.pause();
        if (scene.activeTimer) scene.activeTimer.paused = true;
        
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
    
    close(callback) {
        this.scene.matter.world.resume();
        if (this.scene.activeTimer) this.scene.activeTimer.paused = false;
        
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
