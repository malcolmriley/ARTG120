var Minigame_Alchemy = function(game) {};
Minigame_Alchemy.prototype =
{
	init: function(x,y)
	{
		row=x;
		col=y;	
	},

	preload: function()
	{
		// Define colors
		AlchemyColor = Object.freeze(new AlchemyColors());
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

		// Define Objective
		objective = defineObjective();
    let text = game.add.text((game.camera.width / 2), 20, "Create a " + getQuantityText(objective.quantity) + " of " + objective.color.name + " potion.", { align: "center" });
    text.anchor.setTo(0.5, 0.5);

		// Add equipment. You get: 1 Stand, 1 Bowl
		workzone_table.insert(new AlchemyStand(), 0);
		workzone_shelf.insert(new AlchemyBowl(), 0);
		workzone_shelf.insert(new AlchemyRetort(), 1);

		// Add ingredients. You get: 3 randomly filled potion bottles.
		let firstColor = AlchemyColor.randomNotIncluding(objective.color);
		let secondColor = AlchemyColor.randomNotIncluding(objective.color);
		let thirdColor = AlchemyColor.randomNotIncluding(objective.color);
		workzone_shelf.insert(new AlchemyBottle(firstColor, 4), 2);
		workzone_shelf.insert(new AlchemyBottle(secondColor, 4), 3);
		workzone_shelf.insert(new AlchemyBottle(thirdColor, 4), 4);

		// Create Sounds
		sound_clink = new RandomizedSound(game, "clink_0", "clink_1");
		sound_ping = new RandomizedSound(game, "metal_ping_1", "metal_ping_2", "metal_ping_3");
		sound_pour = game.add.audio("pour");
		sound_uncork = game.add.audio("cork");
		sound_break = game.add.audio("bottle_break");
	},

	update: function()
	{
		let totalVolume = 0;
		layer_apparatus.forEach(function(object){
			if (object.onUpdate) {
				object.onUpdate();
				if (object.quantity) {
					totalVolume += object.quantity;
				}
				// See if the objective is fulfilled anywhere in the workspace
				if (checkObjective(object, objective)) {
					// TODO: Win state goes here.
					health[row][col]+=Math.floor(Math.random()*10)+5;
					// set a cap for mamximum health
					if(health[row][col]>100)
					{
						health[row][col]=100;
					}

					console.log("WIN");
					this.game.state.start("Town");
				}
			}
		});
		// If there isn't enough volume to make a potion, you lose
		if (objective) {
			if (totalVolume < objective.quantity) {
				health[row][col]-=Math.floor(Math.random()*10)+10;
				// add to dead if happen to fail during minigame
				if(health[num]<1)
				{
					dead++;	
				}

				this.game.state.start("MiniGameOver");
			}
		}
	}
}

function getQuantityText(passedQuantity) {
	switch(passedQuantity) {
		case 1:
			return "one-quarter dose"
			break;
		case 2:
			return "one-half dose"
			break;
		case 3:
			return "three-quarter dose"
			break;
		case 4:
			return "full dose";
			break;
	}
	return "dose"; // Just in case.
}

function defineObjective() {
	let objective_color = AlchemyColor.random();
	let objective_quantity = Math.floor(Math.random() * 4) + 1;
	let instance = { color : objective_color, quantity : objective_quantity };
	return instance;
}

function checkObjective(passedAlchemyObject, passedObjective) {
	return (passedAlchemyObject.color == passedObjective.color) && (passedAlchemyObject.quantity >= passedObjective.quantity);
}

function onReact(passedDraggedObject, passedReactingObject) {
	let shouldReturn = true;
	let sound = null;
	if (passedReactingObject.objectType == "stand_background") {
		if (!passedReactingObject.installed) {
			passedReactingObject.addElement(passedDraggedObject);
			sound = sound_ping;
			shouldReturn = false;
		}
	}
	// If the dragged object has contents...
	else if (passedDraggedObject.quantity > 0) {
		// If the receiving object has contents, perform a reaction
		if (passedReactingObject.quantity > 0) {
			switch(passedDraggedObject.objectType) {
				case "bottle_round":
					// Play pour sound
					sound = sound_pour;
					break;
			}
			passedReactingObject.color = AlchemyColor.combine(passedDraggedObject.color, passedReactingObject.color);
		}
		// Otherwise, fill it from the dragged object
		else {
			passedReactingObject.color = passedDraggedObject.color;
		}
		passedDraggedObject.quantity -= 1;
		passedReactingObject.quantity += 1;
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
	let destinationX = passedCircleObject.x;
	let destinationY = passedCircleObject.y;
	let occupied = passedCircleObject.workarea.isOccupied(passedCircleObject.index);
	if (occupied) {
		destinationX = passedDraggedObject.oldPos.x;
		destinationY = passedDraggedObject.oldPos.y;
	}
	let tween = game.add.tween(passedDraggedObject).to({x : destinationX, y : destinationY}, 250, Phaser.Easing.Circular.InOut, true);
	if (!occupied) {
		tween.onComplete.add(function(){
			passedCircleObject.workarea.insert(passedDraggedObject, passedCircleObject.index);
		});
	}
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
			passedSprite.destroy();
			sound_break.play();
		}
		passedSprite.checkWorldBounds = true;
		passedSprite.events.onOutOfBounds.add(breakIt, this);
	}
}

