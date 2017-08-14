"use strict";
angular.module('app').directive('appHead',['cache',function(cache){
	return {
		restrica:'A',   //'AEMC' 属性、元素、样式、注释
		replace:true,   //替换父元素  
		templateUrl:'view/template/head.html',
		link: function($scope){
			$scope.name = cache.get('name')||'';
		}
	};
}]);