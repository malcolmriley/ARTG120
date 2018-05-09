var Load = function(game) {};
Load.prototype =
{
	preload: function()
	{

	},

	create: function()
	{
		game.add.text(0, 0, 'Loading');
		game.stage.backgroundColor = '#ffffff';
	},

	update: function()
	{
		game.state.start('Menu');
	}
}
