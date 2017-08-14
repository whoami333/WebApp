"use strict";
angular.module('app').service('cache',['$cookies',function($cookies){
	this.put = function(key,value){
		$cookies.put(key,value);
	};
	this.get = function(key){                //service 直接返回函数
		return $cookies.get(key);
	};
	this.remove = function(key){
		$cookies.remove(key);
	};
}]);