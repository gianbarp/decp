angular.module('app').directive('patientList', function($compile) {
  return {
      
    restrict: "E",
    templateUrl: 'components/patient-list/patient-list.html',
    
    controller: function($scope, ngNotify, rest, $localStorage, $location, $state, MessageService){
       
       rest.path = 'user/getdoctorassign';
       $scope.model = {};
       
       var errorCallback = function(data){
            ngNotify.set('No tiene un médico asignado.',{
               type: 'error',
               duration: 2000
            });
       };  
       
       rest.get("userid="+USER_ID).success(function(doctors){
            $scope.doctors = doctors;
            DOCTOR_ID = doctors[0].doctor_id;
       }).error(errorCallback);
       
        $('.modal-trigger').leanModal();
        
      $scope.embedchat = function(id){
          CHANNELID = id;
      }
      
      $scope.modalclose = function(){
          $('#modal1').closeModal();
      }
      
      $scope.sendMedicalMsg = function(){
          rest.path = 'user/sendmsg';
          $scope.model.userid = USER_ID;
          rest.postModel($scope.model).success(function(data){
              $scope.model.msg = '';
              ngNotify.set('Mensaje enviado, en breve recibirá una respuesta.',{
               type: 'success',
               duration: 2000
            });
              
          }).error(function(){
              ngNotify.set('El mensaje no pudo ser enviado, intente luego por favor.',{
                type: 'error',
                duration: 2000
             });
          });;
          
      }
      
    }
    
  };
  
});