/**
 * Created by badane on 22/12/2016.
 */
angular.module('starter')


    .constant('AUTH_EVENTS', {
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })

    .constant('USER_ROLES', {
        admin: 'admin_role',
        client:'client_role',
        public: 'public'
    });