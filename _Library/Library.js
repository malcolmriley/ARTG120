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
  passedSprite.events.onInputDown.add(passedClickAction, passedReference);
  if (passedOverAction != undefined) {
    passedSprite.events.onInputOver.add(passedOverAction, passedReference);
  }
  if (passedOutAction != undefined) {
    passedSprite.events.onInputOut.add(passedOutAction, passedReference);
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
    passedSprite.events.onDragStart.add(passedDragStartAction, passedReference);
  }
  if (passedDragStopAction != undefined) {
    passedSprite.events.onDragStop.add(passedDragStopAction, passedReference);
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
