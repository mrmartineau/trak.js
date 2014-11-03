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
			return str;
		} else {
			return str.toString().replace(/\s|'|"/g, options.delimeter).toLowerCase();
		}
	};

	/**
	 * trak.event()
	 * @param  string category         The category of the tracking event
	 * @param  string action           The action of the tracking event
	 * @param  string label            The label of the tracking event
	 * @param  object options          The label of the tracking event
	 * @param  number value            Use this to assign a numerical value to a tracked page object
	 * @param  boolean nonInteraction  Used if trak.options.trackType = 'ga': you might want to send an event, but not impact your bounce rate.
	 */
	var event = function(category, action, label, extendedOptions) {
		extendedOptions = getExtendedOptions(extendedOptions);

		if (options.trackType === 'ga' && typeof ga !== 'undefined') {
			ga('send', 'event', clean(category), clean(action), clean(label), extendedOptions.value, {'nonInteraction': extendedOptions.nonInteraction});
		} else if (options.trackType === '_gaq' && typeof _gaq !== 'undefined') {
			_gaq.push(['_trackEvent', clean(category), clean(action), clean(label), extendedOptions.value]);
		} else if (options.trackType === 'gtm' && typeof dataLayer !== 'undefined') {
			dataLayer.push({
				'event'         : extendedOptions.eventName,
				'eventCategory' : clean(category),
				'eventAction'   : clean(action),
				'eventLabel'    : clean(label),
				'eventValue'    : extendedOptions.value
			});
		}

		if (options.additionalTypes !== undefined) {
			options.additionalTypes();
		}

		if (options.debug) {
			console.log('Debug:\n Category:', clean(category), '\n Action:', clean(action), '\n Label:', clean(label), '\n Extended options:', extendedOptions);
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
		var _options      = JSON.parse(this.getAttribute('data-trak'));
		var _category     = wildcard.call(this, _options.category);
		var _action       = wildcard.call(this, _options.action);
		var _label        = wildcard.call(this, _options.label);
		var _extendedOpts = _options.options;
		event(_category, _action, _label, _extendedOpts);
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
	 * getExtendedOptions
	 * Extended options are any items that are not the category, action or label
	 */
	var getExtendedOptions = function (extendedOptions) {
			return {
				value          : extendedOptions && extendedOptions.value          || 0,
				nonInteraction : extendedOptions && extendedOptions.nonInteraction || false,
				eventName      : extendedOptions && extendedOptions.eventName      || undefined
			};
	};


	/**
	 * trak.options
	 * These are the default options for trak.js
	 * To override them, reassign these values in your code, see
	 * https://gist.github.com/mrmartineau/24ae259f373e6dbda66f for an example
	 * @type {Object}
	 */
	var options = {
		clean           : true, // trak.options.clean     = false
		delimeter       : '_',  // trak.options.delimeter = '-'
		trackType       : 'ga', // trak.options.trackType = 'ga' Available options: ga, _gaq & gtm
		additionalTypes : undefined,
		debug           : false
	};


	var start = function() {
		console.log("trak started");
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
		options   : options
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
