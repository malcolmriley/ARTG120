loc="start";
health=[100,100,100];

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
			house.num=i;
			house.hp=game.add.text(300*i+470,160,'health: '+health[i]);
		}

		player=initPlayer();
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

		houses.forEach(this.updateHouse,this);

		if(Math.random()<.1)
		{
			health[Math.floor(Math.random()*3)]-=1;
		}
	},

	checkInput: function(player,house)
	{
		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR))
		{
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
			goToInterior();
		}
	},

	updateHouse: function(house)
	{
		if(health[house.num]<1)
		{
			house.body.enable=false;
			house.hp.text='';
		}
		else
		{
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

function goToInterior() {
	soundfx_door.play();
	game.state.start('MiniGame');
}
