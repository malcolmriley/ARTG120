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

		this.load.path = ""; // TODO: Remove when Town is finalized.
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

function createMenuButton(passedReference, passedPositionX, passedPositionY, passedGroup, passedSpriteKey, passedState) {
	let buttonInstance = passedGroup.create(passedPositionX, passedPositionY, "button");
	let buttonText = passedGroup.create(passedPositionX, passedPositionY, passedSpriteKey);
	buttonInstance.alpha = 0;
	centerAnchor(buttonInstance);
	centerAnchor(buttonText);

	// Generate event callbacks
	let fadeTime = 75;
	let onClick = function() {
		game.state.start(passedState);
	};
	let onMouseOver = function(passedSprite, passedPointer) {
		game.add.tween(buttonInstance).to({ alpha : 1.0 }, fadeTime, Phaser.Easing.Linear.None, true);
	};
	let onMouseOut = function(passedSprite, passedPointer) {
		game.add.tween(buttonInstance).to({ alpha : 0.0 }, fadeTime, Phaser.Easing.Linear.None, true);
	};

	// Attach event callbacks
	makeButton(buttonInstance, passedReference, onClick);
	makeMouseover(buttonInstance, passedReference, onMouseOver, onMouseOut);
	return buttonInstance;
}
