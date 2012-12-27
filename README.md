Lobserv
=======
An obvious script loader

Quick Start
-------
Tell lobserv what to wait for, and then what to do (that's it!). No boilerplate required.

```html
<script src="lobserv.min.js"></script>
<script>
// load jQuery (simple right?)
lobserv('http://code.jquery.com/jquery.min.js');
// wait until jQuery is available, then load jQuery UI
lobserv('jQuery', 'http://code.jquery.com/ui/1.9.2/jquery-ui.min.js');
// wait until both jQuery and jQuery UI are available, then check print their versions
lobserv(['jQuery.fn', 'jQuery.ui'], function(fn, ui){
	console.log('jQuery version', fn.jquery);
	console.log('jQuery UI version', ui.version);
});
</script>
```

The API
-------
Lobserv only exposes one global method: `lobserv(...)`. However, the method is polymorphic and supports three
signatures:

```js
lobserv(scripts)
```
*Immediately load and execute one or more scripts*
  - `scripts` `String|Array` The script, or scripts, to load


```js
lobserv(prereqs, scripts)
```
*Loads scripts after the prerequisites exist*
  - `prereqs` `String|Array` One or more prerequisites that should exist before loading scripts
  - `scripts` `String|Array` The script, or scripts, to load after the prerequisites exist


```js
lobserv(prereqs, callback)
```
*Waits until prereqs exist, then passes them into the callback*
  - `prereqs`  `String|Array`      One or more prerequisites that should be passed to the callback
  - `callback` `Function(...args)` The method to call when the prerequisites exist; args match the evaluated prereqs


Background (from The Author)
----------------------------
There are plenty of script loaders out there - and they are all relatively good at what they do. From the
[super-optimized](http://labjs.com) to the [polyfill-enabling](http://yepnopejs.com/) to the
[package-specifying](http://www.requirejs.org), every script loader targets a niche audience and delivers the support
they demand. So why then did I find myself, spending my precious nights, hacking together this little script?
Well, I don't think that anyone ever addressed my niche. I like a straightforward syntax, a lightweight (2K)
deliverable, and the modularity of packages. However, I don't want the bloat that comes with AMD, and I'm not
sure polyfill support should ship with my script loader by default. The frankenstein born of my mixed interests
is Lobserv; I hope you enjoy using it as much as I enjoyed writing it!

Bugs
----
Please report all bugs and feature requests on [the official tracker](lobserv/issues).

Licence
-------
This software is licenced under the ever-liberal [MIT License](lobserv/blob/master/LICENCE.md). Let me know if you use it
anywhere fun!