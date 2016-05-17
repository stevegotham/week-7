angular.module('JobApp', [])

angular.module('JobApp')
	.controller('homeController', ['$scope', function($scope){

	}]);

angular.module('JobApp')
	.controller('applicantController', ['$scope','$http', function($scope, $http){
		$http.get('/applicantsDB')
			.then(function(res) {
				$scope.applicants = res.data
				console.log($scope.applicants)
			})
	}]);
