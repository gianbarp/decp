angular.module('app').directive('medicalRecord', function() {
  return {
    restrict: "E",
    
    templateUrl: 'components/medical-record/medical-record.html',
    
    scope:{
      slogan:'@',
      description: '@',
      experience: '@',
    },

    controller: function($scope){
    
        $scope.user_slogan = $scope.slogan;
        $scope.user_description = $scope.description;
        $scope.user_experience = $scope.experience;
        
        $scope.medicalRecordClose = function(){
            $('#patientinfomadal').closeModal();
        }
    
    }
    
  };
  
});