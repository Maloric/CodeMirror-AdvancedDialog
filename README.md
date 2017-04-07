# CodeMirror-AdvancedDialog
A more advanced dialog for CodeMirror allowing for multiple inputs and buttons.

To create a new dialog, use the following command:

`cm.openAdvancedDialog(template, opts);`

The first parameter is an html template or DOM node much like the vanilla dialog, and the second is an options object with the following properties:

- **shrinkEditor** (bool) - If set to true, the editor will shrink to make room for the dialog in order to prevent the dialog obscuring any text.
- **inputBehaviours** (object) - an object with behaviours for each input in the order that they appear in the template.
  * *closeOnEnter* (bool) - if true, the dialog will close if the user hits enter when this field has focus
  * *closeOnBlur* (bool) - if true, the dialog will close if this field loses focus
  * *callback* (function) - a callback function that will be executed if the user hits enter when this field has focus.  The function receives two parameters - the first is an array of the input fields in the dialog and the second is the DOM event.
- **buttonBehaviours** (object) - an object with behaviours for each button in the order that they appear in the template.
  * *callback* (function) - a callback function that will be executed if the user hits enter when this field has focus.  The function receives two parameters - the first is an array of the input fields in the dialog and the second is the DOM event.
  
