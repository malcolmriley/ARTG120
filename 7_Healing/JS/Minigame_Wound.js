var Minigame_Wound = function(game) {};
Minigame_Wound.prototype =
{
	preload: function()
	{
		this.load.path='../_Assets/images/';
		this.load.image("hand", "hand.png");
	},

	create: function()
	{
		// enables physics system
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		// creates an array to hold different images
		select=["wound0","wound1","wound2","wound3"];

		// creates arm sprite
		arm=game.add.sprite(-20,50,"hand");
		arm.scale.set(.6,1);
		arm.angle=-2;

		// creates group to hold amount of wounds
		wound=game.add.group()

		for(i=0;i<3;i++)
		{
			// creates a group of cuts and enable physics
			cut=game.add.group();
			cut.enableBody=true;
			this.spawnCuts(cut,select[Math.floor(Math.random()*4)]);
			// adds cut to number of wounds
			wound.add(cut);
		}

		// create a mortar and pestle on a table
		table=game.add.sprite(25,480,"table");
		table.scale.set(.2,.5);
		mortar=game.add.sprite(50,470,"bowl");
		pestle=game.add.sprite(40,460,"pestle");
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
		timer=1000;
		timerText=this.add.text(600,5,'Time left : '+timer);
	},

	update: function()
	{
		wound.forEach(this.checkWound,this);

		// updates timer
		timer-=1/60;
		timerText.text='Time left: '+timer.toFixed(2);

		// goes to game over screen when time runs out
		if(timer<0)
		{
			this.sound.stopAll();
			this.state.start('MiniGameOver');
		}

		// goes back to town if cured
		if(wound.countLiving()==0)
		{
			this.sound.stopAll();
			this.state.start('Town');
		}
	},

	spawnCuts: function(container,img)
	{
		temp=container.create(Math.random()*380+380,Math.random()*120+200,img);
		temp.anchor.set(.5,.5);
		temp.scale.set(.3);
		// change bounding box to be small and centered
		temp.body.setSize(10,10,150,50);
	},

	makePoultice: function()
	{
		poultice=meds.create(110,490,"poultice");
		poultice.anchor.set(.5,.5);
		poultice.angle=Math.random()*360;
		// gives poultice a random amount of uses
		poultice.use=Math.floor(Math.random()*4+1);
		// allows poultice to be draggable
		poultice.inputEnabled=true;
		poultice.input.enableDrag();
	},

	checkWound: function(cut)
	{
		if(cut.countLiving()==0)
		{
			cut.destroy();
		}
		game.physics.arcade.overlap(meds,cut,this.remove);
	},

	// removes sprites when they touch
	remove: function(poultice,cut)
	{
		if(poultice.use>0)
		{
			poultice.use-=1;
		}
		else
		{
			poultice.kill();
		}
		cut.kill();
	}
}