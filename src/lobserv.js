/**
 * Lobserv - An obvious script loader
 *
 * @version 1.0.0
 * @license MIT <https://github.com/azoff/lobserv/blob/master/LICENSE.md>
 * @link <https://github.com/azoff/lobserv>
 * @author Jonathan Azoff <jon@azoffdesign.com>
 */

/*! Lobserv | v1.0.0 | MIT | http://azof.fr/U1Selv */

(function(global, dom){

	"use strict";

	var loaded = {};

	function whenSet(object, property, callback) {
		if (!Object.defineProperty) {
			throw new Error("This browser does not support observing setters");
		}
		Object.defineProperty(object, property, {
			configurable: true,
			set: function(value){
				Object.defineProperty(object, property, {
					value: value,
					writable: true,
					enumerable: true
				});
				callback(value);
			}
		});
	}

	function whenDefined(object, property, callback) {
		var setter;
		if (!object.hasOwnProperty('_lobserv')) {
			object._lobserv = {};
		}
		if (!object._lobserv.hasOwnProperty(property)) {
			setter = object._lobserv[property] = function(value, callback) {
				while (callback = setter.callbacks.pop()) {
					callback(value);
				}
			};
			whenSet(object, property, setter);
		} else {
			setter = object._lobserv[property];
		}
		if ('callbacks' in setter) {
			setter.callbacks.push(callback);
		} else {
			setter.callbacks = [callback];
		}
	}

	function load(src) {
		var script   = dom.createElement('script');
		script.async = true;
		script.src   = src;
		if (dom.body) {
			dom.body.appendChild(script);
		} else if (dom.head) {
			dom.head.appendChild(script);
		} else {
			(dom.head = dom.getElementsByTagName('head')[0]).appendChild(script);
		}
	}

	function isArray(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	}

	function scriptLoader(scripts) {
		var src, total = scripts.length;
		return function() {
			for (var i=0; i<total; i++) {
				// by the time we get here, the scripts will already be cached
				if (!loaded.hasOwnProperty(src = scripts[i])) {
					loaded[src] = true;
					load(src);
				}
			}
		};
	}

	function whenExists(object, property, callback) {
		var parts = property.split('.');
		var head  = parts.shift();
		var tail  = parts.join('.');
		var done = function(value) {
			if (tail) {
				whenExists(value, tail, callback);
			} else {
				callback(value);
			}
		};
		if (object[head] !== undefined) {
			done(object[head]);
		} else {
			whenDefined(object, head, done);
		}
	}

	function aggregator(i, callback) {
		return function(arg){
			callback.args[i] = arg;
			if (--callback.count <= 0) {
				callback.apply(global, callback.args);
			}
		}
	}

	function whenExist(objects, callback) {
		callback.args  = [];
		callback.count = objects.length;
		for (var i=0; i<objects.length; i++) {
			whenExists(global, objects[i], aggregator(i, callback));
		}
	}

	function main(prereqs, scripts, callback) {
		if (!scripts) {
			scripts = prereqs;
			prereqs = [];
		}
		if (!isArray(prereqs)) {
			prereqs = [prereqs];
		}
		if (scripts.call) {
			callback = scripts;
		} else {
			if (!isArray(scripts)) {
				scripts = [scripts];
			}
			callback = scriptLoader(scripts);
		}
		if (prereqs.length) {
			whenExist(prereqs, callback);
		} else {
			callback();
		}
	}

	global.lobserv = main;

})(window, document);