// Heavy Defence
// A super simple heavy tower defence game

// Game state
const game = {
    health: 100,
    money: 50,
    wave: 1,
    towers: [],
    enemies: [],
};

// Tower and enemy templates
function Tower(pos) {
    this.pos = pos;
    this.damage = 10;
    this.range = 2;
}

function Enemy(hp, speed) {
    this.hp = hp;
    this.speed = speed;
    this.pos = 0;
}

// Place a tower
function placeTower(pos) {
    if (game.money >= 20) {
        game.towers.push(new Tower(pos));
        game.money -= 20;
        console.log('Tower placed at', pos);
    } else {
        console.log('Not enough money!');
    }
}

// Spawn a wave of enemies
function spawnWave() {
    for (let i = 0; i < game.wave + 2; i++) {
        game.enemies.push(new Enemy(30 + game.wave * 5, 1));
    }
    console.log('Wave', game.wave, 'spawned!');
}

// Towers attack enemies
function towersAttack() {
    game.towers.forEach(tower => {
        if (tower.name === 'Archer') {
            // Archer: attacks from a distance
            let target = game.enemies.find(e => Math.abs(e.pos - tower.pos) <= tower.range && e.hp > 0);
            if (target) {
                target.hp -= tower.damage;
                console.log(`Archer at ${tower.pos} shoots an arrow at enemy for ${tower.damage}`);
            }
        } else if (tower.name === 'Swordsman') {
            // Swordsman: moves toward nearest enemy and attacks in melee
            let target = game.enemies.filter(e => e.hp > 0)
                .sort((a, b) => Math.abs(a.pos - tower.pos) - Math.abs(b.pos - tower.pos))[0];
            if (target && Math.abs(target.pos - tower.pos) <= 1) {
                target.hp -= tower.damage;
                console.log(`Swordsman at ${tower.pos} slashes enemy for ${tower.damage}`);
            } else if (target) {
                // Move swordsman toward enemy
                if (target.pos > tower.pos) tower.pos++;
                else if (target.pos < tower.pos) tower.pos--;
                console.log(`Swordsman runs to ${tower.pos} with sword drawn!`);
            }
        } else {
            // Default tower (old type)
            let target = game.enemies.find(e => Math.abs(e.pos - tower.pos) <= tower.range && e.hp > 0);
            if (target) {
                target.hp -= tower.damage;
                console.log('Tower at', tower.pos, 'hits enemy for', tower.damage);
            }
        }
    });
}

// Enemies move and damage base
function enemiesMove() {
    game.enemies.forEach(enemy => {
        if (enemy.hp > 0) {
            enemy.pos += enemy.speed;
            if (enemy.pos > 10) {
                game.health -= 10;
                enemy.hp = 0;
                console.log('Enemy reached base! Health:', game.health);
            }
        }
    });
}

// Game loop (super simple, no UI)
function gameTick() {
    towersAttack();
    enemiesMove();
    game.enemies = game.enemies.filter(e => e.hp > 0);
    if (game.enemies.length === 0) {
        game.wave++;
        game.money += 20;
        spawnWave();
    }
    if (game.health <= 0) {
        console.log('Game Over!');
        clearInterval(loop);
    }
}

// Card shop
const shop = {
    cards: [
        { name: 'Archer', cost: 15, type: 'tower', damage: 7, range: 3 },
        { name: 'Swordsman', cost: 10, type: 'tower', damage: 12, range: 1 },
    ],
    buy(cardName, pos) {
        const card = this.cards.find(c => c.name.toLowerCase() === cardName.toLowerCase());
        if (!card) {
            console.log('Card not found!');
            return;
        }
        if (game.money < card.cost) {
            console.log('Not enough money to buy', card.name);
            return;
        }
        if (card.type === 'tower') {
            game.towers.push({ pos, damage: card.damage, range: card.range, name: card.name });
            game.money -= card.cost;
            console.log(card.name, 'placed at', pos);
        }
    },
    list() {
        this.cards.forEach(c => {
            console.log(`${c.name}: $${c.cost} (Damage: ${c.damage}, Range: ${c.range})`);
        });
    }
};

// Start game
placeTower(3);
placeTower(7);
spawnWave();
const loop = setInterval(gameTick, 1000);
