var app = angular.module('app')
  app.run(['PubNub','currentUser', function(PubNub, currentUser) {

    PubNub.init({
        publish_key: 'pub-c-bccd3e40-eeee-4c0b-aa69-6327a56fde2f',
        subscribe_key: 'sub-c-9a492030-35c7-11e6-aaa8-0619f8945a4f',
        uuid: currentUser,
        /*origin: 'pubsub.pubnub.com',*/
        ssl: true
    });
    
  }])
  .run(['ngNotify', function(ngNotify) {

      ngNotify.config({
          theme: 'paster',
          position: 'top',
          duration: 250
      });

  }])
  .config(['$authProvider', function($authProvider) {
          
    console.log($authProvider);

  }]);
  
app.factory('$localStorage', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
}]);

app.factory('authInterceptor', function ($q, $window, $localStorage) {
    return {
        request:function(config){
            if ($localStorage.getObject('_auth')._auth && config.url.substring(0, 4) == 'http') {
                config.params = {'access-token': $localStorage.getObject('_auth')._auth};
            }
            return config;
        },
        responseError: function(rejection){
            if(rejection.status === 401){
                $window.location = '#/tab/dash';
            }
            return $q.reject(rejection);
        }
    };
});

app.value('app-version', '1.0.0');

app.service("queryStringParam", function(){
    //Based on https://github.com/jquery/jquery/blob/master/src/serialize.js#L50
 
    var encodedSpaceRegExp = /%20/g;
 
    var include = function (name) {
        return ["$promise", "$resolved"].indexOf(name) == -1;
    };
 
    var buildParams = function (prefix, object, add) {
        if (angular.isArray(object)) {
            object.forEach(function (value, index) {
                buildParams(prefix + "[]", value, add);
            });
        } else if (angular.isDate(object)) {
            add(prefix, object.toISOString());
        } else if (angular.isObject(object)) {
            angular.forEach(object, function (propertyValue, propertyName) {
                if (include(propertyName)) {
                    buildParams(prefix + "[{0}]".format(propertyName), propertyValue, add);
                }
            });
        } else {
            add(prefix, object);
        }
    };
 
    return function (params) {
        var result = [];
 
        var add = function (key, value) {
            result.push(encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value));
        };
 
        angular.forEach(params, function (paramValue, paramName) {
            if (include(paramName)) {
                buildParams(paramName, paramValue, add);
            }
        });
 
        return result.join("&").replace(encodedSpaceRegExp, "+");
    };
})

app.service('rest', function ($http,queryStringParam) {

    return {

        baseUrl : 'https://doctorencasa.co/',
        path: undefined,
        
        serialize: function(data){
            if (!angular.isObject(data)){ 
                return((data == null) ? "" : data.toString()); 
            }

            var buffer = [];

            for (var name in data) { 
                if(!data.hasOwnProperty(name)){ 
                    continue; 
                }

                var value = data[name];

                buffer.push(
                    encodeURIComponent(name) + "=" + encodeURIComponent((value == null) ? "" : value)
                ); 
            }

            var source = buffer.join("&").replace(/%20/g, "+"); 
            return(source); 
        },

        models: function(){
            return $http.get(this.baseUrl + this.path + location.search);
        },

        get: function(model) {
            return $http({
                    method  : 'GET',
                    url     : this.baseUrl + this.path + '?' + model,
                    ///data    : model,
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
               });
        },
        
        post: function(model) {
            return $http({
                    method  : 'POST',
                    url     : this.baseUrl + this.path,
                    data    : model,  // pass in data as stringsular passing info as form data (not request payload)
                    headers : { 'Content-Type': 'application/javascript' }
                });
        },
        
        postModel: function (model) {
            return $http.post(this.baseUrl + this.path, model);
        },

        putModel: function (model) {
            return $http.put(this.baseUrl + this.path + "/" + $routeParams.id, model);
        },

        deleteModel: function () {
            return $http.delete(this.baseUrl + this.path);
        }
    };

});
