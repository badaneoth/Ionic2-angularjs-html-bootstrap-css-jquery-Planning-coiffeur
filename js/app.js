// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var url2="http://192.168.1.11/universite/";
angular.module('starter', ['ionic', 'ngMockE2E', 'jett.ionic.filter.bar','ui.calendar','ngResource','ionic-datepicker','uiGmapgoogle-maps','ngCordova'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })
    .config(function ($stateProvider, $urlRouterProvider, USER_ROLES) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })
            .state('logincustomer', {
                url: '/logincustomer',
                templateUrl: 'templates/loginclient.html',
                controller: 'LogincustomCtrl'
            })
            .state('main', {
                url: '/',
                abstract: true,
                templateUrl: 'templates/main.html',
            })
            .state('main.dash', {
                url: 'main/dash',
                views: {
                    'dash-tab': {
                        templateUrl: 'templates/dashboard.html',
                        controller: 'DashCtrl'
                    }
                }
            })
            .state('main.public', {
                url: 'main/public',
                views: {
                    'public-tab': {
                        templateUrl: 'templates/public.html'
                    }
                }
            }) 
            .state('main.admin', {
                url: 'main/admin',
                views: {
                    'admin-tab': {
                        templateUrl: 'templates/admin.html'
                    }
                },
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })
            .state('home', {
                url: '/home',
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            })
            .state('listecoiff', {
                url: '/listecoiff',
                templateUrl: 'templates/listecoiff.html',
                controller: "EtablissementCtrl"
            })
            .state('coifform', {
                url: '/signup',
                templateUrl: 'templates/coifform.html',
                controller: "SignupCtrl"
            })
            .state('menu', {
                url: '/menu',
                templateUrl: 'templates/menu.html',
                controller:  "MenuCtrl",
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                }

            })
            .state('menucustomer', {
                url: '/menucustomer',
                templateUrl: 'templates/menucustomer.html',
                controller:  "MenucustomerCtrl"


            })
        .state('customers', {
            url: '/customers',
            templateUrl: 'templates/customers.html'

        })
        .state('addcustomer', {
            url: '/addcustomer',
            templateUrl: 'templates/addcustomer.html',
            controller:  "addcustomerCtrl"
        })
        .state('events', {
            url: '/events',
            templateUrl: 'templates/events.html',
            controller:  "EventCtrl"
        })
            .state('map', {
                url: '/map',
                templateUrl: 'templates/map.html',
                controller: 'EventCtrl'

            });

        
        $urlRouterProvider.otherwise('/home')
    })


    .run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
        $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
            if ('data' in next && 'authorizedRoles' in next.data) {
                var authorizedRoles = next.data.authorizedRoles;
                if (!AuthService.isAuthorized(authorizedRoles)) {
                    event.preventDefault();
                    $state.go($state.current, {}, {reload: true});
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                }
            }


            if (!AuthService.isAuthenticated()) {
                if (next.name !== 'login') {
                    event.preventDefault();
                    $state.go('login');
                }
            }
        })
    })
    .run(function ($httpBackend) {
        $httpBackend.whenGET('http://192.168.1.11:8100/valid')
            .respond({message: 'This is my valid response!'});
        $httpBackend.whenGET('http://192.168.1.11:8100/notauthenticated')
            .respond(401, {message: 'Not Authenticated!'});
        $httpBackend.whenGET('http://192.168.1.11:8100/notauthorized')
            .respond(403, {message: 'Not Authorized!'});

        $httpBackend.whenGET(/templates\/\w+.*/).passThrough();
        $httpBackend.whenGET(/universite/).passThrough();
        $httpBackend.whenGET(/data/).passThrough();
        $httpBackend.whenPOST(/universite/).passThrough();
    });