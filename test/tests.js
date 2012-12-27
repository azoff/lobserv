test('lobserv loaded', function(){
	ok(window.lobserv, 'lobserv not found');
});

asyncTest('load jquery', 1, function(){
	lobserv('jQuery', function($){
		ok($.fn, 'Could not find valid jQuery object');
		start();
	});
	lobserv('http://code.jquery.com/jquery.min.js');
});

asyncTest('multiple prereqs', 3, function(){
	lobserv('http://code.jquery.com/jquery.min.js');
	lobserv(['jQuery', 'jQuery.fn', 'document'], function($, fn, doc){
		ok($, 'Could not find valid jQuery object');
		ok(fn, 'Could not find valid jQuery.fn object');
		ok(doc, 'Could not find valid document object');
		start();
	});
});

asyncTest('load jqueryui after jquery', 2, function(){
	lobserv('http://code.jquery.com/jquery.min.js');
	lobserv('jQuery', 'http://code.jquery.com/ui/1.9.2/jquery-ui.min.js');
	lobserv(['jQuery', 'jQuery.fn.button'], function($, button){
		ok($, 'Could not find valid jQuery object');
		ok(button, 'Could not find valid jQuery.fn.button object');
		start();
	});
});