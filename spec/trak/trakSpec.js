describe("trak", function() {
	var trak = require('../../dist/trak.js');

	beforeAll(function() {
		global.document = {
			title: 'Page title',
			referrer: 'http://google.com'
		};
		global.window = {
			location : {
				href: 'http://google.com'
			}
		};
	});

	describe('Wildcards', function () {
		it("returns the page title", function() {
			expect(trak.wildcard('page.title')).toEqual('Page title');
		});

		it("returns the page href", function() {
			expect(trak.wildcard('page.href')).toEqual('http://google.com');
		});

		it("returns the referrer", function() {
			expect(trak.wildcard('referrer')).toEqual('http://google.com');
		});

		it("returns the link href", function() {
			var test = {
				href: 'http://google.com'
			};
			expect(trak.wildcard.call(test, 'link.href')).toEqual('http://google.com');
		});

		it("returns the link title", function() {
			var test = {
				title: 'Link title'
			};
			expect(trak.wildcard.call(test, 'link.title')).toEqual('Link title');
		});
	});


	describe('Clean', function () {
		it("should clean", function() {
			expect(trak.clean('Clean this')).toEqual('clean_this');
		});

		it("should not clean", function() {
			trak.options.clean = false;
			expect(trak.clean('Clean this')).toEqual('Clean this');
		});

		afterEach(function(){
			trak.options.clean = true;
		});
	});


	describe('trak.event', function () {
		var gaMock = {
			category: 'CATEGORY',
			action: 'ACTION',
			label: 'page.title' ,
			value: 1,
			eventName: 'click'
		};
		global._gaq = [];
		global.dataLayer = [];

		beforeAll(function () {
			ga = jasmine.createSpy('ga');
		});

		afterEach(function() {
			trak.options.trackType = 'ga';
		});


		it('should emit and construct an Object that matches gaMock and call ga() with it', function () {
			trak.event(gaMock);

			expect(ga).toHaveBeenCalledWith('send', 'event', 'category', 'action', 'page_title', 1, { nonInteraction: false });
		});


		it('should emit & push to the _gaq array', function () {
			trak.options.trackType = '_gaq';
			trak.event(gaMock);

			expect(_gaq).toContain(['_trackEvent', 'category', 'action', 'page_title', 1]);
		});


		it('should emit and & push to the dataLayer array', function () {
			trak.options.trackType = 'gtm';
			trak.event(gaMock);

			expect(dataLayer).toContain({
				eventCategory: 'category',
				eventAction: 'action',
				eventLabel: 'page_title' ,
				eventValue: 1,
				event: 'click',
				eventNonInteraction: false
			});
		});
	});
});
