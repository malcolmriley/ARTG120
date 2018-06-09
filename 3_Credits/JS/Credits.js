var Credits = function(game) {};
Credits.prototype =
{
	preload: function()
	{
		this.game.load.json("credits", "../3_Credits/credits.json");
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

		// Build Credits
		this.credits = game.cache.getJSON("credits").credits;
		for (let index = 0; index < this.credits.length; index += 1) {
			let iteratedEntry = this.credits[index];
			let instance = new CreditsObject(this.game, center_x, center_y, iteratedEntry.header, iteratedEntry.column_left, iteratedEntry.column_right);
			instance.alpha = 0;
			this.credits[index] = instance;
		}
		// Add backdrop
		createBackdrop(this, "backdrop");
	},

	update: function()
	{

	}
}

/**
 * Specialized object for managing blocks of credits, by automatically managing the position of three internal text objects.
 *
 * Makes a bold header, and two colunms of centered text below it.
 * Altering the standard x, y, or alpha properties also alters that of the internal objects. Makes for nice tweening!
 */
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

	destroy() {
		if (this.header) { this.header.destroy() };
		if (this.column_left) { this.column_left.destroy() };
		if (this.column_right) { this.column_right.destroy() };
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
