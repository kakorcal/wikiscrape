(()=>{
  angular.module('wiki.directive', [])
    .directive('compileHtml', compile);
  
  function compile($parse, $sce, $compile){
    return {
      restrict: "A",
      link: function(scope, element, attr){
        let expression = $sce.parseAsHtml(attr.compileHtml);
        debugger;

        let getResult = function(){
          let ex = expression(scope);
          debugger;
          return ex;
        };

        scope.$watch(getResult, function(newValue){
          let linker = $compile(newValue);
          element.append(linker(scope));
          debugger;
        });

      }
    };
  }

  compile.$inject = ['$parse', '$sce','$compile'];


  // function compile($compile){
  //   debugger;
  //   return function(scope, element, attrs){
  //     debugger;
  //     scope.$watch(
  //       function(scope) {
  //         debugger;
  //         return scope.$eval(attrs.compileHtml);
  //       },
  //       function(value) {
  //         element.html(value);
  //         $compile(element.contents())(scope);
  //         debugger;
  //       }
  //     );
  //   }
  // }

  // compile.$inject = ['$compile'];
})();