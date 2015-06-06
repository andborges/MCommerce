angular.module('templates-main', ['templates/screen.tpl', 'templates/loader.tpl', 'templates/page.tpl', 'templates/pageContent.tpl', 'templates/slideMenu.tpl', 'templates/slideMenuLeft.tpl', 'templates/slideMenuRight.tpl', 'templates/scrollerPullDown.tpl']);

angular.module("templates/screen.tpl", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/screen.tpl",
	"<div id=\"mblSlideMenuContent\" class=\"snap-content\">\n" +
    "	<div id=\"mblMain\">\n" +
	"		<div ng-view class=\"slide\"></div>\n" +
	"		<div ng-transclude></div>\n" +
	"	</div>\n" +
    "</div>");
}]);

angular.module("templates/slideMenu.tpl", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/slideMenu.tpl",
    "<div class=\"snap-drawers\" ng-transclude>\n" +
    "</div>");
}]);

angular.module("templates/slideMenuLeft.tpl", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/slideMenuLeft.tpl",
    "<div class=\"snap-drawer snap-drawer-left\" ng-transclude>\n" +
    "</div>");
}]);

angular.module("templates/slideMenuRight.tpl", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/slideMenuRight.tpl",
    "<div class=\"snap-drawer snap-drawer-right\" ng-transclude>\n" +
    "</div>");
}]);

angular.module("templates/loader.tpl", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/loader.tpl",
    "<div id=\"mblLoader\" style=\"display: none\">\n" +
	"	<i></i>\n" +
	"	<h1 ng-transclude></h1>\n" +
	"</div>");
}]);

angular.module("templates/page.tpl", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/page.tpl",
    "<div class=\"mbl-page\" ng-transclude>\n" +
	"</div>");
}]);

angular.module("templates/pageContent.tpl", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/pageContent.tpl",
    "<div class=\"mbl-page-content-wrapper\">\n" +
	"	<div class=\"mbl-page-content-scroller\" ng-transclude>\n" +
	"	</div>\n" +
	"</div>");
}]);

angular.module("templates/scrollerPullDown.tpl", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/scrollerPullDown.tpl",
    "<div id='pullDown'>\n" +
	"	<span class='pullDownIcon'></span><span class='pullDownLabel'>Puxe para atualizar...</span>\n" +
	"</div>");
}]);

(function() {
	var directiveModules = angular.module('mobileit.directives', ['templates-main']); // [] -> create new module

	directiveModules.run(function($rootScope, $window) {
		$rootScope.mbl = $rootScope.mbl || {};
		$rootScope.mbl.$get = function(id) {
			id = id.replace('#', '');
			return angular.element(document.getElementById(id)).isolateScope();
		};
	});

	directiveModules.factory('setup', function($rootScope, $location) {
		return {
					initialize: function(options) {
						$rootScope.mbl = $rootScope.mbl || {};

						$rootScope.mbl.options = options;
						$rootScope.mbl.app = {};
						
						$rootScope.mbl.app.logoff = function() {
							$("#mblMain").addClass("reverse");
							$rootScope.sessionId = null;
							$location.path("/");
						}

						$rootScope.mbl.app.exit = function (buttonIndex) {
							if (buttonIndex == "2") {
								navigator.app.exitApp();
							}
						}
				
						// Back button handler
						document.addEventListener("backbutton", function (e) {
							if ($location.path() != $rootScope.mbl.options.firstPage) {
								$rootScope.mbl.screen.back();
							} else {
								navigator.notification.confirm('Tem certeza que deseja sair?', $rootScope.mbl.app.exit, 'Confirmar sa\u00edda', 'N\u00e3o,Sim');
							}
						}, false);

						// iScroll
						document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

						// iScroll hack
						window.addEventListener("orientationchange", function() {
							$(".mbl-page .mbl-page-content-wrapper").height($(window).height() - $rootScope.mbl.page.top - $rootScope.mbl.page.bottom);
						}, false);

						// FastClick
						window.addEventListener('load', function() {
							FastClick.attach(document.body);
						}, false);
						
						// Prevent double click (Android Jelly Bean)
						var last_click_time = new Date().getTime();
						document.addEventListener('click', function (e) {
							click_time = e['timeStamp'];
							if (click_time && (click_time - last_click_time) < 500) {
								e.stopImmediatePropagation();
								e.preventDefault();
								return false;
							}
							last_click_time = click_time;
						}, true);
					}
				};
	});

	directiveModules.factory('crypt', function($rootScope) {
		return {
					encrypt: function(plainText) {
						var key = CryptoJS.PBKDF2(
							$rootScope.mbl.options.encryptionInfo.password,
							CryptoJS.enc.Latin1.parse($rootScope.mbl.options.encryptionInfo.salt),
							{
								keySize: $rootScope.mbl.options.encryptionInfo.keySize,
								iterations: $rootScope.mbl.options.encryptionInfo.passwordIterations
							}
						);
						
						return CryptoJS.AES.encrypt(plainText, key,	{ iv: CryptoJS.enc.Latin1.parse($rootScope.mbl.options.encryptionInfo.initialVector) });
					},
					decrypt: function(encrypted) {
						var key = CryptoJS.PBKDF2(
							$rootScope.mbl.options.encryptionInfo.password,
							CryptoJS.enc.Latin1.parse($rootScope.mbl.options.encryptionInfo.salt),
							{
								keySize: $rootScope.mbl.options.encryptionInfo.keySize,
								iterations: $rootScope.mbl.options.encryptionInfo.passwordIterations
							}
						);
						
						return CryptoJS.AES.decrypt(encrypted, key,	{ iv: CryptoJS.enc.Latin1.parse($rootScope.mbl.options.encryptionInfo.initialVector) }).toString(CryptoJS.enc.Utf8);
					}
				};
	});
	
	directiveModules.factory('api', function($rootScope, $http) {
		return {
					call: function(url, querystring, params, successCallback) {
						var fullUrl = $rootScope.mbl.options.server + "/Api/" + url + "?callback=JSON_CALLBACK";
							fullUrl += ($rootScope.sessionId ? "&sessionId=" + $rootScope.sessionId : "");
							fullUrl += (querystring ? "&" + querystring : "");
						
						if (params.beginLoading != false)
							$rootScope.mbl.loader.beginLoading();

						$http.jsonp(fullUrl)
						.success(function(data) {
							if (params.stopLoading != false)
								$rootScope.mbl.loader.stopLoading();

							successCallback(data);
						})
						.error(function(data) {
							$rootScope.mbl.loader.stopLoading();
							// Todo: Logging
						});
					}
				};
	});
	
	directiveModules.factory('MBL_CONSTANTS', function() {
		var CONSTANTS = {
			DIRECTIVE_TEMPLATE_URL: "templates"
		};

		return CONSTANTS;
	});
})();

