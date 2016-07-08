(()=>{
  angular.module('wiki.component', ['ngSanitize'])
    .controller('WikiController', WikiController);

  function WikiController($scope, Socket){
    Socket.connect();
    
    let vm = this;
    
    vm.generateRandom = function(){
      Socket.emit('generate random');
    };

    Socket.on('receive article', data=>{
      vm.title = data.title;
      vm.content = data.content;
      vm.styles = data.styles;
    });

    Socket.on('Error', data=>{
      alert(data);
    });
  
    $scope.$on('$locationChangeStart', e=>{
      Socket.disconnect(true);
    });
  }

  WikiController.$inject = ['$scope', 'Socket'];
})();