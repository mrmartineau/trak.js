/* ==========================================================================
   Trak - Universal event tracking API

   # Default implementation uses Google Analytics:
   https://developers.google.com/analytics/devguides/collection/analyticsjs/

   ## Page and event tracking
   https://developers.google.com/analytics/devguides/collection/analyticsjs/events

   ### Usage:
   Trak.event('category', 'action');
   Trak.event('category', 'action', 'label');
   Trak.event('category', 'action', 'label', value); // value is an integer
   Trak.event('category', 'action', 'label', value, nonInteraction); // nonInteraction is an integer

   ### Example:
   Trak.event('help', 'tool_dl', this.title);

   Another usage:
   <a href="#" data-trak='{"category":"Rating","action":"Comparison notepad","label":"Up"}'>link</a>

   Using wildcards:
   HREF: Uses window.location.href
   <a href="#" data-trak='{"category":"Rating","action":"href","label":"Up"}'>link</a>

   TITLE: Uses document.title
   <a href="#" data-trak='{"category":"Rating","action":"href","label":"title"}'>link</a>
   ========================================================================== */
;(function(Trak) {
	Trak = {

		options : {
			delimeter : '_', // Trak.options.delimeter = '-'
			trackType : 'ga' // Trak.options.trackType = 'ga' Options
		},

		clean : function(str) {
			return str.toString().replace(/\s|'|"/g, this.options.delimeter).toLowerCase();
		},

		event : function (category, action, label, value, nonInteraction) {
			value          = 0 || value;
			nonInteraction = false || nonInteraction;

			if (Trak.options.trackType === 'ga' && typeof ga !== 'undefined') {
				ga('send', 'event', this.clean(category), this.clean(action), this.clean(label), value, {'nonInteraction': nonInteraction});

				/**
				 * Could use the below instead:
				 *
				ga('send', {
					'hitType': 'event',
					'eventCategory': this.clean(category),
					'eventAction': this.clean(action),
					'eventLabel': this.clean(label),
					'eventValue': value,
					{
						'nonInteraction': nonInteraction
					}
				});
				*/
			}

			if (Trak.options.trackType === 'gaq' && typeof _gaq !== 'undefined') {
				_gaq.push(['_trackEvent', this.clean(category), this.clean(action), this.clean(label), value]);
			}

			if (Trak.options.trackType === 'gtm' && typeof gtm !== 'undefined') { // use _gaq for old style
				gtm('send', 'event', this.clean(category), this.clean(action), this.clean(label), value, {'nonInteraction': nonInteraction});
			}

			/**
			 * Add any others that you would like here:
			 */
		},

		eventTag : function() {
			var trakElements = document.querySelectorAll('[data-trak]');
			for (var i = 0; i < trakElements.length ; i++) {
				trakElements[i].addEventListener('click', dataAttrEvent, true);
			}

			function dataAttrEvent() {
				var options  = JSON.parse(this.getAttribute("data-trak"));
				var category = options.category === 'href' ? window.location.href : this.clean(options.category);
				var action   = options.action === 'href' ? window.location.href : this.clean(options.action);
				var label    = options.label === 'href' ? window.location.href : this.clean(options.label);

				Trak.event(category, action, label);
			}
		}
	};
})(window.Trak = window.Trak || {});
