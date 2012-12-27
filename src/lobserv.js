(function(global, dom){

	"use strict";

	function whenSet(object, property, callback) {
		if (!Object.defineProperty) {
			throw new Error("This browser does not support observing setters");
		}
		Object.defineProperty(object, property, {
			configurable: true,
			set: function(value){
				Object.defineProperty(object, property, { value: value });
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

	function preload(src) {
		var preloader = new Image();
		preloader.src = src;
	}

	function scriptLoader(scripts) {
		var total = scripts.length;
		for (var i=0; i<total; i++) {
			// preload the scripts into the browser cache
			if (scripts[i] in scriptLoader.cache) {
				scripts[i].skip = true;
				continue;
			}
			preload(scripts[i]);
			scriptLoader.cache[scripts[i]] = true;
		}
		return function() {
			for (i=0; i<total; i++) {
				// by the time we get here, the scripts will already be cached
				if (scripts[i].skip) { continue; }
				load(scripts[i]);
			}
		};
	} scriptLoader.cache = {};

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