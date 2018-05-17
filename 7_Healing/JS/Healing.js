var MiniGame = function(game) {};
MiniGame.prototype =
{
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
		// adds images and enables physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.blank=this.game.add.sprite(600,300,"X");
		this.blank.scale.setTo(0.1, 0.1);
		this.game.physics.arcade.enable(this.blank);
		this.flower=this.game.add.sprite(0,300,'flower');
		this.game.physics.arcade.enable(this.flower);

		// turns on input and then enables drag
		this.flower.inputEnabled=true;
		this.flower.input.enableDrag();
		this.flower.scale.setTo(0.1, 0.1);

		// saves position of flower
		this.flower.ogPos=this.flower.position.clone();
		// what happens when you stop dragging/let go
		this.flower.events.onDragStop.add(function(current){
		    this.stopDrag(current,this.blank);},this);

		this.add.text(0, 0, "MiniGame \n ENTER: GameOver \n SPACE: Town");
		this.stage.backgroundColor = '#ffffff';
		music_background = this.add.audio('background');
		music_background.play();
	},

	update: function()
	{
		if(this.input.keyboard.isDown(Phaser.Keyboard.ENTER))
		{
			this.state.start('GameOver');
		}
		else if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			this.sound.stopAll();
			this.state.start('Town');
		}
	},

	// function that executes when player lets go of flower
	stopDrag: function(current,end){
		// if flower is not touching blank/end goal
		if(!this.game.physics.arcade.overlap(current,end,function(){
		    // if it does overlap, execute function which disables drag
		    current.input.draggable=false;
		    // also snaps to goal position
		    current.position.copyFrom(end.position);})) {
			// snaps back to original position
			current.position.copyFrom(current.ogPos);
		}
	}
}
