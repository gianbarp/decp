angular
  .module('app')  
  .config(function ($stateProvider, $urlRouterProvider, $authProvider) {
   
    // Redirect to the login page if not authenticated  
    
    if(window.localStorage.getItem('_userid')){
        USER_ID = window.localStorage.getItem('_userid');
        USER_NAME = window.localStorage.getItem('_fullname');
        USER_AVATAR = window.localStorage.getItem('_avatar');
    }
    
    var requireAuthentication = function ($location) {
    
        var storage = window.localStorage;
        if(storage.getItem('_auth')){
            window.setTimeout(function () {
                return $location.path('/patientlist');
            },10);
        }else{
           return $location.path('/login'); 
        }  
        
    }; 
    
    var logout = function(){
        window.localStorage.removeItem('_auth');
        if(!window.localStorage.getItem('_auth')){
          window.location.href = '/login';
        }
    }
    
    $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: 'views/login.html',
      cache: true,
      resolve:{
           requireAuthentication: requireAuthentication, 
        }
    })
    .state('patientlist', {
        url:"/patientlist",
        templateUrl: 'views/patientlist.html',
        cache: true,
        resolve:{
           requireAuthentication: requireAuthentication,
        }
    })
    .state('chat', {
      url: "/chat/:id",
      templateUrl: 'views/chat.html',
      cache: false,
    })
    .state('chat.conversation', {
      url: "/:type/:name",
      template: '<conversation></conversation>'    
    })
    .state('logout',{
        url: '/logout', 
        templateUrl: 'views/logout.html',
        cache: false,
        resolve:{
            logout: logout,
        }
      })
    $urlRouterProvider.when('/', '/conversations/channel/general');
    // For any unmatched url, redirect to /login
    $urlRouterProvider.otherwise("/login");
  })