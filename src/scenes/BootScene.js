import Phaser from 'phaser';
import AssetLoader from '../utils/AssetLoader.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const centerX = width / 2;
        const centerY = height / 2;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();

        // Generate BG Pattern (blueprint grid)
        const bgGrid = this.make.graphics({ x: 0, y: 0, add: false });
        bgGrid.lineStyle(1, 0x6085e0, 0.05); // Very low opacity blue for blueprint feel
        bgGrid.strokeRect(0, 0, 40, 40);
        
        // Add subtle intersection cross
        bgGrid.lineStyle(1, 0x6085e0, 0.1);
        bgGrid.moveTo(18, 20);
        bgGrid.lineTo(22, 20);
        bgGrid.moveTo(20, 18);
        bgGrid.lineTo(20, 22);
        
        bgGrid.generateTexture('bg_grid', 40, 40);
        bgGrid.destroy();

        // Generate Deco Pattern (diagonal lines for level badge)
        const deco = this.make.graphics({ x: 0, y: 0, add: false });
        deco.lineStyle(2, 0x6085e0, 0.08); // Subtle blue
        for (let i = -100; i < 300; i += 12) {
            deco.moveTo(i, 0);
            deco.lineTo(i + 100, 100);
        }
        deco.generateTexture('deco_lines', 200, 100);
        deco.destroy();
        
        const barWidth = 600;
        const barHeight = 40;
        const x = centerX - (barWidth / 2);
        const y = centerY;

        progressBox.fillStyle(0xe0e0e8, 1);
        progressBox.fillRoundedRect(x, y, barWidth, barHeight, barHeight/2);

        const loadingText = this.add.text(centerX, y - 60, 'LOADING...', {
            fontFamily: 'Fredoka',
            fontSize: '36px',
            color: '#888899',
            fontStyle: '600',
            letterSpacing: 2
        }).setOrigin(0.5);

        // Load SVG Icon pack
        const svgConfig = { svgWidth: 128, svgHeight: 128 };
        this.load.svg('icon_back', '/icons/back.svg', svgConfig);
        this.load.svg('icon_delete', '/icons/delete.svg', svgConfig);
        this.load.svg('icon_duplicate', '/icons/duplicate.svg', svgConfig);
        this.load.svg('icon_edit', '/icons/edit.svg', svgConfig);
        this.load.svg('icon_editor', '/icons/edit.svg', svgConfig);
        this.load.svg('icon_eraser', '/icons/eraser.svg', svgConfig);
        this.load.svg('icon_home', '/icons/home.svg', svgConfig);
        this.load.svg('icon_pause', '/icons/pause.svg', svgConfig);
        this.load.svg('icon_play', '/icons/play.svg', svgConfig);
        this.load.svg('icon_redo', '/icons/redo.svg', svgConfig);
        this.load.svg('icon_restart', '/icons/restart.svg', svgConfig);
        this.load.svg('icon_retry', '/icons/restart.svg', svgConfig);
        this.load.svg('icon_save', '/icons/save.svg', svgConfig);
        this.load.svg('icon_settings', '/icons/settings.svg', svgConfig);
        this.load.svg('icon_skip', '/icons/skip.svg', svgConfig);
        this.load.svg('icon_fastforward', '/icons/skip.svg', svgConfig);
        this.load.svg('icon_undo', '/icons/undo.svg', svgConfig);
        this.load.svg('icon_move', '/icons/edit.svg', svgConfig);
        this.load.svg('icon_close', '/icons/back.svg', svgConfig);
        this.load.svg('icon_list', '/icons/settings.svg', svgConfig);
        this.load.svg('icon_grid', '/icons/settings.svg', svgConfig);
        this.load.svg('icon_check', '/icons/play.svg', svgConfig);
        this.load.svg('icon_rotate', '/icons/restart.svg', svgConfig);
        this.load.svg('icon_resize', '/icons/edit.svg', svgConfig);
        this.load.svg('icon_add', '/icons/edit.svg', svgConfig);

        // Texture generation handles all assets procedurally
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRoundedRect(x + 8, y + 8, (barWidth - 16) * value, barHeight - 16, (barHeight - 16)/2);
        });
    }

    create() {
        // Wait a frame to ensure fonts are fully applied
        this.time.delayedCall(100, () => {
            this.generateAllTextures();
            this.scene.start('MenuScene');
        });
    }

    generateAllTextures() {
        // Fallback for any icon textures that failed to load
        this.generateFallbackIconTextures();

        // Star & Coin vector graphics
        this.generateStarGraphic('icon_star', 0xe0b060, true, 80);
        this.generateStarGraphic('icon_star_outline', 0xe0e0e8, false, 80);
        this.generateCoinGraphic('icon_coin', 0xe0b060, 60);

        // Generate background textures
        this.generateRect('bg_blue', 40, 40, 0x6085e0);
        this.generateRect('bg_brown', 40, 40, 0x8a6b4e);
        this.generateRect('bg_green', 40, 40, 0x4caf50);

        // Generate missing ball textures
        this.generateCircle('ball_blue_large', 30, 0xffffff);
        this.generateCircle('ball_blue_large_alt', 30, 0xffffff);
        this.generateCircle('ball_red_large', 30, 0xffffff);
        this.generateCircle('ball_red_large_alt', 30, 0xffffff);
        this.generateCircle('ball_blue_small', 15, 0xffffff);
        this.generateCircle('ball_blue_small_alt', 15, 0xffffff);
        this.generateCircle('ball_red_small', 15, 0xffffff);
        this.generateCircle('ball_red_small_alt', 15, 0xffffff);

        // Generate walls (radius = 0 for seamless merging without corner notches)
        this.generateRect('wall_seamless', 40, 40, 0x4a4a5a, 0);
        this.generateRect('wall_thick_large', 200, 40, 0x4a4a5a, 0);
        this.generateRect('wall_narrow_thin', 40, 200, 0x4a4a5a, 0);
        this.generateRect('wall_corner', 40, 40, 0x4a4a5a, 0);
        this.generateRect('wall_corner_large', 80, 80, 0x4a4a5a, 0);
        
        // Generate laser beam (red center with soft glow)
        this.generateLaserBeam('laser', 300, 16, 0xff0000, 8);

        // Generate Portals, Hole & Laser Shooter textures
        this.generatePortal('portal_entry', 0x00bcd4, 0x00e5ff, 64);
        this.generatePortal('portal_exit', 0xff9800, 0xff6d00, 64);
        this.generateHoleGraphic('hole_goal', 64);
        this.generateLaserShooter('laser_shooter', 48);
    }

    generateHoleGraphic(key, size = 64) {
        const g = this.make.graphics({ add: false });
        const radius = size / 2;

        // Outer Metallic Rim
        g.fillStyle(0x3a3a4a, 1);
        g.fillCircle(radius, radius, radius);
        g.lineStyle(3, 0xe0b060, 1);
        g.strokeCircle(radius, radius, radius - 1.5);

        // Dark Gradient Cup Shadow
        g.fillStyle(0x1a1a24, 1);
        g.fillCircle(radius, radius, radius * 0.82);

        // Deep Hole Center
        g.fillStyle(0x08080c, 1);
        g.fillCircle(radius, radius, radius * 0.65);

        // Center Flag Cup Pin Dot
        g.fillStyle(0xe0b060, 0.9);
        g.fillCircle(radius, radius, radius * 0.22);
        g.fillStyle(0xffffff, 0.9);
        g.fillCircle(radius, radius, radius * 0.1);

        g.generateTexture(key, size, size);
        g.destroy();
    }

    generatePortal(key, outerColor, innerColor, size = 64) {
        const g = this.make.graphics({ add: false });
        const radius = size / 2;
        // Outer glowing aura
        g.fillStyle(outerColor, 0.35);
        g.fillCircle(radius, radius, radius);
        // Middle ring
        g.fillStyle(innerColor, 0.75);
        g.fillCircle(radius, radius, radius * 0.75);
        // Inner core ring
        g.lineStyle(3, 0xffffff, 0.9);
        g.strokeCircle(radius, radius, radius * 0.5);
        // Center white swirl core
        g.fillStyle(0xffffff, 0.95);
        g.fillCircle(radius, radius, radius * 0.3);

        g.generateTexture(key, size, size);
        g.destroy();
    }

    generateLaserShooter(key, size = 48) {
        const g = this.make.graphics({ add: false });
        const half = size / 2;
        // Metallic base casing
        g.fillStyle(0x3a3a4a, 1);
        g.fillRoundedRect(4, 4, size - 8, size - 8, 10);
        g.lineStyle(2, 0x6085e0, 1);
        g.strokeRoundedRect(4, 4, size - 8, size - 8, 10);
        
        // Center red lens
        g.fillStyle(0xf44336, 1);
        g.fillCircle(half, half, 12);
        g.fillStyle(0xffffff, 0.8);
        g.fillCircle(half - 3, half - 3, 4);

        g.generateTexture(key, size, size);
        g.destroy();
    }
    
    generateLaserBeam(key, width, height, coreColor, radius = 0) {
        const g = this.make.graphics({ add: false });
        // Outer soft glow
        g.fillStyle(coreColor, 0.3);
        g.fillRoundedRect(0, 0, width, height, radius);
        // Inner bright core
        g.fillStyle(0xffffff, 0.9);
        g.fillRoundedRect(0, height * 0.25, width, height * 0.5, radius * 0.5);
        g.generateTexture(key, width, height);
        g.destroy();
    }

    generateCircle(key, radius, color) {
        const g = this.make.graphics({ add: false });
        g.fillStyle(color, 1);
        g.fillCircle(radius, radius, radius);
        g.generateTexture(key, radius * 2, radius * 2);
        g.destroy();
    }

    generateRect(key, width, height, color, radius = 0) {
        const g = this.make.graphics({ add: false });
        g.fillStyle(color, 1);
        if (radius > 0) {
            g.fillRoundedRect(0, 0, width, height, radius);
        } else {
            g.fillRect(0, 0, width, height);
        }
        g.generateTexture(key, width, height);
        g.destroy();
    }

    generateStarGraphic(key, color, isFilled, size = 80) {
        const g = this.make.graphics({ add: false });
        const cx = size / 2;
        const cy = size / 2;
        const outerR = size * 0.42;
        const innerR = size * 0.20;
        const points = 5;

        g.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const r = (i % 2 === 0) ? outerR : innerR;
            const angle = (i * Math.PI) / points - Math.PI / 2;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            if (i === 0) g.moveTo(x, y);
            else g.lineTo(x, y);
        }
        g.closePath();

        if (isFilled) {
            g.fillStyle(color, 1);
            g.fillPath();
        } else {
            g.lineStyle(4, color, 1);
            g.strokePath();
        }

        g.generateTexture(key, size, size);
        g.destroy();
    }

    generateCoinGraphic(key, color, size = 60) {
        const g = this.make.graphics({ add: false });
        const r = size / 2;
        g.fillStyle(color, 1);
        g.fillCircle(r, r, r - 2);
        g.lineStyle(3, 0xffffff, 0.8);
        g.strokeCircle(r, r, r - 8);
        g.fillStyle(0xffffff, 0.9);
        g.fillRect(r - 3, r - 12, 6, 24);
        g.fillRect(r - 10, r - 3, 20, 6);
        g.generateTexture(key, size, size);
        g.destroy();
    }

    generateFallbackIconTextures() {
        const iconKeys = [
            'icon_back', 'icon_delete', 'icon_duplicate', 'icon_edit', 'icon_editor',
            'icon_eraser', 'icon_home', 'icon_pause', 'icon_play', 'icon_redo',
            'icon_restart', 'icon_retry', 'icon_save', 'icon_settings', 'icon_skip',
            'icon_fastforward', 'icon_undo', 'icon_move', 'icon_close', 'icon_list',
            'icon_grid', 'icon_check', 'icon_rotate', 'icon_resize', 'icon_add'
        ];

        const size = 128;
        const center = size / 2;

        iconKeys.forEach(key => {
            if (this.textures.exists(key)) {
                const tex = this.textures.get(key);
                if (tex && tex.key !== '__MISSING' && tex.getSourceImage() && tex.getSourceImage().width > 0) {
                    return; // Texture exists and is valid
                }
            }

            const g = this.make.graphics({ add: false });
            g.fillStyle(0xffffff, 1);
            g.lineStyle(8, 0xffffff, 1);

            if (key.includes('play') || key.includes('check')) {
                g.beginPath();
                g.moveTo(42, 32);
                g.lineTo(96, 64);
                g.lineTo(42, 96);
                g.closePath();
                g.fillPath();
            } else if (key.includes('pause')) {
                g.fillRect(38, 34, 20, 60);
                g.fillRect(70, 34, 20, 60);
            } else if (key.includes('restart') || key.includes('retry') || key.includes('rotate')) {
                g.beginPath();
                g.arc(center, center, 32, 0.4, Math.PI * 1.7, false);
                g.strokePath();
                g.beginPath();
                g.moveTo(88, 20);
                g.lineTo(104, 38);
                g.lineTo(80, 48);
                g.closePath();
                g.fillPath();
            } else if (key.includes('home')) {
                g.beginPath();
                g.moveTo(center, 28);
                g.lineTo(100, 64);
                g.lineTo(84, 64);
                g.lineTo(84, 98);
                g.lineTo(44, 98);
                g.lineTo(44, 64);
                g.lineTo(28, 64);
                g.closePath();
                g.fillPath();
            } else if (key.includes('back') || key.includes('close')) {
                g.beginPath();
                g.moveTo(80, 32);
                g.lineTo(40, 64);
                g.lineTo(80, 96);
                g.strokePath();
                g.fillRect(40, 58, 52, 12);
            } else if (key.includes('skip') || key.includes('fastforward')) {
                g.beginPath();
                g.moveTo(32, 38);
                g.lineTo(68, 64);
                g.lineTo(32, 90);
                g.closePath();
                g.fillPath();
                g.beginPath();
                g.moveTo(68, 38);
                g.lineTo(104, 64);
                g.lineTo(68, 90);
                g.closePath();
                g.fillPath();
            } else if (key.includes('settings') || key.includes('list') || key.includes('grid')) {
                g.strokeCircle(center, center, 28);
                g.fillCircle(center, center, 12);
                for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
                    const x = center + Math.cos(a) * 36;
                    const y = center + Math.sin(a) * 36;
                    g.fillCircle(x, y, 8);
                }
            } else if (key.includes('undo')) {
                g.beginPath();
                g.arc(68, 72, 30, Math.PI, Math.PI * 1.8, false);
                g.strokePath();
                g.beginPath();
                g.moveTo(38, 42);
                g.lineTo(28, 72);
                g.lineTo(58, 68);
                g.closePath();
                g.fillPath();
            } else if (key.includes('redo')) {
                g.beginPath();
                g.arc(60, 72, 30, Math.PI * 1.2, Math.PI * 2, false);
                g.strokePath();
                g.beginPath();
                g.moveTo(90, 42);
                g.lineTo(100, 72);
                g.lineTo(70, 68);
                g.closePath();
                g.fillPath();
            } else if (key.includes('delete')) {
                g.strokeRect(40, 48, 48, 54);
                g.fillRect(32, 36, 64, 10);
                g.fillRect(52, 28, 24, 8);
            } else {
                g.beginPath();
                g.moveTo(88, 32);
                g.lineTo(96, 40);
                g.lineTo(48, 88);
                g.lineTo(32, 96);
                g.lineTo(40, 80);
                g.closePath();
                g.fillPath();
            }

            g.generateTexture(key, size, size);
            g.destroy();
        });
    }
}
