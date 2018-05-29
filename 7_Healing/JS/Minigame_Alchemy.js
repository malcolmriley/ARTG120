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
		this.load.image("bottle_cork", "cork.png");
		this.load.spritesheet("liquid_bowl", "liquid_bowl.png", 450, 300);
		this.load.spritesheet("liquid_bottle",  "liquid_bottle.png", 300, 450);
		spriteScale = 0.25; // TODO: Remove when final asset size is determined

		// Define colors
		AlchemyColor = Object.freeze(new AlchemyColors());
	},

	create: function()
	{
		// Launch Physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

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
		bottle = initObject(new AlchemyBottle(layer_midground, Math.random() * 0xffffff, 3), workzone, 3, this);
		bowl = initObject(new AlchemyBowl(layer_midground, Math.random() * 0xffffff, 2), workzone, 2, this);
	},

	update: function()
	{

	}
}

function beginDragAlchemy(passedObject, passedPointer) {

}

function endDragAlchemy(passedObject, passedPointer) {
	game.physics.arcade.overlap(passedObject, layer_midground, onOverlap);
}

function onOverlap(passedFirstSprite, passedSecondSprite) {
	console.log("OVERLAP ACHIEVED!");
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
	makeDraggable(passedObject.container, passedReference, beginDragAlchemy, endDragAlchemy);
	passedWorkArea.insert(passedObject.container, passedIndex);
	game.physics.arcade.enable(passedObject.container);
	return passedObject;
}

class AlchemyColors {
	constructor() {
		let init = function(passedIndex, passedColor) {
			let instance = { index : passedIndex, tint : passedColor};
			return instance;
		};
		this.RED = init(0, 0xB50000);
		this.ORANGE = init(1, 0xC55500);
		this.YELLOW = init(2, 0xFFBA1A);
		this.GREEN = init(3, 0x5C8D1A);
		this.BLUE = init(4, 0x0030B5);
		this.INDIGO = init(5, 0x5956B5);
		this.VIOLET = init(6, 0x8627FF);
		this.MAGENTA = init(7, 0x862768);
		this.colorArray = [this.RED, this.ORANGE, this.YELLOW, this.GREEN, this.BLUE, this.INDIGO, this.VIOLET, this.MAGENTA];
	}

	get(passedIndex) {
		return this.colorArray[(passedIndex % this.colorArray.length)];
	}
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
 // TODO: Make AlchemyObject extend Sprite for improved integration with existing Phaser systems
class AlchemyObject {
	constructor(passedGroup, passedContainer, passedFluid, passedColor, passedQuantity) {
		this.group = passedGroup;
		this.container = this.initElement(passedContainer);
		this.contents = this.addElement(passedFluid);
		if ((passedQuantity != undefined) && (passedColor != undefined)) {
			this.setQuantity(passedQuantity);
			this.setColor(passedColor);
		}
	}

	initElement(passedKey, passedXPosition, passedYPosition) {
		let instance = this.group.create(0, 0, passedKey);
		if ((passedXPosition != null) && (passedYPosition != null)) {
			instance.x = passedXPosition;
			instance.y = passedYPosition;
		}
		instance.anchor.x = 0.5;
		instance.anchor.y = 1;
		return instance;
	}

	addElement(passedKey, passedXPosition, passedYPosition) {
		let instance = this.initElement(passedKey, passedXPosition, passedYPosition);
		this.container.addChild(instance);
		this.container.scale.setTo(spriteScale, spriteScale); // TODO: Remove when final asset size is determined
		return instance;
	}

	setColor(passedColor) {
			this.contents.tint = passedColor;
			return this;
	}

	setQuantity(passedQuantity) {
		this.quantity = passedQuantity;
		this.contents.frame = passedQuantity;
		return this;
	}

	setPosition(passedXPosition, passedYPosition) {
			this.container.x = passedXPosition;
			this.container.y = passedYPosition;
			return this;
	}
}

class AlchemyBottle extends AlchemyObject {
	constructor(passedGroup, passedColor, passedQuantity) {
		super(passedGroup, "bottle_round", "liquid_bottle", passedColor, passedQuantity);
		this.cork = this.addElement("bottle_cork", 0, -415);
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
 // TODO Make WorkArea extend Group for improved integration with existing Phaser systems
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
		this.addPositionData(passedObject);
	}

	addPositionData(passedSprite) {
		passedSprite.oldPos = new Phaser.Point(passedSprite.x, passedSprite.y);
		passedSprite.oldArea = this;
	}
}
