webpackJsonp([3],{106:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(14),a=n(53),c=n(109),o=n(117),i=n(151),s=n.n(i),u=n(280);n.n(u);n(107);var f={};r.a.use(s.a,f),r.a.config.productionTip=!1,r.a.use(a.z),n(278),a.z.start(function(){new r.a({el:"#q-app",router:c.a,store:o.a,render:function(e){return e(n(282))}})})},107:function(e,t){},109:function(e,t,n){"use strict";function r(e){return function(){return n(111)("./"+e+".vue")}}var a=n(14),c=n(110);a.a.use(c.a),t.a=new c.a({routes:[{path:"/",component:r("Index")},{path:"/login/:token",component:r("Index")},{path:"*",component:r("Error404")}]})},111:function(e,t,n){function r(e){var t=a[e];return t?n.e(t[1]).then(function(){return n(t[0])}):Promise.reject(new Error("Cannot find module '"+e+"'."))}var a={"./Error404.vue":[288,1],"./Index.vue":[289,0]};r.keys=function(){return Object.keys(a)},r.id=111,e.exports=r},117:function(e,t,n){"use strict";var r=n(104),a=n(14),c=n(118),o=n(119);a.a.use(r.a);var i={token:"",devices:{},hasDevicesInit:!1,offline:!1};t.a=new r.a.Store({state:i,mutations:c.a,actions:o.a})},118:function(e,t,n){"use strict";function r(e){}function a(e,t){t.forEach(function(t){p.a.set(e.devices,t.id,t)})}function c(e,t){switch(t.response.status){case 0:f(e,!0),p.a.set(e,"token","");break;case 401:i(e)}}function o(e,t){var n=t.replace("FlespiToken ","");t&&n.match(/^[a-z0-9]+$/i)?(p.a.connector.token="FlespiToken "+n,v.d.set("X-Flespi-Token",n)):(n="",p.a.connector.token="",i(e)),p.a.set(e,"token",n)}function i(e){var t=v.a.get("X-Flespi-Token"),n=v.d.get.item("X-Flespi-Token");t&&n&&t===n&&v.a.remove("X-Flespi-Token"),v.d.remove("X-Flespi-Token"),p.a.connector.token="",p.a.set(e,"token","")}function s(e){e.hasDevicesInit=!0}function u(e){e.hasDevicesInit=!1,p.a.set(e,"devices",[])}function f(e,t){p.a.set(e,"offline",t)}var p=n(14),v=n(53);t.a={reqStart:r,reqSuccessful:a,reqFailed:c,setToken:o,clearToken:i,setDevicesInit:s,unsetDevicesInit:u,setOfflineFlag:f}},119:function(e,t,n){"use strict";var r=n(120),a=n.n(r),c=n(123),o=n.n(c),i=n(14),s=function(){var e=o()(a.a.mark(function e(t,n){var r,c,o=t.state,s=t.commit;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(s("reqStart"),e.prev=1,!o.token){e.next=9;break}return e.next=5,i.a.connector.gw.getDevices("all",{fields:"id,name,ident,phone,telemetry,messages_ttl"});case 5:r=e.sent,c=r.data.result,s("reqSuccessful",c),o.hasDevicesInit||s("setDevicesInit");case 9:e.next=14;break;case 11:e.prev=11,e.t0=e.catch(1),s("reqFailed",e.t0);case 14:case"end":return e.stop()}},e,this,[[1,11]])}));return function(t,n){return e.apply(this,arguments)}}(),u=function(){var e=o()(a.a.mark(function e(t){var n,r=(t.state,t.commit);return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,i.a.connector.http.get("./statics/icons/favicon-16x16.png?_="+(new Date).getTime());case 3:n=e.sent,200===n.status&&r("setOfflineFlag",!1),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0);case 10:case"end":return e.stop()}},e,this,[[0,7]])}));return function(t){return e.apply(this,arguments)}}();t.a={getDevices:s,checkConnection:u}},243:function(e,t){},267:function(e,t){},268:function(e,t){},279:function(e,t){},281:function(e,t){},282:function(e,t,n){function r(e){n(283)}var a=n(101)(n(284),n(285),r,null,null);e.exports=a.exports},283:function(e,t){},284:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={}},285:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"q-app"}},[n("router-view")],1)},staticRenderFns:[]}}},[106]);