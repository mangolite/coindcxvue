(function(e){function n(n){for(var r,o,i=n[0],c=n[1],d=n[2],l=0,f=[];l<i.length;l++)o=i[l],Object.prototype.hasOwnProperty.call(u,o)&&u[o]&&f.push(u[o][0]),u[o]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);s&&s(n);while(f.length)f.shift()();return a.push.apply(a,d||[]),t()}function t(){for(var e,n=0;n<a.length;n++){for(var t=a[n],r=!0,o=1;o<t.length;o++){var i=t[o];0!==u[i]&&(r=!1)}r&&(a.splice(n--,1),e=c(c.s=t[0]))}return e}var r={},o={coindcxvue:0},u={coindcxvue:0},a=[];function i(e){return c.p+"js/"+({}[e]||e)+".js"}function c(n){if(r[n])return r[n].exports;var t=r[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,c),t.l=!0,t.exports}c.e=function(e){var n=[],t={"chunk-0b16e114":1,"chunk-10d140c8":1,"chunk-c1a7f4e0":1};o[e]?n.push(o[e]):0!==o[e]&&t[e]&&n.push(o[e]=new Promise((function(n,t){for(var r="css/"+({}[e]||e)+".css",u=c.p+r,a=document.getElementsByTagName("link"),i=0;i<a.length;i++){var d=a[i],l=d.getAttribute("data-href")||d.getAttribute("href");if("stylesheet"===d.rel&&(l===r||l===u))return n()}var f=document.getElementsByTagName("style");for(i=0;i<f.length;i++){d=f[i],l=d.getAttribute("data-href");if(l===r||l===u)return n()}var s=document.createElement("link");s.rel="stylesheet",s.type="text/css",s.onload=n,s.onerror=function(n){var r=n&&n.target&&n.target.src||u,a=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");a.code="CSS_CHUNK_LOAD_FAILED",a.request=r,delete o[e],s.parentNode.removeChild(s),t(a)},s.href=u;var p=document.getElementsByTagName("head")[0];p.appendChild(s)})).then((function(){o[e]=0})));var r=u[e];if(0!==r)if(r)n.push(r[2]);else{var a=new Promise((function(n,t){r=u[e]=[n,t]}));n.push(r[2]=a);var d,l=document.createElement("script");l.charset="utf-8",l.timeout=120,c.nc&&l.setAttribute("nonce",c.nc),l.src=i(e);var f=new Error;d=function(n){l.onerror=l.onload=null,clearTimeout(s);var t=u[e];if(0!==t){if(t){var r=n&&("load"===n.type?"missing":n.type),o=n&&n.target&&n.target.src;f.message="Loading chunk "+e+" failed.\n("+r+": "+o+")",f.name="ChunkLoadError",f.type=r,f.request=o,t[1](f)}u[e]=void 0}};var s=setTimeout((function(){d({type:"timeout",target:l})}),12e4);l.onerror=l.onload=d,document.head.appendChild(l)}return Promise.all(n)},c.m=e,c.c=r,c.d=function(e,n,t){c.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},c.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,n){if(1&n&&(e=c(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(c.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)c.d(t,r,function(n){return e[n]}.bind(null,r));return t},c.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return c.d(n,"a",n),n},c.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},c.p="/",c.oe=function(e){throw console.error(e),e};var d=window["webpackJsonp"]=window["webpackJsonp"]||[],l=d.push.bind(d);d.push=n,d=d.slice();for(var f=0;f<d.length;f++)n(d[f]);var s=l;a.push([0,"chunk-vendors"]),t()})({0:function(e,n,t){e.exports=t("56d7")},"034f":function(e,n,t){"use strict";t("85ec")},"56d7":function(e,n,t){"use strict";t.r(n);t("e260"),t("e6cf"),t("cca6"),t("a79d"),t("adcf");var r=t("a026"),o=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{attrs:{id:"app"}},[t("router-view")],1)},u=[],a=t("5f5b"),i=t("b1e0");t("f9e3"),t("2dd8"),t("cd74"),t("7d05");r["default"].use(a["a"]),r["default"].use(i["a"]);var c={name:"App",components:{},mounted:function(){var e=document.createElement("script");e.setAttribute("src","https://kit.fontawesome.com/1153462312.js"),document.head.appendChild(e)}},d=c,l=(t("034f"),t("2877")),f=Object(l["a"])(d,o,u,!1,null,null,null),s=f.exports,p=(t("d3b7"),t("3ca3"),t("ddb0"),t("8c4f"));r["default"].use(p["a"]);var h=new p["a"]({mode:"history",base:"coindcxvue",scrollBehavior:function(){return window.scrollTo({top:0,behavior:"smooth"})},routes:[{path:"/",name:"demo",component:function(){return t.e("chunk-c1a7f4e0").then(t.bind(null,"71a7"))}},{path:"/home",name:"home",component:function(){return t.e("chunk-10d140c8").then(t.bind(null,"57da"))}},{path:"/blog",name:"blog",component:function(){return t.e("chunk-0b16e114").then(t.bind(null,"3d68"))}}]});r["default"].config.productionTip=!1,new r["default"]({render:function(e){return e(s)},router:h}).$mount("#app")},"7d05":function(e,n,t){},"85ec":function(e,n,t){},adcf:function(e,n,t){window.CONST&&window.CONST.CDN_URL&&(t.p=window.CONST.CDN_URL+"/"),window.CONST=window.CONST||{},window.CONST.APP=window.CONST.APP||"admin";var r=location.pathname;/^\/[a-z]+\/plugin\/customer\/.*$/.test(r)?window.CONST.APP="customer":0==r.indexOf("/admin")?window.CONST.APP="admin":0==r.indexOf("/agent")?window.CONST.APP="agent":0==r.indexOf("/dev")&&(window.CONST.APP="dev")}});