var Menu = function(game) {};
Menu.prototype =
{
	preload: function()
	{
		this.load.path = "../_Assets/images/";
		this.load.image("backdrop", "old_paper.png");
		this.load.image("button", "button.png");
		this.load.image("title", "title.png");
		this.load.image("text_credits", "text_credits.png");
		this.load.image("text_play", "text_play.png");
	},

	create: function()
	{
		layer_background = this.game.add.group();

		// Make title Sprite
		title = layer_background.create((game.camera.width / 2), (game.camera.height * 0.3), "title");
		centerAnchor(title);

	  // Add Backdrop
		createBackdrop(this, "backdrop");
	},

	update: function()
	{
		
	}
}
