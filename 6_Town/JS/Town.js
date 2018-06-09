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
		//as always, phyics
		game.physics.startSystem(Phaser.Physics.ARCADE);
		//temp background
		game.stage.backgroundColor = '#f0f0f0';

		// Load sounds
		soundfx_door = game.add.audio("fx_door_creak");

		// Create Player
		this.player = initPlayer();

		/*grab the width and height of the house image to
		use for positioning houses in a grid, round numbers*/
		var width = game.cache.getImage("house").width;
		width = Math.ceil(width * .10);
		var height = game.cache.getImage("house").height;
		height = Math.ceil(height * .10);

		//House group
		this.group_houses = game.add.group();

		/*This right here reads in the array and creates an evenly 
		spaced grid for houses*/
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

		//send the houses to back b/c they appear above player
		game.world.sendToBack(this.group_houses);
		//give the houses group physics
		game.physics.arcade.enable(this.group_houses);
		// Create Text Overlay
		game.add.text(0, 0, "Town \n Click to enter house.");
	},

	update: function()
	{
		//player movement
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

//boilerplate for initializing a player
function initPlayer() {
	let instance = game.add.sprite(0, 0, "character");
  	game.physics.arcade.enable(instance);
	instance.scale.setTo(0.05, 0.05);
	instance.body.enable = true;
	instance.body.collideWorldBounds=true;
	return instance;
}

//this creates a house by calling the House prefab and adding it to house group
function makeHouse(group, height, width, i, j, player)
{
	let house = new House(game, "house", player, height, width, i, j);
	game.add.existing(house);
	group.add(house);
}

//a function to scale up a sprite
function scaleUp(passedSprite, passedReference) {
	passedSprite.scale.setTo(0.185, 0.185);
}

//a function to scale down a sprite
function scaleDown(passedSprite) {
	passedSprite.scale.setTo(0.10, 0.10)
}

/* NOTE TO SELF: Make the scale functions more universal by allowing them to take in
ant sclae factor. But also this can easily be done in one like, I don't know why we need these functions
but I'm using them anyways so I guess I'll keep them for now
*/

/**This is supposed to be the function for entering a house
 * but I don't think there is much of a use for it because this is now being handeled in the 
 * House prefab update (but it can also be handeled in the main update; I guess whereever it 
 * will be more convenient in the end)
 */
function goToInterior() {
	soundfx_door.play();
	// TODO: Transition to other minigames as well
	game.state.start("Minigame_Wound");
}

//Ahhhh yes the house prefab. No prefab folders because this is actually the only one so I just left it in here
function House(game, key, player, height, width, i, j)
{
	Phaser.Sprite.call(this, game, j * width, i * height, key);

	this.anchor.set(0.5);
	
	game.physics.arcade.enable(this, this.player);
	this.body.collideWorldBounds = true;
	this.body.enable = true;
	this.body.immovable = true;

	this.maxHealth = 100;
	this.health = 70;
	this.takeDamage = game.rnd.integerInRange(2, 5);
	this.alive = true;

	this.player = player;
	this.enter = false;

	scaleDown(this);

	this.hp = game.add.text(this.x, (this.y - (this.width / 2) - 20),'Health: ' + this.health, {font: "20px"});
}

House.prototype = Object.create(Phaser.Sprite.prototype);
House.prototype.constructor = House;

House.prototype.create = function()
{
	this.timer = game.time.create(false);
	this.timer.loop(5000, damage, this);
	this.timer.start();
}

House.prototype.update = function()
{
	//constantly kill and recreate HP text
	this.hp.kill();
	this.hp = game.add.text(this.x, (this.y - (this.width / 2) - 20),'Health: ' + this.health, {font: "20px"});

	console.log(this.timer);
	console.log(this.health);

	//check for overlap and if house is alive scale up for funsies, and enter house to play minigame
	if(game.physics.arcade.overlap(this, this.player) && this.alive == true)
	{
			this.scale.setTo(.15);
			if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR))
			{
				console.log("Change states here");
				this.enter = true;
			}

	}
	//scale down when no overlap
	else
	{
		scaleDown(this);
	}

	//if house was entered and is no longer alive disable the physics body
	if(this.enter == true && this.alive == false)
	{
		this.body.enable = false;
	}
}

House.prototype.damage = function()
{
	this.health -= this.takeDamage;
	if(this.health <= 0)
	{
		this.alive = false;
	}
}