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
		game.stage.backgroundColor = '#f0f0f0';
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.world.setBounds(0, 0, 1920, 600);

		// Load sounds
		soundfx_door = game.add.audio("fx_door_creak");

		houses=game.add.group();
		for(i=0;i<3;i++)
		{
			house=houses.create(300*i+400,200,"house");
			house.scale.set(.25);
			house.hp=Math.random()*100;
		}

		player=game.add.sprite(100,250,"character");
		player.scale.set(.1);
		player.anchor.set(.5,0);
		game.physics.arcade.enable([player,houses]);

		game.camera.follow(player);
		game.camera.deadzone=new Phaser.Rectangle(300,100,200,5);
	},

	update: function()
	{
		if(game.input.keyboard.isDown(Phaser.Keyboard.A))
		{
			player.x -= 5;
			player.scale.set(-.1,.1);
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.D))
		{
			player.x += 5;
			player.scale.set(.1);
		}
		game.physics.arcade.overlap(player,houses,this.checkInput);
	},

	checkInput: function(player,house)
	{
		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR))
		{
			console.log(house.hp);
			goToInterior();
		}
	},

	render: function()
	{
		game.debug.body(player);
		game.debug.physicsGroup(houses);
	}
}


function goToInterior() {
	soundfx_door.play();
	game.state.start('MiniGame');
}
