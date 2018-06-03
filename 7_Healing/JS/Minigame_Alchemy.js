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
		this.load.image("stand_background", "stand_background.png");
		this.load.image("stand_foreground", "stand_foreground.png");
		this.load.image("burner", "burner.png");
		this.load.spritesheet("liquid_bowl", "liquid_bowl.png", 113, 75);
		this.load.spritesheet("liquid_bottle",  "liquid_bottle.png", 75, 113);
		this.load.spritesheet("liquid_retort",  "liquid_retort.png", 150, 75);

		// Load Sounds
		this.load.path = "../_Assets/sounds/";
		this.load.audio("pour", "water_pour.wav");
		this.load.audio("cork", "cork_out.wav");
		this.load.audio("clink_0", "bottle_clink_0.wav");
		this.load.audio("clink_1", "bottle_clink_1.wav");
		this.load.audio("bottle_break", "bottle_break.wav");

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
		bottle = workzone_shelf.insert(new AlchemyBottle(Color.RED, 4), 1, true);
		bowl = workzone_shelf.insert(new AlchemyBowl(Color.BLUE, 4), 2, true);
		retort = workzone_shelf.insert(new AlchemyRetort(Color.GREEN, 4), 3, true);
		burner = workzone_table.insert(new AlchemyStand(), 1, true);

		// Create Sounds
		sound_clink = new RandomizedSound(game, "clink_0", "clink_1");
		sound_pour = game.add.audio("pour");
		sound_uncork = game.add.audio("cork");
		sound_break = game.add.audio("bottle_break");
	},

	update: function()
	{

	}
}

function onReact(passedDraggedObject, passedReactingObject) {
	let shouldReturn = true;
	let sound = null;
	// If the dragged object has contents...
	if (passedDraggedObject.quantity > 0) {
		// If the receiving object has contents, perform a reaction
		if (passedReactingObject.quantity > 0) {
			switch(passedDraggedObject.objectType) {
				case "bottle_round":
					// Play pour sound
					sound = sound_pour;
					break;
			}
			passedReactingObject.color = Color.combine(passedDraggedObject.color, passedReactingObject.color);
		}
		// Otherwise, fill it from the dragged object
		else {
			switch(passedReactingObject.objectType) {
				case "stand_background":
					if (!passedReactingObject.installed) {
						passedDraggedObject.x = 0;
						passedDraggedObject.y = -70;
						passedReactingObject.addElement(passedDraggedObject);
						shouldReturn = false;
					}
					break;
				default: // Fill container
					passedReactingObject.color = passedDraggedObject.color;
					passedDraggedObject.quantity -= 1;
					passedReactingObject.quantity += 1;
					break;
			}
		}
	}
	// If the dragged object does not have contents...
	else {

	}

	// Play sound if appropriate
	if (sound) {
		sound.play();
	}

	// Return dragged object to original location
	if (shouldReturn) {
		onReturn(passedDraggedObject);
	}
}

function onDrop(passedDraggedObject, passedCircleObject) {
	let tween = game.add.tween(passedDraggedObject).to({x : passedCircleObject.x, y : passedCircleObject.y}, 250, Phaser.Easing.Circular.InOut, true);
	tween.onComplete.add(function(){
		passedCircleObject.workArea.insert(passedDraggedObject, passedCircleObject.index, true);
	});
}

function onReturn(passedSprite) {
	let tween = game.add.tween(passedSprite).to({x : passedSprite.oldPos.x, y : passedSprite.oldPos.y}, 500, Phaser.Easing.Circular.InOut, true);
}

