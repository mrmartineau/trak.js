describe("trak", function() {
	var trak = require('../../dist/trak.js');

	beforeEach(function() {
		global.document = {
			title: 'Page title',
			referrer: 'http://google.com'
		};
		global.window = {
			location : {
				href: 'http://google.com'
			}
		}
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


	xdescribe('trak.event', function () {
		var gaMock = {
			category: 'CATEGORY',
			action: 'ACTION',
			label: 'LABEL' ,
			value: '1',
			eventName: 'click'
		};

		beforeEach(function () {
			global.ga = function(type, event, category, action, label, value) {
			};
		});

		it('should emit and construct an Object that matches gaMock and call ga() with it', function () {
			trak.event({
				category: 'CATEGORY',
				action: 'ACTION',
				label: 'LABEL',
				value: 1
			});

			expect(ga).toHaveBeenCalledWith('send', 'event', 'CATEGORY', 'ACTION', 'LABEL');
		});

	});
});
