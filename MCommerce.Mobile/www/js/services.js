'use strict';

angular.module('mcommerceApp.shoppingCart', [])
	.factory('shoppingCart', function($rootScope) {
			return {
						initialize: function() {
							$rootScope.shoppingCart = $rootScope.shoppingCart || {};
							$rootScope.shoppingCart.itens = $rootScope.shoppingCart.itens || [];
							
							$rootScope.shoppingCart.index = 0;
							$rootScope.shoppingCart.storeId = 0;

							$rootScope.shoppingCart.getItemByProductId = function(productId) {
								for (var i = 0; i < $rootScope.shoppingCart.itens.length; i++) {
									if ($rootScope.shoppingCart.itens[i].product.Id == productId) {
										return i;
									}
								}
							}
							
							$rootScope.shoppingCart.addItem = function(product) {
								var productIndex = $rootScope.shoppingCart.getItemByProductId(product.Id);
							
								if (productIndex >= 0) {
									$rootScope.shoppingCart.itens[productIndex].quantity = parseInt($rootScope.shoppingCart.itens[productIndex].quantity) + 1;
								} else {
									$rootScope.shoppingCart.index++;
									
									$rootScope.shoppingCart.itens.push(
									{
										index: $rootScope.shoppingCart.index,
										product: product,
										quantity: 1
									});

									$rootScope.shoppingCart.storeId = product.StoreId;

									$rootScope.$watch('shoppingCart.itens[' + ($rootScope.shoppingCart.itens.length - 1) + '].quantity', function() {
										$rootScope.shoppingCart.update();
									});
								}
							};
							
							$rootScope.shoppingCart.removeItem = function(index) {
								$rootScope.shoppingCart.confirmRemoveIndex = index;
								navigator.notification.confirm('Tem certeza que deseja remover o item?', $rootScope.shoppingCart.confirmRemoveItem, 'Confirmar remo\u00e7\u00e3o', 'N\u00e3o,Sim');
							};
							
							$rootScope.shoppingCart.confirmRemoveItem = function(buttonIndex) {
								if (buttonIndex == "2") {
									for (var i = 0; i < $rootScope.shoppingCart.itens.length; i++) {
										if ($rootScope.shoppingCart.itens[i].index == $rootScope.shoppingCart.confirmRemoveIndex) {
											$rootScope.shoppingCart.itens.splice(i, 1);
											$rootScope.$apply();
											return;
										}
									}

									$rootScope.shoppingCart.update();
								}
							};

							$rootScope.shoppingCart.update = function() {
								var total = 0;

								for (var i = 0; i < $rootScope.shoppingCart.itens.length; i++) {
									total += $rootScope.shoppingCart.itens[i].product.Price * $rootScope.shoppingCart.itens[i].quantity;
								}

								$rootScope.shoppingCart.total = total;
								$rootScope.mbl.slideMenu.right.refreshScroll();
							};
							
							$rootScope.shoppingCart.checkout = function() {
								if ($rootScope.sessionId) {
									$rootScope.mbl.screen.go("/checkout");
								} else {
									$rootScope.auth.redirect = "/checkout";
									$rootScope.auth.show = true;
								}
							};
						}
					};
		});

angular.module('mcommerceApp.auth', ['mobileit.directives'])
	.factory('auth', function($rootScope, crypt, api) {
			return {
						initialize: function() {
							$rootScope.auth = $rootScope.auth || {};
							$rootScope.auth.show = false;

							$rootScope.auth.email = window.localStorage.getItem("auth.email");
							// $rootScope.auth.email = "andborges@gmail.com";
							// $rootScope.auth.password = "1q2w3e4r";
							
							$rootScope.auth.login = function() {
								$rootScope.auth.message = "";

								var customerLoginViewModel = {};
								customerLoginViewModel.Email = $rootScope.auth.email;
								customerLoginViewModel.Password = $rootScope.auth.password;
								customerLoginViewModel.DeviceUuid = window.device.uuid;
								
								var encryptedInfo = crypt.encrypt(JSON.stringify(customerLoginViewModel));
								
								api.call("v1/customerauth/login", "EncryptedInfo=" + encodeURIComponent(encryptedInfo), {}, function(data) {
									if (data.Success) {
										window.localStorage.setItem("auth.email", $rootScope.auth.email);

										$rootScope.sessionId = data.Data.Token.SessionId;
										$rootScope.auth.name = data.Data.Token.Name;
										$rootScope.auth.devicename = data.Data.DeviceName;
										$rootScope.auth.addresses = data.Data.Addresses;
										$rootScope.auth.paymentMethods = data.Data.PaymentMethods;

										$rootScope.auth.show = false;
										
										if ($rootScope.auth.redirect) {
											$rootScope.mbl.screen.go($rootScope.auth.redirect);
											$rootScope.auth.redirect = null;
										}
									} else {
										$rootScope.auth.message = data.Message;
									}
								});
							}
							
							$rootScope.auth.logoff = function() {
								$rootScope.sessionId = null;
								$rootScope.auth.name = null;
								$rootScope.auth.password = null;
							}
						}
					};
		});