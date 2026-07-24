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

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRoundedRect(x + 8, y + 8, (barWidth - 16) * value, barHeight - 16, (barHeight - 16)/2);
        });

        // Load new visual assets
        this.load.image('bg_blue', '/assets/sprites/background/background_blue.png');
        this.load.image('bg_brown', '/assets/sprites/background/background_brown.png');
        this.load.image('bg_green', '/assets/sprites/background/background_green.png');
        
        this.load.image('ball_blue_large', '/assets/sprites/ball/ball_blue_large.png');
        this.load.image('ball_blue_large_alt', '/assets/sprites/ball/ball_blue_large_alt.png');
        this.load.image('ball_blue_small', '/assets/sprites/ball/ball_blue_small.png');
        this.load.image('ball_blue_small_alt', '/assets/sprites/ball/ball_blue_small_alt.png');
        
        this.load.image('ball_red_large', '/assets/sprites/ball/ball_red_large.png');
        this.load.image('ball_red_large_alt', '/assets/sprites/ball/ball_red_large_alt.png');
        this.load.image('ball_red_small', '/assets/sprites/ball/ball_red_small.png');
        this.load.image('ball_red_small_alt', '/assets/sprites/ball/ball_red_small_alt.png');

        this.load.image('portal_entry', '/assets/sprites/portals/portal_entry.png');
        this.load.image('portal_exit', '/assets/sprites/portals/portal_exit.png');

        this.load.image('laser', '/assets/sprites/walls/laser.png');
        this.load.image('laser_shooter', '/assets/sprites/walls/laser_shooter.png');
        this.load.image('wall_corner', '/assets/sprites/walls/wall_corner.png');
        this.load.image('wall_corner_large', '/assets/sprites/walls/wall_corner_large.png');
        this.load.image('wall_narrow_thin', '/assets/sprites/walls/wall_narrow_thin.png');
        this.load.image('wall_thick_large', '/assets/sprites/walls/wall_thick_large.png');
    }

    create() {
        this.generateIcon('icon_play', 'play_arrow', '#3a3a4a');
        this.generateIcon('icon_retry', 'refresh', '#3a3a4a');
        this.generateIcon('icon_menu', 'menu', '#3a3a4a');
        this.generateIcon('icon_pause', 'pause', '#3a3a4a');
        this.generateIcon('icon_home', 'home', '#3a3a4a');
        this.generateIcon('icon_settings', 'settings', '#3a3a4a');
        this.generateIcon('icon_fastforward', 'skip_next', '#3a3a4a');
        this.generateIcon('icon_back', 'arrow_back', '#3a3a4a');
        
        // Star & Coin
        this.generateIcon('icon_star', 'star', '#e0b060', 80);
        this.generateIcon('icon_star_outline', 'star', '#e0e0e8', 80); // Can use same character, diff color
        this.generateIcon('icon_coin', 'monetization_on', '#e0b060', 60);

        this.time.delayedCall(200, () => {
            this.scene.start('MenuScene');
        });
    }

    generateIcon(key, char, color, size = 60) {
        const text = this.make.text({
            x: size / 2,
            y: size / 2,
            text: char,
            style: {
                fontFamily: '"Material Symbols Rounded"',
                fontSize: `${size}px`,
                color: color
            },
            add: false
        });
        text.setOrigin(0.5);
        
        const rt = this.make.renderTexture({ width: size, height: size, add: false });
        rt.draw(text);
        rt.saveTexture(key);
        
        text.destroy();
        rt.destroy();
    }
}
