/* trak.js v0.2.2 | (c) 2014 @mrmartineau | https://github.com/tmwagency/trak.js
   Universal event tracking API. */
function trak() {
	'use strict';

	var trakElements = document.querySelectorAll('[data-trak]');
	for (var i = 0; i < trakElements.length ; i++) {
		if (trakElements[i].addEventListener) {
			trakElements[i].addEventListener('click', trak.dataAttrEvent);
		} else if (trakElements[i].attachEvent) {
			trakElements[i].attachEvent('onclick', trak.dataAttrEvent);
		}
	}
}


/**
 * trak.clean()
 * Cleans the input replacing spaces with a specified delimeter (see trak.options) and converts to lower case
 * @param  string str
 * @return string cleaned string
 */
trak.clean = function(str) {
	if (!trak.options.clean) {
		return str;
	} else {
		return str.toString().replace(/\s|'|"/g, this.options.delimeter).toLowerCase();
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
trak.event = function(category, action, label, extendedOptions) {
	extendedOptions = trak.getExtendedOptions(extendedOptions);

	if (trak.options.trackType === 'ga' && typeof ga !== 'undefined') {
		ga('send', 'event', trak.clean(category), trak.clean(action), trak.clean(label), extendedOptions.value, {'nonInteraction': extendedOptions.nonInteraction});
	} else if (trak.options.trackType === '_gaq' && typeof _gaq !== 'undefined') {
		_gaq.push(['_trackEvent', trak.clean(category), trak.clean(action), trak.clean(label), extendedOptions.value]);

	} else if (trak.options.trackType === 'gtm' && typeof dataLayer !== 'undefined') {
		dataLayer.push({
			'event': extendedOptions.eventName,
			'eventCategory': trak.clean(category),
			'eventAction': trak.clean(action),
			'eventLabel': trak.clean(label),
			'eventValue': extendedOptions.value
		});
	}

	if (trak.options.additionalTypes !== undefined) {
		trak.options.additionalTypes();
	}

	if (trak.options.debug) {
		console.log('Debug:\n Category:', trak.clean(category), '\n Action:', trak.clean(action), '\n Label:', trak.clean(label), '\n Extended options:', extendedOptions);
	}
};

/**
 * dataAttrEvent
 * This is called when any element with the [data-trak] attribute is clicked.
 * If [data-trakwithjs] is present on the element, the trak.attr() method is not called
 * To allow use of the
 */
trak.dataAttrEvent = function() {
	var trakWithJs = this.getAttribute('data-trakwithjs') !== undefined ? false : true;
	if (!trakWithJs) {
		trak.attrEvent.call(this);
	}
};

/**
 * attrEvent
 * This is used when elements with the [data-trak] is present.
 * It calls trak.event()
 * Usage in your js code:
 * > trak.attrEvent.call(this);
 */
trak.attrEvent = function() {
	var _options   = JSON.parse(this.getAttribute('data-trak'));
	var _category  = trak.wildcard.call(this, _options.category);
	var _action    = trak.wildcard.call(this, _options.action);
	var _label     = trak.wildcard.call(this, _options.label);
	var _extendedOpts = _options.options;
	trak.event(_category, _action, _label, _extendedOpts);
};

/**
 * Function to convert wildcards into real values
 * @param  string str
 * @return string     The converted ouput from str
 */
trak.wildcard = function(str) {
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
trak.getExtendedOptions = function (extendedOptions) {
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
trak.options = {
	clean           : true, // trak.options.clean     = false
	delimeter       : '_',  // trak.options.delimeter = '-'
	trackType       : 'ga', // trak.options.trackType = 'ga' Available options: ga, _gaq & gtm
	additionalTypes : undefined,
	debug           : true
};