(()=>{
  angular.module('wiki.component', ['ngSanitize'])
    .controller('WikiController', WikiController)
    .directive('compile', compile);
  
  //***************************************************************************
  // NOT MY CODE!! check out: https://github.com/angular/angular.js/issues/4992
  //***************************************************************************
  function compile($compile) {
    // directive factory creates a link function
    return function(scope, element, attrs) {
      scope.$watch(
        function(scope) {
          // watch the 'compile' expression for changes
          return scope.$eval(attrs.compile);
        },
        function(value) {
          // when the 'compile' expression changes
          // assign it into the current DOM
          element.html(value);

          // compile the new DOM and link it to the current
          // scope.
          // NOTE: we only compile .childNodes so that
          // we don't get into infinite loop compiling ourselves
          $compile(element.contents())(scope);
        }
      );
    };
  };

  compile.$inject = ['$compile'];
  //***************************************************************************
    // END
  //***************************************************************************


  function WikiController($scope, $sce, $compile, Socket){
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
      vm.content = $sce.trustAsHtml(data.content);
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

  WikiController.$inject = ['$scope', '$sce', '$compile', 'Socket'];
})();