(function() {
	'use strict';

	var directives = angular.module('mobileit.directives'); // no [] -> referencing existing module

	directives.directive('mblScreen', function(MBL_CONSTANTS, $rootScope, $location) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			templateUrl: MBL_CONSTANTS.DIRECTIVE_TEMPLATE_URL + '/screen.tpl',
			link: function($scope, element, attrs) {
				$rootScope.mbl = $rootScope.mbl || {};
				$rootScope.mbl.screen = {};

				$rootScope.mbl.screen.go = function(url, reverse) {
					if (reverse) {
						$("#mblMain").addClass("reverse");
					} else {
						$("#mblMain").removeClass("reverse");
					}

					$location.path(url);
					$rootScope.mbl.screen.snapper.close();
				}
	
				$rootScope.mbl.screen.back = function() {
					$("#mblMain").addClass("reverse");
					window.history.back();
				}
				
				if ($(".snap-drawer-left").length || $(".snap-drawer-right").length) {
					var disable = "none";
					
					if ($(".snap-drawer-left").length == 0) {
						disable = "left";
					} else if ($(".snap-drawer-right").length == 0) {
						disable = "right";
					}
				
					var snapper = new Snap({
						element: document.getElementById('mblSlideMenuContent'),
						disable: disable,
						maxPosition: 300,
						minPosition: -300,
						transitionSpeed: 0.2,
						easing: 'linear'
					});
					
					$rootScope.mbl.screen.snapper = snapper;
				}
			}
		};
	});
})();

(function() {
	'use strict';

	var loading = 0;
	var directives = angular.module('mobileit.directives'); // no [] -> referencing existing module

	directives.directive('mblLoader', function(MBL_CONSTANTS, $rootScope) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			templateUrl: MBL_CONSTANTS.DIRECTIVE_TEMPLATE_URL + '/loader.tpl',
			link: function($scope, element, attrs) {
				$rootScope.mbl = $rootScope.mbl || {};
				$rootScope.mbl.loader = {};

				$rootScope.mbl.loader.beginLoading = function() {
					loading++;
					
					if (loading > 0) {
						$("#mblLoader").show();
					}
				}

				$rootScope.mbl.loader.stopLoading = function() {
					if (loading > 0) {
						loading--;
					}
					
					if (loading <= 0) {
						setTimeout(function() {
							$("#mblLoader").hide();
						}, 200);
					}
				}
			}
		};
	});
})();

(function() {
	'use strict';

	var directives = angular.module('mobileit.directives'); // no [] -> referencing existing module

	directives.directive('mblPage', function(MBL_CONSTANTS, $rootScope) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			templateUrl: MBL_CONSTANTS.DIRECTIVE_TEMPLATE_URL + '/page.tpl',
			link: function($scope, element, attrs) {
				$rootScope.mbl = $rootScope.mbl || {};
				$rootScope.mbl.page = $rootScope.mbl.page || {};
			}
		};
	});
})();

