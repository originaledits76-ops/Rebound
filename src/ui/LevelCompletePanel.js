import Phaser from 'phaser';
import Button from './Button.js';

export default class LevelCompletePanel extends Phaser.GameObjects.Container {
    constructor(scene, isWin, shots, onAction, loseReason = 'OUT OF BOUNDS') {
        super(scene, scene.cameras.main.width / 2, scene.cameras.main.height / 2);
        
        const width = 640;
        const height = 580;
        const radius = 30;

        const shadow = scene.add.graphics();
        shadow.fillStyle(0xd0d0d8, 0.6);
        shadow.fillRoundedRect(-width/2, -height/2 + 20, width, height, radius);

        const bg = scene.add.graphics();
        bg.fillStyle(0xffffff, 1);
        bg.fillRoundedRect(-width/2, -height/2, width, height, radius);
        
        const stroke = scene.add.graphics();
        stroke.lineStyle(2, 0xf0f0f5, 1);
        stroke.strokeRoundedRect(-width/2, -height/2, width, height, radius);

        this.add([shadow, bg, stroke]);

        if (isWin) {
            let titleText = 'COMPLETE';
            let titleColor = '#6085e0';
            let starsToAward = 1;

            if (shots === 1) {
                titleText = 'PERFECT';
                titleColor = '#e0b060';
                starsToAward = 3;
            } else if (shots === 2) {
                titleText = 'GREAT';
                titleColor = '#70b880';
                starsToAward = 2;
            }

            const title = scene.add.text(0, -180, titleText, {
                fontFamily: 'Fredoka',
                fontSize: '64px',
                color: titleColor,
                fontStyle: '700',
                letterSpacing: 2
            }).setOrigin(0.5);
            
            const subtitle = scene.add.text(0, -120, `SHOTS: ${shots}`, {
                fontFamily: 'Fredoka',
                fontSize: '28px',
                color: '#808090',
                fontStyle: '600'
            }).setOrigin(0.5);

            this.add([title, subtitle]);

            // Create Star placeholders and animate awarded stars
            for (let i = 0; i < 3; i++) {
                const isCenter = i === 1;
                const x = (i - 1) * 130;
                const y = isCenter ? -40 : -20;
                const scale = isCenter ? 1.4 : 1.1;

                const starOutline = scene.add.image(x, y, 'icon_star_outline');
                starOutline.setScale(scale);
                starOutline.setTint(0xe0e0e8);
                this.add(starOutline);

                if (i < starsToAward) {
                    const starFull = scene.add.image(x, y, 'icon_star');
                    starFull.setScale(0); // Start scale at 0 for animation
                    starFull.setTint(0xe0b060);
                    this.add(starFull);

                    // Animate star popping in
                    scene.tweens.add({
                        targets: starFull,
                        scale: scale,
                        duration: 500,
                        delay: 400 + (i * 200),
                        ease: 'Back.out',
                        easeParams: [1.7],
                        onComplete: () => {
                            // Sparkle effect
                            const particles = scene.add.particles(x, y, 'icon_star', {
                                speed: { min: 20, max: 60 },
                                scale: { start: 0.15, end: 0 },
                                alpha: { start: 1, end: 0 },
                                lifespan: 600,
                                quantity: 5,
                                tint: 0xffd700,
                                angle: { min: 0, max: 360 }
                            });
                            this.add(particles);
                            particles.explode();
                            scene.time.delayedCall(600, () => particles.destroy());
                        }
                    });
                }
            }
            
            const menuBtn = new Button(scene, -150, 180, 'HOME', () => onAction('menu'), { width: 260, bgColor: 0x9090a0, icon: 'icon_home' });
            const nextBtn = new Button(scene, 150, 180, 'NEXT', () => onAction('next'), { width: 260, bgColor: 0x6085e0, icon: 'icon_play' });
            this.add([menuBtn, nextBtn]);
            
        } else {
            const title = scene.add.text(0, -140, loseReason, {
                fontFamily: 'Fredoka',
                fontSize: '48px',
                color: '#4a4a5a',
                fontStyle: '700',
                letterSpacing: 1
            }).setOrigin(0.5);
            this.add(title);

            const retryBtn = new Button(scene, 0, 80, 'RETRY LEVEL', () => onAction('retry'), { width: 340, bgColor: 0x6085e0, icon: 'icon_retry' });
            const menuBtn = new Button(scene, 0, 200, 'HOME', () => onAction('menu'), { width: 340, bgColor: 0x9090a0, icon: 'icon_home' });
            this.add([retryBtn, menuBtn]);
        }

        this.setDepth(300);
        
        // Entrance animation
        this.setScale(0.8);
        this.setAlpha(0);
        scene.tweens.add({
            targets: this,
            scale: 1,
            alpha: 1,
            duration: 400,
            ease: 'Back.out',
            easeParams: [1.2]
        });

        scene.add.existing(this);
    }
}
