"use strict";
//mainCtrl  获取职位列表
angular.module('app').controller('postCtrl',['$scope','$http',function($scope,$http){
	$scope.tabList = [{
		id:'all',
		name:'全部'
	},{
		id:'pass',
		name:'面试邀请'
	},{
		id:'fail',
		name:'不合格'
	}];	
	$http.get('data/myPost.json').success(function(resp){
		$scope.positionList = resp;
	})
	$scope.filterObj = {};
	$scope.tClick = function(id,name){
		switch (id){
			case 'all':
			delete $scope.filterObj.state;
			break;
			
			case 'pass':
			$scope.filterObj.state = '1';
			break;
			
			case 'fail':
			$scope.filterObj.state = '-1';
			break;
			default:
		}
	}
}])
