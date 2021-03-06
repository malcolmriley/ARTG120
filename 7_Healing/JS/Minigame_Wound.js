var Minigame_Wound = function(game) {};
Minigame_Wound.prototype =
{
	init: function(x,y)
	{
		row=x;
		col=y;
	},

	create: function()
	{
		squirt=game.add.audio("squirt");
		cloth=game.add.audio("cloth");

		// enables physics system
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		// creates an array to hold different images
		select=["wound0","wound1","wound2","wound3"];

		// creates arm sprite
		arm=game.add.sprite(-20,50,"hand");
		arm.scale.set(.6,1);
		arm.angle=-2;

		// creates group to hold amount of wounds
		wound=game.add.group();
		layer_foreground = game.add.group();

		// initially spawns 3 cuts
		for(i=0;i<3;i++)
		{
			this.spawnCuts();
		}

		// create a mortar and pestle on a table
		table=game.add.sprite(25,480,"table");
		table.scale.set(.2,.5);
		mortar=game.add.sprite(50,470,"bowl");
		pestle=game.add.sprite(40,460,"pestle");
		pestle.angle=-30;

		// enables inputs on mortar and calls functions when clicked
		mortar.inputEnabled=true;
		mortar.events.onInputDown.add(this.spawnPoultice,this);

		// creates group of meds and enable physics
		meds=game.add.group();
		meds.enableBody=true;

		//music_background=this.add.audio('background');
		//music_background.play();

		counter=game.add.text(400,20,"Cuts:");

		// Add Tutorial
		if (!sessionStorage.getItem("tutorial_wound")) {
			this.splash = new TutorialSplash(this.game, layer_foreground);
			let drawDiagram1 = function(passedData, passedScreen) {
				// Add splash
				passedData.sprite = this.game.add.sprite(0, 0, "ui_tutorial_wound_1");
				centerAnchor(passedData.sprite);
				passedScreen.addChild(passedData.sprite);

				// Add cursor cue
				passedData.cursor = this.game.add.sprite(-85, 100, "ui_mouse");
				passedData.cursor.frame = 1;
				let anim = passedData.cursor.animations.add("click");
				passedData.cursor.animations.play("click", 1.25, true);
				centerAnchor(passedData.cursor);
				passedScreen.addChild(passedData.cursor);
			};
			let drawDiagram2 = function(passedData, passedScreen) {
				// Add splash
				passedData.sprite = this.game.add.sprite(0, 0, "ui_tutorial_wound_2");
				centerAnchor(passedData.sprite);
				passedScreen.addChild(passedData.sprite);

				// Add cursor cue
				passedData.cursor = this.game.add.sprite(50, 100, "ui_mouse");
				passedData.cursor.frame = 1;
				let tween = this.game.add.tween(passedData.cursor).from({x : -150}, 1200, Phaser.Easing.Linear.None, true);
				tween.loop(true);
				centerAnchor(passedData.cursor);
				passedScreen.addChild(passedData.cursor);
			};
			let eraseDiagram = function(passedData, passedScreen) {
				passedData.sprite.destroy();
				passedData.cursor.destroy();
			};
			this.splash.addDiagram(this, drawDiagram1, eraseDiagram);
			this.splash.addDiagram(this, drawDiagram2, eraseDiagram);
			this.splash.addOnComplete(this, function(){
				// The tutorial is over!
				sessionStorage.setItem("tutorial_wound", true);
				this.tutorial = false;
				this.addTimer();
			});
			this.splash.begin();
			this.tutorial = true;
		}
		else {
			this.addTimer();
		}

		// add background
		createBackdrop(this, "backdrop");
	},

	addTimer: function() {
		// Add timer that spawns cuts every 3 seconds
		timer=game.time.create(false);
		timer.loop(3000,this.spawnCuts,this);
		timer.start();
	},

	update: function()
	{
		counter.text="Cuts: "+wound.countLiving();

		// continuously checks each cut in wound
		wound.forEach(this.checkWound,this);

		// Don't do checks during tutorial
		if (!this.tutorial) {
			// goes to game over screen when there are 5 cuts
			if(wound.countLiving()==5)
			{
        health[row][col]-=Math.floor(Math.random()*10)+10;
			  // add to dead if happen to fail during minigame
		  	if(health[row][col]<1)
		  	{
		  		dead++;	
		  	}
        
				//this.sound.stopAll();
				game.state.start('MiniGameOver');
			}

			// goes back to town if cured
			if(wound.countLiving()==0)
			{
        health[row][col]+=Math.floor(Math.random()*10)+5;
		  	// set a cap for mamximum health
			  if(health[row][col]>100)
	  		{
	  			health[row][col]=100;
  			}
				//this.sound.stopAll();
				cloth.play();
				game.state.start('Town');
			}
		}
	},

	// function to spawn cuts
	spawnCuts: function()
	{
		// chooses which of the wounds to spawn
		img=select[Math.floor(Math.random()*4)];

		// creates a cut group and enable physics
		cut=game.add.group();
		cut.enableBody=true;

		// variables to hold random location on arm
		randX=Math.random()*380+380;
		randY=Math.random()*120+200;

		for(j=0;j<Math.floor(Math.random()*4+4);j++)
		{
			temp=cut.create(randX,randY,img);
			temp.anchor.set(.5,.5);
			temp.scale.set(.3);
			// change bounding box to be small and centered
			temp.body.setSize(10,10,Math.random()*300,Math.random()*50+25);
		}

		// adds cut to number of wounds
		wound.add(cut);
	},

	// function to spawn poultices
	spawnPoultice: function()
	{
		squirt.play();

		poultice=meds.create(110,490,"poultice");
		poultice.anchor.set(.5,.5);
		poultice.angle=Math.random()*360;

		// gives poultice a random amount of uses
		poultice.use=Math.floor(Math.random()*4+3);

		// allows poultice to be draggable
		poultice.inputEnabled=true;
		poultice.input.enableDrag();
	},

	// function that applies to every cut
	checkWound: function(cut)
	{
		// checks for overlap between poultices and cuts
		game.physics.arcade.overlap(meds,cut,this.remove);

		// destroys cut group when healed
		if(cut.countLiving()==0)
		{
			cut.destroy();
		}
	},

	// function that removes sprites when they touch
	remove: function(poultice,cut)
	{
		// decrements poultice uses from healing cuts
		if(poultice.use>0)
		{
			poultice.use-=1;
		}
		// removes poultice when used up
		else
		{
			poultice.kill();
		}
		// removes a portion of the cut when healed
		cut.kill();
	}
}
