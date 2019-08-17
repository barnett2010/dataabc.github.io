"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}!function(e){if("object"==("undefined"==typeof exports?"undefined":_typeof(exports))&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).toolbox=e()}}(function(){return function i(c,s,a){function u(t,e){if(!s[t]){if(!c[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(f)return f(t,!0);var r=new Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}var o=s[t]={exports:{}};c[t][0].call(o.exports,function(e){return u(c[t][1][e]||e)},o,o.exports,i,c,s,a)}return s[t].exports}for(var f="function"==typeof require&&require,e=0;e<a.length;e++)u(a[e]);return u}({1:[function(e,t,n){function a(e,t){((t=t||{}).debug||c.debug)&&console.log("[sw-toolbox] "+e)}function o(e){var t;return e&&e.cache&&(t=e.cache.name),t=t||c.cache.name,caches.open(t)}function r(e){var t=Array.isArray(e);if(t&&e.forEach(function(e){"string"==typeof e||e instanceof Request||(t=!1)}),!t)throw new TypeError("The precache method expects either an array of strings and/or Requests or a Promise that resolves to an array of strings and/or Requests.");return e}var i,c=e("./options"),u=e("./idb-cache-expiration");t.exports={debug:a,fetchAndCache:function(n,r){var t=(r=r||{}).successResponses||c.successResponses;return fetch(n.clone()).then(function(e){return"GET"===n.method&&t.test(e.status)&&o(r).then(function(t){t.put(n,e).then(function(){var e=r.cache||c.cache;(e.maxEntries||e.maxAgeSeconds)&&e.name&&function(e,t,n){var r=function(e,n,t){var r=e.url,o=t.maxAgeSeconds,i=t.maxEntries,c=t.name,s=Date.now();return a("Updating LRU order for "+r+". Max entries is "+i+", max age is "+o),u.getDb(c).then(function(e){return u.setTimestampForUrl(e,r,s)}).then(function(e){return u.expireEntries(e,i,o,s)}).then(function(e){a("Successfully updated IDB.");var t=e.map(function(e){return n.delete(e)});return Promise.all(t).then(function(){a("Done with cache cleanup.")})}).catch(function(e){a(e)})}.bind(null,e,t,n);i=i?i.then(r):r()}(n,t,e)})}),e.clone()})},openCache:o,renameCache:function(t,e,n){return a("Renaming cache: ["+t+"] to ["+e+"]",n),caches.delete(e).then(function(){return Promise.all([caches.open(t),caches.open(e)]).then(function(e){var n=e[0],r=e[1];return n.keys().then(function(e){return Promise.all(e.map(function(t){return n.match(t).then(function(e){return r.put(t,e)})}))}).then(function(){return caches.delete(t)})})})},cache:function(t,e){return o(e).then(function(e){return e.add(t)})},uncache:function(t,e){return o(e).then(function(e){return e.delete(t)})},precache:function(e){e instanceof Promise||r(e),c.preCacheItems=c.preCacheItems.concat(e)},validatePrecacheInput:r,isResponseFresh:function(e,t,n){if(!e)return!1;if(t){var r=e.headers.get("date");if(r&&new Date(r).getTime()+1e3*t<n)return!1}return!0}}},{"./idb-cache-expiration":2,"./options":4}],2:[function(e,t,n){var o="sw-toolbox-",i=1,u="store",f="url",p="timestamp",r={};t.exports={getDb:function(e){return e in r||(r[e]=function(r){return new Promise(function(e,t){var n=indexedDB.open(o+r,i);n.onupgradeneeded=function(){n.result.createObjectStore(u,{keyPath:f}).createIndex(p,p,{unique:!1})},n.onsuccess=function(){e(n.result)},n.onerror=function(){t(n.error)}})}(e)),r[e]},setTimestampForUrl:function(r,o,i){return new Promise(function(e,t){var n=r.transaction(u,"readwrite");n.objectStore(u).put({url:o,timestamp:i}),n.oncomplete=function(){e(r)},n.onabort=function(){t(n.error)}})},expireEntries:function(e,n,t,r){return function(c,s,a){return s?new Promise(function(e,t){var r=1e3*s,o=[],n=c.transaction(u,"readwrite"),i=n.objectStore(u);i.index(p).openCursor().onsuccess=function(e){var t=e.target.result;if(t&&a-r>t.value[p]){var n=t.value[f];o.push(n),i.delete(n),t.continue()}},n.oncomplete=function(){e(o)},n.onabort=t}):Promise.resolve([])}(e,t,r).then(function(t){return function(r,a){return a?new Promise(function(e,t){var o=[],n=r.transaction(u,"readwrite"),i=n.objectStore(u),c=i.index(p),s=c.count();c.count().onsuccess=function(){var r=s.result;a<r&&(c.openCursor().onsuccess=function(e){var t=e.target.result;if(t){var n=t.value[f];o.push(n),i.delete(n),r-o.length>a&&t.continue()}})},n.oncomplete=function(){e(o)},n.onabort=t}):Promise.resolve([])}(e,n).then(function(e){return t.concat(e)})})}}},{}],3:[function(e,t,n){function r(e){return e.reduce(function(e,t){return e.concat(t)},[])}e("serviceworker-cache-polyfill");var o=e("./helpers"),i=e("./router"),c=e("./options");t.exports={fetchListener:function(e){var t=i.match(e.request);t?e.respondWith(t(e.request)):i.default&&"GET"===e.request.method&&0===e.request.url.indexOf("http")&&e.respondWith(i.default(e.request))},activateListener:function(e){o.debug("activate event fired");var t=c.cache.name+"$$$inactive$$$";e.waitUntil(o.renameCache(t,c.cache.name))},installListener:function(e){var t=c.cache.name+"$$$inactive$$$";o.debug("install event fired"),o.debug("creating cache ["+t+"]"),e.waitUntil(o.openCache({cache:{name:t}}).then(function(t){return Promise.all(c.preCacheItems).then(r).then(o.validatePrecacheInput).then(function(e){return o.debug("preCache list: "+(e.join(", ")||"(none)")),t.addAll(e)})}))}}},{"./helpers":1,"./options":4,"./router":6,"serviceworker-cache-polyfill":16}],4:[function(e,t,n){var r;r=self.registration?self.registration.scope:self.scope||new URL("./",self.location).href,t.exports={cache:{name:"$$$toolbox-cache$$$"+r+"$$$",maxAgeSeconds:null,maxEntries:null,queryOptions:null},debug:!1,networkTimeoutSeconds:null,preCacheItems:[],successResponses:/^0|([123]\d\d)|(40[14567])|410$/}},{}],5:[function(e,t,n){function r(e,t,n,r){t instanceof RegExp?this.fullUrlRegExp=t:(0!==t.indexOf("/")&&(t=o+t),this.keys=[],this.regexp=i(t,this.keys)),this.method=e,this.options=r,this.handler=n}var o=new URL("./",self.location).pathname,i=e("path-to-regexp");r.prototype.makeHandler=function(e){var n;if(this.regexp){var r=this.regexp.exec(e);n={},this.keys.forEach(function(e,t){n[e.name]=r[t+1]})}return function(e){return this.handler(e,n,this.options)}.bind(this)},t.exports=r},{"path-to-regexp":15}],6:[function(e,t,n){function s(e,t){for(var n=e.entries(),r=n.next(),o=[];!r.done;)new RegExp(r.value[0]).test(t)&&o.push(r.value[1]),r=n.next();return o}function o(){this.routes=new Map,this.routes.set(RegExp,new Map),this.default=null}var u=e("./route"),f=e("./helpers");["get","post","put","delete","head","any"].forEach(function(r){o.prototype[r]=function(e,t,n){return this.add(r,e,t,n)}}),o.prototype.add=function(e,t,n,r){var o;r=r||{},o=t instanceof RegExp?RegExp:(o=r.origin||self.location.origin)instanceof RegExp?o.source:function(e){return e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}(o),e=e.toLowerCase();var i=new u(e,t,n,r);this.routes.has(o)||this.routes.set(o,new Map);var c=this.routes.get(o);c.has(e)||c.set(e,new Map);var s=c.get(e),a=i.regexp||i.fullUrlRegExp;s.has(a.source)&&f.debug('"'+t+'" resolves to same regex as existing route.'),s.set(a.source,i)},o.prototype.matchMethod=function(e,t){var n=new URL(t),r=n.origin,o=n.pathname;return this._match(e,s(this.routes,r),o)||this._match(e,[this.routes.get(RegExp)],t)},o.prototype._match=function(e,t,n){if(0===t.length)return null;for(var r=0;r<t.length;r++){var o=t[r],i=o&&o.get(e.toLowerCase());if(i){var c=s(i,n);if(0<c.length)return c[0].makeHandler(n)}}return null},o.prototype.match=function(e){return this.matchMethod(e.method,e.url)||this.matchMethod("any",e.url)},t.exports=new o},{"./helpers":1,"./route":5}],7:[function(e,t,n){var i=e("../options"),c=e("../helpers");t.exports=function(n,e,r){var o=(r=r||{}).cache||i.cache,t=o.queryOptions;return c.debug("Strategy: cache first ["+n.url+"]",r),c.openCache(r).then(function(e){return e.match(n,t).then(function(e){var t=Date.now();return c.isResponseFresh(e,o.maxAgeSeconds,t)?e:c.fetchAndCache(n,r)})})}},{"../helpers":1,"../options":4}],8:[function(e,t,n){var i=e("../options"),c=e("../helpers");t.exports=function(t,e,n){var r=(n=n||{}).cache||i.cache,o=r.queryOptions;return c.debug("Strategy: cache only ["+t.url+"]",n),c.openCache(n).then(function(e){return e.match(t,o).then(function(e){var t=Date.now();if(c.isResponseFresh(e,r.maxAgeSeconds,t))return e})})}},{"../helpers":1,"../options":4}],9:[function(e,t,n){var u=e("../helpers"),f=e("./cacheOnly");t.exports=function(c,s,a){return u.debug("Strategy: fastest ["+c.url+"]",a),new Promise(function(t,n){function r(e){i.push(e.toString()),o?n(new Error('Both cache and network failed: "'+i.join('", "')+'"')):o=!0}function e(e){e instanceof Response?t(e):r("No result returned")}var o=!1,i=[];u.fetchAndCache(c.clone(),a).then(e,r),f(c,s,a).then(e,r)})}},{"../helpers":1,"./cacheOnly":8}],10:[function(e,t,n){t.exports={networkOnly:e("./networkOnly"),networkFirst:e("./networkFirst"),cacheOnly:e("./cacheOnly"),cacheFirst:e("./cacheFirst"),fastest:e("./fastest")}},{"./cacheFirst":7,"./cacheOnly":8,"./fastest":9,"./networkFirst":11,"./networkOnly":12}],11:[function(e,t,n){var r=e("../options"),h=e("../helpers");t.exports=function(c,e,s){var a=(s=s||{}).cache||r.cache,u=a.queryOptions,f=s.successResponses||r.successResponses,p=s.networkTimeoutSeconds||r.networkTimeoutSeconds;return h.debug("Strategy: network first ["+c.url+"]",s),h.openCache(s).then(function(e){var t,n,r=[];if(p){var o=new Promise(function(r){t=setTimeout(function(){e.match(c,u).then(function(e){var t=Date.now(),n=a.maxAgeSeconds;h.isResponseFresh(e,n,t)&&r(e)})},1e3*p)});r.push(o)}var i=h.fetchAndCache(c,s).then(function(e){if(t&&clearTimeout(t),f.test(e.status))return e;throw h.debug("Response was an HTTP error: "+e.statusText,s),n=e,new Error("Bad response")}).catch(function(t){return h.debug("Network or response error, fallback to cache ["+c.url+"]",s),e.match(c,u).then(function(e){if(e)return e;if(n)return n;throw t})});return r.push(i),Promise.race(r)})}},{"../helpers":1,"../options":4}],12:[function(e,t,n){var r=e("../helpers");t.exports=function(e,t,n){return r.debug("Strategy: network only ["+e.url+"]",n),fetch(e)}},{"../helpers":1}],13:[function(e,t,n){var r=e("./options"),o=e("./router"),i=e("./helpers"),c=e("./strategies"),s=e("./listeners");i.debug("Service Worker Toolbox is loading"),self.addEventListener("install",s.installListener),self.addEventListener("activate",s.activateListener),self.addEventListener("fetch",s.fetchListener),t.exports={networkOnly:c.networkOnly,networkFirst:c.networkFirst,cacheOnly:c.cacheOnly,cacheFirst:c.cacheFirst,fastest:c.fastest,router:o,options:r,cache:i.cache,uncache:i.uncache,precache:i.precache}},{"./helpers":1,"./listeners":3,"./options":4,"./router":6,"./strategies":10}],14:[function(e,t,n){t.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},{}],15:[function(e,t,n){function r(e,t){for(var n,r=[],o=0,i=0,c="",s=t&&t.delimiter||"/";null!=(n=S.exec(e));){var a=n[0],u=n[1],f=n.index;if(c+=e.slice(i,f),i=f+a.length,u)c+=u[1];else{var p=e[i],h=n[2],l=n[3],d=n[4],m=n[5],g=n[6],v=n[7];c&&(r.push(c),c="");var x=null!=h&&null!=p&&p!==h,y="+"===g||"*"===g,w="?"===g||"*"===g,b=n[2]||s,E=d||m;r.push({name:l||o++,prefix:h||"",delimiter:b,optional:w,repeat:y,partial:x,asterisk:!!v,pattern:E?(k=E,k.replace(/([=!:$\/()])/g,"\\$1")):v?".*":"[^"+R(b)+"]+?"})}}var k;return i<e.length&&(c+=e.substr(i)),c&&r.push(c),r}function h(e){return encodeURI(e).replace(/[\/?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function o(f){for(var p=new Array(f.length),e=0;e<f.length;e++)"object"==_typeof(f[e])&&(p[e]=new RegExp("^(?:"+f[e].pattern+")$"));return function(e,t){for(var n="",r=e||{},o=(t||{}).pretty?h:encodeURIComponent,i=0;i<f.length;i++){var c=f[i];if("string"!=typeof c){var s,a=r[c.name];if(null==a){if(c.optional){c.partial&&(n+=c.prefix);continue}throw new TypeError('Expected "'+c.name+'" to be defined')}if(m(a)){if(!c.repeat)throw new TypeError('Expected "'+c.name+'" to not repeat, but received `'+JSON.stringify(a)+"`");if(0===a.length){if(c.optional)continue;throw new TypeError('Expected "'+c.name+'" to not be empty')}for(var u=0;u<a.length;u++){if(s=o(a[u]),!p[i].test(s))throw new TypeError('Expected all "'+c.name+'" to match "'+c.pattern+'", but received `'+JSON.stringify(s)+"`");n+=(0===u?c.prefix:c.delimiter)+s}}else{if(s=c.asterisk?encodeURI(a).replace(/[?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()}):o(a),!p[i].test(s))throw new TypeError('Expected "'+c.name+'" to match "'+c.pattern+'", but received "'+s+'"');n+=c.prefix+s}}else n+=c}return n}}function R(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function l(e,t){return e.keys=t,e}function d(e){return e.sensitive?"":"i"}function i(e,t,n){m(t)||(n=t||n,t=[]);for(var r=(n=n||{}).strict,o=!1!==n.end,i="",c=0;c<e.length;c++){var s=e[c];if("string"==typeof s)i+=R(s);else{var a=R(s.prefix),u="(?:"+s.pattern+")";t.push(s),s.repeat&&(u+="(?:"+a+u+")*"),i+=u=s.optional?s.partial?a+"("+u+")?":"(?:"+a+"("+u+"))?":a+"("+u+")"}}var f=R(n.delimiter||"/"),p=i.slice(-f.length)===f;return r||(i=(p?i.slice(0,-f.length):i)+"(?:"+f+"(?=$))?"),i+=o?"$":r&&p?"":"(?="+f+"|$)",l(new RegExp("^"+i,d(n)),t)}function c(e,t,n){return m(t)||(n=t||n,t=[]),n=n||{},e instanceof RegExp?function(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return l(e,t)}(e,t):m(e)?function(e,t,n){for(var r=[],o=0;o<e.length;o++)r.push(c(e[o],t,n).source);return l(new RegExp("(?:"+r.join("|")+")",d(n)),t)}(e,t,n):function(e,t,n){return i(r(e,n),t,n)}(e,t,n)}var m=e("isarray");t.exports=c,t.exports.parse=r,t.exports.compile=function(e,t){return o(r(e,t))},t.exports.tokensToFunction=o,t.exports.tokensToRegExp=i;var S=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g")},{isarray:14}],16:[function(e,t,n){!function(){var e=Cache.prototype.addAll,t=navigator.userAgent.match(/(Firefox|Chrome)\/(\d+\.)/);if(t)var n=t[1],r=parseInt(t[2]);e&&(!t||"Firefox"===n&&46<=r||"Chrome"===n&&50<=r)||(Cache.prototype.addAll=function(n){function r(e){this.name="NetworkError",this.code=19,this.message=e}var o=this;return r.prototype=Object.create(Error.prototype),Promise.resolve().then(function(){if(arguments.length<1)throw new TypeError;return n=n.map(function(e){return e instanceof Request?e:String(e)}),Promise.all(n.map(function(e){"string"==typeof e&&(e=new Request(e));var t=new URL(e.url).protocol;if("http:"!==t&&"https:"!==t)throw new r("Invalid scheme");return fetch(e.clone())}))}).then(function(e){if(e.some(function(e){return!e.ok}))throw new r("Incorrect response status");return Promise.all(e.map(function(e,t){return o.put(n[t],e)}))}).then(function(){})},Cache.prototype.add=function(e){return this.addAll([e])})}()},{}]},{},[13])(13)}),self.addEventListener("install",function(){return self.skipWaiting()}),self.addEventListener("active",function(){return self.clients.claim()});var precacheUrls=[];precacheUrls.push("/"),precacheUrls.push("/linuxISO/"),precacheUrls.push("/weibospider/"),precacheUrls.push("/payspotify/"),precacheUrls.push("/doctokindle/"),precacheUrls.push("/djangopic/"),toolbox.precache(precacheUrls),toolbox.options={networkTimeoutSeconds:5},toolbox.router.any(/hm.baidu.com/,toolbox.networkOnly),toolbox.router.any(/.*\.(js|css|jpg|jpeg|png|gif)$/,toolbox.cacheFirst),toolbox.router.any(/\//,toolbox.networkFirst);