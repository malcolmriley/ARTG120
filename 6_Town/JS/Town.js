health=[[100,100,100],[100,100,100],[100,100,100]];
dead=0;

var Town = function(game) {};
Town.prototype =
{
	preload: function()
	{

	},

	create: function()
	{
		// initializes physics and world
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Load sounds
		soundfx_door = game.add.audio("fx_door_creak");

		//Houses group
		houses=game.add.group();

		for(i=0;i<health.length;i++)
		{
			for(j=0;j<health[i].length;j++)
			{
				house=houses.create(250*i+150,200*j+40,"house");
				house.scale.set(.5);
				house.row=i;
				house.col=j;
				house.hp=game.add.text(250*i+150,200*j+20,'health: '+health[i][j]);
			}
		}

		// Create Player
		player=initPlayer();

		// enables physics bodies for all sprites
		game.physics.arcade.enable([player,houses]);

		createBackdrop(this, "backdrop");
	},

	update: function()
	{
		//player movement
		if(game.input.keyboard.isDown(Phaser.Keyboard.A))
		{
			player.x-=5;
			player.scale.set(-1,1);
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.D))
		{
			player.x+=5;
			player.scale.set(1);
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.W))
		{
			player.y-=5;
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.S))
		{
			player.y+=5;
		}

		// checks if player inputs button when on house
		game.physics.arcade.overlap(player,houses,this.checkInput);
		// checks each house sprite and updates their properties
		houses.forEach(this.updateHouse,this);

		if(Math.random()<.2)
		{
			health[Math.floor(Math.random()*3)][Math.floor(Math.random()*3)]-=1;
		}

		// ends the game when enough has died
		if(dead==5)
		{
			game.state.start('GameOver');
		}

	},

	checkInput: function(player,house)
	{
		// checks if player is interacting with houses
		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR))
		{
			// simple function to play sound and begin minigames
			goToInterior(house.row,house.col);
		}
	},

	updateHouse: function(house)
	{
		// if house is dead
		if(health[house.row][house.col]<1)
		{
			// disable interaction and remove text
			house.body.enable=false;
			house.hp.text='';
			// increases death count when health hits 0
			if(health[house.row][house.col]==0)
			{
				dead++;
				// sets health to negative so dead doesn't increase for multiple ticks
				health[house.row][house.col]=-1;	
			}
		}
		else
		{
			// otherwise, update health text
			house.hp.text='health: '+health[house.row][house.col];
		}
},
//,render:function(){game.debug.body(this.player);game.debug.physicsGroup(group_houses);}
}

//boilerplate for initializing a player
function initPlayer() {
	instance=game.add.sprite(50,250,"character");
	instance.anchor.set(.5,0);
	return instance;
}

//a function to scale up a sprite
function scaleUp(passedSprite, passedReference) {
	passedSprite.scale.setTo(.6);
}

//a function to scale down a sprite
function scaleDown(passedSprite) {
	passedSprite.scale.setTo(.4);
}

//this.hp = game.add.text(this.x, (this.y - (this.width / 2) - 20),'Health: ' + this.health, {font: "20px"})

function goToInterior(row,col) {
	soundfx_door.play();
	game.state.start(choose("Minigame_Alchemy", "Minigame_Wound"),true,false,row,col);
}
