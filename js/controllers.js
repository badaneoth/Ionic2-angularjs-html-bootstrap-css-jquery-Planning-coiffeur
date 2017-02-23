/**
 * Created by badane on 22/12/2016.
 */
var url = "http://192.168.1.11/universite/";
var user='';
var pass;
angular.module('starter')

    .controller('AppCtrl', function ($state, $scope, $ionicPopup, AuthService, AUTH_EVENTS) {
        $scope.username = AuthService.username();

        $scope.$on(AUTH_EVENTS.notAuthorized, function (event) {
            var alertPopup = $ionicPopup.alert({
                title: 'Unauthorized',
                template: 'You are not allowed to access this resource.'
            });
        });

        $scope.$on(AUTH_EVENTS.notAuthenticated, function (event, $scope) {
            AuthService.logout();
            $state.go('login');
            //$state.go('home');

            var alertPopup = $ionicPopup.alert({
                title: 'Session lost!',
                template: 'Sorry, You have to login again.'
            });
        });

        $scope.setCurrentUsername = function (name) {
            $scope.user = name;
        };

    })

    .controller('LoginCtrl', function ($scope, $state, $ionicPopup, AuthService, $http) {
        $scope.data = {};


        $scope.login = function (data) {

            AuthService.login(data.username, data.password).then(function (authenticated) {

                user = data.username;
                pass = data.password;
                $http.get(url + "coiffeurs.php")
                    .success(function (data) {
                        for (var i = 0; i < data.length; i++) {
                            //console.log('kkkkk' + data[i].name);
                            //console.log('mmmm' + user);
                            //console.log('lllll' + pass);

                            if ((data[i].name == user) && (data[i].password == pass)) {
                                console.log('lllll' + pass);
                                if (data[i].role == 'admin') {
                                    //console.log('ttttttyy' + data[i].role);

                                    $state.go('menu', {}, {reload: true})
                                    $scope.setCurrentUsername(user)

                                }
                                else if (data[i].role == 'client') {
                                    // console.log('dddd' + data[i].role);

                                    $state.go('menucustomer', {}, {reload: true})
                                    $scope.setCurrentUsername(data.username)
                                }
                            }

                        }
                    })
                    .error(function (err) {
                        console.log(err);
                    })
            }, function (err) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed',
                    template: '¨Please check your credentials!'
                });


            });

        }

        $scope.signup = function () {
            $state.go("coifform", {});
        }
        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });
    })


    .controller('DashCtrl', function ($scope, $state, $ionicPopup, $http, AuthService) {
        $scope.logout = function () {
            AuthService.logout();
            $state.go('login');
        }

        $scope.performValidRequest = function () {
            $http.get('http://192.168.1.11:8100/valid').then(
                function (result) {
                    $scope.response = result;
                });
        };
        $scope.performUnauthorizedRequest = function () {
            $http.get('http://192.168.1.11:8100/notauthorized').then(
                function (result) {
                }, function (err) {
                    $scope.response = err;
                });
        };
        $scope.performInValidRequest = function () {
            $http.get('http://192.168.1.11:8100/notauthenticated').then(
                function (result) {
                }, function (err) {
                    $scope.response = err;
                });
        };

    })
    .controller("EtablissementCtrl", function ($http, $scope, $state) {
        $scope.etablissements = [];
        $scope.url = url;


        $http.get(url + "etablissements.php")
            .success(function (data) {
                console.log(data)
                $scope.etablissements = data;
            })
            .error(function (err) {
                console.log(err);
            });
        $scope.chargerFormations = function (idEt) {
            $state.go("login", {
                idEtablissement: idEt
            });
        }
        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });

    })
    .controller("HomeCtrl", function ($http, $scope, $state) {

        $scope.client = function () {
            $state.go("listecoiff", {});
        }
        $scope.signup = function () {
            $state.go("coifform", {});
        }


    })
    .controller('SignupCtrl', function ($scope, $http, $ionicLoading, $state) {
        $scope.data = {};
        $scope.url = url;
        $scope.signUp = function (data) {
            console.log(data.username)
            var request = $http({
                method: "post",
                url: url + "insertcoiff.php",
                crossDomain: true,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: {

                    username: data.username,
                    email: data.email,
                    password: data.password,
                    role: data.role
                },
            });
            request.success(function (data) {
                $ionicLoading.hide();
                if (data == "1") {
                    $scope.responseMessage = "Account Created Successfully!";
                }
                if (data == "2") {
                    $scope.responseMessage = "Can not Create Account";
                }
                else if (data == "0") {
                    $scope.responseMessage = "Email Already Exists"
                }
            });
        };

        $scope.signin = function () {
            $state.go("login", {});
        }

        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });
    })

    .controller('addcustomerCtrl', function ($scope, $http, $ionicLoading, $state) {
        $scope.data = {};
        $scope.url = url;
        $scope.signUp = function (data) {
            console.log(data.username)
            var request = $http({
                method: "post",
                url: url + "insertcoiff.php",
                crossDomain: true,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: {

                    username: data.username,
                    email: data.email,
                    password: data.password,
                    role: data.role
                },
            });
            request.success(function (data) {
                $ionicLoading.hide();
                if (data == "1") {
                    $scope.responseMessage = "Account Created Successfully!";
                }
                if (data == "2") {
                    $scope.responseMessage = "Can not Create Account";
                }
                else if (data == "0") {
                    $scope.responseMessage = "Email Already Exists"
                }
            });
        };

        $scope.signin = function () {
            $state.go("login", {});
        }

        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });
    })

    .controller('myNgController', function ($scope, $state, $ionicPopup, $http, AuthService) {
        $scope.logout = function () {
            AuthService.logout();
            $state.go('login');
        }
        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });


    })
    .controller('MenucustomerCtrl', function ($scope, $state, $ionicPopup, $http, AuthService) {

        $scope.logout = function () {
            AuthService.logout();
            $state.go('logincustomer');
        }
        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });

    })


    .controller('EventCtrl', function ($scope, $ionicPopup, $ionicLoading, $cordovaGeolocation, EventService) {
        $scope.searchKey = "";
        $scope.clearSearch = function () {
            $scope.searchKey = null;
            EventService.find($scope.searchKey, $scope.searchStartDate, $scope.searchEndDate, $scope.distance, $scope.latitude, $scope.longitude).then(function (events) {
                $scope.events = events;
            });
        };

        
        var currentDate = new Date();
        $scope.searchStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
        $scope.searchEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
        $scope.startDateSelected = function (startDate) {
            if (startDate > $scope.searchEndDate) {
                var msg = {title: '', template: ''};
                $ionicPopup.alert(msg);
                throw msg;
            }
            EventService.find($scope.searchKey, startDate, $scope.searchEndDate, $scope.distance, $scope.latitude, $scope.longitude).then(function (events) {
                $scope.events = events;
            });
            return startDate;
        };
        $scope.endDateSelected = function (endDate) {
            if (endDate < $scope.searchStartDate) {
                var msg = {title: '', template: ''};
                $ionicPopup.alert(msg);
                endDate = $scope.searchEndDate;
                throw msg;
            }
            EventService.find($scope.searchKey, $scope.searchStartDate, endDate, $scope.distance, $scope.latitude, $scope.longitude).then(function (events) {
                $scope.events = events;
            });
        };

        $scope.distance = 100000;
        $scope.changeDistance = function () {
            EventService.find($scope.searchKey, $scope.searchStartDate, $scope.searchEndDate, $scope.distance, $scope.latitude, $scope.longitude).then(function (events) {
                $scope.events = events;
            });
        };

        $scope.latitude = 0;
        $scope.longitude = 0;
        $cordovaGeolocation.getCurrentPosition().then(function (position) {
            $scope.latitude = position.coords.latitude;
            $scope.longitude = position.coords.longitude;
        }, function (err) {
        });


        $scope.search = function () {
            EventService.find($scope.searchKey, $scope.searchStartDate, $scope.searchEndDate, $scope.distance, $scope.latitude, $scope.longitude).then(function (events) {
                $scope.events = events;
            });
        };

        var firstSearch = function () {
            EventService.findAll().then(function (events) {
                $scope.events = events;
            });
        }
        firstSearch();

        // ui-Calendar
        $scope.eventSources = [];
        $scope.uiConfig = {
            calendar: {
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                height: 500,
                lang: 'fr',
                scrollTime: '10:00:00',
                buttonIcons: false,
                weekNumbers: false,
                editable: false,
                eventLimit: true,
                events: EventService.getCalendarInfo()
            }
        };

        // Google Map
        $scope.map = {
            center: {
                latitude: 35.613281,
                longitude: 140.112869
            },
            zoom: 10,
            markers: EventService.getMarkerInfo()
        };
    })


    .controller('EventDetailCtrl', function ($scope, $stateParams, EventService) {
        EventService.findById($stateParams.eventId).then(function (event) {
            $scope.event = event;
        });
    })

    // Instagram
    .controller('InstafeedCtrl', function ($scope, $stateParams, EventService) {
        $scope.feed = new Instafeed({
            get: 'tagged',
            tagName: 'chibalotte',
            clientId: '6c32ef1ca54a4f32a22075a3b90aa2e2',
            sortBy: 'most-recent',
            links: false,
            limit: 100,
            resolution: 'low_resolution',
            template: '<li><a href="{{link}}" target="_blank"><img src="{{image}}"/></a><br/>{{caption}}<br/>like:{{likes}}</li>'
        });
        $scope.feed.run();

        $scope.next = function () {
            feed.next();
        };
    })


    .controller('MenuCtrl', ['$scope', '$http', 'uiCalendarConfig', function ($scope, $http, uiCalendarConfig, AuthService, $state) {
        $scope.logout = function () {
            AuthService.logout();
            $state.go('login');
        }
        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });

        $scope.SelectedEvent = null;
        var isFirstTime = true;

        $scope.events = [];

        $scope.eventSources = [$scope.events];


        //Load events from server
        $http.get(url + "events.php", {
            cache: true,
            params: {}
        }).then(function (data) {
            $scope.events.slice(0, $scope.events.length);
            angular.forEach(data.data, function (value) {
                $scope.events.push({
                    title: value.Title,
                    description: value.Description,
                    start: new Date(parseInt(value.startAt.substr(6))),
                    end: new Date(parseInt(value.endAt.substr(6))),
                    // allDay : value.IsFullDay,
                    stick: true
                });
            });
        });

        //configure calendar
        $scope.uiConfig = {
            calendar: {
                height: 450,
                editable: true,
                displayEventTime: false,
                header: {
                    left: 'month basicWeek basicDay agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev,next'
                },
                eventClick: function (event) {
                    $scope.SelectedEvent = event;
                },
                eventAfterAllRender: function () {
                    if ($scope.events.length > 0 && isFirstTime) {
                        //Focus first event
                        uiCalendarConfig.calendars.myCalendar.fullCalendar('gotoDate', $scope.events[0].start);
                        isFirstTime = false;
                    }
                }
            }
        };

    }])
    .controller('dateCtrl', function ($scope, moment) {
        $scope.date = moment().toDate(); // Date Object
        $scope.time = moment().toDate(); // Date Object
    });