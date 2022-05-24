// controllers ... in a more complex app, the different controllers would
// likely be contained in separate files
var bookControllers = angular.module('bookControllers', []);
var loginController = angular.module('loginController', []);
var logoutController = angular.module('logoutController', []);
var todoController = angular.module('todoController', []);

var messageController = angular.module('messageController', []);

// Simplify our code here by hard-coding the url of service.
// In real code, we would likely encapsulate it within angular factory or service
var book_serviceURL = 'https://mean.westus2.cloudapp.azure.com/api/books/';
var employee_serviceURL = 'https://mean.westus2.cloudapp.azure.com/api/employees/';
var todo_serviceURL = 'https://mean.westus2.cloudapp.azure.com/api/todo';

var message_serviceURL = 'https://mean.westus2.cloudapp.azure.com/api/messages/';

// Controller for book list view
bookControllers.controller('BookListCtrl', ['$scope', '$http', '$window', '$location',
    function($scope, $http, $window, $location)
    {

        // retrieve all the book data from our web service
        $http.get(book_serviceURL)
            .then(function(response)
            {
                $scope.books = response.data;
            });
    }
]);

// Controller for single book detail view
bookControllers.controller('BookDetailCtrl', ['$scope', '$routeParams', '$http',
    function($scope, $routeParams, $http) {
        $scope.isbn = $routeParams.isbn;
        
        // retrieve just the data for a single book from our web service
        $http.get(book_serviceURL + $routeParams.isbn)
            .then(function(response) {
                $scope.book = response.data[0];
            });
    }
]);

//controller for login view
loginController.controller('loginController',
  ['$scope', '$location', 'AuthService', '$rootScope',
  function ($scope, $location, AuthService, $rootScope)
  {
      //goto homepage if already logged in
      if ($rootScope.user)
      {
        $location.path('/books');
      }

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        //on successful login
        .then(function ()
        {
          //not needed as the isLoggedI() within our authService sets this variable with all the user data
          //$rootScope.user = {};
          //$rootScope.user.username = $scope.loginForm.username;
          $location.path('/books');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        //on error/unsuccessful login
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };

}]);

logoutController.controller('logoutController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService)
  {
    $scope.logout = function ()
    {
      
      // call logout from service
      AuthService.logout()
        .then(function ()
        {
          $location.path('/login');
        });
    };

}]);

// Controller for book table view 
bookControllers.controller('BookTableCtrl', ['$scope', '$http', function($scope,$http) { 
    // retrieve all the book data from our web service 
    $http.get(book_serviceURL) 
        .then(function (response) { 
            $scope.books = response.data;
            $scope.sortField = 'isbn10'; // set the default sort field 
            $scope.sortReverse = false; // set the default sort order
            
        }); 
    } 
]); 

//Todo list controller
todoController.controller('todoController', ['$scope', '$http',

    function($scope, $http)
    {
      $scope.updateForm = {};
      //update the todo display
      var updateTodoList = function()
      {
        $http.get(todo_serviceURL).then(function(response)
        {
          $scope.todos = response.data;
        });
      }
      updateTodoList();
      
      $scope.createTodo = function()
      {
        var todoDescription = $scope.todoForm.text;
        var date = new Date();
        
        $http.post('/api/todo/add',
        {
            status: 'active',
            priority: $scope.todoForm.priority,
            date: date.toLocaleDateString("en-US"),
            description: todoDescription
        })
        // handle success
        .success(function (data, status)
        {
            if(status === 200 && data.status)
            {
              $scope.todoForm = null;
                //console.log("added");
                updateTodoList();
            }
            else
            {
                //console.log("not added");
            }
        });
      }
      
      $scope.deleteTodo = function(id)
      {
        $http.get(todo_serviceURL + "/remove/" + id).then(function(response)
        {
          //$scope.todos = response.data;
          updateTodoList();
        });
      }
      
      // $scope.updateTodo = function(updateFormText, todo)
      // {
      //   //do the update action - call API
      //   //console.log(updateFormText + todo);
      //   //$scope.updateForm.text = null;
      // }
      
      $scope.updateTodo = function(updateFormText, id)
      {
        var todoDescription = $scope.updateFormText;
        //var date = new Date();
        
        $http.post(todo_serviceURL + "/edit/" + id,
        {
            //date: date.toLocaleDateString("en-US"),
            description: updateFormText
        }) //also on success update form
        .success(function (data, status)
        {
            if(status === 200 && data.status)
            {
              $scope.todoForm = null;
                updateTodoList();
            }
        });
      }
    }
]);

// Controller for messages view
// messageController.controller('MessageCtrl', ['$scope', '$http', '$window', '$location',
//   function($scope, $http)
//   {
//     $scope.updateForm = {};
//     //update the todo display
//     var updateMessagesList = function()
//     {
//       $http.get(message_serviceURL).then(function(response)
//       {
//         $scope.messages = response.data;
//       });
//     }
//     updateMessagesList();
    
//   }
// ]);

messageController.controller('messageController', ['$scope', '$routeParams', '$http',
    function($scope, $routeParams, $http) {
        $scope.id = $routeParams.id;
        
        // retrieve just the data for a single message from our web service
        $http.get(message_serviceURL)
            .then(function(response) {
                $scope.message = response.data[$routeParams.id-1];
            });
    }
]);