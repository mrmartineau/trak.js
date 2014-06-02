/* ==========================================================================
   Trak - Universal event tracking API

   # Default implementation uses is Google Analytics:
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
   ========================================================================== */
;(function(Trak) {
	Trak = {

		clean : function(str) {
			return str.toString().replace(/\s|'|"/g, '_').toLowerCase();
		},

		event : function (category, action, label, value, nonInteraction) {
			value          = 0 || value;
			nonInteraction = 0 || nonInteraction;

			if (typeof(ga) !== 'undefined') { // use _gaq for old style
				ga('send', 'event', this.clean(category), this.clean(action), this.clean(label), value, {'nonInteraction': nonInteraction});

				// Old style:
				//_gaq.push(['_trackEvent', this.clean(category), this.clean(action), this.clean(label), value]);
			}
		},

		eventTag : function() {
			var trakElements = document.querySelectorAll('[data-trak]');
			for (var i = 0; i < trakElements.length ; i++) {
				trakElements[i].addEventListener('click', dataAttrEvent, true);
			}

			function dataAttrEvent() {
				var options  = JSON.parse(this.getAttribute("data-trak"));
				var category = options.category === 'href' ? window.location.href : options.category;
				var action   = options.action === 'href' ? window.location.href : options.action;
				var label    = options.label === 'href' ? window.location.href : options.label;

				// console.log('Clicked', options, category, action, label);
				Trak.event(category, action, label);
			}
		}
	};
})(window.Trak = window.Trak || {});
