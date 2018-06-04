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

		// reset game when game numbers when game over
		loc="start";
		health=[100,100,100];
		dead=0;
		diff=0;
	},

	update: function()
	{
		if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER))
		{
			game.state.start('Menu');
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.R))
		{
			game.state.start('Town');
		}
	}
}
