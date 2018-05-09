var Controls = function(game) {};
Controls.prototype =
{
	preload: function()
	{

	},

	create: function()
	{
		game.add.text(0, 0, "Controls \n ESC: Return");
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
