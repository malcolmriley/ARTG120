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
		spriteScale = 0.25; // TODO: Remove when final asset size is determined
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
		ingredients = new WorkArea(50, 125, 3, "Ingredients");

		// Add "equipment" reserve
		equipment = new WorkArea(50, 275, 3, "Equipment");

		// Add "work area"
		workzone = new WorkArea(50, 550, 5);

		// Add test container
		bottle = new AlchemyObject(0, 0, layer_foreground, "bottle_round", "liquid_bottle", Math.random() * 0xffffff, 3);
		makeDraggable(bottle.container, this);
		equipment.insert(bottle.container, 1);
	},

	update: function()
	{

	}
}

/**
 * Constructor for AlchemyObject object.
 *
 * passedPositionX - The X position for the AlchemyObject
 * passedPositionY - The Y position for the AlchemyObject
 * passedGroup - The group to use for creating the AlchemyObject
 * passedFluid - The texture to use for the contained material (should be a spritesheet or equivalent)
 * The following parameters are optional, but must be used in conjunction:
 * passedColor - The tint to use for the contained material (should be a spritesheet or equivalent)
 * passedQuantity - The initial quantity to fill this container with
 */
function AlchemyObject(passedPositionX, passedPositionY, passedGroup, passedContainer, passedFluid, passedColor, passedQuantity) {
	this.container = passedGroup.create(0, 0, passedContainer);
	this.contents = passedGroup.create(0, 0, passedFluid);
	this.container.anchor.x = 0.5;
	this.container.anchor.y = 1;
	this.contents.anchor.x = 0.5;
	this.contents.anchor.y = 1;
	this.container.addChild(this.contents);
	this.container.x = passedPositionX;
	this.container.y = passedPositionY;
	this.container.scale.setTo(spriteScale, spriteScale); // TODO: Remove when final asset size is determined
	if ((passedQuantity != undefined) && (passedColor != undefined)) {
		this.setContents(passedQuantity, passedColor);
	}
}
AlchemyObject.prototype.setContents = function (passedQuantity, passedColor) {
		this.quantity = passedQuantity;
		if (passedColor != undefined) {
			this.contents.tint = passedColor;
		}
		this.contents.frame = passedQuantity;
}
AlchemyObject.prototype.setPosition = function (passedXPosition, passedYPosition) {
	this.container.x = passedXPosition;
	this.container.y = passedYPosition;
}

// TODO: Switch to class-syntax approach
// This is getting gross.

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
		circleInstance.scale.setTo(spriteScale, spriteScale); // TODO: Remove when final asset size is determined
		circleInstance.x = passedPositionX + (count * (padding + circleInstance.width)) + (circleInstance.width / 2);
		circleInstance.y = passedPositionY + (circleInstance.height / 2);
		circleInstance.alpha = 0.4;
		this.spaces[count] = circleInstance;
	}
	// TODO: Better font?
	if (passedLabel != undefined) {
		this.textLabel = game.add.text(passedPositionX, passedPositionY + (2 * padding), passedLabel);
		layer_background.add(this.textLabel);
	}
}
WorkArea.prototype.insert = function(passedObject, passedIndex) {
	this.apparatus[passedIndex] = passedObject;
	let x_pos = this.spaces[passedIndex].x;
	let y_pos = this.spaces[passedIndex].y;
	if (passedObject instanceof Phaser.Sprite) {
		passedObject.x = x_pos;
		passedObject.y = y_pos;
	}
	if (passedObject instanceof AlchemyObject) {
		passedObject.setPosition(x_pos, y_pos);
	}
}
