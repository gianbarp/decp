angular.module('app').directive('patient', function($compile) {
  return {
    restrict: "E",
    templateUrl: 'components/patient/patient.html',
    
    scope: {
      fullname: "@",
      userid: "@",
      avatar: "@",
    },
    controller: function($scope,MessageService){
      $scope.user_id = $scope.userid;
      $scope.fullname = $scope.fullname;
      $scope.avatar = $scope.avatar;
      
      $('.modal-trigger').leanModal({
             ready: function() {
                 var el = $compile('<nav class="blue darken-1"> <div class="nav-wrapper"> <a href="#/patientlist" ng-click="modalclose()" data-activates="slide-out" class="button-collapse"><i class="ico-patient-list-back"><</i></a> <a class="page-title patient-chip" ng-click="getInfoDoctor()"><div id="patient-chip" class="chip">Ver perfil del médico</div> </a> </div> <ul id="slide-out" class="side-nav"> <li><a href="#!">Inicio</a></li> <li><a href="#!">¿Cómo funciona?</a></li> </ul> </nav>\
                                    <div class="message-container"><message-list></message-list><message-form></message-form></div>')($scope);
                 $("#chat-content").append(el);
             }
        });
        
        $scope.embedchat = function(id){
          CHANNELID = id;
        }

        $scope.modalclose = function(){
            $('#modal1').closeModal();
        }
        
      
    }
    
  };
});