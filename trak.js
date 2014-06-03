/* ==========================================================================
	 Trak - Universal event tracking API

	 ### JS Usage:
	 Trak.event('category', 'action');
	 Trak.event('category', 'action', 'label');
	 Trak.event('category', 'action', 'label', value); // value is an integer
	 Trak.event('category', 'action', 'label', value, nonInteraction); // nonInteraction is an integer

	 ##### JS Example:
	 Trak.event('help', 'tool_dl', this.title);

	 ### Data attribute usage:
	 <a href="#" data-trak='{"category":"Rating","action":"Comparison notepad","label":"Up"}'>link</a>

	 ##### Data attribute wildcards:
	 HREF: Uses window.location.href
	 <a href="#" data-trak='{"category":"Rating","action":"href","label":"Up"}'>link</a>

	 TITLE: Uses document.title
	 <a href="#" data-trak='{"category":"Rating","action":"href","label":"title"}'>link</a>
	 ========================================================================== */

function Trak() {
	console.log('Trak loaded');

	var trakElements = document.querySelectorAll('[data-trak]');
	// console.log(trakElements);
	for (var i = 0; i < trakElements.length ; i++) {
		trakElements[i].addEventListener('click', dataAttrEvent, true);
	}

	function dataAttrEvent() {
		var _options = JSON.parse(this.getAttribute("data-trak"));
		var _category;
		var _action;
		var _label;

		switch(_options.category) {
			case 'page.title':
				_category = document.title;
				break;
			case 'page.href':
				_category = window.location.href;
				break;
			case 'link.href':
				_category = this.href;
				break;
			case 'link.title':
				_category = this.title;
				break;
			default:
				_category = Trak.clean(_options.category);
				break;
		}

		switch(_options.action) {
			case 'page.title':
				_action = document.title;
				break;
			case 'page.href':
				_action = window.location.href;
				break;
			case 'link.href':
				_action = this.href;
				break;
			case 'link.title':
				_action = this.title;
				break;
			default:
				_action = Trak.clean(_options.action);
				break;
		}

		switch(_options.label) {
			case 'page.title':
				_label = document.title;
				break;
			case 'page.href':
				_label = window.location.href;
				break;
			case 'link.href':
				_label = this.href;
				break;
			case 'link.title':
				_label = this.title;
				break;
			default:
				_label = Trak.clean(_options.label);
				break;
		}
		// console.log(_category, _action, _label);
		Trak.event(_category, _action, _label);
	}
}

Trak.clean = function(str) {
	return str.toString().replace(/\s|'|"/g, this.options.delimeter).toLowerCase();
};

Trak.event = function(category, action, label, value, nonInteraction) {
	value          = 0 || value;
	nonInteraction = false || nonInteraction;

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
	}

	if (Trak.options.trackType === '_gaq' && typeof _gaq !== 'undefined') {
		_gaq.push(['_trackEvent', Trak.clean(category), Trak.clean(action), Trak.clean(label), value]);
	}

	/**
	 * Add any others that you would like here:
	 */
};


Trak.options = {
	delimeter : '_', // Trak.options.delimeter = '-'
	trackType : 'ga' // Trak.options.trackType = 'ga' Options
};


document.addEventListener('DOMContentLoaded', function(e) {
	console.log("DOM fully loaded and parsed");
	Trak();
});