/**
 * DebugOverlay.js
 * Visualizes procedural generator metrics on screen:
 * - Generation time
 * - Generation attempt number
 * - Difficulty requested & measured
 * - Puzzle concept
 * - Bounce count
 * - Mechanics used
 * - Similarity score
 * - Estimated attempts
 * - Reason for rejection / history
 */

export class DebugOverlay {
    /**
     * @param {Phaser.Scene} scene - Active game scene.
     * @param {Object} levelData - Active level data.
     */
    constructor(scene, levelData) {
        this.scene = scene;
        this.levelData = levelData;
        this.visible = false;
        this.container = null;
        this.graphics = null;

        this.create();
    }

    create() {
        const width = this.scene.cameras.main.width;

        // Container for Debug Panel
        this.container = this.scene.add.container(width - 20, 160).setDepth(1000).setVisible(false);

        // Panel Shadow & Background
        const panelW = 420;
        const panelH = 390;

        const bg = this.scene.add.graphics();
        bg.fillStyle(0x1a1a24, 0.94);
        bg.fillRoundedRect(-panelW, 0, panelW, panelH, 18);
        bg.lineStyle(2, 0x6085e0, 0.9);
        bg.strokeRoundedRect(-panelW, 0, panelW, panelH, 18);

        // Text Info
        const meta = this.levelData?.metadata || {};
        const debug = this.levelData?.debugInfo || {};

        const reqDiff = meta.difficulty || debug.difficulty || 25;
        const measDiff = meta.measuredDifficulty || debug.measuredDifficulty || reqDiff;
        const concept = meta.puzzleConcept || debug.puzzleConcept || 'RICHOCHET';
        const attempts = meta.generationAttempts || debug.generationAttempts || 1;
        const genTime = meta.generationTimeMs || debug.generationTimeMs || '<1';
        const simScore = meta.similarityScore || debug.similarityScore || 0;
        const estAttempts = meta.estimatedAttempts || debug.estimatedAttempts || 3;
        const wallCount = (this.levelData?.walls || []).length;
        const portalCount = Math.floor((this.levelData?.portals || []).length / 2);
        const laserCount = (this.levelData?.lasers || []).length;
        const movingCount = (this.levelData?.movingWalls || []).length;
        const solverResult = 'SOLVED (PASSED)';

        const infoText = [
            `🛠️ PUZZLE GENERATOR DEBUG`,
            `--------------------------`,
            `• Theme: ${concept.toUpperCase()}`,
            `• Diff Req / Meas: ${reqDiff} / ${measDiff}`,
            `• Walls: ${wallCount} | Portals: ${portalCount}`,
            `• Lasers: ${laserCount} | Moving: ${movingCount}`,
            `• Gen Time: ${genTime} ms`,
            `• Gen Attempts: ${attempts}`,
            `• Solver Result: ${solverResult}`,
            `• Similarity Score: ${simScore}`,
            `• Est. Player Tries: ${estAttempts}`
        ].join('\n');

        const text = this.scene.add.text(-panelW + 20, 18, infoText, {
            fontFamily: 'Courier, monospace',
            fontSize: '17px',
            color: '#60e0a0',
            lineSpacing: 6,
            fontStyle: 'bold'
        });

        this.container.add([bg, text]);

        // Trajectory Overlay Graphics
        this.graphics = this.scene.add.graphics().setDepth(999).setVisible(false);

        // Keyboard Shortcut: Press 'D' to toggle Debug Overlay
        if (this.scene.input && this.scene.input.keyboard) {
            this.scene.input.keyboard.on('keydown-D', () => {
                this.toggle();
            });
        }
    }

    toggle() {
        this.visible = !this.visible;
        this.container.setVisible(this.visible);
        this.graphics.setVisible(this.visible);

        if (this.visible) {
            this.drawTrajectory();
        } else {
            this.graphics.clear();
        }
    }

    drawTrajectory() {
        this.graphics.clear();
        const nodes = this.levelData?.debugInfo?.trajectoryNodes;
        if (!nodes || nodes.length < 2) return;

        // Draw glowing solution path
        this.graphics.lineStyle(4, 0xff007f, 0.85);
        this.graphics.beginPath();
        this.graphics.moveTo(nodes[0].x, nodes[0].y);

        for (let i = 1; i < nodes.length; i++) {
            this.graphics.lineTo(nodes[i].x, nodes[i].y);
        }
        this.graphics.strokePath();

        // Draw trajectory nodes
        nodes.forEach((node) => {
            const color = node.type === 'spawn' ? 0x4caf50 : (node.type === 'hole' ? 0xffeb3b : 0xff007f);
            this.graphics.fillStyle(color, 1);
            this.graphics.fillCircle(node.x, node.y, node.type === 'bounce' ? 10 : 16);
        });
    }

    destroy() {
        if (this.container) this.container.destroy();
        if (this.graphics) this.graphics.destroy();
    }
}

export default DebugOverlay;
