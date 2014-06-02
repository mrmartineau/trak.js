# Trak - Universal event tracking API

## Usage:
There are two main ways to use **trak.js**, in you js code or as data attributes in your markup.

### JS implementation:
```js
Trak.event('category', 'action');
Trak.event('category', 'action', 'label');
Trak.event('category', 'action', 'label', value); // value is an integer
Trak.event('category', 'action', 'label', value, nonInteraction); // nonInteraction is an integer
```
### Example:
`Trak.event('engagement', 'signpost', 'href');

### Data attr implementation:
```js
<a href="#" data-trak='{"category":"Rating","action":"Comparison notepad","label":"Up"}'>link</a>
```

#### Data-attr wildcards:
Wildcards can be used to specify certain options like the page title or url. 
##### HREF: Uses window.location.href
`<a href="#" data-trak='{"category":"Rating","action":"href","label":"Up"}'>link</a>``

##### TITLE: Uses document.title
`<a href="#" data-trak='{"category":"Rating","action":"href","label":"title"}'>link</a>`

## Options
Various default **trak.js** options can be overridden:

### Trak.options.delimeter
**trak.js** includes a cleaning method to normalise the arguments that are passed to it.
```js
clean : function(str) {
  return str.toString().replace(/\s|'|"/g, this.options.delimeter).toLowerCase();
}
```
**Default**: `'_'`
**Alternatives**: Anything you like, preferably a hyphen

### Trak.options.trackType
Use this to change your default tracking provider.
**Default**: `'ga'`
**Alternatives**: `'gaq'`

## Which tracking API's are used?
The default implementation uses latest version of Google Analytics (`ga.js`) but **trak.js** also supports the older `_gaq` type. For more information about either, please visit https://developers.google.com/analytics/devguides/collection/analyticsjs/
