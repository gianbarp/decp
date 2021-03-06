angular.module('app').directive('messageItem', function(MessageService) {
  return {
    restrict: "E",
    templateUrl: 'components/message-item/message-item.html',
    
    scope: {
      content: "@",
    },
    controller: function($scope){
        
      var nameImg = JSON.parse($scope.content).message.sender_uuid.split("##");  
        
      $scope.user_content = JSON.parse($scope.content).message.content;
      $scope.user_sender_id = nameImg[0];
      $scope.user_date = JSON.parse($scope.content).message.date;
      $scope.avatar = nameImg[1];
      $scope.receive_image = '';
      $scope.doctor_in = (JSON.parse($scope.content).message.doctor_in) ? JSON.parse($scope.content).message.doctor_in : '';
      
      if(JSON.parse($scope.content).message.image){
          $scope.receive_image = 'https://doctorencasa.co/uploads/'+JSON.parse($scope.content).message.message;
          $scope.img_indicator = true;
      }
    }
    
  };
});