var Credits = function(game) {};
Credits.prototype =
{
	preload: function()
	{

	},

	create: function()
	{
		game.add.text(0, 0, "Credits \n ESC: Return");
		game.stage.backgroundColor = '#ffffff';
	},

	update: function()
	{
		if(game.input.keyboard.isDown(Phaser.Keyboard.ESC))
		{
			game.state.start('Menu');
		}
	}
}
