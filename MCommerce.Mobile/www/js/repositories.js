'use strict';

angular.module('mcommerceApp.repositories', ['mobileit.directives'])
	.factory('fakeRepository', function() {
			var products = [
								{
									Id: 1,
									Name: "Camisa Pólo Nome Bastante Longo Para Testes de Quebra de Linha",
									Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat, metus vitae fringilla vulputate, ligula est tincidunt risus, a fermentum augue nunc eu nisl. Nunc bibendum quis libero sed dignissim. Fusce pharetra auctor consectetur.",
									Price: 20.00
								},
								{
									Id: 2,
									Name: "Calça Jeans Nome Bastante Longo Para Testes de Quebra de Linha",
									Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat, metus vitae fringilla vulputate, ligula est tincidunt risus, a fermentum augue nunc eu nisl. Nunc bibendum quis libero sed dignissim. Fusce pharetra auctor consectetur.",
									Price: 25.00
								},
								{
									Id: 3,
									Name: "Bermuda Cargo",
									Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat, metus vitae fringilla vulputate, ligula est tincidunt risus, a fermentum augue nunc eu nisl. Nunc bibendum quis libero sed dignissim. Fusce pharetra auctor consectetur.",
									Price: 22.00
								},
								{
									Id: 4,
									Name: "Camisa de Malha",
									Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat, metus vitae fringilla vulputate, ligula est tincidunt risus, a fermentum augue nunc eu nisl. Nunc bibendum quis libero sed dignissim. Fusce pharetra auctor consectetur.",
									Price: 15.00
								},
								{
									Id: 5,
									Name: "Jaqueta de Couro",Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat, metus vitae fringilla vulputate, ligula est tincidunt risus, a fermentum augue nunc eu nisl. Nunc bibendum quis libero sed dignissim. Fusce pharetra auctor consectetur.",
									Price: 120.00
								}
							];

			return {
						products: 
						{
							getHomeProducts: function() {
								return products;
							},
							getProduct: function(id) {
								return $.Enumerable.From(products).First(function(p){ return p.Id == id; });
							},
							getMainCategories: function() {
								return [
									{
										Id: 1,
										Name: "Roupas Masculinas"
									},
									{
										Id: 2,
										Name: "Calçados Masculinos"
									}
								];
							},
							getSubCategories: function(parentCategory) {
								return [
									{
										Id: 11,
										Name: "Camisas Sociais"
									},
									{
										Id: 12,
										Name: "Calças Sociais"
									},
									{
										Id: 13,
										Name: "Camisetas"
									},
									{
										Id: 14,
										Name: "Moda Praia"
									}
								];
							},
							searchProducts: function(searchTerm) {
								return $.Enumerable.From(products).Where(function(p){ return p.Name.indexOf(searchTerm) > -1; }).ToArray();
							}
						},
						customer:
						{
							
						}
					};
		});