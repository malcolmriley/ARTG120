var Boot = function(game) {};
Boot.prototype =
{
	preload: function()
	{
			// Load stuff needed for load screen
			this.load.path = "../_Assets/images/";
      this.game.load.image("progressbar", "progressbar.png");
      this.game.load.image("progressbar_background", "progressbar_background.png");

      // Reset load path to prevent breaking states that don't set it
      // TODO: Remove when these issues are removed from the other states
      this.load.path = "";
	},

	create: function()
	{
    game.state.start("Load");
	},

	update: function()
	{

	}
}
