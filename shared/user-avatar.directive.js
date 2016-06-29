angular.module('app').directive('userAvatar', function() {
  return {
    restrict: "E",
    template: '<img src="{{avatarUrl}}" alt="{{uuid}}" class="circle circle-avatar">',
    scope: {
      uuid: "@",
    },
    controller: function($scope){
      // Generating a uniq avatar for the given uniq string provided using robohash.org service
      $scope.avatarUrl = 'https://doctorencasa.co/uploads/'+$scope.uuid;
    }
  };
});