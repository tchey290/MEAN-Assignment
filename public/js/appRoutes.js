//This defines our application’s routing


(function()
{
    var lab10app = angular.module('lab10app', ['ngRoute', 'bookControllers', 'loginController', 'logoutController', 'todoController', 'messageController']);
    
    lab10app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when("/books", {
                    templateUrl: "./views/bookList.html",
                    controller: "BookListCtrl"
                })
                .when("/books/:isbn", {
                    templateUrl: "./views/bookDetail.html",
                    controller: "BookDetailCtrl"
                })
                .when("/login", {
                    templateUrl: "./views/loginForm.html",
                    controller: "loginController"
                })
                .when('/logout', {
                    controller: "logoutController"
                })
                .when("/table", {
                    templateUrl: "./views/bookTable.html",
                    controller: "BookTableCtrl"
                })
                .when("/todo", {
                    templateUrl: "./views/todo.html",
                    controller: "todoController"
                })
                .when("/about", {
                    templateUrl: "./views/about.html",
                    controller: "BookTableCtrl"
                })
                .when("/messages", {
                    templateUrl: "./views/messages.html",
                    controller: "BookTableCtrl"
                })
                .when("/university/:id", {
                    templateUrl: "./views/universityDetail.html",
                    controller: "messageController"
                })
                .otherwise({
                    redirectTo: '/login'
                });
        }
    ]);
    
    //intercept all requests and forward to login if not logged in
    lab10app.run(function ($rootScope, $location, $route, AuthService)
    {
        $rootScope.$on('$routeChangeStart', function (event, next, current)
        {
            if (AuthService.isLoggedIn() === false)
            {
                $location.path('/login');
            }
        });
    });

}());