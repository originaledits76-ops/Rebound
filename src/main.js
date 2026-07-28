import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import LevelSelectScene from './scenes/LevelSelectScene.js';
import GameScene from './scenes/GameScene.js';
import CrazyGamesManager from './managers/CrazyGamesManager.js';

const isMobile = window.innerWidth < 768;
const logicalWidth = 1080;
const logicalHeight = isMobile ? Math.floor((window.innerHeight / window.innerWidth) * logicalWidth) : 1920;

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'app',
        width: logicalWidth,
        height: logicalHeight,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#fbf8f1', // Warm off-white background
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0 },
            debug: false // Production-ready: no debug overlays
        }
    },
    scene: [BootScene, MenuScene, LevelSelectScene, GameScene]
};

async function initApp() {
    // 1. Initialize CrazyGames SDK safely without blocking game creation
    await CrazyGamesManager.initialize();

    // 2. Load web fonts
    try {
        if (document.fonts) {
            await Promise.all([
                document.fonts.load('16px Fredoka').catch(() => {}),
                document.fonts.load('16px "Material Symbols Rounded"').catch(() => {})
            ]);
        }
    } catch (e) {
        console.warn('Font loading fallback:', e);
    }

    // 3. Create Phaser Game
    console.log("Creating Phaser Game...");
    const game = new Phaser.Game(config);
    window.game = game;
    console.log("Game Ready");
}

initApp();


