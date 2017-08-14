"use strict";
//mainCtrl  获取职位列表
angular.module('app').controller('mainCtrl',['$scope','$http',function($scope,$http){
	$http.get('/data/positionList.json')
	.success(
		function(resp){
//			console.log(resp);
			$scope.list = resp;
		}
	)
	.error(function(){
		alert("请求职位列表数据失败")
	});
	
}])
