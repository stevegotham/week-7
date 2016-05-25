(function() {
  angular.module('myApp', ['ui.router'])
  .run(function ($rootScope, $state, $window) {
     $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
       if (toState.authenticate) {
             if (!$window.localStorage.getItem('token')) {
               $state.transitionTo('login')
               event.preventDefault()
             }
       }
     })
})
    .config(routerConfig)
    .controller('myController', ['$http', '$state','$window','$rootScope', ctrlfunc])
    .factory('AuthInterceptor', function($q, $location, $window) {

    var interceptorFactory = {};

    // this will happen on all HTTP requests
    interceptorFactory.request = function(config) {

        // grab the token
        var token = $window.localStorage.getItem('token');

        // if the token exists, add it to the header as x-access-token
        if (token)
            config.headers['x-access-token'] = token;

        return config;
    };

    // happens on response errors
    interceptorFactory.responseError = function(response) {

        // if our server returns a 403 forbidden response
        if (response.status == 403) {
            $window.localStorage.removeItem('token')
            $location.path('/login');
        }

        // return the errors from the server as a promise
        return $q.reject(response);
    };

    return interceptorFactory;

})
/////////////////////////////
// router configuration
    function routerConfig($stateProvider, $urlRouterProvider, $httpProvider) {
      $httpProvider.interceptors.push('AuthInterceptor')
      $stateProvider
        .state('login', {
          url: '/',
          templateUrl: 'login.html',
          controller: 'myController as cf',
          authenticate: false
        })
        .state('profile', {
          url: '/profile',
          templateUrl: 'profile.html',
          controller: 'myController as cf',
          authenticate: true
        })

        $urlRouterProvider.otherwise('/')
    }


// controller
    function ctrlfunc($http, $state, $window, $rootScope) {
      var cf = this
        var token = $window.localStorage.getItem('token')

      $http.get('/api/friends')
        .then(function(res) {
          console.log(res)
        })
      cf.login = function() {
        $http.post('/login', {username: cf.username, password: cf.password})
          .then(function(res) {
            var token = res.data.token
            if(token) {
              $window.localStorage.setItem('token', token)
              $state.go('profile')
            }
            else {
              console.log('no token found')
            }
          })
      }
    }
}());
