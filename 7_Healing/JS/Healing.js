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
		// enables physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.cuts=game.add.group()
		this.cuts.enableBody=true;
		for(i=0;i<5;i++)
		{
			this.blank=this.cuts.create(600,100*i,"X");
			this.blank.scale.set(.1,.1);	
		}

		this.flowers=game.add.group();
		this.flowers.enableBody=true;
		for(i=0;i<5;i++)
		{
			this.flower=this.flowers.create(0,300,"flower");
			this.flower.scale.set(.1,.1);
			this.flower.inputEnabled=true;
			this.flower.input.enableDrag();
		}

		this.add.text(0, 0, "MiniGame \n ENTER: GameOver \n SPACE: Town");
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

		this.game.physics.arcade.overlap(this.flowers,this.cuts,this.remove);

		if(timer<0)
		{
			this.sound.stopAll();
			this.state.start('GameOver');
		}

		if(this.input.keyboard.isDown(Phaser.Keyboard.ENTER))
		{
			this.sound.stopAll();
			this.state.start('GameOver');
		}
		else if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			this.sound.stopAll();
			this.state.start('Town');
		}
	},

	// function that executes when player lets go of flower
	remove: function(current,end)
	{
		current.kill();
		end.kill();
	}
}
