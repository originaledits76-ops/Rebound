import Phaser from 'phaser';
import AudioManager from '../managers/AudioManager.js';

export default class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, text, onClick, options = {}) {
        super(scene, x, y);
        this.scene = scene;
        this.onClick = onClick;

        const {
            width = 380,
            height = 100,
            radius = 16,
            bgColor = 0x6085e0,
            textColor = '#ffffff',
            fontSize = '36px',
            icon = null
        } = options;

        this.baseY = 0;
        this.btnWidth = width;
        this.btnHeight = height;

        // Soft drop shadow
        this.shadow = scene.add.graphics();
        this.shadow.fillStyle(0xa0a0b0, 0.4);
        this.shadow.fillRoundedRect(-width/2, -height/2 + 10, width, height, radius);

        // Main background pill
        this.bg = scene.add.graphics();
        this.bg.fillStyle(bgColor, 1);
        this.bg.fillRoundedRect(-width/2, -height/2, width, height, radius);

        // Inner highlight for 3D feel (top edge)
        this.highlight = scene.add.graphics();
        this.highlight.lineStyle(3, 0xffffff, 0.25);
        this.highlight.beginPath();
        this.highlight.moveTo(-width/2 + radius, -height/2 + 2);
        this.highlight.lineTo(width/2 - radius, -height/2 + 2);
        this.highlight.strokePath();

        const elements = [this.shadow, this.bg, this.highlight];
        this.animatableContent = [];

        if (icon && !text) {
            this.iconImg = scene.add.image(0, 0, icon).setScale(0.8);
            elements.push(this.iconImg);
            this.animatableContent.push(this.iconImg);
        } else if (icon && text) {
            this.iconImg = scene.add.image(-width/2 + 60, 0, icon).setScale(0.7);
            this.label = scene.add.text(20, 0, text, {
                fontFamily: 'Fredoka',
                fontSize: fontSize,
                color: textColor,
                fontStyle: '600',
                letterSpacing: 1
            }).setOrigin(0.5);
            elements.push(this.iconImg, this.label);
            this.animatableContent.push(this.iconImg, this.label);
        } else {
            this.label = scene.add.text(0, 0, text, {
                fontFamily: 'Fredoka',
                fontSize: fontSize,
                color: textColor,
                fontStyle: '600',
                letterSpacing: 1
            }).setOrigin(0.5);
            elements.push(this.label);
            this.animatableContent.push(this.label);
        }

        this.add(elements);
        this.setSize(width, height);
        
        // Interaction setup
        this.setInteractive({ useHandCursor: true });
        this.on('pointerdown', this.handleDown, this);
        this.on('pointerup', this.handleUp, this);
        this.on('pointerover', this.handleOver, this);
        this.on('pointerout', this.handleOut, this);

        // Entrance animation
        this.setScale(0);
        scene.tweens.add({
            targets: this,
            scale: 1,
            duration: 500,
            ease: 'Back.out',
            easeParams: [1.5]
        });

        this.scene.add.existing(this);
    }

    handleDown() {
        this.bg.y = 5;
        this.highlight.y = 5;
        this.animatableContent.forEach(c => c.y = 5);
        this.shadow.alpha = 0.2;
        
        this.scene.tweens.add({
            targets: this,
            scaleX: 0.96,
            scaleY: 0.96,
            duration: 100,
            ease: 'Cubic.easeOut'
        });
        
        AudioManager.playSFX('button_click');
    }

    handleUp() {
        this.bg.y = 0;
        this.highlight.y = 0;
        this.animatableContent.forEach(c => c.y = 0);
        this.shadow.alpha = 0.4;
        
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.02,
            scaleY: 1.02,
            duration: 150,
            ease: 'Back.out',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 150,
                    ease: 'Sine.inOut'
                });
            }
        });
        if (this.onClick) this.onClick();
    }

    handleOver() {
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.02,
            scaleY: 1.02,
            duration: 200,
            ease: 'Cubic.easeOut'
        });
    }

    handleOut() {
        this.bg.y = 0;
        this.highlight.y = 0;
        this.animatableContent.forEach(c => c.y = 0);
        this.shadow.alpha = 0.4;
        this.scene.tweens.add({
            targets: this,
            scaleX: 1,
            scaleY: 1,
            duration: 200,
            ease: 'Cubic.easeOut'
        });
    }
}