function onFall(passedSprite) {
	if (spritesOverlap(passedSprite, table) || spritesOverlap(passedSprite, shelf)) {
		onReturn(passedSprite);
	}
	else {
		passedSprite.body.gravity.y = 1200;
		passedSprite.inputEnabled = false;
		let breakIt = function() {
			if (passedSprite.workarea) {
				passedSprite.workarea.reference.remove(passedSprite.workarea.index);
			}
			passedSprite.kill();
			sound_break.play();
		}
		passedSprite.checkWorldBounds = true;
		passedSprite.events.onOutOfBounds.add(breakIt, this);
	}
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

	invert(passedColor) {
		let calculatedIndex = passedColor.index + (Math.floor(this.colorArray.length / 2));
		return this.get(calculatedIndex);
	}

	combine(passedFirstColor, passedSecondColor) {
		let calculatedIndex = Math.floor((passedFirstColor.index + passedSecondColor.index) / 2);
		return this.get(calculatedIndex);
	}

	split(passedColor) {
		let instance = { first : this.get(passedColor.index - 1), second : this.get(passedColor.index + 1)};
		return instance;
	}

	rotate(passedColor, passedDirection) {
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
class AlchemyObject extends Phaser.Sprite {
	constructor(passedGroup, passedContainer, passedContents, passedColor, passedQuantity) {
		// Due Diligence
		super(game, 0, 0, passedContainer);
		game.add.existing(this);
		passedGroup.add(this);
		game.physics.arcade.enable(this);

		// Set local properties
		this.anchor.setTo(0.5, 0.9);
		this.group = passedGroup;

		// Define callbacks
		let beginDrag = function(passedObject, passedPointer) {
			if (passedObject.parent.removeElement) {
				passedObject.parent.removeElement(passedObject);
			}
			else {
				passedObject.parent.removeChild(passedObject);
			}
			passedGroup.add(passedObject);
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
				onFall(passedObject);
			}
		}
		let mouseOver = function(passedObject, passedPointer)  {
			// Play clinking sound
			sound_clink.play();

			// Do tilt effect
			let randomAngle = (0.5 - Math.random()) * 10;
			let tween = game.add.tween(this).from({angle : randomAngle}, 50, Phaser.Easing.Linear.None, true);
			let resetAngle = function() {
				this.angle = 0;
			}
			tween.onComplete.add(resetAngle, this);
		}
		let mouseOut = function(passedObject, passedPointer)  {
			// TODO:
		}

		// Attach callbacks
		makeDraggable(this, this, beginDrag, endDrag);
		makeMouseover(this, this, mouseOver, mouseOut);
	}

	initElement(passedKey, passedXPosition, passedYPosition) {
		let instance = this.group.create(0, 0, passedKey);
		if ((passedXPosition != null) && (passedYPosition != null)) {
			instance.x = passedXPosition;
			instance.y = passedYPosition;
		}
		instance.anchor.setTo(this.anchor.x, this.anchor.y);
		return instance;
	}

	addElement(passedObject, passedXPosition, passedYPosition) {
		this.addChild(passedObject);
		return passedObject;
	}

	removeElement(passedObject) {
		this.removeChild(passedObject);
		return passedObject;
	}

	get objectType() {
		return this.key;
	}
}

class AlchemyContainer extends AlchemyObject {
	constructor(passedGroup, passedContainer, passedContents, passedColor, passedQuantity) {
		super(passedGroup, passedContainer);

		this.contents = this.addChild(this.initElement(passedContents));

		// Set properties of contents if defined
		if ((passedQuantity != undefined) && (passedColor != undefined)) {
			this.quantity = passedQuantity;
			this.color = passedColor;
		}
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
		this.contents.frame = (passedQuantity <= 4) ? passedQuantity : 4;
		return this;
	}
}

class AlchemyStand extends AlchemyObject {
	constructor() {
		super(layer_apparatus, "stand_background");
		this.body.setSize(75, 75, 19, 50);
		this.burner = this.addChild(this.initElement("burner"));
		this.anchor.y = 0.8;
		this.frontlegs = this.addChild(this.initElement("stand_foreground"));
		this.installed = false;
	}

	addElement(passedObject) {
		super.addElement(passedObject);
		super.addChild(this.frontlegs);
		this.installed = true;
	}

	removeElement(passedObject) {
		super.removeElement(passedObject);
		this.installed = false;
	}
}

class AlchemyBottle extends AlchemyContainer {
	constructor(passedColor, passedQuantity) {
		super(layer_apparatus, "bottle_round", "liquid_bottle", passedColor, passedQuantity);
		// Set bottle-specific properties
		this.cork = this.addChild(this.initElement("bottle_cork", 0, -95));
		this.body.setSize(75, 75, 0, 38);
	}
}

class AlchemyBowl extends AlchemyContainer {
	constructor(passedColor, passedQuantity) {
		super(layer_apparatus, "bowl", "liquid_bowl", passedColor, passedQuantity);
		// set bowl-specific properties
		this.body.setSize(75, 75, 20, 0);
	}
}

class AlchemyRetort extends AlchemyContainer {
	constructor(passedColor, passedQuantity) {
		super(layer_apparatus, "retort", "liquid_retort", passedColor, passedQuantity);
		// Set retort-specific properties
		this.anchor.x = 0.25;
		this.contents.anchor.x = 0.25;
		this.body.setSize(75, 75, 0, 0);
		this.facing = 1;
	}
}

/**
 * WorkArea object.
 *
 * passedPositionX - The x position of the work area in total
 * passedPositionY - The y position of the work area in total
 * passedQuantity - The number of "spaces" in the work area
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
			circleInstance.x = passedPositionX + (count * (padding + circleInstance.width)) + (circleInstance.width / 2);
			circleInstance.y = passedPositionY + (circleInstance.height / 2);
			circleInstance.alpha = 0.4;
			this.spaces[count] = circleInstance;
		}
	}

	getArea(passedIndex) {
		return this.spaces[passedIndex];
	}

	insert(passedObject, passedIndex, passedSetPosition) {
		this.apparatus[passedIndex] = passedObject;
		if (passedObject.workarea) {
			passedObject.workarea.reference.remove(passedObject.workarea.index);
		}
		passedObject.workarea = { reference : this, index : passedIndex };
		if (passedSetPosition) {
			passedObject.x = this.spaces[passedIndex].x;
			passedObject.y = this.spaces[passedIndex].y;
			storePosition(passedObject);
		}
		return passedObject;
	}

	remove(passedIndex) {
		this.apparatus.workarea = null;
		this.apparatus[passedIndex] = null;
	}
}
