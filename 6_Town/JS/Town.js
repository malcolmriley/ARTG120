var town = [
	[0, 0, 0, 0, 0, 0, 0],
	[0, 1, 2, 1, 2, 1, 0],
	[0, 2, 2, 2, 2, 2, 0],
	[0, 1, 2, 1, 2, 1, 0],
	[0, 2, 2, 2, 2, 2, 0],
	[0, 1, 2, 1, 2, 1, 0],
	[0, 0, 0, 0, 0, 0, 0]
];
var Town = function(game) {};
Town.prototype =
{
	preload: function()
	{
		// TODO: Swap for atlas version.
		game.load.image("character", "../_Assets/images/character.png");
		game.load.image("house", "../_Assets/images/house.png");

		// Load door open sound
		game.load.audio("fx_door_creak", "../_Assets/sounds/door_open.wav");
	},

	create: function()
	{

		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.stage.backgroundColor = '#f0f0f0';

		// Load sounds
		soundfx_door = game.add.audio("fx_door_creak");

		// Create Player
		this.player = initPlayer();
		//scaleDown(this.player);

		var width = game.cache.getImage("house").width;
		width = Math.ceil(width * .10);
		var height = game.cache.getImage("house").height;
		height = Math.ceil(height * .10);

		// Create House Grid
		//this.group_houses = game.add.group();
		this.group_houses = game.add.group();

		//makeHouse(group_houses);
		for(var i = 0; i < town.length; i++)
		{
			var row = town[i];
			for(var j = 0; j < row.length; j++)
			{
				if(town[i][j] == 1)
				{
					makeHouse(this.group_houses, height, width, i, j, this.player);
				}
			}
		}

		game.world.sendToBack(this.group_houses);
		game.physics.arcade.enable(this.group_houses);
		// Create Text Overlay
		game.add.text(0, 0, "Town \n Click to enter house.");
	},

	update: function()
	{
		// TODO: Better movement system. Right now, left takes precedence over right, and up over down
		// Also, velocity is preserved in a really dumb way (doesn't reset until ALL keys are released)
		// For now, the Swensen Bubblegum and Shoestring Method will have to do.
		let playerSpeed = 150;
		if(game.input.keyboard.isDown(Phaser.Keyboard.A))
		{
			this.player.x -= 5;
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.D))
		{
			this.player.x += 5;
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.W))
		{
			this.player.y -= 5;
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.S))
		{
			this.player.y += 5;
		}
		else {
			this.player.body.velocity.x = 0;
			this.player.body.velocity.y = 0;
		}
	}
	// TODO: Enable travel to individual house
	// House is a "button" right now for the simple fact of testing the functionality thereof.
	// More likely, for the final implementation, the player will use some other control for entering an individual house.
}

function initPlayer() {
	let instance = game.add.sprite(0, 0, "character");
  	game.physics.arcade.enable(instance);
	instance.scale.setTo(0.05, 0.05);
	instance.enableBody = true;
	instance.body.collideWorldBounds=true;
	return instance;
}

function makeHouse(group, height, width, i, j, player)
{
	let house = new House(game, "house", player, 100, height, width, i, j);
	game.add.existing(house);
	group.add(house);
}

function scaleUp(passedSprite, passedReference) {
	passedSprite.scale.setTo(0.185, 0.185);
}

function scaleDown(passedSprite) {
	passedSprite.scale.setTo(0.10, 0.10)
}

function goToInterior() {
	soundfx_door.play();
	// TODO: Transition to other minigames as well
	game.state.start("Minigame_Wound");
}

function House(game, key, player, health, height, width, i, j)
{
	Phaser.Sprite.call(this, game, j * width, i * height, key);

	this.anchor.set(0.5);
	
	game.physics.enable(this);
	this.body.collideWorldBounds = true;
	this.enableBody = true;

	this.player = player;


	scaleDown(this);

	this.hp = game.add.text(this.x, (this.y - (this.width / 2) - 20),'Health: ' + health, {font: "20px"});
}

House.prototype = Object.create(Phaser.Sprite.prototype);
House.prototype.constructor = House;

House.prototype.update = function()
{
	if(game.physics.arcade.overlap(this, this.player))
	{
			this.scale.setTo(.2);
			if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR))
			{
				console.log("Change states here");
			}
	}
	else
	{
		scaleDown(this);
	}
}