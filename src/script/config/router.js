'use strict';

angular.module('app').config(['$stateProvider','$urlRouterProvider',
	function($stateProvider,$urlRouterProvider){
	$stateProvider
	.state('main',{
		url:'/main', //地址栏上的哈希值
		templateUrl:'view/main.html',  //对应的页面
		controller:'mainCtrl'   //对应页面的控制、交互
	})
	.state('position',{
		url:'/position/:id',// 传值
		templateUrl:'view/position.html',
		controller:'positionCtrl'
	})
	.state('company',{
		url:'/company/:id',
		templateUrl:'view/company.html',
		controller:'companyCtrl'
	})
	.state('search',{
		url:'/search',
		templateUrl:'view/search.html',
		controller:'searchCtrl'
	})
	.state('login',{
		url:'/login',
		templateUrl:'view/login.html',
		controller:'loginCtrl'
	})
	.state('register',{
		url:'/register',
		templateUrl:'view/register.html',
		controller:'registerCtrl'
	})
	.state('me',{
		url:'/me',
		templateUrl:'view/me.html',
		controller:'meCtrl'
	})
	.state('post',{
		url:'/post',
		templateUrl:'view/post.html',
		controller:'postCtrl'
	})
	.state('favorite',{
		url:'/favorite',
		templateUrl:'view/favorite.html',
		controller:'favoriteCtrl'
	});
	$urlRouterProvider.otherwise('main'); //没有匹配则转发到 main
}]);