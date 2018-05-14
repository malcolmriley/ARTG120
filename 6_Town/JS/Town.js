var Town = function(game) {};
Town.prototype =
{
	preload: function()
	{
		// TODO: Swap for atlas version.
		game.load.image("character", "../_Assets/images/character.png");
		game.load.image("house", "../_Assets/images/house.png");
	},

	create: function()
	{
		game.stage.backgroundColor = '#f0f0f0';

		// Create House Grid
		group_houses = game.add.group();
		let startX = 200;
		let startY = 30;
		for(let row = 0; row < 3; row += 1) {
			for (let column = 0; column < 3; column += 1) {
				var house = initHouse();
			}
		}

		// Create Player
		player = initPlayer();

		// Create Text Overlay
		game.add.text(0, 0, "Town \n Click to enter house.");

		// Make cursors for player control
		cursors = game.input.keyboard.createCursorKeys();
	},

	update: function()
	{
		// TODO: Better movement system. Right now, left takes precedence over right, and up over down
		let playerSpeed = 5;
		if (cursors.left.isDown) {
			player.body.velocity.x = -playerSpeed;
		}
		else if (cursors.right.isDown) {
				player.body.velocity.x = playerSpeed;
		}
		else if (cursors.up.isDown) {
			player.body.velocity.y = -playerSpeed;
		}
		else if (cursors.down.isDown) {
				player.body.velocity.y = playerSpeed;
		}
		else {
			player.body.velocity.x = 0;
			player.body.velocity.y = 0;
		}
	}
}

function initHouse(passedGroup) {
	let instance = passedGroup.create(0, 0, "house");
	instance.scale.setTo(0.15, 0.15);
	instance.x = startX + row * (10 + house.width);
	instance.y = startY + column * (10 + house.width);
	makeButton(instance, this, goToInterior);
}

function initPlayer() {
	let instance = game.add.sprite(0, 0, "character");
  game.physics.arcade.enable(instance);
	instance.scale.setTo(0.1, 0.1);
	instance.enableBody = true;
	instance.body.collideWorldBounds=true;
	return instance;
}

function goToInterior() {
	game.state.start('MiniGame');
}
