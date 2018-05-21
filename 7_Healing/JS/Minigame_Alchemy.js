var Minigame_Alchemy = function(game) {};
Minigame_Alchemy.prototype =
{
	preload: function()
	{
    // Load Images
		this.load.path = "../_Assets/images/";
		this.load.image("backdrop", "old_paper.png");
		this.load.image("circle", "circle.png");
		this.load.image("bowl", "bowl.png");
		this.load.image("bottle_round", "bottle_round.png");
		this.load.spritesheet("liquid_bowl", "liquid_bowl.png", 450, 300);
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

		// Add test containers
		bottle = initObject(new AlchemyBottle(layer_foreground, Math.random() * 0xffffff, 3), workzone, 3, this);
		bowl = initObject(new AlchemyBowl(layer_foreground, Math.random() * 0xffffff, 2), workzone, 2, this);
	},

	update: function()
	{

	}
}

/**
 * Convenience function for initializing AlchemyObject instances.
 *
 * Makes them draggable, and adds them to the passed work area at the passed index.
 *
 * passedObject - The AlchemyObject to initialize
 * passedWorkArea - The WorkArea object to add them to
 * passedIndex - The index of the WorkArea to add them to
 * passedReference - The context from which this AlchemyObject has been initialized (typically "this")
 */
function initObject(passedObject, passedWorkArea, passedIndex, passedReference) {
	makeDraggable(passedObject.container, passedReference);
	passedWorkArea.insert(passedObject.container, passedIndex);
	return passedObject;
}

/**
 * AlchemyObject object.
 *
 * passedGroup - The group to use for creating the AlchemyObject
 * passedFluid - The texture to use for the contained material (should be a spritesheet or equivalent)
 * The following parameters are optional, but must be used in conjunction:
 * passedColor - The tint to use for the contained material (should be a spritesheet or equivalent)
 * passedQuantity - The initial quantity to fill this container with
 */
class AlchemyObject {
	constructor(passedGroup, passedContainer, passedFluid, passedColor, passedQuantity) {
		this.group = passedGroup;
		this.container = this.initElement(passedContainer);
		this.contents = this.initElement(passedFluid);
		this.container.addChild(this.contents);
		this.container.scale.setTo(spriteScale, spriteScale); // TODO: Remove when final asset size is determined
		if ((passedQuantity != undefined) && (passedColor != undefined)) {
			this.setContents(passedQuantity, passedColor);
		}
	}

	initElement(passedKey) {
		let instance = this.group.create(0, 0, passedKey);
		instance.anchor.x = 0.5;
		instance.anchor.y = 1;
		return instance;
	}

	setContents(passedQuantity, passedColor) {
		this.quantity = passedQuantity;
		if (passedColor != undefined) {
			this.contents.tint = passedColor;
		}
		this.contents.frame = passedQuantity;
	}

	setPosition(passedXPosition, passedYPosition) {
			this.container.x = passedXPosition;
			this.container.y = passedYPosition;
	}
}

class AlchemyBottle extends AlchemyObject {
	constructor(passedGroup, passedColor, passedQuantity) {
		super(passedGroup, "bottle_round", "liquid_bottle", passedColor, passedQuantity);
	}
}

class AlchemyBowl extends AlchemyObject {
	constructor(passedGroup, passedColor, passedQuantity) {
		super(passedGroup, "bowl", "liquid_bowl", passedColor, passedQuantity);
	}
}

/**
 * WorkArea object.
 *
 * passedPositionX - The x position of the work area in total
 * passedPositionY - The y position of the work area in total
 * passedQuantity - The number of "spaces" in the work area
 * The remaining parameters are optional:
 * passedLabel - A textual lable for this work area
 */
class WorkArea {
	constructor(passedPositionX, passedPositionY, passedQuantity, passedLabel) {
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

	insert(passedObject, passedIndex) {
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
}
