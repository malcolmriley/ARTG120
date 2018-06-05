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
		//game.world.setBounds(0, 0, 1920, 600);
		game.stage.backgroundColor = '#f0f0f0';

		// Load sounds
		soundfx_door = game.add.audio("fx_door_creak");

		// Create Player
		this.player = initPlayer();


		// Create House Grid
		group_houses = game.add.group();
		/*
		let startX = 200;
		let startY = 30;
		for(let row = 0; row < 3; row += 1) {
			for (let column = 0; column < 3; column += 1) {
				let house = group_houses.create(0, 0, "house");
				scaleDown(house, this); // Set initial sprite scaling
				house.x = startX + row * (10 + house.width);
				house.y = startY + column * (10 + house.width);
				makeButton(house, this, goToInterior, scaleUp, scaleDown);
			}
		}*/

		makeHouse(group_houses);

		// Create Text Overlay
		game.add.text(0, 0, "Town \n Click to enter house.");

		// Make cursors for player control
		this.cursors = game.input.keyboard.createCursorKeys();
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
			//player.scale.set(-.1,.1);
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.D))
		{
			this.player.x += 5;
			//player.scale.set(.1);
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.W))
		{
			this.player.y -= 5;
			//player.scale.set(-.1,.1);
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.S))
		{
			this.player.y += 5;
			//player.scale.set(.1);
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
	instance.scale.setTo(0.1, 0.1);
	instance.enableBody = true;
	instance.body.collideWorldBounds=true;
	return instance;
}

function makeHouse(group)
{
	let house = new House(game, "house", this.player, 100);
	game.add.existing(house);
	group.add(house);
}

function scaleUp(passedSprite, passedReference) {
	passedSprite.scale.setTo(0.185, 0.185);
}

function scaleDown(passedSprite) {
	passedSprite.scale.setTo(0.15, 0.15)
}

function goToInterior() {
	soundfx_door.play();
	// TODO: Transition to other minigames as well
	game.state.start("Minigame_Wound");
}

function House(game, key, player, health)
{
	Phaser.Sprite.call(this, game, (game.rnd.integerInRange(64, game.width - 64)), (game.rnd.integerInRange(64, game.height - 64)), key);

	this.anchor.set(0.5);
	
	game.physics.enable(this);
	this.body.collideWorldBounds = true;

	scaleDown(this);

	this.hp = game.add.text(this.x, (this.y - (this.width / 2) - 20),'Health: ' + health);
}

House.prototype = Object.create(Phaser.Sprite.prototype);
House.prototype.constructor = House;