var GameOver = function(game) {};
GameOver.prototype =
{
	preload: function()
	{

	},

	create: function()
	{
		game.add.text(0, 0, "GameOver \n ENTER: Menu \n R: Town (Restart)");
		game.stage.backgroundColor = '#ffffff';
	},

	update: function()
	{
		if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER))
		{
			diff=0;
			game.state.start('Menu');
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.R))
		{
			diff=0;
			game.state.start('Town');
		}
	}
}
