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
import SkipLevelPanel from '../ui/SkipLevelPanel.js';
import EndOfLevelsModal from '../ui/EndOfLevelsModal.js';
import CustomLevelRequestModal from '../ui/CustomLevelRequestModal.js';
import DebugOverlay from '../ui/DebugOverlay.js';
import defaultCampaignArray from '../data/LevelData.js';
import { gameplayStart, gameplayStop, happytime, trackGameActionForAds } from '../managers/CrazyGamesManager.js';


export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.overrideLevelId = data && data.levelId ? data.levelId : null;
        this.customLevelData = data && data.levelData ? data.levelData : null;
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

        if (this.customLevelData) {
            this.buildLevel(this.customLevelData, width, height);
        } else {
            this.levelId = this.overrideLevelId || GameManager.currentLevel;
            if (this.levelId > defaultCampaignArray.length) {
                this.hud = new HUD(this);
                new EndOfLevelsModal(this, defaultCampaignArray.length);
                return;
            }
            LevelManager.getLevel(this.levelId, width, height).then(level => {
                this.buildLevel(level, width, height);
            });
        }
    }


    buildLevel(level, width, height) {
        // Track attempts for this level
        this.currentLevelAttempts = this.registry.get('level_attempts_' + this.levelId) || 0;
        this.timeRemaining = 15;
        if (this.timerEvent) {
            this.timerEvent.destroy();
            this.timerEvent = null;
        }

        // HUD
        this.hud = new HUD(this);
        if (this.hud.updateTimer) this.hud.updateTimer(15);
        this.debugOverlay = new DebugOverlay(this, level);

        // Parse legacy or new schema
        const spawnX = level.startPos ? level.startPos.x : (level.spawn ? level.spawn.x : width/2);
        const spawnY = level.startPos ? level.startPos.y : (level.spawn ? level.spawn.y : height - 200);
        const holeX = level.holePos ? level.holePos.x : (level.hole ? level.hole.x : width/2);
        const holeY = level.holePos ? level.holePos.y : (level.hole ? level.hole.y : 200);

        // Build Walls
        this.walls = [];
        if (level.walls) {
            level.walls.forEach(w => {
                const wallWidth = w.width || w.w || 40;
                const wallHeight = w.height || w.h || 40;
                const wall = new Wall(this, w.x, w.y, wallWidth, wallHeight, w.angle || 0);
                this.walls.push(wall);
            });
        }

        // Build Hole
        this.hole = new Hole(this, holeX, holeY);

        this.movingWalls = [];
        if (level.movingWalls) {
            level.movingWalls.forEach(mw => {
                if (mw.duration) {
                    // New schema
                    const dist = Phaser.Math.Distance.Between(mw.startX, mw.startY, mw.endX, mw.endY);
                    const speed = dist / (mw.duration / 1000);
                    const axis = Math.abs(mw.endX - mw.startX) >= Math.abs(mw.endY - mw.startY) ? 'horizontal' : 'vertical';
                    
                    const mwWidth = mw.width || (axis === 'horizontal' ? 140 : 20);
                    const mwHeight = mw.height || (axis === 'horizontal' ? 20 : 140);
                    
                    const start = axis === 'horizontal' ? mw.startX : mw.startY;
                    const end = axis === 'horizontal' ? mw.endX : mw.endY;
                    this.movingWalls.push(new MovingWall(
                        this, mw.startX, mw.startY, mwWidth, mwHeight, axis, start, end, speed, 0, 'pingpong', 0, 1
                    ));
                } else {
                    // Legacy schema
                    const width = mw.width || mw.w;
                    const height = mw.height || mw.h;
                    this.movingWalls.push(new MovingWall(
                        this, mw.x, mw.y, width, height, mw.movement || mw.axis, mw.start || mw.x, mw.end || mw.x + (mw.distance || 100), mw.speed || 120, mw.pause || 0, mw.mode || 'pingpong', mw.delay || 0, mw.direction || 1
                    ));
                }
            });
        }

        this.portals = [];
        if (level.portals) {
            const portalMap = new Map();
            const minX = 75, maxX = width - 75, minY = 115, maxY = height - 75;
            level.portals.forEach((p, idx) => {
                if (p.x1 !== undefined) {
                    // New schema pairs
                    const px1 = Phaser.Math.Clamp(p.x1, minX, maxX);
                    const py1 = Phaser.Math.Clamp(p.y1, minY, maxY);
                    const px2 = Phaser.Math.Clamp(p.x2, minX, maxX);
                    const py2 = Phaser.Math.Clamp(p.y2, minY, maxY);
                    const idA = 'new_portal_A_' + idx;
                    const idB = 'new_portal_B_' + idx;
                    const portalA = new Portal(this, px1, py1, idA, idB, 'portal_entry');
                    const portalB = new Portal(this, px2, py2, idB, idA, 'portal_exit');
                    this.portals.push(portalA, portalB);
                    portalMap.set(idA, portalA);
                    portalMap.set(idB, portalB);
                } else {
                    // Legacy schema
                    const px = Phaser.Math.Clamp(p.x, minX, maxX);
                    const py = Phaser.Math.Clamp(p.y, minY, maxY);
                    const textureKey = (p.id && p.id.includes('blue')) ? 'portal_entry' : 'portal_exit';
                    const portal = new Portal(this, px, py, p.id, p.pair, textureKey);
                    this.portals.push(portal);
                    portalMap.set(p.id, portal);
                }
            });

            // Link them
            this.portals.forEach(p => {
                if (p.pairId && portalMap.has(p.pairId)) {
                    p.linkedPortal = portalMap.get(p.pairId);
                }
            });
        }

        this.lasers = [];
        if (level.lasers) {
            level.lasers.forEach(l => {
                if (l.x1 !== undefined) {
                    // New schema: l.x1, l.y1 is start, l.x2, l.y2 is end
                    const startX = Math.min(l.x1, l.x2);
                    const startY = Math.min(l.y1, l.y2);
                    const axis = Math.abs(l.x2 - l.x1) > Math.abs(l.y2 - l.y1) ? 'x' : 'y';
                    const length = axis === 'x' ? Math.abs(l.x2 - l.x1) : Math.abs(l.y2 - l.y1);
                    this.lasers.push(new Laser(this, startX, startY, length, axis, l.mode || 'always', l.onTime || 1.2, l.offTime || 1.2));
                } else {
                    // Legacy schema
                    const axis = l.direction === 'vertical' ? 'y' : 'x';
                    this.lasers.push(new Laser(this, l.x, l.y, l.length, axis, l.mode || 'always', l.onTime || 1.2, l.offTime || 1.2));
                }
            });
        }

        // Build Ball
        this.ball = new Ball(this, spawnX, spawnY);

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
        gameplayStart();
        this.showTutorial(level);
    }

    showTutorial(level) {
        let msg = '';
        if (level && level.instruction) {
            msg = level.instruction;
        } else {
            const levelId = typeof level === 'number' ? level : (this.levelId || 1);
            if (levelId === 1) msg = 'Drag and release to aim & shoot!';
            else if (levelId === 2) msg = 'Bounce the ball off walls to reach the hole.';
            else if (levelId === 3) msg = 'Plan your bounce angles carefully.';
            else if (levelId === 4) msg = 'Thread the needle through tight spaces.';
            else if (levelId === 5) msg = 'Avoid deadly lasers!';
            else if (levelId === 6) msg = 'Find the safe path past hazards.';
            else if (levelId === 7) msg = 'Shoot into portals to warp across the arena!';
            else if (levelId === 8) msg = 'Combine portals and bounces.';
            else if (levelId === 9) msg = 'Time your shot when the path clears!';
            else if (levelId === 10) msg = "Use everything you've learned!";
        }

        if (!msg) return;

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const container = this.add.container(width / 2, this.ball ? Math.max(200, this.ball.y - 180) : height - 300);
        
        const text = this.add.text(0, 0, msg, {
            fontFamily: 'Fredoka, sans-serif',
            fontSize: '28px',
            color: '#1a1a2e',
            align: 'center',
            fontStyle: '700',
            wordWrap: { width: 480, useAdvancedWrap: true }
        }).setOrigin(0.5);
        
        const bounds = text.getBounds();
        const bg = this.add.graphics();
        bg.fillStyle(0xffffff, 0.95);
        bg.fillRoundedRect(-bounds.width/2 - 24, -bounds.height/2 - 16, bounds.width + 48, bounds.height + 32, 20);
        bg.lineStyle(3, 0x4cc9f0, 1);
        bg.strokeRoundedRect(-bounds.width/2 - 24, -bounds.height/2 - 16, bounds.width + 48, bounds.height + 32, 20);
        
        container.add([bg, text]);
        container.setDepth(20);
        container.setAlpha(0);
        container.y += 20;

        this.tweens.add({
            targets: container,
            y: container.y - 20,
            alpha: 1,
            duration: 600,
            ease: 'Back.out',
            onComplete: () => {
                this.tweens.add({
                    targets: container,
                    y: container.y - 10,
                    duration: 1500,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.inOut'
                });
            }
        });
        
        let isHidden = false;
        const hideTutorial = () => {
            if (isHidden || !container || !container.active) return;
            isHidden = true;
            this.tweens.killTweensOf(container);
            this.tweens.add({
                targets: container,
                alpha: 0,
                scale: 0.8,
                duration: 250,
                ease: 'Quad.in',
                onComplete: () => {
                    if (container && container.active) container.destroy();
                }
            });
        };

        this.events.once('aim_start', hideTutorial);
        this.events.once('shot_fired', hideTutorial);
        this.input.once('pointerdown', hideTutorial);
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
        if (this.state === 'LOADING' || this.state === 'WIN' || this.state === 'LOSE') return;

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
            if (speed < 0.2 && !this.ball.isTeleporting) {
                // Ball stopped moving
                this.handleFailState("BALL STOPPED");
            }
        }
    }

    shootBall(aimVector) {
        this.state = 'PLAYING';
        this.shots++;
        this.events.emit('shot_fired');
        
        if (this.retryBtnHUD) {
            this.hideRetryButton();
        }
        
        // Physics multiplier - adjusted for strong initial hit, gradual decay
        const forceMulti = 0.00035;
        this.ball.applyForce(new Phaser.Math.Vector2(aimVector.x * forceMulti, aimVector.y * forceMulti));
        
        AudioManager.playSFX('shoot');

        // 15-Second Timer Countdown
        if (this.timerEvent) this.timerEvent.destroy();
        this.timeRemaining = 15;
        if (this.hud && this.hud.updateTimer) this.hud.updateTimer(15);

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            repeat: 14,
            callback: () => {
                if (this.state !== 'PLAYING') return;
                this.timeRemaining--;
                if (this.hud && this.hud.updateTimer) this.hud.updateTimer(this.timeRemaining);
                if (this.timeRemaining <= 0) {
                    this.handleFailState("TIME'S UP");
                }
            }
        });
    }

    handleHUDRestart() {
        if (this.state === 'WIN') return;
        this.handleFailState("RESTARTED");
    }

    handleFailState(reason = 'OUT OF BOUNDS') {
        if (this.state === 'WIN' || this.state === 'LOSE') return;
        this.state = 'LOSE';

        if (this.timerEvent) {
            this.timerEvent.destroy();
            this.timerEvent = null;
        }

        // Increment attempt tracking
        this.currentLevelAttempts++;
        this.registry.set('level_attempts_' + this.levelId, this.currentLevelAttempts);

        if (this.ball) {
            this.ball.setVelocity(0, 0);
            this.ball.setAngularVelocity(0);
        }

        // If >= 3 attempts, immediately present the Skip Level overlay
        if (this.currentLevelAttempts >= 3) {
            this.time.delayedCall(200, () => {
                new SkipLevelPanel(this, () => {
                    this.triggerLose(reason);
                });
            });
        } else {
            this.triggerLose(reason);
        }
    }

    onBallStopped() {
        this.handleFailState("BALL STOPPED");
    }
    
    showRetryButton() {
        if (!this.retryBtnHUD) {
            this.retryBtnHUD = new Button(this, this.cameras.main.width / 2, this.cameras.main.height - 120, 'RESTART LEVEL', () => {
                trackGameActionForAds(() => {
                    const attempts = this.registry.get('level_attempts_' + this.levelId) || 0;
                    this.registry.set('level_attempts_' + this.levelId, attempts + 1);
                    SceneManager.transitionTo(this, 'GameScene', { levelId: this.overrideLevelId });
                });
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
        gameplayStop();
        if (this.shots === 1) {
            happytime();
        }
        if (this.timerEvent) {
            this.timerEvent.destroy();
            this.timerEvent = null;
        }
        
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
                    GameManager.completeLevel(this.shots);
                    new LevelCompletePanel(this, true, this.shots, (action) => {
                        if (action === 'next') {
                            if (GameManager.currentLevel > defaultCampaignArray.length) {
                                new EndOfLevelsModal(this, defaultCampaignArray.length);
                            } else {
                                SceneManager.transitionTo(this, 'GameScene', { levelId: this.overrideLevelId ? null : GameManager.currentLevel });
                            }
                        }
                        if (action === 'menu') {
                            SceneManager.transitionTo(this, 'MenuScene');
                        }
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
        gameplayStop();
        
        AudioManager.playSFX('lose');
        
        if (reason === 'HIT LASER') {
            // Flash camera
            this.cameras.main.flash(200, 255, 200, 200);
            
            // Particle burst
            const particles = this.add.particles(this.ball.x, this.ball.y, 'ball_red_large', {
                speed: { min: 100, max: 300 },
                scale: { start: 0.1, end: 0 },
                alpha: { start: 1, end: 0 },
                lifespan: 400,
                quantity: 12,
                tint: 0xffa0a0,
                blendMode: 'ADD'
            });
            particles.setDepth(15);
            particles.explode();
            this.time.delayedCall(500, () => particles.destroy());
        }

        // Fade out ball
        this.ball.setCollisionCategory(0);
        this.ball.setVelocity(0, 0);

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
                    SceneManager.transitionTo(this, 'GameScene', { levelId: this.overrideLevelId });
                }
                if (action === 'menu') {
                    SceneManager.transitionTo(this, 'MenuScene');
                }
            }, reason);
        });

    }
}
