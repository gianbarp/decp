angular.module('app').directive('patientMsg', function($compile) {
  return {
    restrict: "E",
    replace: true,
    templateUrl: 'components/patient-msg/patient-msg.html',
    scope: {
      msg: "@",
      avatar: "@",
      ddate: "@",
      name: "@",
    },
    
    controller: function($scope){
      
      $scope.user_msg = $scope.msg;
      $scope.user_avatar = $scope.avatar;
      $scope.user_date = $scope.ddate;
      $scope.user_name = $scope.name;
      
    }
  };
});