/* trak.js v0.3.0 | (c) 2014 @mrmartineau | https://github.com/tmwagency/trak.js
   Universal event tracking API. */
var trak = (function() {
	'use strict';


	/**
	 * trak.clean()
	 * Cleans the input replacing spaces with a specified delimeter (see trak.options) and converts to lower case
	 * @param  string str
	 * @return string cleaned string
	 */
	var clean = function(str) {
		if (!str) {
			return '';
		}
		if (!trak.options.clean) {
			return wildcard.call(this, str);
		} else {
			return wildcard.call(this, str).toString().replace(/\s|'|"/g, settings.delimeter).toLowerCase();
		}
	};


	/**
	 * trak.event()
	 * @param  object options     See getOptions() function for available items
	 */
	var event = function(options) {
		var opts           = getOptions(options);

		// Cache the options
		var category       = clean.call(this, opts.category);
		var action         = clean.call(this, opts.action);
		var label          = clean.call(this, opts.label);
		var eventName      = opts.eventName;
		var value          = opts.value;
		var nonInteraction = opts.nonInteraction;

		if (settings.trackType === 'ga' && typeof ga !== 'undefined') {
			ga('send', 'event', category, action, label, value, {'nonInteraction': nonInteraction});

		} else if (settings.trackType === '_gaq' && typeof _gaq !== 'undefined') {
			_gaq.push(['_trackEvent', category, action, label, value]);

		} else if (settings.trackType === 'gtm' && typeof dataLayer !== 'undefined') {
			dataLayer.push({
				'event'         : eventName,
				'eventCategory' : category,
				'eventAction'   : action,
				'eventLabel'    : label,
				'eventValue'    : value
			});
		}

		if (settings.additionalTypes !== undefined) {
			settings.additionalTypes();
		}

		if (settings.debug) {
			console.debug('Debug message:\n Category:', category, '\n Action:', action, '\n Label:', label);
		}
	};


	/**
	 * dataAttrEvent
	 * This is called when any element with the [data-trak] attribute is clicked.
	 * If [data-trakwithjs] is present on the element, the trak.attr() method is not called
	 * To allow use of the
	 */
	var dataAttrEvent = function() {
		var trakWithJs = this.getAttribute('data-trakwithjs') !== null ? true : false;
		if (!trakWithJs) {
			attrEvent.call(this);
		}
	};


	/**
	 * attrEvent
	 * This is used when elements with the [data-trak] is present.
	 * It calls trak.event()
	 * Usage in your js code:
	 * > trak.attrEvent.call(this);
	 */
	var attrEvent = function() {
		var _options = JSON.parse(this.getAttribute('data-trak'));
		event.call(this, _options);
	};


	/**
	 * Function to convert wildcards into real values
	 * @param  string str
	 * @return string     The converted ouput from str
	 */
	var wildcard = function(str) {
		var output;

		switch(str) {
			case 'page.title':
				output = document.title;
				break;
			case 'page.href':
				output = window.location.href;
				break;
			case 'link.href':
				output = this.href;
				break;
			case 'link.title':
				output = this.title;
				break;
			case 'referrer':
				output = document.referrer ? document.referrer : 'No referrer';
				break;
			default:
				output = str;
				break;
		}
		return output;
	};


	/**
	 * getOptions
	 * Get all the options
	 */
	var getOptions = function (opts) {
			return {
				category       : opts && opts.category       || '',
				action         : opts && opts.action         || '',
				label          : opts && opts.label          || '',
				value          : opts && opts.value          || 0,
				nonInteraction : opts && opts.nonInteraction || false,
				eventName      : opts && opts.eventName      || undefined
			};
	};


	/**
	 * trak.options
	 * These are the default options for trak.js
	 * To override them, reassign these values in your code, see
	 * https://gist.github.com/mrmartineau/24ae259f373e6dbda66f for an example
	 * @type {Object}
	 */
	var settings = {
		clean           : true, // trak.options.clean     = false
		delimeter       : '_',  // trak.options.delimeter = '-'
		trackType       : 'ga', // trak.options.trackType = 'ga' Available options: ga, _gaq & gtm
		additionalTypes : undefined,
		debug           : false
	};


	var start = function() {
		var trakElements = document.querySelectorAll('[data-trak]');
		for (var i = 0; i < trakElements.length ; i++) {
			if (trakElements[i].addEventListener) {
				trakElements[i].addEventListener('click', dataAttrEvent);
			} else if (trakElements[i].attachEvent) {
				trakElements[i].attachEvent('onclick', dataAttrEvent);
			}
		}
	};

	return {
		start     : start,
		clean     : clean,
		event     : event,
		attrEvent : attrEvent,
		wildcard  : wildcard,
		options   : settings
	};

})();


// Check for AMD/Module support, otherwise define trak as a global variable.
if (typeof define !== 'undefined' && define.amd) {
	// AMD. Register as an anonymous module.
	define (function() {
		'use strict';
		return trak;
	});
} else if (typeof module !== 'undefined' && module.exports) {
	module.exports = trak;
} else {
	window.trak = trak;
}
