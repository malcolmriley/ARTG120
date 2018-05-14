var game=new Phaser.Game(800, 600, Phaser.AUTO);

var Testing = function(game){};
Testing.prototype={
	preload: function(){
		// loads images
		this.load.path='assets/img/';
		this.load.atlas('atlas','spritesheet.png','sprites.json');
	},
	create: function(){
		// enables physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// flowers group and enable physics
		flowers=game.add.group();
		flowers.enableBody=true;

		for (let i = 0; i < 10; i++) {
			flower=flowers.create(this.world.randomX,this.world.randomY,'atlas','flower_1');
			flower.scale.set(.1);
		}

		// player character and enable physics
		guy=game.add.sprite(400,300,'atlas','character');
		guy.scale.set(.1);
		game.physics.arcade.enable(guy);
	},
	update: function(){
		// creates cursor keys for convenience
		cursors=game.input.keyboard.createCursorKeys();

		if (cursors.left.isDown){
			guy.x-=4;
		}
		else if (cursors.right.isDown){
			guy.x+=4;
		}
		if (cursors.up.isDown){
			guy.y-=4;
		}
		else if (cursors.down.isDown){
			guy.y+=4;
		}
		// checks for when player touches flowers
		game.physics.arcade.overlap(guy,flowers,changeFrame);
	}
}

// changes flower frames
function changeFrame(guy,flower){
	switch(flower.frameName){
		case 'flower_1':
			flower.frameName='flower_2';
			break;
		case 'flower_2':
			flower.frameName='flower_3';
			break;
	}
}

// defines states
game.state.add('Test',Testing);
game.state.start('Test');