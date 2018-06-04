var Menu = function(game) {};
Menu.prototype =
{
	preload: function()
	{

	},

	create: function()
	{
		game.add.text(0, 0, 'Menu. \n SPACE: Start Game \n C: Credits \n Z: Controls');
		game.stage.backgroundColor = '#ffffff';
	},

	update: function()
	{
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('Town');
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.C))
		{
			game.state.start('Credits');
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.Z))
		{
			game.state.start('Controls');
		}
	}
}
