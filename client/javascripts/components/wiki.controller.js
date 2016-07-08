(()=>{
  angular.module('wiki.component', ['ngSanitize'])
    .controller('WikiController', WikiController);

  function WikiController($scope, Socket){
    Socket.connect();
    
    let vm = this;
    
    vm.generateArticle = function(path){
      if(path){
        Socket.emit('generate article', path);
      }else{
        Socket.emit('generate article');
      }
    };

    Socket.on('receive article', data=>{
      vm.title = data.title;
      vm.content = data.content;
      vm.styles = data.styles;
      // vm.scripts = data.scripts;
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