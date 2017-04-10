var myApp = angular.module('myApp', ['ui.router', 'ngFileUpload', 'chart.js', 'ngCookies']);

myApp.config(function ($stateProvider, $urlRouterProvider) {
    console.log("app config");

    (function (ChartJsProvider) {
        ChartJsProvider.setOptions({
            colors: ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
        });
    });



    $urlRouterProvider.when('/', ['$state', function ($state) {
        $state.go('dashboard');
    }]);
    $urlRouterProvider.otherwise('/login');

    var login = {
        name: 'login',
        url: '/login',
        controller: 'LoginController',
        templateUrl: 'tiaaApp/login/login.view.html',
        controllerAs: 'vm',
        resolve: {
            greeting: function ($q, $timeout) {
                var deferred = $q.defer();
                $timeout(function () {
                    deferred.resolve('Hello!');
                }, 1000);
                return deferred.promise;
            }
        }
    };

    var jsonUpload = {
        name: 'jsonUpload',
        url: '/jsonUpload',
        templateUrl: 'tiaaApp/jsonUpload/jsonUpload.html',
        controller: 'JsonUploadController',
        resolve: {
            greeting: function ($q, $timeout) {
                var deferred = $q.defer();
                $timeout(function () {
                    deferred.resolve('Hello!');
                }, 1000);
                return deferred.promise;
            }
        }
    };

    var dashboard = {
        name: 'dashboard',
        url: '/',
        templateUrl: 'tiaaApp/dashboard/dashboard.html',
        controller: 'DashboardController',
        resolve: {
            greeting: function ($q, $timeout) {
                var deferred = $q.defer();
                $timeout(function () {
                    deferred.resolve('Hello!');
                }, 1000);
                return deferred.promise;
            }
        }
    };

    var transfer = {
        name: 'transfer',
        url: '/transfer',
        templateUrl: 'tiaaApp/transfer/transfer.html',
        controller: 'TransferController',
        resolve: {
            greeting: function ($q, $timeout) {
                var deferred = $q.defer();
                $timeout(function () {
                    deferred.resolve('Hello!');
                }, 1000);
                return deferred.promise;
            }
        }
    };

    $stateProvider
        .state('users', {
            url: '/users',
            templateUrl: 'tiaaApp/users/users.html',
            controller: 'UsersController',
            resolve: {
                greeting: function ($q, $timeout) {
                    var deferred = $q.defer();
                    $timeout(function () {
                        deferred.resolve('Hello!');
                    }, 1000);
                    return deferred.promise;
                }
            }
        });
    $stateProvider.state(jsonUpload);
    //    $stateProvider.state(dashboard);
    $stateProvider.state(transfer);
    $stateProvider.state(login)
        .state('dashboard', {
            url: '/admin',
            resolve: {
                greeting: function ($q, $timeout) {
                    var deferred = $q.defer();
                    $timeout(function () {
                        deferred.resolve('Hello!');
                    }, 1000);
                    return deferred.promise;
                }
            },
            views: {
                'content': {
                    templateUrl: 'tiaaApp/tiaaApp.view.html',
                    controller: 'TIAAappController'
                },
                'home@dashboard': {
                    templateUrl: 'tiaaApp/dashboard/dashboard.html',
                    controller: 'DashboardController'
                },
                'jsonUpload@dashboard': {
                    templateUrl: 'tiaaApp/jsonUpload/jsonUpload.html',
                    controller: 'JsonUploadController',
                },
                'users@dashboard': {
                    templateUrl: 'tiaaApp/users/users.html',
                    controller: 'UsersController',
                },
                'transfer@dashboard': {
                    templateUrl: 'tiaaApp/transfer/transfer.html',
                    controller: 'TransferController',
                }
            }
        });
});








myApp.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files;
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        }
    }
}]);








myApp.run(['$q', '$rootScope', '$location', '$cookies', '$http', function ($q, $rootScope, $location, $cookies, $http) {
    console.log("app run");

    function _setMainAccount(accountAddr, amount) {
        var deferred = $q.defer();

        setTimeout(function () {
            MetaCoin.setMainAccount(Number(accountAddr), amount)
                .then(function (response) {
                    deferred.resolve(response);
                }).catch(function (e) {
                    console.log(e);
                    deferred.reject('Address ' + accountAddr + ' is not allowed.');
                })

        }, 0);

        return deferred.promise;
    }

    web3.eth.getAccounts(function (err, accs) {
        _setMainAccount(accs[0], 1000).then(function (response) {
            console.log(response);
            return response;
        }, function (reason) {
            alert('Failed: ' + reason);
        }, function (update) {
            alert('Got notification: ' + update);
        });
    });

    // keep user logged in after page refresh
    $rootScope.globals = $cookies.getObject('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
        var loggedIn = $rootScope.globals.currentUser;
        if (restrictedPage && !loggedIn) {
            $location.path('/login');
        }
    });
}]);