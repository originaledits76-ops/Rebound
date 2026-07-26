import Phaser from 'phaser';
import Button from './Button.js';
import CustomLevelRequestModal from './CustomLevelRequestModal.js';
import SceneManager from '../managers/SceneManager.js';

export default class EndOfLevelsModal extends Phaser.GameObjects.Container {
    constructor(scene, totalLevels = 50) {
        const width = scene.cameras.main.width;
        const height = scene.cameras.main.height;
        super(scene, width / 2, height / 2);

        scene.add.existing(this);
        this.setDepth(350);

        // Dark dim background
        this.overlay = scene.add.rectangle(0, 0, width * 2, height * 2, 0x1a1a2e, 0.75);
        this.add(this.overlay);

        const panelWidth = 580;
        const panelHeight = 540;
        const radius = 30;

        const shadow = scene.add.graphics();
        shadow.fillStyle(0x0a0a1a, 0.4);
        shadow.fillRoundedRect(-panelWidth / 2, -panelHeight / 2 + 15, panelWidth, panelHeight, radius);

        const bg = scene.add.graphics();
        bg.fillStyle(0xffffff, 1);
        bg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, radius);

        const stroke = scene.add.graphics();
        stroke.lineStyle(2, 0xe0e0e8, 1);
        stroke.strokeRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, radius);

        this.add([shadow, bg, stroke]);

        // Trophy / Star Icon
        const trophy = scene.add.image(0, -180, 'icon_star').setScale(1.2).setTint(0xe0b060);
        this.add(trophy);

        // Title
        const title = scene.add.text(0, -110, 'MORE LEVELS COMING SOON!', {
            fontFamily: 'Fredoka',
            fontSize: '34px',
            color: '#3a3a4a',
            fontStyle: '700',
            align: 'center'
        }).setOrigin(0.5);

        // Body message
        const msg = scene.add.text(0, -20, `You have completed all ${totalLevels} levels! We currently have ${totalLevels} levels for now and we are working on adding more levels soon.`, {
            fontFamily: 'Fredoka',
            fontSize: '22px',
            color: '#606070',
            align: 'center',
            fontStyle: '600',
            wordWrap: { width: 480, useAdvancedWrap: true }
        }).setOrigin(0.5);

        this.add([title, msg]);

        // Buttons
        const btnWidth = 460;

        const requestBtn = new Button(scene, 0, 85, 'REQUEST A CUSTOM LEVEL', () => {
            new CustomLevelRequestModal(scene, () => {
                // Modal closed
            });
        }, { width: btnWidth, height: 75, bgColor: 0x6085e0, fontSize: '26px', icon: 'icon_play' });

        const homeBtn = new Button(scene, 0, 180, 'LEVEL SELECT', () => {
            SceneManager.transitionTo(scene, 'LevelSelectScene');
        }, { width: btnWidth, height: 70, bgColor: 0x9090a0, fontSize: '24px', icon: 'icon_home' });

        this.add([requestBtn, homeBtn]);

        // Entrance animation
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
}
