var Minigame_Alchemy = function(game) {};
Minigame_Alchemy.prototype =
{
	preload: function()
	{
    // Load Images
		this.load.path = "../_Assets/images/";
		this.load.image("backdrop", "old_paper.png");
	},

	create: function()
	{
    // Add Backdrop
    this.game.add.sprite(0, 0, "backdrop");
	},

	update: function()
	{

	}
}
