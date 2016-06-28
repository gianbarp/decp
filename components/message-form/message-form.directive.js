angular.module('app').directive('messageForm', function($compile) {
  return {
    restrict: "E",
    replace: true,
    templateUrl: 'components/message-form/message-form.html',
    scope: {},
    
    controller: function($scope, currentUser, MessageService,$stateParams,rest,ngNotify){
      
      $scope.uuid = currentUser;
      $scope.messageContent = '';

      $scope.sendMessage = function(){
      	MessageService.sendMessage($scope.messageContent);
        
        var el = $compile('<patient-msg msg="'+$scope.messageContent+'" avatar="'+USER_AVATAR+'" ddate="'+Date.now()+'" name="'+USER_NAME+'"></patient-msg>')($scope);
        $("#message-list").append(el);
        
      	$scope.messageContent = '';
      }
      
      $scope.takePicture = function(){
          navigator.camera.getPicture(onCapturePhoto, onFail, { 
              quality : 100,
              destinationType : navigator.camera.DestinationType.FILE_URI
          });
          
      }
      
      function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
            return result;
      }
      
      function clearCache() {
            navigator.camera.cleanup();
        }
      
      var retries = 0;
      function onCapturePhoto(fileURI) {
          
            ngNotify.set('Enviando imagen...',{
                type: 'success',
                duration: 10000
             });
      
            var win = function(r){
                
                MessageService.sendWithImage(r.response+'.jpg');
                
                clearCache();
                retries = 0;
                ngNotify.set('La imagen se envió con éxito.',{
                    type: 'success',
                    duration: 2000
                 });
            }

            var fail = function (error) {
                if (retries == 0) {
                    retries ++
                    setTimeout(function() {
                        onCapturePhoto(fileURI)
                    }, 1000)
                } else {
                    retries = 0;
                    clearCache();
                    ngNotify.set('La imagen no logro ser enviada.',{
                        type: 'error',
                        duration: 2000
                     });
                }
            }

            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            options.params = {keyimage:randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')};
            var ft = new FileTransfer();
            ft.upload(fileURI, encodeURI("https://doctorencasa.co/user/setimage"), win, fail, options);
        
      }
      
      function onFail(message) {
        alert('No se ha logrado enviar la imagen.');
      }
      
    }
  };
});