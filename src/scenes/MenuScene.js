import Phaser from 'phaser';
import Button from '../ui/Button.js';
import AudioManager from '../managers/AudioManager.js';
import SceneManager from '../managers/SceneManager.js';
import CreditManager from '../managers/CreditManager.js';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        SceneManager.transitionIn(this);
        AudioManager.init(this);
        
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const centerX = width / 2;
        const centerY = height / 2;

        // Background Grid
        this.add.tileSprite(0, 0, width, height, 'bg_grid').setOrigin(0).setDepth(-10);
        this.createBackgroundParticles();

        // Top Information Bar (Credits & Stars)
        this.createTopHUD();

        // Main Title
        const title = this.add.text(centerX, centerY - 350, 'PUZZLE\nJOURNEY', {
            fontFamily: 'Fredoka',
            fontSize: '140px',
            color: '#3a3a4a',
            align: 'center',
            fontStyle: '700',
            lineSpacing: 10
        }).setOrigin(0.5);
        title.setShadow(0, 15, 'rgba(0,0,0,0.06)', 0);

        // Gentle floating animation
        this.tweens.add({
            targets: title,
            y: title.y - 25,
            duration: 3500,
            ease: 'Sine.inOut',
            yoyo: true,
            repeat: -1
        });

        // Core interactive UI
        new Button(this, centerX, centerY + 100, 'PLAY', () => {
            SceneManager.transitionTo(this, 'GameScene');
        }, { width: 420, height: 110, icon: 'icon_play', bgColor: 0x6085e0, fontSize: '40px' });

        // Bottom Settings Button
        new Button(this, 120, height - 100, '', () => {
            console.log('Settings opened');
        }, { width: 100, height: 100, icon: 'icon_settings', bgColor: 0xe0e0e8 });

        // Version Label
        this.add.text(width - 40, height - 40, 'v0.2.0-beta', {
            fontFamily: 'Fredoka',
            fontSize: '28px',
            color: '#b0b0b8',
            fontStyle: '600'
        }).setOrigin(1, 1);
    }

    createTopHUD() {
        const yPos = 80;
        const paddingX = 40;
        
        // Credits Pill
        const creditsContainer = this.add.container(paddingX + 80, yPos);
        const bgCredits = this.add.graphics();
        bgCredits.fillStyle(0xffffff, 1);
        bgCredits.fillRoundedRect(-100, -35, 200, 70, 35);
        bgCredits.lineStyle(2, 0xe0e0e8, 1);
        bgCredits.strokeRoundedRect(-100, -35, 200, 70, 35);
        
        const coinIcon = this.add.image(-60, 0, 'icon_coin').setScale(0.5);
        const creditsText = this.add.text(20, 0, `${CreditManager.getCredits()}`, {
            fontFamily: 'Fredoka',
            fontSize: '32px',
            color: '#3a3a4a',
            fontStyle: '700'
        }).setOrigin(0.5);
        
        creditsContainer.add([bgCredits, coinIcon, creditsText]);

        // Stars Pill
        const starsContainer = this.add.container(this.cameras.main.width - paddingX - 80, yPos);
        const bgStars = this.add.graphics();
        bgStars.fillStyle(0xffffff, 1);
        bgStars.fillRoundedRect(-100, -35, 200, 70, 35);
        bgStars.lineStyle(2, 0xe0e0e8, 1);
        bgStars.strokeRoundedRect(-100, -35, 200, 70, 35);
        
        const starIcon = this.add.image(-60, 0, 'icon_star').setScale(0.45);
        const starsText = this.add.text(20, 0, `0 / 30`, {
            fontFamily: 'Fredoka',
            fontSize: '32px',
            color: '#3a3a4a',
            fontStyle: '700'
        }).setOrigin(0.5);
        
        starsContainer.add([bgStars, starIcon, starsText]);
    }

    createBackgroundParticles() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0x6085e0, 1);
        graphics.fillCircle(15, 15, 15);
        graphics.generateTexture('particle_bubble', 30, 30);
        graphics.destroy();

        const particles = this.add.particles(0, 0, 'particle_bubble', {
            x: { min: 0, max: this.cameras.main.width },
            y: this.cameras.main.height + 100,
            lifespan: 12000,
            speedY: { min: -20, max: -60 },
            speedX: { min: -15, max: 15 },
            scale: { start: 0.2, end: 1.0 },
            alpha: { start: 0.05, end: 0 },
            frequency: 600,
            blendMode: 'NORMAL'
        });
        particles.setDepth(-1); 
    }
}
