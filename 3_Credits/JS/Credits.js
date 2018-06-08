var Credits = function(game) {};
Credits.prototype =
{
	preload: function()
	{

	},

	create: function()
	{
		// Add escape functionality
		this.key_escape = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
		this.key_escape.onDown.add(function(){ game.state.start("Menu"); });
	},

	update: function()
	{

	}
}