class AlchemyColors {
	constructor() {
		let init = function(passedIndex, passedColor, passedName) {
			let instance = { index : passedIndex, tint : passedColor, name : passedName};
			return instance;
		};
		this.RED = init(0, 0xB50000, "red");
		this.ORANGE = init(1, 0xC55500, "orange");
		this.YELLOW = init(2, 0xFFBA1A, "yellow");
		this.GREEN = init(3, 0x5C8D1A, "green");
		this.BLUE = init(4, 0x0030B5, "blue");
		this.INDIGO = init(5, 0x5956B5, "indigo");
		this.VIOLET = init(6, 0x8627FF, "violet");
		this.MAGENTA = init(7, 0x862768, "magenta");
		this.colorArray = [this.RED, this.ORANGE, this.YELLOW, this.GREEN, this.BLUE, this.INDIGO, this.VIOLET, this.MAGENTA];
	}

	randomFrom(passedArray) {
		let index = Math.floor(Math.random() * passedArray.length);
		return passedArray[index];
	}

	random() {
		return this.randomFrom(this.colorArray);
	}


	randomNotIncluding(passedColor) {
		let tempArray = this.colorArray.filter(function(color){ return (color != passedColor); });
		return this.randomFrom(tempArray);
	}

	get(passedIndex) {
		let modulo = (passedIndex % this.colorArray.length);
		let index = (passedIndex >= 0) ? modulo : (this.colorArray.length - Math.abs(modulo));
		return this.colorArray[index];
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
			if (passedObject.workarea) {
				passedObject.workarea.reference.remove(passedObject.workarea.index);
				passedObject.workarea = null;
			}
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
			tween.onComplete.add(function(){ this.angle = 0 }, this);
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
		passedObject.x = 0;
		passedObject.y = -70;
		this.addChild(passedObject);
		return passedObject;
	}

	removeElement(passedObject) {
		this.removeChild(passedObject);
		return passedObject;
	}

	onUpdate() {

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
		else {
			this.quantity = 0;
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
		if (this.amount > 4) {
			this.amount = 4;
			let spill = layer_workzones.create(this.x, this.y, "spill");
			spill.anchor.setTo(0.5, 0.5);
			spill.tint = this.color.tint;
			let tween = game.add.tween(spill).to({alpha : 0}, 1000 + Math.random() * 2000, Phaser.Easing.Linear.None, true);
			tween.onComplete.add(function(){spill.kill()});
		}
		this.contents.frame = (passedQuantity <= 4) ? passedQuantity : 4;
		return this;
	}
}

class AlchemyStand extends AlchemyObject {
	constructor() {
		super(layer_apparatus, "stand_background");
		this.burner = this.addChild(this.initElement("burner"));
		this.anchor.y = 0.8;
		this.frontlegs = this.addChild(this.initElement("stand_foreground"));
		this.installed = null;
		this.progress = 0;
	}

	addElement(passedObject) {
		super.addElement(passedObject);
		this.body.setSize(75, 75, 19, 50);
		super.addChild(this.frontlegs);
		this.installed = passedObject;
		this.progress = 1;
	}

	removeElement(passedObject) {
		super.removeElement(passedObject);
		this.body.setSize(113, 125, 0, 0);
		this.installed = null;
		this.progress = 1;
	}

	onUpdate() {
		if (this.installed && this.workarea) {
			if (this.installed.quantity > 0) {
				this.progress += 1;
				if ((this.progress % 120) == 0) {
					this.progress = 0;
					let color = this.installed.color;
					switch(this.installed.objectType) {
						case "bottle_round":
							this.installed.color = AlchemyColor.rotate(color, 1);
							break;
						case "bowl":
							this.installed.color = AlchemyColor.rotate(color, -1);
							break;
						case "retort":
							let circle = this.workarea.reference.getArea(this.installed.facing + this.workarea.index);
							let apparatus = (circle) ? circle.apparatus : null;
							if (apparatus) {
								if (apparatus.quantity > 0) {
									apparatus.color = AlchemyColor.combine(AlchemyColor.invert(color), apparatus.color);
								}
								else {
									apparatus.color = AlchemyColor.invert(color);
								}
								apparatus.quantity += 1;
							}
							break;
					}
					this.installed.quantity -= 1;
				}
			}
		}
	}

	get quantity() {
		return (this.installed) ? this.installed.quantity : 0;
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

	get direction() {
		return this.facing;
	}

	set direction(passedValue) {
		this.facing = (passedValue < 0) ? -1 : 1;
		this.scale.x = this.facing;
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

		// Initialize member objects
		let padding = 20;
		for (let count = 0; count < passedQuantity; count += 1) {
			let circleInstance = layer_workzones.create(0, 0, "circle");
			game.physics.arcade.enable(circleInstance);
			centerAnchor(circleInstance);
			circleInstance.workarea = this;
			circleInstance.index = count;
			circleInstance.apparatus = null;
			circleInstance.x = passedPositionX + (count * (padding + circleInstance.width)) + (circleInstance.width / 2);
			circleInstance.y = passedPositionY + (circleInstance.height / 2);
			circleInstance.alpha = 0.4;
			this.spaces[count] = circleInstance;
		}
	}

	isOccupied(passedIndex) {
		return (this.getArea(passedIndex).apparatus != null);
	}

	getArea(passedIndex) {
		return this.spaces[passedIndex];
	}

	insert(passedObject, passedIndex) {
		this.getArea(passedIndex).apparatus = passedObject;
		if (passedObject.workarea) {
			passedObject.workarea.reference.remove(passedObject.workarea.index);
		}
		passedObject.workarea = { reference : this, index : passedIndex };
		passedObject.x = this.getArea(passedIndex).x;
		passedObject.y = this.getArea(passedIndex).y;
		storePosition(passedObject);
		return passedObject;
	}

	remove(passedIndex) {
		this.getArea(passedIndex).apparatus = null;
	}
}
