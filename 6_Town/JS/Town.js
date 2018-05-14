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
				let house = group_houses.create(0, 0, "house");
				house.scale.setTo(0.15, 0.15);
				house.x = startX + row * (10 + house.width);
				house.y = startY + column * (10 + house.width);
				makeButton(house, this, goToInterior);
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
		// Also, velocity is preserved in a really dumb way (doesn't reset until ALL keys are released)
		// For now, the Swensen Bubblegum and Shoestring Method will have to do.
		let playerSpeed = 150;
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

	// TODO: Enable travel to individual house
	// House is a "button" right now for the simple fact of testing the functionality thereof.
	// More likely, for the final implementation, the player will use some other control for entering an individual house.
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
