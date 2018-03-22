"use strict";var precacheConfig=[["app.b6e929790023f62797d0f7bea1700758.css","f9d16197acfb627adc0a9f80f8a7482f"],["app.df295c9ae3cd337ef9355ca7a850c585.css","f82373fb59a9239138a2565a43a41bc3"],["fonts/MaterialIcons-Regular.012cf6a.woff","012cf6a10129e2275d79d6adac7f3b02"],["fonts/Roboto-Bold.ad140ff.woff","ad140ff02a7091257e2b31619106194e"],["fonts/Roboto-Light.37fbbba.woff","37fbbbad5577a95bdf058307c717c882"],["fonts/Roboto-Medium.303ded6.woff","303ded6436dcf7ea75157e2aeff876ce"],["fonts/Roboto-Regular.081b11e.woff","081b11ebaca8ad30fd092e01451015dc"],["fonts/Roboto-Thin.90d3804.woff","90d3804f0231704c15ccc5861245e8ce"],["fonts/mdi.6473d7d.woff","6473d7d5a01bb3f8fccd5bbeaf2be312"],["index.html","8b829203d265ca2538956b4efb8b79b7"],["js/0.ceb42a9fec4db0ac7d65.js","74ba207f8be31336a049cfea340efc6f"],["js/0.db6cb233ef73f396d160.js","5e246abdd6b2eb8945e4b63acc4517fb"],["js/1.2baf83c8b679098e2a7a.js","7a10d58f26afd5f8caaf13c6b87753a6"],["js/app.09a504fcf3bc665241d4.js","298767d8599a69ac5fa435e65dd6015a"],["js/app.7818e43824c20a80e404.js","3ae2ee997fbe06a8f38ea0142da092c0"],["js/vendor.30c6a043d1386db2cb9b.js","bfc03b09939509b849343eaf647613e2"],["js/vendor.8f77a60a4916ccc18638.js","bed74c680f6469703cc5daeee7b654a5"],["js/vendor.e2d2bfa53f3e85966865.js","d836862240e8eca61b0d97e943a2b213"],["manifest.json","2bcee5a9ee6e0b44d229aeba978b1462"],["service-worker.js","4530a66fc76be98bc83c38532c177f72"],["statics/icons/apple-icon-152x152.png","06438c17ff3a24508a2d15930ff094d7"],["statics/icons/favicon-16x16.png","1429e4c47a98004cf4290ef7ca7fa500"],["statics/icons/favicon-32x32.png","791c846cb92da61bcc6bf46dbd4117a4"],["statics/icons/icon-128x128.png","f63bdbf1d5728bf711644b93ef4c4fe8"],["statics/icons/icon-192x192.png","f42103dc29c2df7133e639e1caedbc37"],["statics/icons/icon-256x256.png","2941cacdf1e521b8a380a5e6709328e7"],["statics/icons/icon-384x384.png","c66199be428d467cd19fbbdf6621c248"],["statics/icons/icon-512x512.png","41070a581a7f81a80abef64bf38da676"],["statics/icons/ms-icon-144x144.png","4b06f3608af9da8521edbf2e237596e7"]],cacheName="sw-precache-v3-telemetry-viewer-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,a){var n=new URL(e);return"/"===n.pathname.slice(-1)&&(n.pathname+=a),n.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(a){return new Response(a,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,a,n,t){var c=new URL(e);return t&&c.pathname.match(t)||(c.search+=(c.search?"&":"")+encodeURIComponent(a)+"="+encodeURIComponent(n)),c.toString()},isPathWhitelisted=function(e,a){if(0===e.length)return!0;var n=new URL(a).pathname;return e.some(function(e){return n.match(e)})},stripIgnoredUrlParameters=function(e,a){var n=new URL(e);return n.hash="",n.search=n.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return a.every(function(a){return!a.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),n.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var a=e[0],n=e[1],t=new URL(a,self.location),c=createCacheKey(t,hashParamName,n,!1);return[t.toString(),c]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(a){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(n){if(!a.has(n)){var t=new Request(n,{credentials:"same-origin"});return fetch(t).then(function(a){if(!a.ok)throw new Error("Request for "+n+" returned a response with status "+a.status);return cleanResponse(a).then(function(a){return e.put(n,a)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var a=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(n){return Promise.all(n.map(function(n){if(!a.has(n.url))return e.delete(n)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var a,n=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching);(a=urlsToCacheKeys.has(n))||(n=addDirectoryIndex(n,"index.html"),a=urlsToCacheKeys.has(n));0,a&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(n)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(a){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,a),fetch(e.request)}))}});