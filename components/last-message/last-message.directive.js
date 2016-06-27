angular.module('app').directive('lastMessage', function($compile) {
  return {
      
    restrict: "E",
    templateUrl: 'components/last-message/last-message.html',
    scope:{
        userid:'@'
    },
    
    controller: function($scope, ngNotify, rest, $localStorage, $location, $state, MessageService){
     
    }    
    
  };
  
});