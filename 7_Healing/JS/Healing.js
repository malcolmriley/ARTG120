var MiniGame = function(game) {};
MiniGame.prototype =
{
	preload: function()
	{
		// loads images
		this.load.path='../Assets/Art/';
		this.load.image('blank','blank.jpg');
		this.load.image('flower','flower.jpg');

		//load sound
		this.load.path = '../Assets/Sound/';
		this.load.audio('background', 'Midnightcem.ogg');
	},

	create: function()
	{
		// adds images and enables physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.blank=this.game.add.sprite(600,0,'blank');
		this.game.physics.arcade.enable(this.blank);
		this.flower=this.game.add.sprite(0,0,'flower');
		this.game.physics.arcade.enable(this.flower);

		// turns on input and then enables drag
		this.flower.inputEnabled=true;
		this.flower.input.enableDrag();

		// saves position of flower
		this.flower.ogPos=this.flower.position.clone();
		// what happens when you stop dragging/let go
		this.flower.events.onDragStop.add(function(current){
		    this.stopDrag(current,this.blank);},this);
		
		this.add.audio('background');	
		this.add.text(0, 0, "MiniGame \n ENTER: GameOver \n SPACE: Town");
		this.stage.backgroundColor = '#ffffff';
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
