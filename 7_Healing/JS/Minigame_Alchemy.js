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
		this.load.image("retort", "retort.png");
		this.load.image("bottle_cork", "cork.png");
		this.load.image("table", "table.png");
		this.load.image("shelf", "shelf.png");
		this.load.spritesheet("liquid_bowl", "liquid_bowl.png", 450, 300);
		this.load.spritesheet("liquid_bottle",  "liquid_bottle.png", 300, 450);
		this.load.spritesheet("liquid_retort",  "liquid_retort.png", 600, 300);

		// Load Sounds
		this.load.path = "../_Assets/sounds/";
		this.load.audio("pour", "water_pour.wav");
		this.load.audio("cork", "cork_out.wav");
		this.load.audio("clink_0", "bottle_clink_0.wav");
		this.load.audio("clink_1", "bottle_clink_1.wav");

		spriteScale = 0.25; // TODO: Remove when final asset size is determined

		// Define colors
		Color = Object.freeze(new AlchemyColors());
	},

	create: function()
	{
		// Launch Physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		// Add render groups for use as "render layers"
		layer_background = this.game.add.group();
		layer_workzones = this.game.add.group();
		layer_apparatus = this.game.add.group();
		layer_foreground = this.game.add.group();
		layer_paper = this.game.add.group();

	  // Add Backdrop
	  paper = layer_paper.create(0, 0, "backdrop");
		paper.blendMode = 2;

		// Add "reagents" reserve
		workzone_shelf = new WorkArea(140, 135, 5);

		// Add "work area"
		workzone_table = new WorkArea(140, 475, 5);

		// Add table and shelves
		table = layer_background.create(0, 415, "table");
		shelf = layer_background.create(100, 120, "shelf");

		// Add test containers
		bottle = initObject(new AlchemyBottle(this, Color.RED, 3), workzone_shelf, 1, this);
		bowl = initObject(new AlchemyBowl(this, Color.BLUE, 2), workzone_shelf, 2, this);
		retort = initObject(new AlchemyRetort(this, Color.GREEN, 4), workzone_shelf, 3, this);

		// Create Sounds
		sound_clink = new RandomizedSound(game, "clink_0", "clink_1");
		sound_pour = game.add.audio("pour");
		sound_uncork = game.add.audio("cork");
	},

	update: function()
	{

	}
}

function onReact(passedDraggedObject, passedReactingObject) {
	// Play pour sound
	sound_pour.play();

	// Return dragged object to original location
	onReturn(passedDraggedObject);
}

function onDrop(passedDraggedObject, passedCircleObject) {
	passedCircleObject.workArea.insert(passedDraggedObject, passedCircleObject.index);
	let tween = game.add.tween(passedDraggedObject).to({x : passedCircleObject.x, y : passedCircleObject.y}, 250, Phaser.Easing.Circular.InOut, true);
	tween.onComplete.add(function(){ storePosition(passedDraggedObject); });
}

function onReturn(passedSprite) {
	let tween = game.add.tween(passedSprite).to({x : passedSprite.oldPos.x, y : passedSprite.oldPos.y}, 500, Phaser.Easing.Circular.InOut, true);
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
	passedObject.setPosition(passedWorkArea.getArea(passedIndex).x, passedWorkArea.getArea(passedIndex).y);
	passedWorkArea.insert(passedObject.container, passedIndex, true);
	storePosition(passedObject.container);
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

	static get(passedIndex) {
		return this.colorArray[(passedIndex % this.colorArray.length)];
	}

	static invert(passedColor) {
		let calculatedIndex = passedColor.index + (Math.floor(this.colorArray.length / 2));
		return this.get(calculatedIndex);
	}

	static combine(passedFirstColor, passedSecondColor) {
		let calculatedIndex = Math.floor((passedFirstColor.index + passedSecondColor.index) / 2);
		return this.get(calculatedIndex);
	}

	static split(passedColor) {
		let instance = { first : this.get(passedColor.index - 1), second : this.get(passedColor.index + 1)};
		return instance;
	}

	static rotate(passedColor, passedDirection) {
		return this.get(passedColor.index + passedDirection);
	}
}

/**
 * AlchemyObject object.
 *
 * passedGroup - The group to use for creating the AlchemyObject
 * passedContents - The texture to use for the contained material (should be a spritesheet or equivalent)
 * The following parameters are optional, but must be used in conjunction:
 * passedColor - The tint to use for the contained material (should be a spritesheet or equivalent)
 * passedQuantity - The initial quantity to fill this container with
 */
