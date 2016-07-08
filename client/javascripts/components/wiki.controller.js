(()=>{
  angular.module('wiki.component', [])
    .controller('WikiController', WikiController);

  function WikiController($scope, Socket){
    let vm = this;

    Socket.connect();

    $scope.$on('$locationChangeStart', e=>{
      Socket.disconnect(true);
    });
  }

  WikiController.$inject = ['$scope', 'Socket'];
})();