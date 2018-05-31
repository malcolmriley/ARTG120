loc="start";
health=[100,100,100];
dead=0;

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
		// initializes physics and world
		game.stage.backgroundColor = '#f0f0f0';
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.world.setBounds(0, 0, 1920, 600);

		// Load sounds
		soundfx_door = game.add.audio("fx_door_creak");

		// creates a group to hold houses
		houses=game.add.group();
		// could be modified should we change viewpoint
		for(i=0;i<3;i++)
		{
			// spawns a row of houses
			house=houses.create(300*i+400,200,"house");
			house.scale.set(.25);
			// sets an id number to distinguish house for health and location
			house.num=i;
			// creates a health indicator for house
			house.hp=game.add.text(300*i+470,160,'health: '+health[i]);
		}

		// calls a function to create player sprite
		player=initPlayer();

		// enables physics bodies for all sprites
		game.physics.arcade.enable([player,houses]);

		// adds text to display deaths that moves with camera
		toll=game.add.text(10,10,"Deaths: "+dead);
		toll.fixedToCamera=true;

		// sets camera to follow player
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

		// checks if player inputs button when on house
		game.physics.arcade.overlap(player,houses,this.checkInput);
		// checks each house sprite and updates their properties
		houses.forEach(this.updateHouse,this);

		// updates death toll text
		toll.text="Deaths: "+dead;

		if(Math.random()<.1)
		{
			health[Math.floor(Math.random()*3)]-=1;
		}

		// ends the game when enough has died
		if(dead==3)
		{
			game.state.start('GameOver');
		}
	},

	checkInput: function(player,house)
	{
		// checks if player is interacting with houses
		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR))
		{
			// updates location based on house
			switch(house.num)
			{
				case 0:
					loc="house0";
					break;
				case 1:
					loc="house1";
					break;
				case 2:
					loc="house2";
					break;
			}
			// simple function to play sound and begin minigames
			goToInterior(house.num);
		}
	},

	updateHouse: function(house)
	{
		// if house is dead
		if(health[house.num]<1)
		{
			// disable interaction and remove text
			house.body.enable=false;
			house.hp.text='';
			// increases death count when health hits 0
			if(health[house.num]==0)
			{
				dead++;
				// sets health to negative so dead doesn't increase for multiple ticks
				health[house.num]=-1;	
			}
		}
		else
		{
			// otherwise, update health text
			house.hp.text='health: '+health[house.num];
		}
	},

	render: function()
	{
		game.debug.body(player);
		game.debug.physicsGroup(houses);
	}
}

function initPlayer()
{
	// spawns player depending on previous location
	switch(loc)
	{
		case "start":
			instance=game.add.sprite(100,250,"character");
			break;
		case "house0":
			instance=game.add.sprite(475,250,"character");
			break;
		case "house1":
			instance=game.add.sprite(775,250,"character");
			break;
		case "house2":
			instance=game.add.sprite(1075,250,"character");
			break;
	}
	instance.scale.set(.1);
	instance.anchor.set(.5,0);
	return instance;
}

function goToInterior(num) {
	soundfx_door.play();
	game.state.start('MiniGame',true,false,num);
}
