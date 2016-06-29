angular.module('app').directive('signIn', function() {
  return {
      
    restrict: "E",
    templateUrl: 'components/login/sign-in.html',
    
    controller: function($scope, ngNotify, rest, $localStorage, $location){
        
      $scope.model = {};  
        
      rest.path = 'user/loginapi';  
        
      var errorCallback = function (data) {
           ngNotify.set('Error de autenticación.', {
              type: 'error',
              sticky: true,
              button: true,
           });
     };  
        
      $scope.authenticate = function(){
           
            rest.postModel($scope.model).success(function(data){
                
                if(data){
                    window.localStorage.setItem('_auth', data.auth_key);
                    window.localStorage.setItem('_userid', data.user_id);
                    window.localStorage.setItem('_fullname', data.fullname);
                    window.localStorage.setItem('_avatar', data.avatar);
                    
                    USER_ID = window.localStorage.getItem('_userid', data.user_id);
                    USER_NAME = window.localStorage.getItem('_fullname', data.fullname);
                    USER_AVATAR = window.localStorage.getItem('_avatar', data.avatar);
                    
                    window.location.href = '#/patientlist';
                }else{
                    ngNotify.set('Error de autenticación.', {
                        type: 'error',
                        duration: 3000
                     });
                }
            }).error(errorCallback);
      
      };
       
    }
    
  };
  
});