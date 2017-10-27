/**
 * Created by victor on 6/28/2016.
 */
(function(){
    angular.module('app')
        .config(function($stateProvider, $urlRouterProvider) {
            //
            // For any unmatched url, redirect to /state1
            $urlRouterProvider.otherwise("/home");
            //
            // Now set up the states
            $stateProvider
                .state('app', {
                    url: "/home",
                    templateUrl: "/tpls/home/videos.html",
                    controller: "homeCtrl",
                    controllerAs: "home"
                })
                .state('state1', {
                    url: "/list",
                    template: "<h1> HELLO PEOPLE </h1>"
                })
                .state('state2', {
                    url: "/state2",
                    templateUrl: "partials/state2.html"
                })
                .state('state2.list', {
                    url: "/list",
                    templateUrl: "partials/state2.list.html"
                });
        });
}());
