"use strict";
//mainCtrl  获取职位列表
angular.module('app').controller('meCtrl',['$state','$cookies','$scope','$http',function($state,$cookies,$scope,$http){
	if($cookies.get('name')){
		$scope.name = $cookies.get('name');
		$scope.image = $cookies.get('image');
	}
	$scope.logout = function(){
		$cookies.remove('id');
		$cookies.remove('name');
		$cookies.remove('image');
		$state.go('main');
	}
}])
