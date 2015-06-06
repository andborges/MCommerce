'use strict';

angular.module('mcommerceApp.controllers', ['mobileit.directives'])
    .controller('HomeCtrl', ['$scope', '$rootScope', 'crypt', 'api', function ($scope, $rootScope, crypt, api) {
		$scope.search = {};
		$scope.search.term = $rootScope.search;

		$scope.products = $scope.search.term ?
								$rootScope.mbl.options.repositories.products.searchProducts($scope.search.term) :
								$rootScope.mbl.options.repositories.products.getHomeProducts();

		$scope.ready = true;
		
		setTimeout(function() {
			$rootScope.mbl.page.addScroll();
		}, 50);
		
		$scope.search = function() {
			$scope.products = $scope.search.term ?
									$rootScope.mbl.options.repositories.products.searchProducts($scope.search.term) :
									$rootScope.mbl.options.repositories.products.getHomeProducts();

			$rootScope.search = $scope.search.term;
			$rootScope.mbl.page.scroll.refresh();
		}
		
		$scope.showProduct = function(productId) {
			$rootScope.product = $rootScope.mbl.options.repositories.products.getProduct(productId);
			$rootScope.mbl.screen.go('/product');
		}
		
		$scope.qrcode = function() {
			var scanner = cordova.require("com.phonegap.plugins.barcodescanner.barcodescanner");

			scanner.scan(
				function (result) {
					var productCode = ifRipple(result, result.text);
					// alert("We got a barcode\nResult: " + crypt.decrypt(productCode));

					api.call("v1/cart/product/" + productCode, null, {}, function(data) {						
						$rootScope.product = data.Data;
						$rootScope.mbl.screen.go('/product');
					});
				},
				function (error) {
					alert("Scanning failed: " + error);
				}
			);
		}
    }])
	.controller('ProductCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
		$scope.ready = true;

		setTimeout(function() {
			$rootScope.mbl.page.addScroll();
		}, 50);
    }])
	.controller('RegisterCtrl', ['$scope', '$rootScope', 'crypt', 'api', function ($scope, $rootScope, crypt, api) {
		$scope.newUser = {};
		$scope.newUser.devicename = window.device.name;

		setTimeout(function() {
			$rootScope.mbl.page.addScroll();
		}, 50);
		
		$scope.register = function() {
			$scope.message = "";

			var customerRegisterViewModel = {};
			customerRegisterViewModel.Name = $scope.newUser.name;
			customerRegisterViewModel.Email = $scope.newUser.email;
			customerRegisterViewModel.Identity = $scope.newUser.identity;
			customerRegisterViewModel.Password = $scope.newUser.password;
			customerRegisterViewModel.DeviceUuid = window.device.uuid;
			customerRegisterViewModel.DevicePlatform = window.device.platform;
			customerRegisterViewModel.DeviceName = $scope.newUser.devicename;
								
			var encryptedInfo = crypt.encrypt(JSON.stringify(customerRegisterViewModel));
			
			api.call("v1/customerauth/register", "EncryptedInfo=" + encodeURIComponent(encryptedInfo), {}, function(data) {
				if (data.Success) {
					$rootScope.sessionId = data.Data.SessionId;
					$rootScope.auth.name = data.Data.Name;
					navigator.notification.alert(data.Message, null, "Contra criada");
					$rootScope.mbl.screen.go('/', true);
				} else {
					$scope.message = data.Message;
				}
			});
		};
    }])
	.controller('CheckoutCtrl', ['$scope', '$rootScope', 'crypt', 'api', function ($scope, $rootScope, crypt, api) {
		$scope.newCheckout = {};
		$scope.newCheckout.parcels = 1;
		
		api.call("v1/payment/paymentmethods", "storeId=" + $rootScope.shoppingCart.storeId, {}, function(data) {
			if (data.Success) {
				$scope.paymentMethods = data.Data;
		
				setTimeout(function() {
					$rootScope.mbl.page.addScroll();
				}, 50);
			} else {
				$scope.message = data.Message;
			}
		});
		
		$scope.selectAddress = function(address, $event) {
			$scope.newCheckout.address = address.Id;
			$scope.address = address;

			$("#addressList li").removeClass("selected");
			$($event.target).addClass("selected");

			setTimeout(function() {
				$rootScope.mbl.page.scroll.refresh();
			}, 50);
		};
		
		$scope.selectPaymentMethod = function(paymentMethod, $event) {
			if (!paymentMethod.Enabled) return;

			$scope.newCheckout.paymentMethodType = paymentMethod.Type;
			$scope.newCheckout.paymentMethodBrand = paymentMethod.Brand;
			$scope.paymentMethod = paymentMethod;
			
			if ($scope.newCheckout.parcels > paymentMethod.MaxParcels) {
				$scope.newCheckout.parcels = paymentMethod.MaxParcels;
			}
			
			$("#paymentMethodList li").removeClass("selected");
			$($event.target).addClass("selected");
			
			setTimeout(function() {
				$rootScope.mbl.page.scroll.refresh();
			}, 50);
		};
		
		$scope.pay = function() {
			$scope.message = "";

			var itens = "";
			
			for (var i = 0; i < $rootScope.shoppingCart.itens.length; i++) {
				if (itens != "") itens += ";"
				itens += $rootScope.shoppingCart.itens[i].product.Id + "_" + $rootScope.shoppingCart.itens[i].quantity;
			}
			
			var paymentViewModel = {};
			paymentViewModel.StoreId = $rootScope.shoppingCart.storeId;
			paymentViewModel.Parcels = $scope.newCheckout.parcels;
			paymentViewModel.AddressId = $scope.newCheckout.address;
			paymentViewModel.PaymentMethodType = $scope.newCheckout.paymentMethodType;
			paymentViewModel.PaymentMethodBrand = $scope.newCheckout.paymentMethodBrand;
			paymentViewModel.Items = [];
			
			for (var i = 0; i < $rootScope.shoppingCart.itens.length; i++) {
				paymentViewModel.Items[i] = {};
				paymentViewModel.Items[i].ProductId = $rootScope.shoppingCart.itens[i].product.Id;
				paymentViewModel.Items[i].Quantity = $rootScope.shoppingCart.itens[i].quantity;
			}
			
			var encryptedInfo = crypt.encrypt(JSON.stringify(paymentViewModel));
			
			api.call("v1/payment", "EncryptedInfo=" + encodeURIComponent(encryptedInfo), {}, function(data) {
				if (data.Success) {
					navigator.notification.alert(data.Message, null, "Pagamento");
				} else {
					$scope.message = data.Message;
				}
			});
		};
	}]);