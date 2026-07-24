import Phaser from 'phaser';
import SceneManager from '../managers/SceneManager.js';
import GameManager from '../managers/GameManager.js';
import LevelManager from '../managers/LevelManager.js';
import Ball from '../objects/Ball.js';
import Hole from '../objects/Hole.js';
import Wall from '../objects/Wall.js';
import MovingWall from '../objects/MovingWall.js';
import Portal from '../objects/Portal.js';
import Laser from '../objects/Laser.js';
import AimSystem from '../systems/AimSystem.js';
import LevelCompletePanel from '../ui/LevelCompletePanel.js';
import AudioManager from '../managers/AudioManager.js';
import Button from '../ui/Button.js';
import HUD from '../ui/HUD.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        SceneManager.transitionIn(this);
        
        this.state = 'LOADING'; // IDLE, PLAYING, WIN, LOSE, LOADING
        this.shots = 0;
        this.activeTimer = null;

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Background Grid
        this.add.tileSprite(0, 0, width, height, 'bg_grid').setOrigin(0).setDepth(-10);

        this.levelId = GameManager.currentLevel;
        
        // Fetch Level Data
        LevelManager.getLevel(this.levelId, width, height).then(level => {
            this.buildLevel(level, width, height);
        });
    }

    buildLevel(level, width, height) {
        // HUD
        this.hud = new HUD(this);

        // Build Walls
        this.walls = [];
        if (level.walls) {
            level.walls.forEach(w => {
                const wall = new Wall(this, w.x, w.y, w.w, w.h);
                this.walls.push(wall);
            });
        }

        // Build Hole
        this.hole = new Hole(this, level.hole.x, level.hole.y);

        this.movingWalls = [];
        if (level.movingWalls) {
            level.movingWalls.forEach(mw => {
                this.movingWalls.push(new MovingWall(this, mw.x, mw.y, mw.w, mw.h, mw.axis, mw.distance, mw.duration, mw.pause));
            });
        }

        this.portals = [];
        if (level.portals) {
            const portalMap = new Map();
            level.portals.forEach(p => {
                const portal = new Portal(this, p.x, p.y, p.type);
                portal.id = p.id;
                portal.linkId = p.linkId;
                this.portals.push(portal);
                portalMap.set(p.id, portal);
            });
            // Link them
            this.portals.forEach(p => {
                if (p.linkId && portalMap.has(p.linkId)) {
                    p.linkedPortal = portalMap.get(p.linkId);
                }
            });
        }

        this.lasers = [];
        if (level.lasers) {
            level.lasers.forEach(l => {
                this.lasers.push(new Laser(this, l.x, l.y, l.length, l.axis));
            });
        }

        // Build Ball
        this.ball = new Ball(this, level.spawn.x, level.spawn.y);

        // Assign random ball color based on level + retry logic
        this.assignBallColor();

        // Aim System
        this.aimSystem = new AimSystem(this, this.ball);

        // Thick Invisible Screen Bounds
        const thick = 200;
        const edgeOptions = { isStatic: true, restitution: 1, friction: 0 };
        this.matter.add.rectangle(width / 2, -thick/2, width + thick*2, thick, edgeOptions); // Top
        this.matter.add.rectangle(width / 2, height + thick/2, width + thick*2, thick, edgeOptions); // Bottom
        this.matter.add.rectangle(-thick/2, height / 2, thick, height + thick*2, edgeOptions); // Left
        this.matter.add.rectangle(width + thick/2, height / 2, thick, height + thick*2, edgeOptions); // Right

        // Physics Collisions
        this.matter.world.on('collisionstart', this.handleCollision, this);

        this.state = 'IDLE';
    }

    assignBallColor() {
        const colors = [
            0xffea00, // Yellow
            0x6085e0, // Blue
            0x9c27b0, // Purple
            0xf44336, // Red
            0x4caf50, // Green
            0xff9800, // Orange
            0xe91e63, // Pink
            0x00bcd4  // Cyan
        ];
        
        // Mix levelId with attempts to get a color index
        const attempts = this.registry.get('level_attempts_' + this.levelId) || 0;
        const colorIndex = (this.levelId + attempts) % colors.length;
        
        // Use setTint with FILL tint mode for solid color replacement
        this.ball.setTint(colors[colorIndex]).setTintMode(Phaser.TintModes.FILL);
    }

    update() {
        if (this.state === 'WIN' || this.state === 'LOSE') return;

        // Safety Catch (in case of extreme physics tunneling)
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        if (this.ball.y > height + 200 || this.ball.y < -200 || this.ball.x < -200 || this.ball.x > width + 200) {
            this.ball.setPosition(width / 2, height / 2);
            this.ball.setVelocity(0, 0);
            return;
        }

        // Magnetic Hole Check
        const dist = Phaser.Math.Distance.Between(this.ball.x, this.ball.y, this.hole.x, this.hole.y);
        if (dist < 55 && this.state !== 'WIN') {
            this.triggerWin();
            return;
        }

        const speed = this.ball.body.speed;

        if (this.state === 'PLAYING') {
            if (speed < 0.2) {
                // Ball stopped
                this.onBallStopped();
            }
        }
    }

    shootBall(aimVector) {
        this.state = 'PLAYING';
        this.shots++;
        
        if (this.retryBtnHUD) {
            this.hideRetryButton();
        }
        
        // Physics multiplier - adjusted for strong initial hit, gradual decay
        const forceMulti = 0.00035;
        this.ball.applyForce(new Phaser.Math.Vector2(aimVector.x * forceMulti, aimVector.y * forceMulti));
        
        AudioManager.playSFX('shoot');

        // Maximum active lifetime 10 seconds
        if (this.activeTimer) this.activeTimer.remove();
        this.activeTimer = this.time.delayedCall(10000, () => {
            if (this.state === 'PLAYING') {
                this.triggerLose("TIME'S UP");
            }
        });
    }

    onBallStopped() {
        this.state = 'IDLE';
        if (this.activeTimer) this.activeTimer.remove();
        
        this.ball.setVelocity(0, 0);
        this.ball.setAngularVelocity(0);
        
        this.showRetryButton();
    }
    
    showRetryButton() {
        if (!this.retryBtnHUD) {
            this.retryBtnHUD = new Button(this, this.cameras.main.width / 2, this.cameras.main.height - 120, 'RESTART LEVEL', () => {
                const attempts = this.registry.get('level_attempts_' + this.levelId) || 0;
                this.registry.set('level_attempts_' + this.levelId, attempts + 1);
                SceneManager.transitionTo(this, 'GameScene');
            }, { width: 320, bgColor: 0x9090a0 });
            this.retryBtnHUD.setDepth(150);
            this.add.existing(this.retryBtnHUD);
            this.animateRetryButtonIn();
        } else {
            this.animateRetryButtonIn();
        }
    }
    
    animateRetryButtonIn() {
        if (!this.retryBtnHUD || this.retryBtnHUD.activeTween) return;
        
        this.retryBtnHUD.setVisible(true);
        this.retryBtnHUD.setAlpha(0);
        this.retryBtnHUD.y = this.cameras.main.height - 80;
        
        this.retryBtnHUD.activeTween = this.tweens.add({
            targets: this.retryBtnHUD,
            alpha: 1,
            y: this.cameras.main.height - 130,
            duration: 400,
            ease: 'Back.out',
            onComplete: () => { this.retryBtnHUD.activeTween = null; }
        });
    }
    
    hideRetryButton() {
        if (!this.retryBtnHUD || !this.retryBtnHUD.visible) return;
        if (this.retryBtnHUD.activeTween) this.retryBtnHUD.activeTween.stop();
        
        this.retryBtnHUD.activeTween = this.tweens.add({
            targets: this.retryBtnHUD,
            alpha: 0,
            y: this.cameras.main.height - 80,
            duration: 200,
            ease: 'Sine.in',
            onComplete: () => {
                this.retryBtnHUD.setVisible(false);
                this.retryBtnHUD.activeTween = null;
            }
        });
    }

    handleCollision(event) {
        if (this.state === 'WIN' || this.state === 'LOSE') return;

        const pairs = event.pairs;
        for (let i = 0; i < pairs.length; i++) {
            const bodyA = pairs[i].bodyA;
            const bodyB = pairs[i].bodyB;
            
            const isBall = bodyA.gameObject instanceof Ball || bodyB.gameObject instanceof Ball;
            if (isBall) {
                const ballBody = bodyA.gameObject instanceof Ball ? bodyA : bodyB;
                const otherBody = bodyA === ballBody ? bodyB : bodyA;
                const ballGo = ballBody.gameObject;

                if (otherBody.label === 'laser') {
                    this.triggerLose('HIT LASER');
                    return;
                }

                if (otherBody.gameObject instanceof Portal) {
                    otherBody.gameObject.triggerTeleport(ballGo);
                    return;
                }

                const speed = ballBody.speed; 
                
                // Scale shake exponentially with speed
                if (speed > 2) {
                    const normalizedSpeed = Math.min(speed / 25, 1);
                    const intensity = normalizedSpeed * normalizedSpeed * 0.005; 
                    if (intensity > 0.0005) {
                        this.cameras.main.shake(80, intensity);
                    }
                    
                    this.spawnCollisionParticles(ballBody.position.x, ballBody.position.y, speed);
                    AudioManager.playSFX('bounce', Math.min(speed / 12, 1));
                } else if (speed > 0.5) {
                    AudioManager.playSFX('bounce', speed / 20);
                }
            }
        }
    }

    spawnCollisionParticles(x, y, speed) {
        // Cleaner, subtle impact particles
        const particles = this.add.particles(x, y, 'ball_blue_large', {
            speed: { min: speed * 2, max: speed * 8 },
            scale: { start: 0.08, end: 0 },
            alpha: { start: 0.4, end: 0 },
            lifespan: 250,
            quantity: Math.min(Math.floor(speed), 6),
            tint: 0xb0b0c0
        });
        particles.setDepth(5);
        particles.explode();
        this.time.delayedCall(300, () => particles.destroy());
    }

    spawnWinParticles() {
        const particles = this.add.particles(this.hole.x, this.hole.y, 'icon_star', {
            speed: { min: 80, max: 250 },
            scale: { start: 0.25, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 1200,
            quantity: 25,
            tint: 0xe0b060, // Soft amber
            angle: { min: 0, max: 360 }
        });
        particles.setDepth(5);
        particles.explode();
        this.time.delayedCall(1200, () => particles.destroy());
    }

    triggerWin() {
        this.state = 'WIN';
        
        // Disable physics interaction
        this.ball.setCollisionCategory(0);
        this.ball.setVelocity(0, 0);
        
        if (this.retryBtnHUD) this.hideRetryButton();
        
        AudioManager.playSFX('win'); // Initially play win/capture sound

        // Magnetic suction tween
        this.tweens.add({
            targets: this.ball,
            x: this.hole.x,
            y: this.hole.y,
            scaleX: 0.2,
            scaleY: 0.2,
            angle: 360,
            duration: 450,
            ease: 'Back.in',
            onComplete: () => {
                AudioManager.playSFX('win'); // Satisfying pop/win
                this.spawnWinParticles();
                this.ball.setVisible(false);
                
                // Show LEVEL COMPLETE text
                const width = this.cameras.main.width;
                const height = this.cameras.main.height;
                const completeText = this.add.text(width/2, height/2 - 120, 'LEVEL COMPLETE!', {
                    fontFamily: 'Fredoka',
                    fontSize: '64px',
                    color: '#6085e0',
                    fontStyle: '700',
                    stroke: '#ffffff',
                    strokeThickness: 10
                }).setOrigin(0.5).setDepth(200).setScale(0);
                
                // Add soft shadow
                completeText.setShadow(0, 8, 'rgba(0,0,0,0.15)', 0);
                
                this.tweens.add({
                    targets: completeText,
                    scale: 1,
                    duration: 600,
                    ease: 'Back.out'
                });
                
                this.time.delayedCall(1200, () => {
                    GameManager.completeLevel();
                    new LevelCompletePanel(this, true, this.shots, (action) => {
                        if (action === 'next') SceneManager.transitionTo(this, 'GameScene');
                        if (action === 'menu') SceneManager.transitionTo(this, 'MenuScene');
                    });
                });
            }
        });
        
        // Pulse hole glow
        this.tweens.add({
            targets: this.hole,
            scaleX: 1.4,
            scaleY: 1.4,
            alpha: 0.8,
            duration: 250,
            yoyo: true,
            ease: 'Sine.inOut'
        });
    }

    triggerLose(reason = 'OUT OF BOUNDS') {
        this.state = 'LOSE';
        
        AudioManager.playSFX('lose');
        
        // Fade out ball and line
        this.tweens.add({
            targets: this.ball,
            alpha: 0,
            scaleX: 0,
            scaleY: 0,
            duration: 400,
            ease: 'Back.in'
        });

        this.time.delayedCall(400, () => {
            new LevelCompletePanel(this, false, this.shots, (action) => {
                if (action === 'retry') {
                    const attempts = this.registry.get('level_attempts_' + this.levelId) || 0;
                    this.registry.set('level_attempts_' + this.levelId, attempts + 1);
                    SceneManager.transitionTo(this, 'GameScene');
                }
                if (action === 'menu') {
                    SceneManager.transitionTo(this, 'MenuScene');
                }
            }, reason);
        });
    }
}
