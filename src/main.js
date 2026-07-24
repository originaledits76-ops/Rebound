import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';

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
    scene: [BootScene, MenuScene, GameScene]
};

document.fonts.ready.then(() => {
    const game = new Phaser.Game(config);
});
