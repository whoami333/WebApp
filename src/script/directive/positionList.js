"use strict";
angular.module('app').directive('appPositionList',['$http',function($http){
	return{
		restrict:'A',
		replace:true,
		templateUrl:'view/template/positionList.html',  
		scope:{ //在一个页面存在多个应用接口时   接口指令  还需要传到对应的控制器上
			data:'=',
			filterObj:'=',
			isFavorite:'='
		},
		link: function($scope){
//			$scope.name =cache.get('name') || '';
			$scope.select = function(item){
				$http.post('data/favorite.json',{
					id: item.id,
					select: !item.select
				}).success(function(resp){
					item.select = !item.select;
				})
			}
		}
	};
}]);
