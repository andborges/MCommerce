mcommerceApp.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl : 'pages/home.html',
		controller  : 'HomeCtrl'
	})
	.when('/product', {
		templateUrl : 'pages/product.html',
		controller  : 'ProductCtrl'
	})
	.when('/register', {
		templateUrl : 'pages/register.html',
		controller  : 'RegisterCtrl'
	})
	.when('/checkout', {
		templateUrl : 'pages/checkout.html',
		controller  : 'CheckoutCtrl'
	})
});