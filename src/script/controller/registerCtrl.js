"use strict";
//mainCtrl  获取职位列表
angular.module('app').controller('registerCtrl',['$state','$interval','$scope','$http',function($state,$interval,$scope,$http){
	$scope.submit = function(){
		$http.post('data/regist.json',$scope.user).success(function(resp){
			alert('注册成功');
			$state.go('login');
		})
	}
	var count = 60;
	$scope.send = function(){
		$http.get('data/code.json').success(function(resp){
			if(1===resp.state){
				count = 60;
				$scope.time = '60s';
				var interval = $interval(function(){
					if(count <= 0){
						$interval.cancel(interval);
						$scope.time= '';
					}else{
						count--;
						$scope.time =count + 's';
					}
				},1000)
			}
		});
	}
}]);
