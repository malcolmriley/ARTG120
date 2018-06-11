var GameOver = function(game) {};
GameOver.prototype =
{
	preload: function()
	{

	},

	create: function()
	{
		this.fadeDuration = 600;
		// Fade From Black
		this.camera.flash("#000000", this.fadeDuration);

		// Add UI Layer
		layer_ui = this.game.add.group();

		// Add screen elements
		let elementPadding = 50;
		let center_x = (game.camera.width / 2);
		let center_y = (game.camera.height / 2);
		this.grave = layer_ui.create(center_x, center_y, "grave");
		centerAnchor(this.grave);

		let deathtoll = game.rnd.integerInRange(4000, 10000);
		this.deathText = this.game.add.text(center_x, 30, "Death Toll: " + deathtoll, { align: "center" });
		centerAnchor(this.deathText);

		let goToMenu = function() {
			this.camera.fade("#000000", this.fadeDuration);
			this.camera.onFadeComplete.add(function(){ this.game.state.start("Menu") });
		};

		this.button_quit = createMenuButton(this, center_x, (this.grave.y + elementPadding + (this.grave.height / 2)), layer_ui, "text_gameover", goToMenu);

		// resets town
		health=[[100,100,100],[100,100,100],[100,100,100]];
		dead=0;

		// Add backdrop
		createBackdrop(this, "backdrop");
	},

	update: function()
	{

	},
}
