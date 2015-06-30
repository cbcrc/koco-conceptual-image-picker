# koco-conceptual-image-picker
Component for launching and receiving the output of a UI for choosing a conceptual image.


## Installation

```bash
bower install koco-conceptual-image-picker


## Usage with KOCO

This is a shared module that is mostly used in conjunction with other modules related to koco-conceptual-image-picker. By convention it is registered in your components.js like so:

```javascript
Components.prototype.registerComponents = function() {
    ...
    koUtilities.registerComponent('koco-conceptual-image-picker');
    ...
};
````