(function() {
	'use strict';

	var mblPageContentWrapperIndex = 0;
	var directives = angular.module('mobileit.directives'); // no [] -> referencing existing module

	directives.directive('mblPageContent', function(MBL_CONSTANTS, $rootScope) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			templateUrl: MBL_CONSTANTS.DIRECTIVE_TEMPLATE_URL + '/pageContent.tpl',
			link: function($scope, element, attrs) {
				$rootScope.mbl = $rootScope.mbl || {};
				$rootScope.mbl.page = $rootScope.mbl.page || {};
				
				$rootScope.mbl.page.scrollerPullDownCallback = function() {};
				
				$rootScope.mbl.page.addScroll = function(offset) {
					mblPageContentWrapperIndex++;
					element.attr("id", "mblPageContentWrapper" + mblPageContentWrapperIndex);
					
					$rootScope.mbl.page.top = offset || 0;
					$rootScope.mbl.page.bottom = 0;

					var navbar = element.parents(".mbl-page").find(".topcoat-navigation-bar");
					var tabbar = element.parents("#mblMain").find(".topcoat-tab-bar");

					if (navbar.length) {
						$rootScope.mbl.page.top += navbar.outerHeight();
					}
					
					if (tabbar.length) {
						$rootScope.mbl.page.bottom = tabbar.outerHeight();
					}
					
					element.offset({ top: $rootScope.mbl.page.top });
					element.height($(window).height() - $rootScope.mbl.page.top - $rootScope.mbl.page.bottom);

					$rootScope.mbl.page.scroll = createScroll("mblPageContentWrapper" + mblPageContentWrapperIndex, $rootScope);
				}
			}
		};
	});
})();

(function() {
	'use strict';

	var directives = angular.module('mobileit.directives'); // no [] -> referencing existing module

	directives.directive('mblSlideMenu', function(MBL_CONSTANTS) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			templateUrl: MBL_CONSTANTS.DIRECTIVE_TEMPLATE_URL + '/slideMenu.tpl'
		};
	});
})();

(function() {
	'use strict';

	var directives = angular.module('mobileit.directives'); // no [] -> referencing existing module

	directives.directive('mblSlideMenuLeft', function(MBL_CONSTANTS, $rootScope) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			templateUrl: MBL_CONSTANTS.DIRECTIVE_TEMPLATE_URL + '/slideMenuLeft.tpl',
			link: function($scope, element, attrs) {
				$rootScope.mbl = $rootScope.mbl || {};
				$rootScope.mbl.slideMenu = $rootScope.mbl.slideMenu || {};
				$rootScope.mbl.slideMenu.left = $rootScope.mbl.slideMenu.left || {};
				
				element.find(".mbl-page-content-wrapper").attr("id", "mblSlideMenuLeftWrapper");
				
				$rootScope.mbl.slideMenu.left.refreshScroll = function() {
					if ($rootScope.mbl.slideMenu.left.scroll) {
						$rootScope.mbl.slideMenu.left.scroll.refresh();
					} else {
						$rootScope.mbl.slideMenu.left.scroll = createScroll("mblSlideMenuLeftWrapper", $rootScope);
					}
				}
			}
		};
	});
})();

(function() {
	'use strict';

	var directives = angular.module('mobileit.directives'); // no [] -> referencing existing module

	directives.directive('mblSlideMenuRight', function(MBL_CONSTANTS, $rootScope) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			templateUrl: MBL_CONSTANTS.DIRECTIVE_TEMPLATE_URL + '/slideMenuRight.tpl',
			link: function($scope, element, attrs) {
				$rootScope.mbl = $rootScope.mbl || {};
				$rootScope.mbl.slideMenu = $rootScope.mbl.slideMenu || {};
				$rootScope.mbl.slideMenu.right = $rootScope.mbl.slideMenu.right || {};
				
				element.find(".mbl-page-content-wrapper").attr("id", "mblSlideMenuRightWrapper");
				
				$rootScope.mbl.slideMenu.right.refreshScroll = function() {
					if ($rootScope.mbl.slideMenu.right.scroll) {
						$rootScope.mbl.slideMenu.right.scroll.refresh();
					} else {
						$rootScope.mbl.slideMenu.right.scroll = createScroll("mblSlideMenuRightWrapper", $rootScope);
					}
				}
			}
		};
	});
})();

(function() {
	'use strict';

	var directives = angular.module('mobileit.directives'); // no [] -> referencing existing module

	directives.directive('mblSlideMenuContent', function(MBL_CONSTANTS) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			templateUrl: MBL_CONSTANTS.DIRECTIVE_TEMPLATE_URL + '/pageContent.tpl'
		};
	});
})();

(function() {
	'use strict';

	var directives = angular.module('mobileit.directives'); // no [] -> referencing existing module

	directives.directive('mblScrollerPullDown', function(MBL_CONSTANTS) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			templateUrl: MBL_CONSTANTS.DIRECTIVE_TEMPLATE_URL + '/scrollerPullDown.tpl'
		};
	});
})();

