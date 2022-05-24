angular.module('lab10app').factory('AuthService', ['$q', '$timeout', '$http', '$rootScope', function ($q, $timeout, $http, $rootScope)
{
    // create user variable
    var user = null;

    //create functions for the auth service
    function isLoggedIn()
    {
      $http.get('/api/login/status')
      //handle success
      .success(function (data)
      {
        if(data.status)
        {
          user = true;
          $rootScope.user = data.userData;
        }
        else
        {
          user = false;
        }
      })
      //handle error
      .error(function (data)
      {
        user = false;
      });
      
      if(user)
      {
        return true;
      }
      else
      {
        return false;
      }
    }
    
    function login(username, password)
    {
        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server for authentication
        $http.post('/api/login',
        {
            username: username,
            password: password
        })
        // handle success
        .success(function (data, status)
        {
            if(status === 200 && data.status)
            {
                user = true;
                deferred.resolve();
            }
            else
            {
                user = false;
                deferred.reject();
            }
        })
        // handle error
        .error(function (data)
        {
            user = false;
            deferred.reject();
        });
        
        //return promise object
        return deferred.promise;
    }
    
    function logout()
    {

  // create a new instance of deferred
  var deferred = $q.defer();

  // send a get request to the server
  $http.get('/api/logout')
    // handle success
    .success(function (data)
    {
      $rootScope.user = false;
      deferred.resolve();
    })
    // handle error
    .error(function (data)
    {
      $rootScope.user = false;
      deferred.reject();
    });

  // return promise object
  return deferred.promise;

}
    
    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      login: login,
      logout: logout,
    });

}]);