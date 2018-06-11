var town = [
	[0, 0, 0, 0, 0, 0, 0],
	[0, 1, 2, 1, 2, 1, 0],
	[0, 2, 2, 2, 2, 2, 0],
	[0, 1, 2, 1, 2, 1, 0],
	[0, 2, 2, 2, 2, 2, 0],
	[0, 1, 2, 1, 2, 1, 0],
	[0, 0, 0, 0, 0, 0, 0]
];

var lostHouses = 0;
var listMinigame = false;
var Town = function(game) {};
Town.prototype =
{
	preload: function()
	{

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
		player = initPlayer();

		/*grab the width and height of the house image to
		use for positioning houses in a grid, round numbers*/
		var width = game.cache.getImage("house").width;
		width = Math.ceil(width * .5);
		var height = game.cache.getImage("house").height;
		height = Math.ceil(height * .3);

		//House group
		group_houses = game.add.group();

		/*This right here reads in the array and creates an evenly
		spaced grid for houses*/
		for(var i = 0; i < town.length; i++)
		{
			var row = town[i];
			for(var j = 0; j < row.length; j++)
			{
				if(town[i][j] == 1)
				{
					makeHouse(group_houses, height, width, i, j, player);
				}
			}
		}

		//send the houses to back b/c they appear above player
		game.world.sendToBack(group_houses);
		//give the houses group physics
		game.physics.arcade.enable(group_houses);
		// Create Text Overlay
		//game.add.text(0, 0, "Town \n Click to enter house.");
	},

	update: function()
	{
		//player movement
		if(game.input.keyboard.isDown(Phaser.Keyboard.A))
		{
			player.x -= 5;
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.D))
		{
			player.x += 5;
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.W))
		{
			player.y -= 5;
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.S))
		{
			player.y += 5;
		}
		else {
			player.body.velocity.x = 0;
			player.body.velocity.y = 0;
		}
	}
//,render:function(){game.debug.body(this.player);game.debug.physicsGroup(group_houses);}
}

//boilerplate for initializing a player
function initPlayer() {
	let instance = game.add.sprite(0, 0, "character");
  	game.physics.arcade.enable(instance);
	instance.scale.setTo(1);
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
	passedSprite.scale.setTo(.6);
}

//a function to scale down a sprite
function scaleDown(passedSprite) {
	passedSprite.scale.setTo(.4);
}

//Ahhhh yes the house prefab. No prefab folders because this is actually the only one so I just left it in here
function House(game, key, player, height, width, i, j)
{
	Phaser.Sprite.call(this, game, j * width, i * height, key);

	this.anchor.set(0.5);

	game.physics.arcade.enable(this, this.player);
	//this.body.collideWorldBounds = true;
	this.body.enable = true;
	//this.body.immovable = true;

	this.maxHealth = 100;
	this.health = game.rnd.integerInRange(50, 70);
	this.takeDamage = game.rnd.integerInRange(2, 5);
	this.alive = true;

	this.player = player;
	this.enter = false;

	//death clock, every 3 seconds damage function is called
	this.timer = game.time.create(false);
	this.timer.loop(3000, damage, this);
	this.timer.start();

	scaleDown(this);

	this.hp = game.add.text(this.x, (this.y - (this.width / 2) - 20),'Health: ' + this.health, {font: "20px"});
}

function goToInterior(something) {
	soundfx_door.play();
	// TODO: Transition to other minigames as well
	group_houses.visible=false;
	group_houses.forEach(function(house){house.hp.visible=false;},this);
	player.visible=false;
	game.state.start(choose("Minigame_Alchemy", "Minigame_Wound"),false,false,something);
}

House.prototype = Object.create(Phaser.Sprite.prototype);
House.prototype.constructor = House;

House.prototype.update = function()
{
	//updates text
	this.hp.setText('Health: ' + this.health, {font: "20px"});

	//check for overlap and if house is alive scale up for funsies, and enter house to play minigame
	if(game.physics.arcade.overlap(this, this.player) && this.alive == true)
	{
			this.scale.setTo(.6);
			if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR))
			{
				this.enter = true;
        goToInterior(group_houses);
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
		lostHouses++;
	}
}

//gradual damage to house, once it dies kill its timer
var damage = function()
{
	this.health -= this.takeDamage;
	if(this.health <= 0)
	{
		this.alive = false;
		this.timer.destroy();
		this.health = 0;
	}
}
