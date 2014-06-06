# trak.js - Universal analytics event tracking API

## Usage:
Include **trak.js** in your JavaScript bundle or add it to your HTML page like this:
```js
<script type='application/javascript' src='/path/to/trak.js'></script>
```

There are two main ways to use **trak.js**, in you js code or as data-* attributes in your markup.

### JS implementation:
```js
trak.event('category', 'action');
trak.event('category', 'action', 'label');
trak.event('category', 'action', 'label', value); // value is an integer
trak.event('category', 'action', 'label', value, nonInteraction); // nonInteraction is an integer
```
##### Example:
`trak.event('engagement', 'signpost', 'page.href');`

### Data-* attr implementation:
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
##### referrer: Uses `document.referrer`
```html
<a href="#" data-trak='{"category":"Rating","action":"document.referrer","label":"Up"}'>link</a>
```

--- 

### Options
Various default **trak.js** options can be overridden:

#### trak.options.clean
Type: `boolean`  
Default: `true`

Choose whether you'd like to clean the provided category, action and labels

#### trak.options.delimeter
Type: `string`  
Default: `_`

**trak.js** includes a cleaning method to normalise the arguments that are passed to it. Spaces are converted to an underscore by default but can be overridden by reassigning this value.

#### trak.options.trackType
Type: `string`  
Default: `ga`
Alternatives: 
* `ga` : Google Analytics (Universal 
* `_gaq` : Google Analytics (ga.js) Old version
* `gtm` : Google Tag Manager

Use this to change your default tracking provider.

#### trak.options.additionalTypes
Type: `function`  
Default: `undefined`

Add any other event tracking providers. See below for example:

```js
trak.options.additionalTypes = function() {
	UDM.evq.push(['trackEvent', trak.clean(category), trak.clean(action)]); // trak.clean(label)
	console.log('Fire additional event');
}
```

#### trak.options.debug
Type: `boolean`  
Default: `false`

Show debug logs in the js console

--- 

## Which tracking API's are used?
The default implementation uses latest version of Google Analytics (`ga.js`) but **trak.js** also supports the older `_gaq` type or Google Tag Manager.
