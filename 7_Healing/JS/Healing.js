var MiniGame = function(game) {};
MiniGame.prototype =
{
	preload: function()
	{
		// loads images
		this.load.path='../_Assets/images/';
		this.load.image("X", "X.png");
		this.load.image('flower','flower_1.png');

		//load sound
		this.load.path = '../_Assets/sounds/';
		this.load.audio('background', ['Midnightcem.ogg', "Midnightcem.wav"]);
	},

	create: function()
	{
		// enables physics system
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		// creates group of 'cuts' and enable physics
		// change images to some kind of wound
		// change bounding box to be smaller
		// random spawn locations?
		this.cuts=game.add.group()
		this.cuts.enableBody=true;
		for(i=0;i<5;i++)
		{
			this.blank=this.cuts.create(600,100*i,"X");
			this.blank.scale.set(.1,.1);
			// change bounding box to be smaller and slightly centered
			this.blank.body.setSize(100,100,200,250);	
		}

		// creates group of flowers and enable physics
		// should be bandages or something
		this.flowers=game.add.group();
		this.flowers.enableBody=true;
		for(i=0;i<5;i++)
		{
			this.flower=this.flowers.create(0,300,"flower");
			this.flower.scale.set(.1,.1);
			// allows flower to be draggable
			this.flower.inputEnabled=true;
			this.flower.input.enableDrag();
		}

		this.add.text(0, 0, "Drag flowers to Xs.");
		this.stage.backgroundColor = '#ffffff';
		music_background = this.add.audio('background');
		music_background.play();

		// local timer variable and prints
		timer=10;
		timerText=this.add.text(400, 20, 'Time left : '+timer);
	},

	update: function()
	{
		// updates timer
		timer-=1/60;
		timerText.text='Time left: '+timer.toFixed(2);

		// checks for overlap between groups
		this.game.physics.arcade.overlap(this.flowers,this.cuts,this.remove);

		// goes to game over screen when time runs out
		if(timer<0)
		{
			this.sound.stopAll();
			this.state.start('GameOver');
		}

		// goes back to town if cured
		if(this.cuts.countLiving()==0)
		{
			this.sound.stopAll();
			this.state.start('Town');
		}
	},

	// removes sprites when they touch
	remove: function(sprite1,sprite2)
	{
		sprite1.kill();
		sprite2.kill();
	}
}