class AlchemyObject {
	constructor(passedReference, passedGroup, passedContainer, passedContents, passedColor, passedQuantity) {
		this.group = passedGroup;
		this.container = this.initElement(passedContainer);
		this.contents = this.addElement(passedContents);
		let beginDrag = function(passedObject, passedPointer) {
			// TODO:
		}
		let endDrag = function(passedObject, passedPointer) {
			// Perform reaction, or drop onto empty workspace
			let reaction = false;
			let insert = false;

			// If the object was dropped on another alchemy object, perform a reaction
			reaction = game.physics.arcade.overlap(passedObject, layer_apparatus, onReact);
			if (!reaction) {
				// If the object was NOT dropped on another alchemy object, but was dropped on a workspace space, insert it there.
				insert = game.physics.arcade.overlap(passedObject, layer_workzones, onDrop);
			}
			if ((!reaction) && (!insert)) {
				// If the object was NOT dropped on another alchemy object or a workspace, return it to its previous position.
				onReturn(passedObject);
			}
		}
		let mouseOver = function() {
			// Play clinking sound
			sound_clink.play();

			// Do tilt effect
			let randomAngle = (0.5 - Math.random()) * 10;
			let tween = game.add.tween(this.container).from({angle : randomAngle}, 50, Phaser.Easing.Linear.None, true);
		}
		let mouseOut = function() {
			// TODO:
		}
		makeDraggable(this.container, this, beginDrag, endDrag);
		makeMouseover(this.container, this, mouseOver, mouseOut);
		game.physics.arcade.enable(this.container);
		if ((passedQuantity != undefined) && (passedColor != undefined)) {
			this.quantity = passedQuantity;
			this.color = passedColor;
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

	setPosition(passedXPosition, passedYPosition) {
			this.container.x = passedXPosition;
			this.container.y = passedYPosition;
			return this;
	}

	get color() {
		return this.colorObject;
	}

	set color(passedColor) {
		this.colorObject = passedColor;
		this.contents.tint = passedColor.tint;
	}

	get quantity() {
		return this.amount;
	}

	set quantity(passedQuantity) {
		this.amount = passedQuantity;
		this.contents.frame = passedQuantity;
		return this;
	}
}

class AlchemyBottle extends AlchemyObject {
	constructor(passedReference, passedColor, passedQuantity) {
		super(passedReference, layer_apparatus, "bottle_round", "liquid_bottle", passedColor, passedQuantity);
		// Set bottle-specific properties
		this.cork = this.addElement("bottle_cork", 0, -415);
		this.container.body.setSize(300, 300, 0, 150);
	}
}

class AlchemyBowl extends AlchemyObject {
	constructor(passedReference, passedColor, passedQuantity) {
		super(passedReference, layer_apparatus, "bowl", "liquid_bowl", passedColor, passedQuantity);
		// set bowl-specific properties
		this.container.body.setSize(300, 300, 75, 0);
	}
}

class AlchemyRetort extends AlchemyObject {
	constructor(passedReference, passedColor, passedQuantity) {
		super(passedReference, layer_apparatus, "retort", "liquid_retort", passedColor, passedQuantity);
		// Set retort-specific properties
		this.container.anchor.x = 0.25;
		this.contents.anchor.x = 0.25;
		this.container.body.setSize(300, 300, 0, 0);
		this.facing = 1;
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
	constructor(passedPositionX, passedPositionY, passedQuantity) {
		// Initialize member fields
		this.position = new Phaser.Point(passedPositionX, passedPositionY);
		this.quantity = passedQuantity;
		this.spaces = [];
		this.apparatus = [];

		// Initialize member objects
		let padding = 20;
		for (let count = 0; count < passedQuantity; count += 1) {
			let circleInstance = layer_workzones.create(0, 0, "circle");
			game.physics.arcade.enable(circleInstance);
			centerAnchor(circleInstance);
			circleInstance.workArea = this;
			circleInstance.index = count;
			circleInstance.scale.setTo(spriteScale, spriteScale); // TODO: Remove when final asset size is determined
			circleInstance.x = passedPositionX + (count * (padding + circleInstance.width)) + (circleInstance.width / 2);
			circleInstance.y = passedPositionY + (circleInstance.height / 2);
			circleInstance.alpha = 0.4;
			this.spaces[count] = circleInstance;
		}
	}

	getArea(passedIndex) {
		return this.spaces[passedIndex];
	}

	insert(passedObject, passedIndex) {
		this.apparatus[passedIndex] = passedObject;
		passedObject.oldArea = this;
	}
}
