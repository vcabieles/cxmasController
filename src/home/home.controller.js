/**
 * Created by victo on 5/3/2017.
 */

(function(){
    angular.module('app').
    controller("homeCtrl",homeCtrl);

    homeCtrl.$inject = ["$http"];

    function homeCtrl($http){
        let vim = this;

        $http({
            method: 'GET',
            url: '192.168.2.121/api/v1/switches/getAll'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

    }
}());
