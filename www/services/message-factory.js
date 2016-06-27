angular.module('app')
.factory('MessageService', ['$rootScope', '$q', 'PubNub','currentUser', 'ngNotify', '$compile',
 function MessageServiceFactory($rootScope, $q, PubNub, currentUser, ngNotify, $compile) {
  
  // Aliasing this by self so we can access to this trough self in the inner functions
  var self = this;
  this.messages = []
  this.channel = 'messages-channel'+USER_ID;

  // We keep track of the timetoken of the first message of the array
  // so it will be easier to fetch the previous messages later
  this.firstMessageTimeToken = null;
  this.messagesAllFetched = false;

  var whenDisconnected = function(){
      ngNotify.set('Conexión perdida. Intentando conectar...', {
        type: 'warn',
        sticky: true,
        button: false,
      });
  };

  var whenReconnected = function(){
      ngNotify.set('La conexión fue re-establecida.', {
          type: 'info',
          duration: 1500
      });
  };

  var init = function() {
      
      PubNub.ngSubscribe({
          channel: self.channel,
          disconnect : whenDisconnected, 
          reconnect : whenReconnected,
          triggerEvents: ['callback']
      });

      self.firstMessageTimeToken = new Date();
      
      subcribeNewMessage(function(ngEvent,m){
        self.messages.push(m);
        $rootScope.$digest()
  });

  };
  
  var populateHybrid = function(messageshybrid){
      
       var defaultMessagesNumber = 20;

        PubNub.ngHistory({
         channel: messageshybrid,
         callback: function(m){
            
            // Update the timetoken of the first message
            self.timeTokenFirstMessage = m[1]
            angular.extend(self.messages, m[0]);  

            if(m[0].length < defaultMessagesNumber){
              self.messagesAllFetched = true;
            }

            $rootScope.$digest()
            $rootScope.$emit('factory:message:populated')
            
         },
         count: defaultMessagesNumber, 
         reverse: false
        });
      
  }
  
  var populate = function(){

    var defaultMessagesNumber = 20;

    PubNub.ngHistory({
     channel: self.channel,
     callback: function(m){
        // Update the timetoken of the first message
        self.timeTokenFirstMessage = m[1]
        angular.extend(self.messages, m[0]);  
        
        if(m[0].length < defaultMessagesNumber){
          self.messagesAllFetched = true;
        }

        $rootScope.$digest()
        $rootScope.$emit('factory:message:populated')
        
     },
     count: defaultMessagesNumber, 
     reverse: false
    });

  };

  ////////////////// PUBLIC API ////////////////////////

  var subcribeNewMessage = function(callback){
    $rootScope.$on(PubNub.ngMsgEv(self.channel), callback);
  };


  var fetchPreviousMessages = function(){

    var defaultMessagesNumber = 10;

    var deferred = $q.defer()

    PubNub.ngHistory({
     channel: self.channel,
     callback: function(m){
        // Update the timetoken of the first message
        self.timeTokenFirstMessage = m[1]
        Array.prototype.unshift.apply(self.messages,m[0])
        
        if(m[0].length < defaultMessagesNumber){
          self.messagesAllFetched = true;
        }

        $rootScope.$digest()
        deferred.resolve(m)

     },
     error: function(m){
        deferred.reject(m)
     },
     count: defaultMessagesNumber, 
     start: self.timeTokenFirstMessage,
     reverse: false
    });

    return deferred.promise
  };
  
  var getMessagesHybrid = function(messageshybrid) {

      if (_.isEmpty(self.messages))
        populateHybrid(messageshybrid);

      return self.messages;
      
  };


  var getMessages = function() {

    if (_.isEmpty(self.messages))
      populate();

    return self.messages;

  };

  var messagesAllFetched = function() {

    return self.messagesAllFetched;

  };

  var sendMessage = function(messageContent) {

      // Don't send an empty message 
      if (_.isEmpty(messageContent))
          return;

      PubNub.ngPublish({
          channel: 'messages-channel'+DOCTOR_ID,
          message: {
              uuid: USER_NAME + "##" + USER_AVATAR,
              content: messageContent,
              user_id: USER_ID,
              sender_uuid: USER_NAME + "##" + USER_AVATAR,
              date: Date.now()
          },
      });
      
  };

  init();

  // The public API interface
  return {
    getMessages: getMessages, 
    sendMessage: sendMessage,
    subscribeNewMessage: subcribeNewMessage,
    fetchPreviousMessages: fetchPreviousMessages,
    messagesAllFetched : messagesAllFetched,
    getMessagesHybrid: getMessagesHybrid
  } 

}]);