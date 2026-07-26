import Phaser from 'phaser';
import SceneManager from '../managers/SceneManager.js';
import AudioManager from '../managers/AudioManager.js';
import ProgressManager from '../managers/ProgressManager.js';
import GameManager from '../managers/GameManager.js';
import Button from '../ui/Button.js';
import LevelData from '../data/LevelData.js';

export default class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super('LevelSelectScene');
    }

    create() {
        SceneManager.transitionIn(this);
        AudioManager.init(this);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const centerX = width / 2;

        this.currentPage = 1;
        this.levelsPerPage = 20;
        this.totalPages = Math.ceil(LevelData.length / this.levelsPerPage);

        // Background
        this.add.tileSprite(0, 0, width, height, 'bg_grid').setOrigin(0).setDepth(-10);

        // Header Bar
        const topY = 90;

        // Back Button
        new Button(this, 90, topY, '', () => {
            SceneManager.transitionTo(this, 'MenuScene');
        }, { width: 90, height: 90, icon: 'icon_back', bgColor: 0xffffff });

        // Title
        this.add.text(centerX, topY, 'SELECT LEVEL', {
            fontFamily: 'Fredoka',
            fontSize: '48px',
            color: '#3a3a4a',
            fontStyle: '700'
        }).setOrigin(0.5);

        // Stars Pill
        const starsContainer = this.add.container(width - 120, topY);
        const bgStars = this.add.graphics();
        bgStars.fillStyle(0xffffff, 1);
        bgStars.fillRoundedRect(-80, -32, 160, 64, 32);
        bgStars.lineStyle(2, 0xe0e0e8, 1);
        bgStars.strokeRoundedRect(-80, -32, 160, 64, 32);

        const starIcon = this.add.image(-45, 0, 'icon_star');
        starIcon.setDisplaySize(32, 32);

        const totalStars = ProgressManager.getTotalStars();
        const maxStars = 150;
        const starsText = this.add.text(15, 0, `${totalStars} / ${maxStars}`, {
            fontFamily: 'Fredoka',
            fontSize: '26px',
            color: '#3a3a4a',
            fontStyle: '700'
        }).setOrigin(0.5);

        starsContainer.add([bgStars, starIcon, starsText]);

        // Container for level cards
        this.gridContainer = this.add.container(0, 0);

        // Create Page Tab Bar
        this.createPageNavigation(centerX, height - 120);

        // Render current page
        this.renderPage(this.currentPage);
    }

    createPageNavigation(centerX, yPos) {
        const pageBarContainer = this.add.container(centerX, yPos);

        // Prev Button
        this.prevBtn = new Button(this, centerX - 360, yPos, '<', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderPage(this.currentPage);
            }
        }, { width: 90, height: 75, fontSize: '32px', bgColor: 0xffffff, textColor: '#3a3a4a' });

        // Page Indicator Chips
        this.pageChipTexts = [];
        const chipWidth = 110;
        const gap = 16;
        const totalW = this.totalPages * chipWidth + (this.totalPages - 1) * gap;
        const startX = centerX - totalW / 2 + chipWidth / 2;

        this.pageChips = [];
        for (let p = 1; p <= this.totalPages; p++) {
            const px = startX + (p - 1) * (chipWidth + gap);
            const startNum = (p - 1) * this.levelsPerPage + 1;
            const endNum = Math.min(p * this.levelsPerPage, LevelData.length);
            const label = `${startNum}-${endNum}`;

            const chipBtn = new Button(this, px, yPos, label, () => {
                this.currentPage = p;
                this.renderPage(this.currentPage);
            }, { width: chipWidth, height: 75, fontSize: '18px', bgColor: p === 1 ? 0x6085e0 : 0xffffff });

            this.pageChips.push(chipBtn);
        }

        // Next Button
        this.nextBtn = new Button(this, centerX + 360, yPos, '>', () => {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.renderPage(this.currentPage);
            }
        }, { width: 90, height: 75, fontSize: '32px', bgColor: 0xffffff, textColor: '#3a3a4a' });
    }

    renderPage(page) {
        this.gridContainer.removeAll(true);

        // Update page tab chip colors
        this.pageChips.forEach((chip, idx) => {
            const isCurrent = (idx + 1) === page;
            chip.setBgColor(isCurrent ? 0x6085e0 : 0xffffff);
            chip.setTextColor(isCurrent ? '#ffffff' : '#3a3a4a');
        });

        const width = this.cameras.main.width;
        const startIdx = (page - 1) * this.levelsPerPage;
        const endIdx = Math.min(startIdx + this.levelsPerPage, LevelData.length);

        const cols = 5;
        const cardSize = 145;
        const gapX = 28;
        const gapY = 24;

        const gridWidth = cols * cardSize + (cols - 1) * gapX;
        const startX = (width - gridWidth) / 2 + cardSize / 2;
        const startY = 220;

        for (let i = startIdx; i < endIdx; i++) {
            const relIdx = i - startIdx;
            const levelNum = i + 1;
            const col = relIdx % cols;
            const row = Math.floor(relIdx / cols);

            const x = startX + col * (cardSize + gapX);
            const y = startY + row * (cardSize + gapY);

            this.createLevelCard(x, y, cardSize, levelNum);
        }
    }

    createLevelCard(x, y, size, levelNum) {
        const isUnlocked = ProgressManager.isLevelUnlocked(levelNum);
        const isCompleted = ProgressManager.isLevelCompleted(levelNum);
        const stars = ProgressManager.getStarsForLevel(levelNum);

        const container = this.add.container(x, y);

        // Card Shadow
        const shadow = this.add.graphics();
        shadow.fillStyle(0xd0d0d8, 0.4);
        shadow.fillRoundedRect(-size / 2, -size / 2 + 6, size, size, 24);

        // Main Card BG
        const bg = this.add.graphics();
        if (isCompleted) {
            bg.fillStyle(0x6085e0, 1);
            bg.fillRoundedRect(-size / 2, -size / 2, size, size, 24);
            bg.lineStyle(2, 0xffffff, 0.8);
            bg.strokeRoundedRect(-size / 2, -size / 2, size, size, 24);
        } else if (isUnlocked) {
            bg.fillStyle(0xffffff, 1);
            bg.fillRoundedRect(-size / 2, -size / 2, size, size, 24);
            bg.lineStyle(3, 0x6085e0, 1);
            bg.strokeRoundedRect(-size / 2, -size / 2, size, size, 24);
        } else {
            bg.fillStyle(0x3a3a4a, 0.1);
            bg.fillRoundedRect(-size / 2, -size / 2, size, size, 24);
            bg.lineStyle(2, 0xd0d0d8, 1);
            bg.strokeRoundedRect(-size / 2, -size / 2, size, size, 24);
        }

        // Level Number Label
        const numText = this.add.text(0, isCompleted ? -18 : (isUnlocked ? -10 : -4), `${levelNum}`, {
            fontFamily: 'Fredoka',
            fontSize: '44px',
            color: isCompleted ? '#ffffff' : (isUnlocked ? '#3a3a4a' : '#a0a0b0'),
            fontStyle: '700'
        }).setOrigin(0.5);

        container.add([shadow, bg, numText]);

        if (isCompleted || isUnlocked) {
            // Draw Stars indicator
            const starY = 32;
            for (let s = 0; s < 3; s++) {
                const starX = -28 + s * 28;
                const starKey = s < stars ? 'icon_star' : 'icon_star_outline';
                const starImg = this.add.image(starX, starY, starKey);
                starImg.setDisplaySize(22, 22);
                container.add(starImg);
            }
        } else {
            const lockText = this.add.text(0, 30, 'LOCKED', {
                fontFamily: 'Fredoka',
                fontSize: '16px',
                color: '#a0a0b0',
                fontStyle: '700',
                letterSpacing: 1
            }).setOrigin(0.5);
            container.add(lockText);
        }

        container.setSize(size, size);

        if (isUnlocked) {
            container.setInteractive({ useHandCursor: true });

            container.on('pointerdown', () => {
                this.tweens.add({
                    targets: container,
                    scale: 0.92,
                    duration: 100,
                    yoyo: true,
                    onComplete: () => {
                        AudioManager.playSFX('bounce', 0.4);
                        GameManager.setCurrentLevel(levelNum);
                        ProgressManager.recordPlaySession(levelNum);
                        SceneManager.transitionTo(this, 'GameScene', { levelId: levelNum });
                    }
                });
            });

            container.on('pointerover', () => {
                this.tweens.add({ targets: container, scale: 1.05, duration: 150, ease: 'Quad.out' });
            });

            container.on('pointerout', () => {
                this.tweens.add({ targets: container, scale: 1.0, duration: 150, ease: 'Quad.out' });
            });
        }

        this.gridContainer.add(container);
    }
}
