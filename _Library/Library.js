/**
 * Utility function to create the "aged paper" pseudobackdrop.
 *
 * NOTE: This MUST be called AFTER creating all other needed groups, otherwise it won't work!
 *
 * passedContext - A reference to the current context (typically "this")
 * passedSpriteKey - The key to use for the backdrop sprite
 */
function createBackdrop(passedContext, passedSpriteKey) {
  passedContext.layer_paper = passedContext.game.add.group();
  let paper = passedContext.layer_paper.create(0, 0, passedSpriteKey);
  paper.blendMode = 2;
}

/**
 * Utility function that returns, at random, one of the arguments passed to it.
 */
function choose() {
  let index = Math.floor(Math.random() * (arguments.length));
  return arguments[index];
}

/**
 * Creates and returns a clickable "wide" button, the same style as used on the main menu.
 *
 * passedReference - A reference to the desired context (typically "this")
 * passedPositionX - The X position to create the button at
 * passedPositionY - The Y position to create the button at
 * passedGroup - The group to create the button in
 * passedSpriteKey - The key for the sprite to be emblazoned on the button
 * passedClickAction - The action that will be exectuted when the button is clicked.
 */
function createMenuButton(passedReference, passedPositionX, passedPositionY, passedGroup, passedSpriteKey, passedClickAction) {
	let buttonInstance = passedGroup.create(passedPositionX, passedPositionY, "button");
	let buttonText = passedGroup.create(passedPositionX, passedPositionY, passedSpriteKey);
	buttonInstance.alpha = 0;
	centerAnchor(buttonInstance);
	centerAnchor(buttonText);

	// Generate event callbacks
	let fadeTime = 75;
	let onClick = function() {
		sound_click.play();
    passedClickAction.bind(passedReference)();
	};
	let onMouseOver = function(passedSprite, passedPointer) {
		game.add.tween(buttonInstance).to({ alpha : 1.0 }, fadeTime, Phaser.Easing.Linear.None, true);
		sound_mouseover.play();
	};
	let onMouseOut = function(passedSprite, passedPointer) {
		game.add.tween(buttonInstance).to({ alpha : 0.0 }, fadeTime, Phaser.Easing.Linear.None, true);
	};

	// Attach event callbacks
	makeButton(buttonInstance, passedReference, onClick);
	makeMouseover(buttonInstance, passedReference, onMouseOver, onMouseOut);
	return buttonInstance;
}

/**
 * Convenience function to convert a sprite into a clickable button.
 *
 * passedSprite - The sprite to convert
 * passedReference - A reference to the current context (typically "this")
 * passedClickAction - The function to be executed when the button is clicked
 */
function makeButton(passedSprite, passedReference, passedClickAction) {
  passedSprite.inputEnabled = true;
  passedSprite.events.onInputDown.add(passedClickAction.bind(passedReference), passedReference);
  return passedSprite;
}

/**
 * Convenience function to convert a sprite into a draggable entity.
 *
 * passedSprite - The sprite to convert
 * passedReference - A reference to the current context (typically "this");
 * The remaining parameters are optional:
 * passedDragStartAction - The function to be executed when dragging begins
 * passedDragStopAction - The function to be exectuted when dragging ends
 */
function makeDraggable(passedSprite, passedReference, passedDragStartAction, passedDragStopAction) {
  passedSprite.inputEnabled = true;
  passedSprite.input.enableDrag();
  passedSprite.input.useHandCursor = true;
  passedSprite.input.bringToTop = true;
  if (passedDragStartAction != undefined) {
    passedSprite.events.onDragStart.add(passedDragStartAction.bind(passedReference), passedReference);
  }
  if (passedDragStopAction != undefined) {
    passedSprite.events.onDragStop.add(passedDragStopAction.bind(passedReference), passedReference);
  }
  return passedSprite;
}

/**
 * Convenience function to add mouseover events to the passed sprite.
 *
 * passedSprite - The sprite to add the events to
 * passedReference - A reference to the current context (typically "this");
 * passedMouseOverAction - The function to be executed when the mouse is over passedSprite
 * The remaining parameter is optional:
 * passedMouseOutAction - The function to be executed when the mouse exits passedSprite
 */
function makeMouseover(passedSprite, passedReference, passedMouseOverAction, passedMouseOutAction) {
  passedSprite.inputEnabled = true;
  passedSprite.events.onInputOver.add(passedMouseOverAction.bind(passedReference));
  if (passedMouseOutAction != undefined) {
    passedSprite.events.onInputOut.add(passedMouseOutAction.bind(passedReference));
  }
  return passedSprite;
}

/**
 * Convenience function to center the anchor point on the passed sprite.
 *
 * passedSprite - The sprite to set the anchor of
 */
function centerAnchor(passedSprite) {
  passedSprite.anchor.x = 0.5;
  passedSprite.anchor.y = 0.5;
}

