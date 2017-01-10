var github = angular.module('github', ['ngRoute','filters']);
var githubURL = "https://api.github.com";


github .config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'templates/home.html',
        controller: 'mainCtrl'
      }).
      when('/user/:userId', {
        templateUrl: 'templates/user.html',
        controller: 'userCtrl'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);

github.controller("mainCtrl", function($scope, $http) {
	
	$scope.keyword = "javascript";
	$scope.userNameOnly = true;
	
	$scope.$watch('keyword', function(newValue, oldValue) { 
		
		$scope.getData();

	}); 

	$scope.getData = function(){

		$scope.noResults = false;
		$scope.dataSet = "";
		$scope.loading = true;

		targetUri = githubURL+"/search/users?q="+$scope.keyword;

		if($scope.userNameOnly == true){
			$urlString = "+in:login&type=Users";
		}else{
			$urlString = "";
		}
		
		$http.jsonp(targetUri + $urlString + "&callback=JSON_CALLBACK")
	    .success (function (result) {	    
	        
	        $scope.dataSet = result.data;
	        $scope.loading = false;

	        if(typeof result.data.items !="undefined" && result.data.items.length==0)
	        	$scope.noResults = true;
	    })
	    .error (function (e) {
	    	console.log(e);
	    });

	}
});



github.controller('userCtrl', function($scope, $http, $routeParams) {

	$scope.userId = $routeParams.userId;
	
	$scope.user = "";
	$scope.repos = "";
	$scope.loading = true;
	$scope.showAll = false;
	$scope.totalRepos = 0;

	repoTargetUri = githubURL + "/users/" + $scope.userId + "/repos?type=public&sort=updated";
	userTargetUri = githubURL + "/users/" + $scope.userId;

	
	$http.jsonp(repoTargetUri + "&callback=JSON_CALLBACK")
    .success (function (result) {	    

        $scope.repos = result.data;
        $scope.loading = false;
        $scope.totalRepos = result.data.length;
        
    })
    .error (function (e) {
    	console.log(e);
    });	

	
	$http.jsonp(userTargetUri + "?callback=JSON_CALLBACK")
    .success (function (result) {	    
        
        $scope.user = result.data;
        $scope.loading = false;
        var userData = new Array;
        for(var eachUser in result.data){

        	temp = new Array;
        	temp['key'] = eachUser;
        	temp['value'] = result.data[eachUser];
        	userData.push(temp);
        }
        $scope.userData = userData;
    })
    .error (function (e) {
    	console.log(e);
    });	

});

angular.module('filters', []).filter('limitWords', function() {
  return function(str) {
    	
    	if(typeof str=="undefined" || str=="" || str==null){
    		return "No description";
    	}else{
    		return str.split(' ').splice(0, 20).join(' ');		
    	}
      
    
  }
});