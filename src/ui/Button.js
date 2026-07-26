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
            bgColor = 0xffffff,
            textColor = '#111111',
            fontSize = '36px',
            icon = null
        } = options;

        const iconMap = {
            'icon_play': 'icon_play',
            'play': 'icon_play',
            'play_arrow': 'icon_play',
            'icon_retry': 'icon_restart',
            'retry': 'icon_restart',
            'refresh': 'icon_restart',
            'icon_restart': 'icon_restart',
            'restart': 'icon_restart',
            'icon_menu': 'icon_home',
            'menu': 'icon_home',
            'icon_home': 'icon_home',
            'home': 'icon_home',
            'icon_pause': 'icon_pause',
            'pause': 'icon_pause',
            'icon_settings': 'icon_settings',
            'settings': 'icon_settings',
            'icon_fastforward': 'icon_skip',
            'fastforward': 'icon_skip',
            'skip_next': 'icon_skip',
            'icon_skip': 'icon_skip',
            'skip': 'icon_skip',
            'icon_back': 'icon_back',
            'back': 'icon_back',
            'arrow_back': 'icon_back',
            'icon_edit': 'icon_edit',
            'edit': 'icon_edit',
            'icon_editor': 'icon_edit',
            'icon_save': 'icon_save',
            'save': 'icon_save',
            'icon_undo': 'icon_undo',
            'undo': 'icon_undo',
            'icon_redo': 'icon_redo',
            'redo': 'icon_redo',
            'icon_delete': 'icon_delete',
            'delete': 'icon_delete',
            'icon_duplicate': 'icon_duplicate',
            'duplicate': 'icon_duplicate',
            'icon_eraser': 'icon_eraser',
            'eraser': 'icon_eraser',
            'icon_star': 'icon_star',
            'icon_coin': 'icon_coin'
        };

        this.btnWidth = width;
        this.btnHeight = height;
        this.radius = radius;
        this.bgColor = bgColor;
        this.textColor = textColor;

        // Soft drop shadow
        this.shadow = scene.add.graphics();
        this.shadow.fillStyle(0xd0d0d8, 0.5);
        this.shadow.fillRoundedRect(-width/2, -height/2 + 8, width, height, radius);

        // Main background pill
        this.bg = scene.add.graphics();
        this.bg.fillStyle(bgColor, 1);
        this.bg.fillRoundedRect(-width/2, -height/2, width, height, radius);
        this.bg.lineStyle(2, 0xe0e0e8, 1);
        this.bg.strokeRoundedRect(-width/2, -height/2, width, height, radius);

        // Inner highlight for 3D depth
        this.highlight = scene.add.graphics();
        this.highlight.lineStyle(2, 0xffffff, 0.8);
        this.highlight.beginPath();
        this.highlight.moveTo(-width/2 + radius, -height/2 + 2);
        this.highlight.lineTo(width/2 - radius, -height/2 + 2);
        this.highlight.strokePath();

        const elements = [this.shadow, this.bg, this.highlight];
        this.animatableContent = [];

        const targetIconKey = icon ? (iconMap[icon] || icon) : null;

        if (targetIconKey && !text) {
            // Icon-only button: icon occupies ~55-60% of button height
            const iconSize = Math.round(height * 0.58);
            this.iconImg = scene.add.image(0, 0, targetIconKey);
            this.iconImg.setDisplaySize(iconSize, iconSize);
            elements.push(this.iconImg);
            this.animatableContent.push(this.iconImg);
        } else if (targetIconKey && text) {
            // Icon + Text button: dynamically calculate center positioning to avoid overlap
            const iconSize = Math.round(height * 0.46);
            this.iconImg = scene.add.image(0, 0, targetIconKey);
            this.iconImg.setDisplaySize(iconSize, iconSize);

            this.label = scene.add.text(0, 0, text, {
                fontFamily: 'Fredoka',
                fontSize: fontSize,
                color: textColor,
                fontStyle: '700',
                letterSpacing: 1
            }).setOrigin(0, 0.5);

            // Compute total combined width and center side-by-side
            const labelWidth = this.label.width;
            const spacing = 14;
            const totalWidth = iconSize + spacing + labelWidth;
            const startX = -totalWidth / 2;

            this.iconImg.setPosition(startX + iconSize / 2, 0);
            this.label.setPosition(startX + iconSize + spacing, 0);

            elements.push(this.iconImg, this.label);
            this.animatableContent.push(this.iconImg, this.label);
        } else if (text) {
            this.label = scene.add.text(0, 0, text, {
                fontFamily: 'Fredoka',
                fontSize: fontSize,
                color: textColor,
                fontStyle: '700',
                letterSpacing: 1
            }).setOrigin(0.5, 0.5);
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
            duration: 400,
            ease: 'Back.out',
            easeParams: [1.4]
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

    setBgColor(color) {
        this.bgColor = color;
        this.bg.clear();
        this.bg.fillStyle(color, 1);
        this.bg.fillRoundedRect(-this.btnWidth/2, -this.btnHeight/2, this.btnWidth, this.btnHeight, this.radius);
        this.bg.lineStyle(2, 0xe0e0e8, 1);
        this.bg.strokeRoundedRect(-this.btnWidth/2, -this.btnHeight/2, this.btnWidth, this.btnHeight, this.radius);
    }

    setTextColor(color) {
        this.textColor = color;
        if (this.label) {
            this.label.setColor(color);
        }
    }

    setLabel(text) {
        if (this.label) {
            this.label.setText(text);
            if (this.iconImg) {
                const iconSize = Math.round(this.btnHeight * 0.46);
                const labelWidth = this.label.width;
                const spacing = 14;
                const totalWidth = iconSize + spacing + labelWidth;
                const startX = -totalWidth / 2;

                this.iconImg.setPosition(startX + iconSize / 2, 0);
                this.label.setPosition(startX + iconSize + spacing, 0);
            }
        }
    }

    setText(text) {
        this.setLabel(text);
    }
}
