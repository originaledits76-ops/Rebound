import LevelGenerator from '../src/systems/LevelGenerator.js';

console.log("=========================================================");
console.log("GENERATING 10 CONSECUTIVE PROCEDURAL LEVELS");
console.log("=========================================================\n");

const levels = [];
const referenceLevels = [];

const difficulties = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

for (let i = 0; i < 10; i++) {
    const levelNumber = i + 1;
    const difficulty = difficulties[i];
    const seed = 1000 + i * 555;

    console.log(`\n=========================================================`);
    console.log(`>>> GENERATING LEVEL ${levelNumber} OF 10 (Difficulty: ${difficulty}) <<<`);
    console.log(`=========================================================`);

    const levelData = LevelGenerator.generateLevel({
        difficulty,
        levelNumber,
        seed,
        referenceLevels
    });

    referenceLevels.push(levelData);
    levels.push(levelData);
}

console.log("\n=========================================================");
console.log("ALL 10 CONSECUTIVE LEVELS GENERATED SUCCESSFULLY!");
console.log("=========================================================\n");

levels.forEach((lvl, idx) => {
    console.log(`\n--- LEVEL ${idx + 1} SUMMARY ---`);
    console.log(`ID: ${lvl.id}`);
    console.log(`Title: ${lvl.title}`);
    console.log(`Difficulty Target: ${lvl.metadata.difficulty} | Measured: ${lvl.metadata.measuredDifficulty}`);
    console.log(`Mechanics: ${lvl.metadata.mechanicsUsed.join(', ') || 'walls only'}`);
    console.log(`Bounces: ${lvl.metadata.requiredBounces}`);
    console.log(`Spawn: (${lvl.spawn.x}, ${lvl.spawn.y}) | Hole: (${lvl.hole.x}, ${lvl.hole.y})`);
    console.log(`Walls: ${lvl.walls.length} | MovingWalls: ${lvl.movingWalls.length} | Portals: ${lvl.portals.length} | Lasers: ${lvl.lasers.length}`);
});
