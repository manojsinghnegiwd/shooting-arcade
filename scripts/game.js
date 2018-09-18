var game = new Phaser.Game(400, 600, Phaser.CANVAS, 'shooter', { preload: preload, create: create, update: update });

var weapon = null;
var ship = null;
var cursors = null;
var fireButton = null;
var enemies = null;
var enemySpawnTime = 1000
var time = 0;
var emitter = null;
var scoreText = null;
var score = '';
var winScore = 20;
var button = null;
var game_running = false;

function newGame () {
    enemySpawnTime = 1000
    time = 0;
    score = 0;
    winScore = 20;

    game.paused = false

    button.visible = false
    game_running = true

    if (ship) {
        ship.destroy()
    }

    ship = game.add.sprite(game.world.centerX, game.world.centerY, 'ship');

    if ( enemies ) {
        enemies.forEach(function (enemy) { enemy.kill() })
    }

    enemies = game.add.physicsGroup(Phaser.Physics.ARCADE);

    ship.anchor.setTo(0.5, 0.5)
    ship.scale.setTo(0.2, 0.2)

    game.physics.arcade.enable(ship);
    ship.body.collideWorldBounds = true

    scoreText.text = score

    game.stage.backgroundColor = "#F6DE6C";
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function preload () {

    game.load.baseURL = 'http://localhost:3000'

    game.load.image('ship', '/assets/Solid_black.svg')
    game.load.image('bullet', '/assets/bullet.png')
    game.load.image('enemy', '/assets/enemy.png')
    game.load.image('new_game', '/assets/new-game.png')

    game.stage.backgroundColor = "#F6DE6C";

}

function create () {

    game.world.setBounds(0,0,400,600)
    
    weapon = game.add.weapon(40, 'bullet')

    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    weapon.bulletSpeed = 300;

    cursors = this.input.keyboard.createCursorKeys();
    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    emitter = game.add.emitter(0, 0, 100);
    emitter.makeParticles('ship');

    emitter.gravity = 200;

    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

    scoreText = game.add.text(0, 0, score, style);
    scoreText.setTextBounds(0, 0, 400, 100);

    button = game.add.button(game.world.centerX, game.world.centerY, 'new_game', newGame, this);
    button.anchor.setTo(0.5, 0.5)

}

function particleBurst(ship) {

    //  Position the emitter where the mouse/touch event was
    emitter.x = ship.x;
    emitter.y = ship.y;

    //  The first parameter sets the effect to "explode" which means all particles are emitted at once
    //  The second gives each particle a 2000ms lifespan
    //  The third is ignored when using burst/explode mode
    //  The final parameter (10) is how many particles will be emitted in this single burst
    emitter.start(true, 2000, null, 15);

}


function update () {

    if ( game_running ) {
        if ( score >= winScore ) {
            scoreText.text = 'You Won!!!'
    
            game_running = false
    
            button.visible = true

            ship.body.velocity.y = 0;
            ship.body.velocity.x = 0;

            game.stage.backgroundColor = "#56ff72";
        }
    
        if (ship && ship.body && ship.alive) {
            ship.body.velocity.x = 0;
            ship.body.velocity.y = 0;
    
            var x = ship.x;
            var y = ship.y;
    
            if (cursors.left.isDown) {
                ship.body.velocity.x = -200
            }
        
            if (cursors.right.isDown) {
                ship.body.velocity.x = 200
            }
        
            if (cursors.up.isDown) {
                ship.body.velocity.y = -200
            }
        
            if (cursors.down.isDown) {
                ship.body.velocity.y = 200
            }
        
            if (fireButton.isDown) {
                weapon.fireButton = 0;
                weapon.fire({ x: x, y: y })
            }
        
            weapon.fireRate = 100;
        
            this.physics.arcade.overlap(weapon.bullets, enemies, killEnemies, null, this)
            this.physics.arcade.overlap(ship, enemies, killShip, null, this)
        }
    
        if ( this.game.time.now > time && enemies.children.length < 8 && score < winScore) {
            time = this.game.time.now + enemySpawnTime
    
            var randomX = getRandomInt(0, 400)
            var rangeStartY = 0
            var rangeEndY = 600
    
            if ( randomX > 50 && randomX < 350 ) {
    
                var randomDirection = getRandomInt(0, 1)
    
                if ( randomDirection == 0 ) {
                    rangeEndY = 100
                }
    
                if ( randomDirection == 1 ) {
                    rangeStartY = 500
                }
    
            }
    
            var enemy = enemies.create(randomX, getRandomInt(rangeStartY, rangeEndY), 'enemy', this.game.time.now)
    
            game.physics.arcade.enable(enemy);
    
            enemy.body.collideWorldBounds = true
            enemy.body.velocity.x = getRandomInt(200, 250)
            enemy.body.velocity.y = getRandomInt(200, 250)
            enemy.body.bounce.setTo(1,1)
    
        }
    }

}

function killEnemies (bullet, enemy) {
    enemies.remove(enemy, true)
    emitter.minParticleScale = 0.025;
    emitter.maxParticleScale = 0.025;
    particleBurst(enemy)
    score++
    scoreText.text = score
}

function killShip (ship, enemy) {
    emitter.minParticleScale = 0.05;
    emitter.maxParticleScale = 0.05;
    particleBurst(ship)
    ship.kill()
    scoreText.text = 'You lost!!!'

    game.stage.backgroundColor = "#ff6d6d";

    button.visible = true
}