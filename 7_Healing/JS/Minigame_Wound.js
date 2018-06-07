diff=0;

var Minigame_Wound = function(game) {};
Minigame_Wound.prototype =
{
	preload: function()
	{
		
	},

	create: function()
	{
		// enables physics system
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		// creates an array to hold different images
		select=["wound0","wound1","wound2","wound3"];

		// creates group of 'wounds' and enable physics
		wound=game.add.group()
		wound.enableBody=true;
		for(i=0;i<diff+5;i++)
		{

			cut=wound.create(Math.random()*600+150,Math.random()*500+75,select[Math.floor(Math.random()*4)]);
			cut.anchor.set(.5,.5);
			cut.angle=Math.random()*360;
			cut.scale.set(.3);
			// change bounding box to be small and centered
			cut.body.setSize(10,10,150,50);
		}

		// create a mortar and pestle
		mortar=game.add.sprite(50,500,"bowl");
		mortar.scale.set(.2);
		pestle=game.add.sprite(40,490,"pestle");
		pestle.scale.set(.2);
		pestle.angle=-30;

		// enables inputs on mortar and calls functions when clicked
		mortar.inputEnabled=true;
		mortar.events.onInputDown.add(this.makePoultice,this);

		// creates group of meds and enable physics
		meds=game.add.group();
		meds.enableBody=true;

		music_background=this.add.audio('background');
		music_background.play();

		// add background
		back=game.add.sprite(0,0,"bg");
		back.blendMode=2;

		// instructions text
		this.add.text(5,5,"Make poultices and apply to wounds.");

		// local timer variable and prints
		timer=diff+10;
		timerText=this.add.text(600,5,'Time left : '+timer);
	},

	update: function()
	{
		// updates timer
		timer-=1/60;
		timerText.text='Time left: '+timer.toFixed(2);

		// checks for overlap between groups
		this.game.physics.arcade.overlap(meds,wound,this.remove);

		// goes to game over screen when time runs out
		if(timer<0)
		{
			this.sound.stopAll();
			this.state.start('GameOver');
		}

		// goes back to town if cured
		if(wound.countLiving()==0)
		{
			// increases difficulty with successes
			diff+=Math.floor(Math.random()+1);
			this.sound.stopAll();
			this.state.start('Town');
		}
	},

	makePoultice: function()
	{
		poultice=meds.create(100,520,"poultice");
		poultice.anchor.set(.5,.5);
		poultice.angle=Math.random()*360;
		poultice.scale.set(.2);
		// allows poultice to be draggable
		poultice.inputEnabled=true;
		poultice.input.enableDrag();
	},

	// removes sprites when they touch
	remove: function(sprite1,sprite2)
	{
		sprite1.kill();
		sprite2.kill();
	}
}
