var Credits = function(game) {};
Credits.prototype =
{
	preload: function()
	{

	},

	create: function()
	{
		
	},

	update: function()
	{
		if(game.input.keyboard.isDown(Phaser.Keyboard.ESC))
		{
			game.state.start('Menu');
		}
	}
}
