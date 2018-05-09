var Town = function(game) {};
Town.prototype =
{
	preload: function()
	{

	},

	create: function()
	{
		game.add.text(0, 0, "Town \n ENTER: MiniGame");
	  game.stage.backgroundColor = '#ffffff';
	},

	update: function()
	{
		if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER))
		{
			game.state.start('MiniGame');
		}
	}
}
