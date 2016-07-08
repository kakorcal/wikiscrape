(()=>{
  angular.module('wiki.routes', ['ngRoute'])
    .config(Routes);

  function Routes($routeProvider, $locationProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'views/pages/wiki.html',
        controller: 'WikiController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
      });

      $locationProvider.html5Mode(true);
  }

  Routes.$inject = ['$routeProvider', '$locationProvider'];
})();