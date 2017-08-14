"use strict";
angular.module('app').controller('positionCtrl',['$log','cache','$scope','$http','$state','$q',function($log,cache,$scope,$http,$state,$q){
	$scope.isLogin= !!cache.get('name');
	$scope.message = $scope.isLogin?'投个简历':'去登陆';
	function getPosition(){
		var def= $q.defer(); //延迟加载 $q
		$http.get('/data/position.json?id='+$state.params.id)  
		.success(function(resp){
			$scope.position = resp;
			if(resp.posted){
				$scope.message = '已投递';
			}
			def.resolve(resp);
//			console.log('职位列表id:  '+ resp.id +' !')
//			console.log($state.params.id)
//			console.log(resp.id)
		})
		.error(function(err){
			def.reject(err);
		});
		return def.promise;
	};
	function getCompany(id){
		$http.get('/data/company.json?id='+id)
		.success(function(resp){
			$scope.company = resp;
//			console.log(resp)
//			console.log('公司 id: '+ resp.id)
		})
	};
	getPosition().then(function(obj){
//		console.log(obj)
		getCompany(obj.companyId);
	});
	$scope.go = function(){
		if($scope.message !== '已投递'){
			if($scope.isLogin){
				$http.post('data/handle.json',{
					id: $scope.position.id
				}).success(function(resp){
					$log.info(resp)
					$scope.message = '已投递'
				})
			}else{
				$state.go('login');
			}			
		}
	}
}])
