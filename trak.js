/**
 * @preserve Trak - Universal event tracking API
 *
 * @version 0.1.0
 * @license MIT License (see LICENSE)
 */

function Trak() {
	var trakElements = document.querySelectorAll('[data-trak]');

	for (var i = 0; i < trakElements.length ; i++) {
		trakElements[i].addEventListener('click', dataAttrEvent, true);
	}

	/**
	 * Function to convert wildcards into real values
	 * @param  string str
	 * @return string     The converted ouput from str
	 */
	function wildcard(str) {
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
			default:
				output = Trak.clean(str);
				break;
		}
		return output;
	}

	/**
	 * dataAttrEvent
	 * This is called when any element with the [data-trak] attribute is clicked.
	 * It calls Trak.event()
	 */
	function dataAttrEvent() {
		var _options  = JSON.parse(this.getAttribute("data-trak"));
		var _category = wildcard.call(this, _options.category);
		var _action   = wildcard.call(this, _options.action);
		var _label    = wildcard.call(this, _options.label);
		Trak.event(_category, _action, _label);
	}
}
/**
 * Trak.clean()
 * Cleans the input replacing spaces with a specified delimeter (see Trak.options) and converts to lower case
 * @param  string str
 * @return string cleaned string
 */
Trak.clean = function(str) {
	return str.toString().replace(/\s|'|"/g, this.options.delimeter).toLowerCase();
};


/**
 * Trak.event()
 * Wrapper function for various analytics APIs.
 * Enables you to add more than one, or change mid-project without changing anything else in your code
 * @param  string category        The category of the tracking event
 * @param  string action          The action of the tracking event
 * @param  string label           The label of the tracking event
 * @param  number value           Use this to assign a numerical value to a tracked page object
 * @param  boolean nonInteraction Used if Trak.options.trackType = 'ga': you might want to send an event, but not impact your bounce rate.
 */
Trak.event = function(category, action, label, value, nonInteraction) {
	value          = value || 0;
	nonInteraction = nonInteraction || false;

	if (Trak.options.trackType === 'ga' && typeof ga !== 'undefined') {
		ga('send', 'event', Trak.clean(category), Trak.clean(action), Trak.clean(label), value, {'nonInteraction': nonInteraction});

		/**
		 * Could use the below instead:
		 *
		ga('send', {
			'hitType': 'event',
			'eventCategory': Trak.clean(category),
			'eventAction': Trak.clean(action),
			'eventLabel': Trak.clean(label),
			'eventValue': value,
			{
				'nonInteraction': nonInteraction
			}
		});
		*/
	} else if (Trak.options.trackType === '_gaq' && typeof _gaq !== 'undefined') {
		_gaq.push(['_trackEvent', Trak.clean(category), Trak.clean(action), Trak.clean(label), value]);
	}

	/**
	 * Add any others that you would like here:
	 */

};

/**
 * Trak.options
 * These are the default options for trak.js.
 * To override these, you have to reassign the values to
 * @type {Object}
 */
Trak.options = {
	delimeter : '_', // Trak.options.delimeter = '-'
	trackType : 'ga' // Trak.options.trackType = 'ga' Available options: ga, _gaq
};


document.addEventListener('DOMContentLoaded', function(e) {
	Trak();
});