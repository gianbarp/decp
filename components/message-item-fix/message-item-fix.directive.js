angular.module('app').directive('messageItemFix', function(MessageService) {
  return {
    restrict: "E",
    templateUrl: 'components/message-item-fix/message-item-fix.html',
    
    scope: {
      content: "@",
    },
    controller: function($scope){
      
      var nameImg = C_MSG.message.sender_uuid.split("##");  
        
      $scope.user_content = C_MSG.message.content;
      $scope.user_sender_id = nameImg[0];
      $scope.user_date = C_MSG.message.date;
      $scope.avatar = nameImg[1];
      
    }
    
  };
});