"use strict";
angular.module('app').directive('appPositionInfo',['$http',function($http){
	return {
		restrict: 'A', //限定指令为 属性
		replace:true,
		templateUrl:'view/template/positionInfo.html',
		scope:{
			isActive:'=',
			isLogin:'=',
			position:'='
		},
		link: function($scope){
			$scope.$watch('position',function(newVal){
				if(newVal) {
					$scope.position.select = $scope.position.select || false;
					$scope.imagePath = $scope.position.select?'image/star-active.png':'image/star.png';					
				}
			});
			$scope.favorite = function(){
				$http.post('data/favorite.json',{
					id: $scope.position.id,
					select: !$scope.position.select
				}).success(function(resp){
					$scope.position.select = !$scope.position.select;
					$scope.imagePath = $scope.position.select?'image/star-active.png':'image/star.png';
				});
			}
		}
	}
}]);