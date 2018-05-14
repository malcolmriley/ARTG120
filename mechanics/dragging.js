var game=new Phaser.Game(800, 600, Phaser.AUTO);

var Testing = function(game){};
Testing.prototype={
	preload: function(){
		// loads images
		this.load.path='assets/img/';
		this.load.image('blank','blank.jpg');
		this.load.image('flower','flower.jpg');
	},
	create: function(){
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
	},
	stopDrag: function(current,end){
		// if flower is not touching blank/end goal
		if(!this.game.physics.arcade.overlap(current,end,function(){
		    // if it does overlap, execute function which disables drag
		    current.input.draggable=false;
		    // also snaps to goal position
		    current.position.copyFrom(end.position);})) {
			// snaps back to original position
			//current.position.copyFrom(current.ogPos);
		}
	}
}

// defines states
game.state.add('Test',Testing);
game.state.start('Test');