(function() {
	'use strict';

	var directives = angular.module('mobileit.directives'); // no [] -> referencing existing module

	directives.directive('mblModalDialog', function() {
		return {
			restrict: 'E',
			scope: {
				show: '='
			},
			replace: true,
			transclude: true,
			link: function(scope, element, attrs) {
				scope.dialogStyle = {};

				if (attrs.width)
					scope.dialogStyle.width = attrs.width;

				if (attrs.maxwidth)
					scope.dialogStyle.maxWidth = attrs.maxwidth;
					
				if (attrs.height)
					scope.dialogStyle.height = attrs.height;
					
				scope.hideModal = function() {
					scope.show = false;
				};
			},
			template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
		};
	});
})();

/*
aes.js
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(u,p){var d={},l=d.lib={},s=function(){},t=l.Base={extend:function(a){s.prototype=this;var c=new s;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
r=l.WordArray=t.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=p?c:4*a.length},toString:function(a){return(a||v).stringify(this)},concat:function(a){var c=this.words,e=a.words,j=this.sigBytes;a=a.sigBytes;this.clamp();if(j%4)for(var k=0;k<a;k++)c[j+k>>>2]|=(e[k>>>2]>>>24-8*(k%4)&255)<<24-8*((j+k)%4);else if(65535<e.length)for(k=0;k<a;k+=4)c[j+k>>>2]=e[k>>>2];else c.push.apply(c,e);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=u.ceil(c/4)},clone:function(){var a=t.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],e=0;e<a;e+=4)c.push(4294967296*u.random()|0);return new r.init(c,a)}}),w=d.enc={},v=w.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++){var k=c[j>>>2]>>>24-8*(j%4)&255;e.push((k>>>4).toString(16));e.push((k&15).toString(16))}return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j+=2)e[j>>>3]|=parseInt(a.substr(j,
2),16)<<24-4*(j%8);return new r.init(e,c/2)}},b=w.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++)e.push(String.fromCharCode(c[j>>>2]>>>24-8*(j%4)&255));return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j++)e[j>>>2]|=(a.charCodeAt(j)&255)<<24-8*(j%4);return new r.init(e,c)}},x=w.Utf8={stringify:function(a){try{return decodeURIComponent(escape(b.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return b.parse(unescape(encodeURIComponent(a)))}},
q=l.BufferedBlockAlgorithm=t.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=x.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,e=c.words,j=c.sigBytes,k=this.blockSize,b=j/(4*k),b=a?u.ceil(b):u.max((b|0)-this._minBufferSize,0);a=b*k;j=u.min(4*a,j);if(a){for(var q=0;q<a;q+=k)this._doProcessBlock(e,q);q=e.splice(0,a);c.sigBytes-=j}return new r.init(q,j)},clone:function(){var a=t.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});l.Hasher=q.extend({cfg:t.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){q.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,e){return(new a.init(e)).finalize(b)}},_createHmacHelper:function(a){return function(b,e){return(new n.HMAC.init(a,
e)).finalize(b)}}});var n=d.algo={};return d}(Math);
(function(){var u=CryptoJS,p=u.lib.WordArray;u.enc.Base64={stringify:function(d){var l=d.words,p=d.sigBytes,t=this._map;d.clamp();d=[];for(var r=0;r<p;r+=3)for(var w=(l[r>>>2]>>>24-8*(r%4)&255)<<16|(l[r+1>>>2]>>>24-8*((r+1)%4)&255)<<8|l[r+2>>>2]>>>24-8*((r+2)%4)&255,v=0;4>v&&r+0.75*v<p;v++)d.push(t.charAt(w>>>6*(3-v)&63));if(l=t.charAt(64))for(;d.length%4;)d.push(l);return d.join("")},parse:function(d){var l=d.length,s=this._map,t=s.charAt(64);t&&(t=d.indexOf(t),-1!=t&&(l=t));for(var t=[],r=0,w=0;w<
l;w++)if(w%4){var v=s.indexOf(d.charAt(w-1))<<2*(w%4),b=s.indexOf(d.charAt(w))>>>6-2*(w%4);t[r>>>2]|=(v|b)<<24-8*(r%4);r++}return p.create(t,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
(function(u){function p(b,n,a,c,e,j,k){b=b+(n&a|~n&c)+e+k;return(b<<j|b>>>32-j)+n}function d(b,n,a,c,e,j,k){b=b+(n&c|a&~c)+e+k;return(b<<j|b>>>32-j)+n}function l(b,n,a,c,e,j,k){b=b+(n^a^c)+e+k;return(b<<j|b>>>32-j)+n}function s(b,n,a,c,e,j,k){b=b+(a^(n|~c))+e+k;return(b<<j|b>>>32-j)+n}for(var t=CryptoJS,r=t.lib,w=r.WordArray,v=r.Hasher,r=t.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;r=r.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},
_doProcessBlock:function(q,n){for(var a=0;16>a;a++){var c=n+a,e=q[c];q[c]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360}var a=this._hash.words,c=q[n+0],e=q[n+1],j=q[n+2],k=q[n+3],z=q[n+4],r=q[n+5],t=q[n+6],w=q[n+7],v=q[n+8],A=q[n+9],B=q[n+10],C=q[n+11],u=q[n+12],D=q[n+13],E=q[n+14],x=q[n+15],f=a[0],m=a[1],g=a[2],h=a[3],f=p(f,m,g,h,c,7,b[0]),h=p(h,f,m,g,e,12,b[1]),g=p(g,h,f,m,j,17,b[2]),m=p(m,g,h,f,k,22,b[3]),f=p(f,m,g,h,z,7,b[4]),h=p(h,f,m,g,r,12,b[5]),g=p(g,h,f,m,t,17,b[6]),m=p(m,g,h,f,w,22,b[7]),
f=p(f,m,g,h,v,7,b[8]),h=p(h,f,m,g,A,12,b[9]),g=p(g,h,f,m,B,17,b[10]),m=p(m,g,h,f,C,22,b[11]),f=p(f,m,g,h,u,7,b[12]),h=p(h,f,m,g,D,12,b[13]),g=p(g,h,f,m,E,17,b[14]),m=p(m,g,h,f,x,22,b[15]),f=d(f,m,g,h,e,5,b[16]),h=d(h,f,m,g,t,9,b[17]),g=d(g,h,f,m,C,14,b[18]),m=d(m,g,h,f,c,20,b[19]),f=d(f,m,g,h,r,5,b[20]),h=d(h,f,m,g,B,9,b[21]),g=d(g,h,f,m,x,14,b[22]),m=d(m,g,h,f,z,20,b[23]),f=d(f,m,g,h,A,5,b[24]),h=d(h,f,m,g,E,9,b[25]),g=d(g,h,f,m,k,14,b[26]),m=d(m,g,h,f,v,20,b[27]),f=d(f,m,g,h,D,5,b[28]),h=d(h,f,
m,g,j,9,b[29]),g=d(g,h,f,m,w,14,b[30]),m=d(m,g,h,f,u,20,b[31]),f=l(f,m,g,h,r,4,b[32]),h=l(h,f,m,g,v,11,b[33]),g=l(g,h,f,m,C,16,b[34]),m=l(m,g,h,f,E,23,b[35]),f=l(f,m,g,h,e,4,b[36]),h=l(h,f,m,g,z,11,b[37]),g=l(g,h,f,m,w,16,b[38]),m=l(m,g,h,f,B,23,b[39]),f=l(f,m,g,h,D,4,b[40]),h=l(h,f,m,g,c,11,b[41]),g=l(g,h,f,m,k,16,b[42]),m=l(m,g,h,f,t,23,b[43]),f=l(f,m,g,h,A,4,b[44]),h=l(h,f,m,g,u,11,b[45]),g=l(g,h,f,m,x,16,b[46]),m=l(m,g,h,f,j,23,b[47]),f=s(f,m,g,h,c,6,b[48]),h=s(h,f,m,g,w,10,b[49]),g=s(g,h,f,m,
E,15,b[50]),m=s(m,g,h,f,r,21,b[51]),f=s(f,m,g,h,u,6,b[52]),h=s(h,f,m,g,k,10,b[53]),g=s(g,h,f,m,B,15,b[54]),m=s(m,g,h,f,e,21,b[55]),f=s(f,m,g,h,v,6,b[56]),h=s(h,f,m,g,x,10,b[57]),g=s(g,h,f,m,t,15,b[58]),m=s(m,g,h,f,D,21,b[59]),f=s(f,m,g,h,z,6,b[60]),h=s(h,f,m,g,C,10,b[61]),g=s(g,h,f,m,j,15,b[62]),m=s(m,g,h,f,A,21,b[63]);a[0]=a[0]+f|0;a[1]=a[1]+m|0;a[2]=a[2]+g|0;a[3]=a[3]+h|0},_doFinalize:function(){var b=this._data,n=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;n[c>>>5]|=128<<24-c%32;var e=u.floor(a/
4294967296);n[(c+64>>>9<<4)+15]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360;n[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(n.length+1);this._process();b=this._hash;n=b.words;for(a=0;4>a;a++)c=n[a],n[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});t.MD5=v._createHelper(r);t.HmacMD5=v._createHmacHelper(r)})(Math);
(function(){var u=CryptoJS,p=u.lib,d=p.Base,l=p.WordArray,p=u.algo,s=p.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:p.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,r){for(var p=this.cfg,s=p.hasher.create(),b=l.create(),u=b.words,q=p.keySize,p=p.iterations;u.length<q;){n&&s.update(n);var n=s.update(d).finalize(r);s.reset();for(var a=1;a<p;a++)n=s.finalize(n),s.reset();b.concat(n)}b.sigBytes=4*q;return b}});u.EvpKDF=function(d,l,p){return s.create(p).compute(d,
l)}})();
CryptoJS.lib.Cipher||function(u){var p=CryptoJS,d=p.lib,l=d.Base,s=d.WordArray,t=d.BufferedBlockAlgorithm,r=p.enc.Base64,w=p.algo.EvpKDF,v=d.Cipher=t.extend({cfg:l.extend(),createEncryptor:function(e,a){return this.create(this._ENC_XFORM_MODE,e,a)},createDecryptor:function(e,a){return this.create(this._DEC_XFORM_MODE,e,a)},init:function(e,a,b){this.cfg=this.cfg.extend(b);this._xformMode=e;this._key=a;this.reset()},reset:function(){t.reset.call(this);this._doReset()},process:function(e){this._append(e);return this._process()},
finalize:function(e){e&&this._append(e);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(b,k,d){return("string"==typeof k?c:a).encrypt(e,b,k,d)},decrypt:function(b,k,d){return("string"==typeof k?c:a).decrypt(e,b,k,d)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=p.mode={},x=function(e,a,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var d=0;d<b;d++)e[a+d]^=
c[d]},q=(d.BlockCipherMode=l.extend({createEncryptor:function(e,a){return this.Encryptor.create(e,a)},createDecryptor:function(e,a){return this.Decryptor.create(e,a)},init:function(e,a){this._cipher=e;this._iv=a}})).extend();q.Encryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize;x.call(this,e,a,c);b.encryptBlock(e,a);this._prevBlock=e.slice(a,a+c)}});q.Decryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize,d=e.slice(a,a+c);b.decryptBlock(e,a);x.call(this,
e,a,c);this._prevBlock=d}});b=b.CBC=q;q=(p.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,l=[],n=0;n<c;n+=4)l.push(d);c=s.create(l,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:q}),reset:function(){v.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;else c=a.createDecryptor,this._minBufferSize=1;this._mode=c.call(a,
this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var n=d.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(p.format={}).OpenSSL={stringify:function(a){var b=a.ciphertext;a=a.salt;return(a?s.create([1398893684,
1701076831]).concat(a).concat(b):b).toString(r)},parse:function(a){a=r.parse(a);var b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=s.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return n.create({ciphertext:a,salt:c})}},a=d.SerializableCipher=l.extend({cfg:l.extend({format:b}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var l=a.createEncryptor(c,d);b=l.finalize(b);l=l.cfg;return n.create({ciphertext:b,key:c,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},
decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),p=(p.kdf={}).OpenSSL={execute:function(a,b,c,d){d||(d=s.random(8));a=w.create({keySize:b+c}).compute(a,d);c=s.create(a.words.slice(b),4*c);a.sigBytes=4*b;return n.create({key:a,iv:c,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:p}),encrypt:function(b,c,d,l){l=this.cfg.extend(l);d=l.kdf.execute(d,
b.keySize,b.ivSize);l.iv=d.iv;b=a.encrypt.call(this,b,c,d.key,l);b.mixIn(d);return b},decrypt:function(b,c,d,l){l=this.cfg.extend(l);c=this._parse(c,l.format);d=l.kdf.execute(d,b.keySize,b.ivSize,c.salt);l.iv=d.iv;return a.decrypt.call(this,b,c,d.key,l)}})}();
(function(){for(var u=CryptoJS,p=u.lib.BlockCipher,d=u.algo,l=[],s=[],t=[],r=[],w=[],v=[],b=[],x=[],q=[],n=[],a=[],c=0;256>c;c++)a[c]=128>c?c<<1:c<<1^283;for(var e=0,j=0,c=0;256>c;c++){var k=j^j<<1^j<<2^j<<3^j<<4,k=k>>>8^k&255^99;l[e]=k;s[k]=e;var z=a[e],F=a[z],G=a[F],y=257*a[k]^16843008*k;t[e]=y<<24|y>>>8;r[e]=y<<16|y>>>16;w[e]=y<<8|y>>>24;v[e]=y;y=16843009*G^65537*F^257*z^16843008*e;b[k]=y<<24|y>>>8;x[k]=y<<16|y>>>16;q[k]=y<<8|y>>>24;n[k]=y;e?(e=z^a[a[a[G^z]]],j^=a[a[j]]):e=j=1}var H=[0,1,2,4,8,
16,32,64,128,27,54],d=d.AES=p.extend({_doReset:function(){for(var a=this._key,c=a.words,d=a.sigBytes/4,a=4*((this._nRounds=d+6)+1),e=this._keySchedule=[],j=0;j<a;j++)if(j<d)e[j]=c[j];else{var k=e[j-1];j%d?6<d&&4==j%d&&(k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255]):(k=k<<8|k>>>24,k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255],k^=H[j/d|0]<<24);e[j]=e[j-d]^k}c=this._invKeySchedule=[];for(d=0;d<a;d++)j=a-d,k=d%4?e[j]:e[j-4],c[d]=4>d||4>=j?k:b[l[k>>>24]]^x[l[k>>>16&255]]^q[l[k>>>
8&255]]^n[l[k&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,t,r,w,v,l)},decryptBlock:function(a,c){var d=a[c+1];a[c+1]=a[c+3];a[c+3]=d;this._doCryptBlock(a,c,this._invKeySchedule,b,x,q,n,s);d=a[c+1];a[c+1]=a[c+3];a[c+3]=d},_doCryptBlock:function(a,b,c,d,e,j,l,f){for(var m=this._nRounds,g=a[b]^c[0],h=a[b+1]^c[1],k=a[b+2]^c[2],n=a[b+3]^c[3],p=4,r=1;r<m;r++)var q=d[g>>>24]^e[h>>>16&255]^j[k>>>8&255]^l[n&255]^c[p++],s=d[h>>>24]^e[k>>>16&255]^j[n>>>8&255]^l[g&255]^c[p++],t=
d[k>>>24]^e[n>>>16&255]^j[g>>>8&255]^l[h&255]^c[p++],n=d[n>>>24]^e[g>>>16&255]^j[h>>>8&255]^l[k&255]^c[p++],g=q,h=s,k=t;q=(f[g>>>24]<<24|f[h>>>16&255]<<16|f[k>>>8&255]<<8|f[n&255])^c[p++];s=(f[h>>>24]<<24|f[k>>>16&255]<<16|f[n>>>8&255]<<8|f[g&255])^c[p++];t=(f[k>>>24]<<24|f[n>>>16&255]<<16|f[g>>>8&255]<<8|f[h&255])^c[p++];n=(f[n>>>24]<<24|f[g>>>16&255]<<16|f[h>>>8&255]<<8|f[k&255])^c[p++];a[b]=q;a[b+1]=s;a[b+2]=t;a[b+3]=n},keySize:8});u.AES=p._createHelper(d)})();

/*
pbkdf2.js
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(g,j){var e={},d=e.lib={},m=function(){},n=d.Base={extend:function(a){m.prototype=this;var c=new m;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
q=d.WordArray=n.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=j?c:4*a.length},toString:function(a){return(a||l).stringify(this)},concat:function(a){var c=this.words,p=a.words,f=this.sigBytes;a=a.sigBytes;this.clamp();if(f%4)for(var b=0;b<a;b++)c[f+b>>>2]|=(p[b>>>2]>>>24-8*(b%4)&255)<<24-8*((f+b)%4);else if(65535<p.length)for(b=0;b<a;b+=4)c[f+b>>>2]=p[b>>>2];else c.push.apply(c,p);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=g.ceil(c/4)},clone:function(){var a=n.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*g.random()|0);return new q.init(c,a)}}),b=e.enc={},l=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],f=0;f<a;f++){var d=c[f>>>2]>>>24-8*(f%4)&255;b.push((d>>>4).toString(16));b.push((d&15).toString(16))}return b.join("")},parse:function(a){for(var c=a.length,b=[],f=0;f<c;f+=2)b[f>>>3]|=parseInt(a.substr(f,
2),16)<<24-4*(f%8);return new q.init(b,c/2)}},k=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],f=0;f<a;f++)b.push(String.fromCharCode(c[f>>>2]>>>24-8*(f%4)&255));return b.join("")},parse:function(a){for(var c=a.length,b=[],f=0;f<c;f++)b[f>>>2]|=(a.charCodeAt(f)&255)<<24-8*(f%4);return new q.init(b,c)}},h=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(k.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},parse:function(a){return k.parse(unescape(encodeURIComponent(a)))}},
u=d.BufferedBlockAlgorithm=n.extend({reset:function(){this._data=new q.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=h.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,d=b.words,f=b.sigBytes,l=this.blockSize,e=f/(4*l),e=a?g.ceil(e):g.max((e|0)-this._minBufferSize,0);a=e*l;f=g.min(4*a,f);if(a){for(var h=0;h<a;h+=l)this._doProcessBlock(d,h);h=d.splice(0,a);b.sigBytes-=f}return new q.init(h,f)},clone:function(){var a=n.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});d.Hasher=u.extend({cfg:n.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){u.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,d){return(new a.init(d)).finalize(b)}},_createHmacHelper:function(a){return function(b,d){return(new w.HMAC.init(a,
d)).finalize(b)}}});var w=e.algo={};return e}(Math);
(function(){var g=CryptoJS,j=g.lib,e=j.WordArray,d=j.Hasher,m=[],j=g.algo.SHA1=d.extend({_doReset:function(){this._hash=new e.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(d,e){for(var b=this._hash.words,l=b[0],k=b[1],h=b[2],g=b[3],j=b[4],a=0;80>a;a++){if(16>a)m[a]=d[e+a]|0;else{var c=m[a-3]^m[a-8]^m[a-14]^m[a-16];m[a]=c<<1|c>>>31}c=(l<<5|l>>>27)+j+m[a];c=20>a?c+((k&h|~k&g)+1518500249):40>a?c+((k^h^g)+1859775393):60>a?c+((k&h|k&g|h&g)-1894007588):c+((k^h^
g)-899497514);j=g;g=h;h=k<<30|k>>>2;k=l;l=c}b[0]=b[0]+l|0;b[1]=b[1]+k|0;b[2]=b[2]+h|0;b[3]=b[3]+g|0;b[4]=b[4]+j|0},_doFinalize:function(){var d=this._data,e=d.words,b=8*this._nDataBytes,l=8*d.sigBytes;e[l>>>5]|=128<<24-l%32;e[(l+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(l+64>>>9<<4)+15]=b;d.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=d.clone.call(this);e._hash=this._hash.clone();return e}});g.SHA1=d._createHelper(j);g.HmacSHA1=d._createHmacHelper(j)})();
(function(){var g=CryptoJS,j=g.enc.Utf8;g.algo.HMAC=g.lib.Base.extend({init:function(e,d){e=this._hasher=new e.init;"string"==typeof d&&(d=j.parse(d));var g=e.blockSize,n=4*g;d.sigBytes>n&&(d=e.finalize(d));d.clamp();for(var q=this._oKey=d.clone(),b=this._iKey=d.clone(),l=q.words,k=b.words,h=0;h<g;h++)l[h]^=1549556828,k[h]^=909522486;q.sigBytes=b.sigBytes=n;this.reset()},reset:function(){var e=this._hasher;e.reset();e.update(this._iKey)},update:function(e){this._hasher.update(e);return this},finalize:function(e){var d=
this._hasher;e=d.finalize(e);d.reset();return d.finalize(this._oKey.clone().concat(e))}})})();
(function(){var g=CryptoJS,j=g.lib,e=j.Base,d=j.WordArray,j=g.algo,m=j.HMAC,n=j.PBKDF2=e.extend({cfg:e.extend({keySize:4,hasher:j.SHA1,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(e,b){for(var g=this.cfg,k=m.create(g.hasher,e),h=d.create(),j=d.create([1]),n=h.words,a=j.words,c=g.keySize,g=g.iterations;n.length<c;){var p=k.update(b).finalize(j);k.reset();for(var f=p.words,v=f.length,s=p,t=1;t<g;t++){s=k.finalize(s);k.reset();for(var x=s.words,r=0;r<v;r++)f[r]^=x[r]}h.concat(p);
a[0]++}h.sigBytes=4*c;return h}});g.PBKDF2=function(d,b,e){return n.create(e).compute(d,b)}})();

/*
date-pt-BR.js
*/
var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd, dd/mmm/yyyy HH:MM:ss",
	shortDate:      "d/m/yy",
	mediumDate:     "d mmm, yyyy",
	longDate:       "d mmmm, yyyy",
	fullDate:       "dddd, d mmmm, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb",
		"Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"
	],
	monthNames: [
		"Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez",
		"Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
}

