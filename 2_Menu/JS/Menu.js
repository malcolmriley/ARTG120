var Menu = function(game) {};
Menu.prototype =
{
	preload: function()
	{

	},

	create: function()
	{
		layer_background = this.game.add.group();
		
		// Set up temp variables
		let elementPadding = 50;
		let center_x = (game.camera.width / 2);
		let center_y = (game.camera.height / 2);

		// Make title Sprite
		title = layer_background.create(center_x, (game.camera.height * 0.3), "title");
		centerAnchor(title);

		// Add buttons
		button_play = createMenuButton(this, center_x, (title.y + elementPadding + (title.height / 2)), layer_background, "text_play", "Town");
		button_credits = createMenuButton(this, center_x, (button_play.y + elementPadding + button_play.height), layer_background, "text_credits", "Credits");

		// TODO: Add names/course title to screen?

	  // Add Backdrop
		createBackdrop(this, "backdrop");
	},

	update: function()
	{

	}
}
