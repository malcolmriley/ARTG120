var Minigame_Alchemy = function(game) {};
Minigame_Alchemy.prototype =
{
	preload: function()
	{
    // Load Images
		this.load.path = "../_Assets/images/";
		this.load.image("backdrop", "old_paper.png");
		this.load.image("circle", "circle.png");
		this.load.image("bottle_round", "bottle_round.png");
		this.load.spritesheet("liquid_bottle",  "liquid_bottle.png", 300, 450);
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
		ingredients = new WorkArea(50, 100, 3, "Ingredients");

		// Add "equipment" reserve
		equipment = new WorkArea(50, 250, 3, "Equipment");

		// Add "work area"
		workzone = new WorkArea(50, 500, 5);

		// Add test container
		bottle = new AlchemyContainer(0, 0, layer_foreground, "bottle_round", "liquid_bottle", Math.random() * 0xffffff, 3);
	},

	update: function()
	{

	}
}

function AlchemyContainer(passedPositionX, passedPositionY, passedGroup, passedContainer, passedFluid, passedColor, passedQuantity) {
	this.container = passedGroup.create(passedPositionX, passedPositionY, passedContainer);
	this.contents = passedGroup.create(passedPositionX, passedPositionY, passedFluid);
	this.container.addChild(this.contents);
	this.container.scale.setTo(0.3, 0.3);
	if ((passedQuantity != undefined) && (passedColor != undefined)) {
		this.setContents(passedQuantity, passedColor);
	}
}
AlchemyContainer.prototype.setContents = function (passedQuantity, passedColor) {
		this.quantity = passedQuantity;
		if (passedColor != undefined) {
			this.contents.tint = passedColor;
		}
		this.contents.frame = passedQuantity;
}

/**
 * Constructor for WorkArea object.
 *
 * passedPositionX - The x position of the work area in total
 * passedPositionY - The y position of the work area in total
 * passedQuantity - The number of "spaces" in the work area
 * The remaining parameters are optional:
 * passedLabel - A textual lable for this work area
 */
function WorkArea(passedPositionX, passedPositionY, passedQuantity, passedLabel) {
	// Initialize member fields
	this.position = new Phaser.Point(passedPositionX, passedPositionY);
	this.quantity = passedQuantity;
	this.spaces = [];
	this.apparatus = [];

	// Initialize member objects
	let padding = 20;
	for (let count = 0; count < passedQuantity; count += 1) {
		let circleInstance = layer_background.create(0, 0, "circle");
		centerAnchor(circleInstance);
		circleInstance.scale.setTo(0.3, 0.3);
		circleInstance.x = passedPositionX + (count * (padding + circleInstance.width)) + (circleInstance.width / 2);
		circleInstance.y = passedPositionY + (circleInstance.height / 2);
		circleInstance.alpha = 0.3;
		this.spaces[count] = circleInstance;
	}
	// TODO: Better font?
	if (passedLabel != undefined) {
		this.textLabel = game.add.text(passedPositionX, passedPositionY + (2 * padding), passedLabel);
	}
}
