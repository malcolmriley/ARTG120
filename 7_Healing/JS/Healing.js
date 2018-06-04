diff=0;

var MiniGame = function(game) {};
MiniGame.prototype =
{
	init: function(x)
	{
		num=x;
	},
	preload: function()
	{
		// loads images
		this.load.path='../_Assets/images/';
		this.load.image("X", "Misc/X.png");
		this.load.image('flower','Flowers/flower_1.png');

		//load sound
		this.load.path = '../_Assets/sounds/';
		this.load.audio('background', ['BackgroundMusic/Midnightcem.ogg', "BackgroundMusic/Midnightcem.wav"]);
	},

	create: function()
	{
		// enables physics system
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		// creates group of 'cuts' and enable physics
		// change images to some kind of wound
		this.cuts=game.add.group()
		this.cuts.enableBody=true;
		for(i=0;i<diff+5;i++)
		{
			// creates cuts randomly within an area
			this.blank=this.cuts.create(Math.random()*500+100,Math.random()*400+50,"X");
			this.blank.scale.set(.1,.1);
			// change bounding box to be smaller and slightly centered
			this.blank.body.setSize(100,100,200,250);	
		}

		// creates group of flowers and enable physics
		// should be bandages or something
		this.flowers=game.add.group();
		this.flowers.enableBody=true;
		for(i=0;i<diff+5;i++)
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

		// checks for overlap between groups and calls functions
		this.game.physics.arcade.overlap(this.flowers,this.cuts,this.remove);

		// goes back to town when time runs out
		if(timer<0)
		{
			diff--;
			health[num]-=Math.floor(Math.random()*10)+10;
			// add to dead if happen to fail during minigame
			if(health[num]<1)
			{
				dead++;	
			}
			this.sound.stopAll();
			this.state.start('Town');
		}

		// goes back to town when minigame is completed
		if(this.cuts.countLiving()==0)
		{
			Math.random()>.7 ? diff+=2 : diff++;
			health[num]+=Math.floor(Math.random()*10)+5;
			// set a cap for mamximum health
			if(health[num]>100)
			{
				health[num]=100;
			}
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