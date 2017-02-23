/**
 * Created by badane on 22/12/2016.
 */
var url="http://192.168.1.11/universite/";
var  usernam ;
var   password;
angular.module('starter')

.service('AuthService',function ($q,$http,USER_ROLES) {
    var LOCAL_TOKEN_KEY='yourTokenKey';
    var username='';
    var isAuthenticated=false;
    var role='';
    var authToken;


   // var info=[];
    function loadUserCredentials(){
        var token =window.localStorage.getItem(LOCAL_TOKEN_KEY)
        if(token){
            userCredentials(token);
        }
    };
    function storeUserCredentials(token){
      window.localStorage.setItem(LOCAL_TOKEN_KEY,token);
        console.log("0000"+token);
        userCredentials(token);
    }
    function userCredentials(token){
        username=token.split('.')[0];
        console.log("1111"+token);
        isAuthenticated=true;
        authToken=token;
        $http.get(url+"coiffeurs.php")
            .success(function (data) {
                for (var i = 0; i < data.length ; i++) {

                    if(data[i].role=='admin') {
                        role=USER_ROLES.admin;

                    }
                    if(data[i].role=='client'){
                       // role=USER_ROLES.admin;
                    }
                    //if(username=='admin'){
                   // if(role=='admin'){
                     //   role=USER_ROLES.admin;
                    //}
                    // if(username=='user'){
                    //if(role=='client'){
                      //  role=USER_ROLES.public;
                    //}
                    //$http.defaults.headers.common['X-Auth-Token']=token;


                    } })
                .error(function (err) {
                    console.log(err);
                })




    };

    function destroyUserCredentials(){
        authToken=undefined;
        username='';
        isAuthenticated=false;
        $http.defaults.headers.common['X-Auth-Token']=undefined;
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    };



    var login = function(name ,pw) {

        return $q(function (resolve, reject,data,$scope) {
            $http.get(url+"coiffeurs.php")
                .success(function (data) {
                    for (var i = 0; i < data.length ; i++) {
                        var info = data[i];

                        if ((name == data[i].name && pw == data[i].password)&&(data[i].name!='' && data[i].password!='')) {

                          console.log(data[i].password);
                            console.log(data[i].name);
                      usernam = data[i].name;
                            password = data[i].password;

                    }

                    }
                    if ((name == usernam && pw == password && name!=null && pw!=null) || (name == 'admin' && pw == '1'&& name!=null && pw!=null)) {
                        //    console.log(username);
                        storeUserCredentials(name + ' .yourServerToken');
                        console.log("fffffffffff");
                        resolve('Login success.');
                    } else {
                        reject('Login failed.');
                    }

                })
                .error(function (err) {
                    console.log(err);
                });
           // console.log(usernam);



         });
    };

    var logout=function(){
        destroyUserCredentials();

    };
    var isAuthorized=function(authorizedRoles){
        if(!angular.isArray(authorizedRoles)){
            authorizedRoles=[authorizedRoles];
        }
        return (isAuthenticated && authorizedRoles.indexOf(role)!==-1);
    };
    loadUserCredentials();
return{
    login:login,
    logout:logout,
    isAuthorized:isAuthorized,
    isAuthenticated:function(){return isAuthenticated;},
    username:function () {return username;},
    role:function () {return role;}
};
})
    
.factory('AuthInterceptor',function($rootScope, $q, AUTH_EVENTS){
    return {
        responseError: function (response){
            $rootScope.$broadcast({
                401: AUTH_EVENTS.notAuthenticated,
                403: AUTH_EVENTS.notAuthorized
            }[response.status], response);
            return $q.reject(response);
        }
};
})


.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor')
})




    .factory('EventService', function($q, $resource) {
        var events = $resource('./data/events.json').query();

        return {

            find: function(string_s, start_s, end_s, distance_s, latitude_s, longitude_s) {
                var deferred = $q.defer();
                var results = events.filter(function(element) {

                    var currentLatLng = new google.maps.LatLng(latitude_s,longitude_s);
                    var objectLatLng = new google.maps.LatLng(element.location.geo.latitude,element.location.geo.longitude);
                    var distance = google.maps.geometry.spherical.computeDistanceBetween(currentLatLng,objectLatLng);
                    var distanceCheck = distance <= distance_s;

                    var fullString = element.name + " " + element.description;
                    if(!string_s) string_s = "";
                    var stringCheck = fullString.toLowerCase().indexOf(string_s.toLowerCase()) > -1;

                    var startDate = new Date(element.startDate);
                    var endDate = new Date(element.endDate);
                    var start = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate()).getTime();
                    var end = new Date(endDate.getFullYear(),endDate.getMonth(),endDate.getDate()).getTime();
                    var startEndCheck = (end - start_s.getTime()) * (end_s.getTime() - start) > 0;

                    return stringCheck && startEndCheck && distanceCheck;
                });
                deferred.resolve(results);
                return deferred.promise;
            },

            findAll: function() {
                var deferred = $q.defer();
                deferred.resolve(events);
                return deferred.promise;
            },

            // eventId
            findById: function(eventId) {
                var deferred = $q.defer();
                var event = events[eventId - 1];
                deferred.resolve(event);
                return deferred.promise;
            },

            // fullcalendar
            getCalendarInfo: function() {
                var calEvents = new Array();
                for(var i=0; i<events.length; i++) {
                    var calEvent = new Object();
                    calEvent['title'] = events[i].name;
                    calEvent['start'] = events[i].startDate;
                    calEvent['end'] = events[i].endDate;
                    calEvent['url'] = "#/events/" + events[i].id;
                    calEvents.push(calEvent);
                }
                return calEvents;
            },

            // Google Map
            getMarkerInfo: function() {
                var markers = new Array();
                for(var i=0; i<events.length; i++) {
                    var marker = {
                        id: events[i].id,
                        title: "<a href='#/map/" + events[i].id + "'>" + events[i].name + "</a>",
                        latitude: events[i].location.geo.latitude,
                        longitude: events[i].location.geo.longitude,
                        show: false,
                        onClick: function() {
                            this.show = !this.show;
                        }.bind(this)
                    };
                    markers.push(marker);
                }
                return markers;
            }
        }
    });
