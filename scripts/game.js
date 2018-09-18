var game = new Phaser.Game(400, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

var weapon = null;
var ship = null;
var cursors = null;
var fireButton = 0;
var enemies = null;
var enemySpawnTime = 3000
var time = 0;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function preload () {

    game.load.baseURL = 'http://localhost:3000'

    game.load.image('ship', '/assets/Solid_black.svg')
    game.load.image('bullet', '/assets/bullet.png')
    game.load.image('enemy', '/assets/enemy.png')

    game.stage.backgroundColor = "#F6DE6C";

}

function create () {

    ship = game.add.sprite(game.world.centerX, game.world.centerY, 'ship');
    enemies = game.add.physicsGroup(Phaser.Physics.ARCADE);

    game.world.setBounds(0,0,400,600)
    
    weapon = game.add.weapon(40, 'bullet')

    ship.anchor.setTo(0.5, 0.5)
    ship.scale.setTo(0.2, 0.2)

    game.physics.arcade.enable(ship);

    ship.body.collideWorldBounds = true

    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    weapon.bulletSpeed = 300;

    cursors = this.input.keyboard.createCursorKeys();
    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

}

function update () {

    ship.body.velocity.x = 0;
    ship.body.velocity.y = 0;

    var x = ship.x;
    var y = ship.y;

    if ( this.game.time.now > time && enemies.children.length < 5) {
        time = this.game.time.now + enemySpawnTime

        var enemy = enemies.create(getRandomInt(0, 400), getRandomInt(0, 10), 'enemy', this.game.time.now)

        game.physics.arcade.enable(enemy);

        enemy.body.collideWorldBounds = true
        enemy.body.velocity.x = getRandomInt(100, 350)
        enemy.body.velocity.y = getRandomInt(100, 350)
        enemy.body.bounce.setTo(1,1)

    }

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

    weapon.fireRate = 200;
    
}