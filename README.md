# Trak - Universal event tracking API

## Usage:
Include trak.js in your JavaScript bundle or add it to your HTML page like this:
```js
<script type='application/javascript' src='/path/to/trak.js'></script>
```
Don't forget to add a [shim](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener#Compatibility) for `addEventListener` if you want to support IE8 and below.

There are two main ways to use **trak.js**, in you js code or as data attributes in your markup.

### JS implementation:
```js
Trak.event('category', 'action');
Trak.event('category', 'action', 'label');
Trak.event('category', 'action', 'label', value); // value is an integer
Trak.event('category', 'action', 'label', value, nonInteraction); // nonInteraction is an integer
```
##### Example:
`Trak.event('engagement', 'signpost', 'page.href');`

### Data attr implementation:
```html
<a href="#" data-trak='{"category":"Rating","action":"Comparison notepad","label":"Up"}'>link</a>
```

#### Data-attr wildcards:
Wildcards can be used to specify certain options like the page title or url. 
##### page.href: Uses `window.location.href`
```html
<a href="#" data-trak='{"category":"Rating","action":"page.href","label":"Up"}'>link</a>
``` 
##### page.title: Uses `document.title`
```html
<a href="#" data-trak='{"category":"Rating","action":"page.title","label":"Up"}'>link</a>
```
##### link.href: Uses `this.href`
```html
<a href="#" data-trak='{"category":"Rating","action":"link.href","label":"Up"}'>link</a>
```
##### link.title: Uses `this.title`
```html
<a href="#" data-trak='{"category":"Rating","action":"link.title","label":"Up"}'>link</a>
```

--- 

## Options
Various default **trak.js** options can be overridden:

### Trak.options.delimeter
**trak.js** includes a cleaning method to normalise the arguments that are passed to it. Spaces are converted to an underscore by default but can be overridden by reassigning this value.
* **Default**: `'_'`
* **Alternatives**: Anything you like

### Trak.options.trackType
Use this to change your default tracking provider.

* **Default**: `'ga'`
* **Alternatives**: `'_gaq'`

## Which tracking API's are used?
The default implementation uses latest version of Google Analytics (`ga.js`) but **trak.js** also supports the older `_gaq` type. For more information about either, please visit https://developers.google.com/analytics/devguides/collection/analyticsjs/
