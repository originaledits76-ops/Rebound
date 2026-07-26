import Phaser from 'phaser';
import Button from '../ui/Button.js';
import AudioManager from '../managers/AudioManager.js';
import SceneManager from '../managers/SceneManager.js';
import CreditManager from '../managers/CreditManager.js';
import ProgressManager from '../managers/ProgressManager.js';

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

        // Main Title and Tagline Container
        const titleContainer = this.add.container(centerX, centerY - 320);

        const titleText = this.add.text(0, -35, 'REBOUND', {
            fontFamily: 'Fredoka',
            fontSize: '110px',
            color: '#3a3a4a',
            align: 'center',
            fontStyle: '700',
            letterSpacing: 4
        }).setOrigin(0.5);
        titleText.setShadow(0, 15, 'rgba(0,0,0,0.06)', 0);

        const taglineText = this.add.text(0, 45, 'THE ART OF RICOCHET', {
            fontFamily: 'Fredoka',
            fontSize: '32px',
            color: '#6085e0',
            align: 'center',
            fontStyle: '700'
        }).setOrigin(0.5);
        taglineText.setShadow(0, 5, 'rgba(0,0,0,0.04)', 0);

        // Force tagline to be parallel and exactly equal in width to the game name
        taglineText.setDisplaySize(titleText.displayWidth, taglineText.displayHeight);

        titleContainer.add([titleText, taglineText]);

        // Gentle floating animation for title container
        this.tweens.add({
            targets: titleContainer,
            y: titleContainer.y - 20,
            duration: 3500,
            ease: 'Sine.inOut',
            yoyo: true,
            repeat: -1
        });

        // Core interactive UI
        new Button(this, centerX, centerY + 30, 'PLAY', () => {
            SceneManager.transitionTo(this, 'GameScene');
        }, { width: 420, height: 100, icon: 'icon_play', bgColor: 0x6085e0, fontSize: '40px' });

        // Level Select Button
        new Button(this, centerX, centerY + 150, 'SELECT LEVEL', () => {
            SceneManager.transitionTo(this, 'LevelSelectScene');
        }, { width: 420, height: 90, icon: 'icon_settings', bgColor: 0xffffff, fontSize: '32px' });


        // Version Label
        this.add.text(width - 40, height - 40, 'v0.2.1-beta', {
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
        const starsContainer = this.add.container(this.cameras.main.width - paddingX - 100, yPos);
        const bgStars = this.add.graphics();
        bgStars.fillStyle(0xffffff, 1);
        bgStars.fillRoundedRect(-110, -35, 220, 70, 35);
        bgStars.lineStyle(2, 0xe0e0e8, 1);
        bgStars.strokeRoundedRect(-110, -35, 220, 70, 35);
        
        const starIcon = this.add.image(-70, 0, 'icon_star').setScale(0.45);
        const starsText = this.add.text(15, 0, `${ProgressManager.getTotalStars()} / 150`, {
            fontFamily: 'Fredoka',
            fontSize: '26px',
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