var createScroll = function (id, rootScope) {
	var pullDownEl = $("#" + id).parent(".mbl-page").find("#pullDown");
	var pullDownOffset = pullDownEl[0] ? pullDownEl[0].offsetHeight : 0;
	
	return new iScroll(id,
						{
							topOffset: pullDownOffset,
							mouseWheel: true,
							bounce: true,
							momentum: true,
							useTransition: true,
							shrinkScrollbars: 'clip',
							onBeforeScrollStart: function (e) {
								var target = e.target;
								while (target.nodeType != 1) target = target.parentNode;

								if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
									e.preventDefault();
							},
							onRefresh: function () {
								if (pullDownEl[0] && pullDownEl.hasClass('loading')) {
									pullDownEl.removeClass('loading');
									pullDownEl.removeClass('flip');
									pullDownEl.find('.pullDownLabel').html('Puxe para atualizar...');
								}
							},
							onScrollMove: function (that, e) {
								if (pullDownEl[0]) {
									if (this.y > 0 && !pullDownEl.hasClass('flip')) {
										pullDownEl.addClass('flip');
										pullDownEl.find('.pullDownLabel').html('Solte para atualizar...');
										this.minScrollY = 0;
									} else if (this.y <= 0 && pullDownEl.hasClass('flip')) {
										pullDownEl.removeClass('loading');
										pullDownEl.removeClass('flip');
										pullDownEl.find('.pullDownLabel').html('Puxe para atualizar...');
										this.minScrollY = -pullDownOffset;
									}
								}
							},
							onScrollEnd: function () {
								if (pullDownEl[0] && pullDownEl.hasClass('flip')) {
									pullDownEl.removeClass('flip');
									pullDownEl.addClass('loading');
									pullDownEl.find('.pullDownLabel').html('Atualizando...');
									
									if (rootScope.mbl.page.scrollerPullDownCallback) {
										rootScope.mbl.page.scrollerPullDownCallback();
									}									
								}
							}
						});
}

function queryStringToObject( qstr ) {
	var result = {},
		nvPairs = ( ( qstr || "" ).replace( /^\?/, "" ).split( /&/ ) ),
		i, pair, n, v;

	for ( i = 0; i < nvPairs.length; i++ ) {
		var pstr = nvPairs[ i ];
		if ( pstr ) {
			pair = pstr.split( /=/ );
			n = pair[ 0 ];
			v = pair[ 1 ];
			if ( result[ n ] === undefined ) {
				result[ n ] = v;
			} else {
				if ( typeof result[ n ] !== "object" ) {
					result[ n ] = [ result[ n ] ];
				}
				result[ n ].push( v );
			}
		}
	}

	return result;
}

function ifRipple(rippleResult, notRippleResult) {
	return typeof (window.tinyHippos) == "undefined" ? notRippleResult : rippleResult.replace("\"", "").replace("{", "").replace("}", "");
}