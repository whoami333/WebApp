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