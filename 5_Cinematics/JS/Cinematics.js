var Cinematic = function(game) {};
Cinematic.prototype =
{
	preload: function()
	{

	},

	create: function()
	{
		game.add.text(0, 0, "Cinematic \n ENTER: Skip");
		game.stage.backgroundColor = '#ffffff';
	},

	update: function()
	{
		if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER))
		{
			game.state.start('Town');
		}
	}
}
