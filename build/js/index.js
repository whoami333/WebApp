"use strict";

angular.module('app',['ui.router','ngCookies','validation','ngAnimate']);

'use strict';
angular.module('app').value('dict',{}).run(['dict','$http',function(dict,$http){
	$http.get('data/city.json').success(function(resp){
		dict.city = resp;
	});
	$http.get('data/salary.json').success(function(resp){
		dict.salary = resp;
	});
	$http.get('data/scale.json').success(function(resp){
		dict.scale = resp;
	});	
}])

'use strict';
angular.module('app').config(['$provide',function($provide){
	$provide.decorator('$http',['$delegate','$q',function($delegate,$q){
		$delegate.post = function(url,data,config){
			var def = $q.defer();
			$delegate.get(url).success(function(resp){
				def.resolve(resp);
			}).error(function(err){
				def.reject(err);
			});
			return {
				success: function(cb){
					def.promise.then(cb)
				},
				error: function(cb){
					def.promise.then(null,cb)
				}
			}
		}
		return $delegate;
	}])
}])

'use strict';

angular.module('app').config(['$stateProvider','$urlRouterProvider',
	function($stateProvider,$urlRouterProvider){
	$stateProvider
	.state('main',{
		url:'/main', //地址栏上的哈希值
		templateUrl:'view/main.html',  //对应的页面
		controller:'mainCtrl'   //对应页面的控制、交互
	})
	.state('position',{
		url:'/position/:id',// 传值
		templateUrl:'view/position.html',
		controller:'positionCtrl'
	})
	.state('company',{
		url:'/company/:id',
		templateUrl:'view/company.html',
		controller:'companyCtrl'
	})
	.state('search',{
		url:'/search',
		templateUrl:'view/search.html',
		controller:'searchCtrl'
	})
	.state('login',{
		url:'/login',
		templateUrl:'view/login.html',
		controller:'loginCtrl'
	})
	.state('register',{
		url:'/register',
		templateUrl:'view/register.html',
		controller:'registerCtrl'
	})
	.state('me',{
		url:'/me',
		templateUrl:'view/me.html',
		controller:'meCtrl'
	})
	.state('post',{
		url:'/post',
		templateUrl:'view/post.html',
		controller:'postCtrl'
	})
	.state('favorite',{
		url:'/favorite',
		templateUrl:'view/favorite.html',
		controller:'favoriteCtrl'
	});
	$urlRouterProvider.otherwise('main'); //没有匹配则转发到 main
}]);
'use strict';
angular.module('app').config(['$validationProvider',function($validationProvider){
	var expression = {
		phone:/^1[\d]{10}$/,
		password:function(value){
			var str = value + '';
			return str.length > 5;
		},
		required: function(value){
			return !!value;
		}
	};
	var defaultMsg = {
		phone:{
			success:'',
			error:'必须是11位手机号'
		},
		password:{
			success:'',
			error:'长度至少6位'
		},
		required:{
			success:'',
			error:'不能为空'
		}
	};
	$validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
}]);

"use strict";
//mainCtrl
angular.module('app').controller('companyCtrl',['$scope','$http','$state',function($scope,$http,$state){
	$http.get('/data/company.json?id='+$state.params.id)
	.success(function(resp){
		$scope.company = resp;
//		console.log($state.params.id)
//		console.log(resp)
	});
}]);

"use strict";
//mainCtrl  获取职位列表
angular.module('app').controller('favoriteCtrl',['$scope','$http',function($scope,$http){
	$http.get('data/myFavorite.json').success(function(resp){
		$scope.list = resp;
	})	
}])

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

"use strict";
//mainCtrl  获取职位列表
angular.module('app').controller('searchCtrl',['dict','$scope','$http',function(dict,$scope,$http){
	$scope.name = '';
	$scope.search = function(){
		$http.get('/data/positionList.json')
		.success(
			function(resp){
	//			console.log(resp);
				$scope.positionList = resp;
			}
		)
		.error(function(){
			alert("请求职位列表数据失败")
		});		
	}
	$scope.search();
	$scope.sheet = {};	
	$scope.tabList = [{
	    id: 'city',
	    name: '城市'
	}, {
	    id: 'salary',
	    name: '薪水'
	}, {
		id: 'scale',
	    name: '公司规模'
	}];
	$scope.filterObj={};
	var tabId='';
	$scope.tClick = function(id,name){
		tabId = id;
		$scope.sheet.list = dict[id];
		$scope.sheet.visible = true;
	}
	$scope.sClick = function(id,name){
		if(id){
			angular.forEach($scope.tabList,function(item){
				if(item.id===tabId){
					item.name = name;
				}
			});
			$scope.filterObj[tabId + 'Id']= id;
		}else{
			delete $scope.filterObj[tabId + 'Id'];
			angular.forEach($scope.tabList,function(item){
				if(item.id===tabId){
					switch (item.id){
						case 'city':
							item.name= '城市';
							break;
						case 'salary':
							item.name= '薪水';
							break;
						case 'scale':
							item.name= '公司规模';
							break;							
						default:
					}
				}
			})			
		}
	}
}])

"use strict";
angular.module('app').directive('appCompany',[function(){
	return {
		restrica:'A',   //'AEMC' 属性、元素、样式、注释
		replace:true,   //替换父元素		
		scope:{
			company:'='
		},
		templateUrl:'view/template/company.html'
	};
}]);
"ues strict";
angular.module('app').directive('appFoot',function(){
	return{
		restrict:"A",
		replace:true,
		templateUrl:'view/template/foot.html'
	}
})

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
"use strict";
angular.module('app').directive('appHeadBar',[function(){
	return {
		restrica:'A',   //'AEMC' 属性、元素、样式、注释
		replace:true,   //替换父元素
		templateUrl:'view/template/headBar.html',
		scope:{
			text:'@'
		},
		link: function(scope){
			scope.back = function(){
				window.history.back();
			}
		}
	};
}]);
"use strict";
angular.module('app').directive('appPositionClass',[function(){
	return {
		restrict: 'A', //限定 约束
		replace:true,
		scope:{
			com:'='
		},
		templateUrl:'view/template/positionClass.html',
		link:function($scope){
			$scope.showPositionList = function(idx){
				$scope.positionList = $scope.com.positionClass[idx].positionList;
				$scope.isActive = idx;
			}
			$scope.$watch('com',function(newVal){
				if(newVal) $scope.showPositionList(0);
			})			
		}
	}
}]);
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

"use strict";
angular.module('app').directive('appSheet',[function(){
	return{
		restrict:'A',
		replace:true,
		templateUrl:'view/template/sheet.html',
		scope:{
			list:'=',
			visible:'=',
			select:'&'
		}
	};
}]);

'use strict';
angular.module('app').directive('appTab', [function(){
  return {
    restrict: 'A',
    replace: true,
    scope: {
      list: '=',
      tabClick: '&'
    },
    templateUrl: 'view/template/tab.html',
    link: function($scope) {
      $scope.click = function(tab) {
        $scope.selectId = tab.id;
        $scope.tabClick(tab);
      };
    }
  };
}]);

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
'use strict';
angular.module('app').filter('filterByObj', [function(){
  return function(list, obj) {
    var result = [];
    angular.forEach(list, function(item){
      var isEqual = true;
      for(var e in obj){
        if(item[e]!==obj[e]) {
          isEqual = false;
        }
      }
      if(isEqual) {
        result.push(item);
      }
    });
    return result;
  };
}]);
