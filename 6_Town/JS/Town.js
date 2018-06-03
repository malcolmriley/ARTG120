var world = [
	[0, 0, 0, 0, 0, 0, 0],
	[0, 2, 2, 2, 2, 2, 0],
	[0, 1, 2, 1, 2, 1, 0],
	[0, 2, 2, 2, 2, 2, 0],
	[0, 1, 2, 1, 2, 1, 0],
	[0, 2, 2, 2, 2, 2, 0],
	[0, 1, 2, 1, 2, 1, 0],
	[0, 2, 2, 2, 2, 2, 0],
	[0, 0, 0, 0, 0, 0, 0]
]; 

var Town = function(game) {};
Town.prototype =
{
	preload: function()
	{
		// TODO: Swap for atlas version.
		game.load.image("character", "../_Assets/images/Character/character.png");
		game.load.image("house", "../_Assets/images/Houses/house.png");

		// Load door open sound
		game.load.audio("fx_door_creak", "../_Assets/sounds/SFX/door_open.wav");
	},

	create: function()
	{
		game.stage.backgroundColor = '#f0f0f0';
		this.house = game.sprite.add("House");

		// Load sounds
		soundfx_door = game.add.audio("fx_door_creak");

		// Create House Grid
		//group_houses = game.add.group();
		var xOffset = 200;
		var yOffset = 30;
		for(var i in world) 
		{
			for(var j in i) {
				if(world[i][j] == 1)
				{
					let house = House(game, "house", xOffset, yOffset, i, j);
					makeButton(house, this, goToInterior, scaleUp, scaleDown);
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

function scaleUp(passedSprite, passedReference) {
	passedSprite.scale.setTo(0.185, 0.185);
}

function scaleDown(passedSprite, passedReference) {
	passedSprite.scale.setTo(0.15, 0.15)
}

function goToInterior() {
	soundfx_door.play();
	game.state.start('MiniGame');
}

function placePiece(sprite, x, y)
{

}

function House(game, key, xOffset, yOffset, i, j)
{
	var xPos = xOffset + (j * house.width);
	var yPos = yOffset + (i * house.length);
	Phaser.Sprite.call(this, game, xPos, yPos, key);

	this.anchor.set(0.5);
	scaleDown(this);

	game.physics.eanable(this);
	this.body.collideWorldBounds = true;
}

House.prototype = Object.create(Phaser.Sprite.prototype);
House.prototype.constructor = House;