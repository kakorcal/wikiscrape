(()=>{
  angular.module('socket.services', [])
    .service('Socket', Socket);

  function Socket(socketFactory){
    return socketFactory();
  }

  Socket.$inject = ['socketFactory'];
})();