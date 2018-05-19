var Minigame_Alchemy = function(game) {};
Minigame_Alchemy.prototype =
{
	preload: function()
	{
    // Load Images
		this.load.path = "../_Assets/images/";
		this.load.image("backdrop", "old_paper.png");
		this.load.image("circle", "circle.png");
	},

	create: function()
	{
		// Add render groups for use as "render layers"
		layer_background = this.game.add.group();
		layer_midground = this.game.add.group();
		layer_foreground = this.game.add.group();
		layer_paper = this.game.add.group();

	  // Add Backdrop
	  paper = layer_paper.create(0, 0, "backdrop");
		paper.blendMode = 2;

		// Add "ingredients" reserve
		makeWorkArea(50, 100, 3, "Ingredients");

		// Add "equipment" reserve
		makeWorkArea(50, 250, 3, "Equipment");

		// Add "work area"
		makeWorkArea(50, 500, 5)
	},

	update: function()
	{

	}
}

function makeWorkArea(passedPositionX, passedPositionY, passedQuantity, passedLabel) {
	let padding = 20;
	for (let count = 0; count < passedQuantity; count += 1) {
		let circleInstance = layer_background.create(0, 0, "circle");
		circleInstance.scale.setTo(0.3, 0.3);
		circleInstance.x = passedPositionX + (count * (padding + circleInstance.width));
		circleInstance.y = passedPositionY;
		circleInstance.alpha = 0.3;
	}
	if (passedLabel != undefined) {
		let textInstance = game.add.text(passedPositionX, passedPositionY + (2 * padding), passedLabel);
	}
}
