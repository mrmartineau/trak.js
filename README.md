# trak.js - Universal analytics event tracking API wrapper

Put simply, **trak.js** is a wrapper for any analytics API. By default it uses Google Universal Analytics but you can override this with the older ga.js or Google Tag Manager if you wish, or you can even add custom event trackers as well, instead of Google Analytics.

[![npm version](https://badge.fury.io/js/trak.js.svg)](http://badge.fury.io/js/trak.js) [![Build Status](https://travis-ci.org/mrmartineau/trak.js.svg)](https://travis-ci.org/mrmartineau/trak.js) [![Code Climate](https://codeclimate.com/github/mrmartineau/trak.js.png)](https://codeclimate.com/github/mrmartineau/trak.js) <br>
[![NPM](https://nodei.co/npm/trak.js.png?downloads=true)](https://nodei.co/npm/trak.js/)

## Getting the Library
### Direct downloads
- [Minified](https://raw.githubusercontent.com/mrmartineau/trak.js/master/dist/trak.min.js) (~481 B gzipped)
- [Unminified](https://raw.githubusercontent.com/mrmartineau/trak.js/master/dist/trak.js) (~1.7 KB gzipped)

### Bower
`bower install trak`

### NPM
`npm install trak.js --save`

## Usage
Include **trak.js** in your JavaScript bundle or add it to your HTML page like this:

```html
<script type='application/javascript' src='/path/to/trak.js'></script>
```

or with NPM/Browserify

```js
var trak = require('trak.js');
```

then run `trak.start();` when the DOM is ready (after version 0.3.0 this has changed, run `trak();` before version 0.3.0):

```js
// Native JS
document.addEventListener('DOMContentLoaded', function(e) {
  trak.start();
}

// jQuery
$(function(){
  trak.start();
});
```

# API Reference
There are two main ways to use **trak.js**, in your js code or as `data-trak` attributes in your markup.

## JS implementation:
### trak.event({category: '', action: '', label: '' , value: '', nonInteraction: '', eventName: ''})

Fires an analytics event

#### Arguments object: (these are all optional)
*category*: A string value of the category value to set<br>
*action*: A string value of the action value to set<br>
*label*: A string value of the label value to set<br>
*value*: An integer<br>
**trigger**: A string value of a valid event name: `click`, `focus`, `mouseover` etc<br>
**nonInteraction**: An integer<br>
**eventName**: A string value used only with Google Tag Manager. Define your GTM event name here

If any property is left `undefined`, the browser's default value will be used instead.

```js
trak.event({category: 'category value', action: 'action value'});
trak.event({category: 'category value', action: 'action value', label: 'label value'});
trak.event({category: 'category value', action: 'action value', label: 'label value' , value: '', nonInteraction: '', eventName: ''});
```
##### Example:
```js
el.addEventListener('click', function() {
  trak.event({category: 'engagement', action: 'signpost', label: 'page.href'});
}
el.addEventListener('mouseover', function() {
  trak.event({
    category: 'engagement',
    action: 'signpost',
    label: 'page.href',
    value: 10,
    nonInteraction: true,
    eventName: 'This is a Google Tag Manager event name'
  });
}
```

### data-trak attr implementation
```html
<a data-trak='{"category":"Rating","action":"Comparison notepad","label":"Up"}' href="#">link</a>
```

### Custom trigger type (new as of v0.4.0)
`data-trak` attrs can also define a custom trigger type instead of `click`. Now `mouseover`, `touchstart`, `focus`, `blur` or any other valid event can be used to trigger a trak event.

```html
<!-- Triggered on focus -->
<a data-trak='{"trigger":"focus","category":"Test category","action":"Test action","label":"Test label"}' href="#pagehref">Custom trigger type</a>
```

### Wildcards
Wildcards can be used to specify certain options like the page title or url.

##### page.href: Uses `window.location.href`
```html
<a data-trak='{"category":"Rating","action":"page.href","label":"Up"}' href="#">link</a>
```
##### page.title: Uses `document.title`
```html
<a data-trak='{"category":"Rating","action":"page.title","label":"Up"}'href="#" >link</a>
```
##### link.href: Uses `this.href`
```html
<a data-trak='{"category":"Rating","action":"link.href","label":"Up"}' href="#">link</a>
```
##### link.title: Uses `this.title`
```html
<a data-trak='{"category":"Rating","action":"link.title","label":"Up"}' href="#">link</a>
```
##### referrer: Uses `document.referrer`
```html
<a data-trak='{"category":"Rating","action":"document.referrer","label":"Up"}' href="#">link</a>
```

#### Using `data-trak` attr options with but fire event with js
You can also use data-* attr options but fire events in js. To do this, add the relevant `data-trak` data and also a `data-trakwithjs` boolean attribute. This means that the event will only fire when you run it in your js. To run in your js, use the `trak.attrEvent` method like we have below:

```html
<a data-trakwithjs data-trak='{"category":"Tracked with JS not attr call","action":"link.href","label":"this is a label"}' href="#pagehref">trakwithjs</a>

<script>
  el.addEventListener('click', function() {
    trak.attrEvent.call(this);
  });
</script>
```
See this in use in the [trak demo](http://tech.tmw.co.uk/code/trak/demo.html).

---

### Options
Various default **trak.js** options can be overridden:

#### trak.options.clean
Choose whether you'd like to clean the provided category, action and labels

Type: `boolean`
Default: `true`


#### trak.options.delimeter
**trak.js** includes a cleaning method to normalise the arguments that are passed to it. Spaces are converted to an underscore by default but can be overridden by reassigning this value.

Type: `string`
Default: `_`


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
trak.options.additionalTypes = function(opts) {
  UDM.evq.push(['trackEvent', trak.clean(opts.category), trak.clean(opts.action)]); // trak.clean(opts.label)
  console.log('Fire additional event:', opts);
}
```

#### trak.options.debug
Type: `boolean`
Default: `false`

Show debug logs in the javascript console

---

## Which tracking API's are used?
The default implementation uses latest version of Google Analytics (`ga.js`) but **trak.js** also supports the older `_gaq` type or Google Tag Manager.

---
## Browser Compatibility
trak.js has been tested in the following browsers:
- Chrome
- Firefox 3+
- Opera 10+
- Internet Explorer 8+
