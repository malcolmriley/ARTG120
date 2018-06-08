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

		// Add text layer
		this.layer_text = this.game.add.group();

		let center_x = (game.camera.width / 2);
		let center_y = (game.camera.height / 2);

		// Add backdrop
		createBackdrop(this, "backdrop");
	},

	update: function()
	{

	}
}

class CreditsObject {
	constructor(passedGameReference, passedXPosition, passedYPosition, passedHeader, passedLeftColumn, passedRightColumn) {
		let headerStyle = {
			font : "bold", // TODO
			align : "center",
			fontSize: 32,
		};
		let normalStyle = {
			font : "normal", // TODO
			align : "center",
			fontSize: 26,
		};
		let makeIfPresent = function(passedText, passedStyle) {
			if (passedText) {
				let instance = passedGameReference.add.text(passedXPosition, passedYPosition, passedText, passedStyle);
				centerAnchor(instance);
				return instance;
			}
			return null;
		}
		this.header = makeIfPresent(passedHeader, headerStyle);
		this.column_left = makeIfPresent(passedLeftColumn, normalStyle);
		this.column_right = makeIfPresent(passedRightColumn, normalStyle);

		// Position all elements
		this.x = passedXPosition;
		this.y = passedYPosition;
	}

	set alpha(passedValue) {
		if (this.header) { this.header.alpha = passedValue };
		if (this.column_left) { this.column_left.alpha = passedValue };
		if (this.column_right) { this.column_right.alpha = passedValue };
	}

	set x(passedValue) {
		if (this.header) { this.header.x = passedValue };
		let offset = 0;
		if (this.column_left && this.column_right) { offset = 150 };
		if (this.column_left) { this.column_left.x = passedValue - (offset) };
		if (this.column_right) { this.column_right.x = passedValue + (offset) };
	}

	set y(passedValue) {
		if (this.header) { this.header.y = passedValue - (this.header.height / 2) };
		if (this.column_left) { this.column_left.y = passedValue + (this.column_left.height / 2) };
		if (this.column_right) { this.column_right.y = passedValue + (this.column_right.height / 2) };
	}
}
