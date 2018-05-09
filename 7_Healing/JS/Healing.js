var MiniGame = function(game) {};
MiniGame.prototype =
{
	preload: function()
	{

	},

	create: function()
	{
		game.add.text(0, 0, "MiniGame \n ENTER: GameOver \n SPACE: Town");
		game.stage.backgroundColor = '#ffffff';
	},

	update: function()
	{
		if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER))
		{
			game.state.start('GameOver');
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('Town');
		}
	}
}
