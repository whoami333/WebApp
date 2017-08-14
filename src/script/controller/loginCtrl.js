"use strict";
//mainCtrl  获取职位列表
angular.module('app').controller('loginCtrl',['cache','$state','$scope','$http',function(cache,$state,$scope,$http){
	$scope.submit = function (){
		$http.post('data/login.json',$scope.user).success(function(resp){
			cache.put('id',resp.id);
			cache.put('name',resp.name);
			cache.put('image',resp.image);			
			$state.go('main');
		})
	}	
}])
