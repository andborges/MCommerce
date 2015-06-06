var mcommerceApp = angular.module('mcommerceApp', ['ngRoute', 'ngAnimate', 'mobileit.directives', 'mcommerceApp.controllers', 'mcommerceApp.repositories', 'mcommerceApp.shoppingCart', 'mcommerceApp.auth']);

mcommerceApp.run(function(setup, fakeRepository, shoppingCart, auth) {
	setup.initialize(
	{
		// server: "http://staging.mbl-it.com/mcommerce", // Staging
		server: "http://localhost:4576", // Localhost
		// server: "http://192.168.56.1:5992", // GenyMotion localhost

		repositories: fakeRepository,
		
		firstPage: "/",
		
		encryptionInfo: {
							password: "PafM48eqPZnbhFdgR",
							salt: "MCommerceComponentFramework",
							passwordIterations: 2,
							initialVector: "ADGyi14x#nfq75mK",
							keySize: 256 / 32
						}
	});

	shoppingCart.initialize();
	auth.initialize();
});