/**
 * Utility function to store the current position data of the passed object in a new Phaser.Point
 * field that will be called "oldPos".
 *
 * passedObject - The object whose position should be stored
 */
function storePosition(passedObject) {
	if (passedObject.oldPos == undefined) {
		passedObject.oldPos = new Phaser.Point(passedObject.x, passedObject.y);
	}
	else {
		passedObject.oldPos.x = passedObject.x;
		passedObject.oldPos.y = passedObject.y;
	}
}

/**
 * Convenience function that returns true if the two passed Sprite objects are overlapping.
 * Does NOT require physics to be enabled in order to work!
 *
 * passedFirstSprite - The first Sprite to test
 * passedSecondSprite - The second Sprite to test
 */
function spritesOverlap(passedFirstSprite, passedSecondSprite) {
    return Phaser.Rectangle.intersects(passedFirstSprite.getBounds(), passedSecondSprite.getBounds());
}

/**
 * TutorialSplash utility class. Basically a sequence of splashes that the player may click through, but it can be used
 * for nearly anything. Call addDiagram to add funcitons that will be executed when the tutorial is clicked through.
 *
 * passedGame - A reference to the game object
 * The remaining parameter is optional:
 * passedGroup - The group to add this TutorialSplash to.
 */
class TutorialSplash extends Phaser.Sprite {
  constructor(passedGame, passedGroup) {
    super(passedGame, (passedGame.camera.width / 2), (passedGame.camera.height / 2), "ui_tutorial");
    // Configure splash
    passedGame.add.existing(this);
    if (passedGroup) {
      passedGroup.add(this);
    }
    this.anchor.setTo(0.35, 0.5);

    // Configure diagrams
    this.diagram = [];
    this.diagram_index = 0;

    // Configure escape button
    this.exit = passedGame.add.sprite(145, -90, "ui_x");
    let onMouseOver = function(passedSprite, passedPointer) {
      passedSprite.scale.setTo(1.15, 1.15);
      sound_mouseover.play();
    };
    let onMouseOut = function(passedSprite, passedPointer) {
      passedSprite.scale.setTo(1.0, 1.0);
    };
    let onClick = function(passedSprite, passedPointer) {
      let currentDiagram = this.diagram[this.diagram_index];
      let nextDiagram = this.diagram[this.diagram_index + 1];
      if (currentDiagram) {
        currentDiagram.end(currentDiagram.data, this);
      }
      if (nextDiagram) {
        nextDiagram.begin(nextDiagram.data, this);
        this.diagram_index += 1;
      }
      else {
        if (this.onComplete) {
          this.onComplete();
        }
        this.destroy();
      }
      sound_click.play();
    }
    this.addChild(this.exit);
    makeButton(this.exit, this, onClick);
    makeMouseover(this.exit, this, onMouseOver, onMouseOut);
    centerAnchor(this.exit);
  }

  addDiagram(passedReference, passedOnCreate, passedOnDestroy, passedData) {
    this.diagram[this.diagram.length] = {
      data : (passedData) ? passedData : {},
      begin : (passedOnCreate) ? passedOnCreate.bind(passedReference) : {},
      end : (passedOnDestroy) ? passedOnDestroy.bind(passedReference) : {}
    }
  }

  addOnComplete(passedReference, passedOnComplete) {
    this.onComplete = passedOnComplete.bind(passedReference);
  }

  begin() {
    let diagram = this.diagram[this.diagram_index];
    diagram.begin(diagram.data, this);
  }

  destroy() {
    super.destroy();
    this.exit.destroy();
  }
}

/**
 * Special class for randomizing sound playback, for use with sound effects.
 *
 * As one might expect, if play() is called, it will select a random sound from its internal array and play it.
 *
 * The constructor accepts an arbitray number of arguments:
 * passedGame - A reference to the game
 * ... passedSounds - Any number of Strings that you would ordinarily pass to game.add.audio().
 */
class RandomizedSound {
  constructor(passedGame, ... passedSounds) {
    this.game = passedGame;
    this.sounds = [];
    this.playing = 0;
    for (let iteratedSound of passedSounds) {
      this.sounds[this.sounds.length] = this.game.add.audio(iteratedSound);
    }
  }

  /**
   * Randomly plays one of the sounds from the internal array.
   *
   * Returns the index of that sound as a means of remembering what sound is currently playing.
   */
  play() {
    let index = this.game.rnd.integerInRange(0, this.sounds.length - 1);
    this.playing = index;
    this.sounds[index].play();
    return index;
  }

  /**
   * Stops the sound indicated by passedIndex.
   *
   * If no argument is supplied, stops the currently-playing sound.
   */
  stop(passedIndex) {
    let index = (passedIndex != undefined) ? passedIndex : this.playing;
    this.sounds[index].stop();
  }

  /**
   * Stops all sounds known to this RandomizedSound.
   */
  stopAll() {
    for (let iteratedSound of this.sounds) {
      iteratedSound.stop();
    }
  }
}
