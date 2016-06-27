angular.module('app').directive('messageForm', function($compile) {
  return {
    restrict: "E",
    replace: true,
    templateUrl: 'components/message-form/message-form.html',
    scope: {},
    
    controller: function($scope, currentUser, MessageService,$stateParams){
      
      $scope.uuid = currentUser;
      $scope.messageContent = '';

      $scope.sendMessage = function(){
      	MessageService.sendMessage($scope.messageContent);
        
        var el = $compile('<patient-msg msg="'+$scope.messageContent+'" avatar="'+USER_AVATAR+'" ddate="'+Date.now()+'" name="'+USER_NAME+'"></patient-msg>')($scope);
        $("#message-list").append(el);
        
      	$scope.messageContent = '';
      }
    }
  };
});