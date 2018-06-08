var GameOver = function(game) {};
GameOver.prototype =
{
	preload: function()
	{

	},

	create: function()
	{
		// Add UI Layer
		layer_ui = this.game.add.group();

		// Add screen elements
		let elementPadding = 50;
		let center_x = (game.camera.width / 2);
		let center_y = (game.camera.height / 2);
		this.grave = layer_ui.create(center_x, center_y, "grave");
		centerAnchor(this.grave);

		this.button_quit = createMenuButton(this, center_x, (this.grave.y + elementPadding + (this.grave.height / 2)), layer_ui, "text_gameover", "Menu");

		// Add backdrop
		createBackdrop(this, "backdrop");
	},

	update: function()
	{

	}
}
