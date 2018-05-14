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
  passedButton.inputEnabled = true;
  passedButton.events.onInputDown.add(passedClickAction, passedReference);
  if (passedOverAction != undefined) {
    passedButton.events.onInputOver.add(passedOverAction, passedReference);
  }
  if (passedOutAction != undefined) {
    passedButton.events.onInputOut.add(passedOutAction, passedReference);
  }
  return passedSprite;
}
