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