/**
 * Convenience function to convert a sprite into a clickable button.
 *
 * passedSprite - The sprite to convert
 * passedReference - A reference to the current context (typically "this")
 * passedClickAction - The function to be executed when the button is clicked
 * The remaining paramters are optional:
 * passedOverAction - The function to be executed when the cursor enters the button's bounds
 * passedOutAction - The function to be executed when the cursor exits the button's bounds
 */
function makeButton(passedSprite, passedReference, passedClickAction, passedOverAction, passedOutAction) {
  passedSprite.inputEnabled = true;
  passedSprite.events.onInputDown.add(passedClickAction.bind(passedReference), passedReference);
  if (passedOverAction != undefined) {
    passedSprite.events.onInputOver.add(passedOverAction.bind(passedReference), passedReference);
  }
  if (passedOutAction != undefined) {
    passedSprite.events.onInputOut.add(passedOutAction.bind(passedReference), passedReference);
  }
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
  passedSprite.events.onInputOver(passedMouseOverAction.bind(passedReference));
  if (passedMouseOutAction != undefined) {
    passedSprite.events.onInputOut(passedMouseOutAction.bind(passedReference));
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
