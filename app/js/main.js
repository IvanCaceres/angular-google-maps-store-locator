(function () {

  'use strict';
  window.$ = window.jQuery = require('jquery');
  require('bootstrap');
  require('angular');
  require('angular-ui-router');
  require('angular-resource');
  window._ = require('lodash');
  require('angular-google-maps');
  require('./services/services');
  var mainCtrl = require('./controllers/mainctrl');
  angular.module('StoreLocatorApp', [
    'ui.router',
    'uiGmapgoogle-maps',
    'AppServices'
    ])

  .config([
    '$locationProvider',
    '$stateProvider',
    '$urlRouterProvider',
    'uiGmapGoogleMapApiProvider',
    function($locationProvider, $stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {
      $locationProvider.html5Mode(true);
      // routes
      $stateProvider
        .state("home", {
          url: "/",
          templateUrl: "./partials/home.html",
          controller: "MainController"
        });
      $urlRouterProvider.otherwise("/");

      //google maps tests
      console.log('logging uigmap:')
      console.log(uiGmapGoogleMapApiProvider)
      uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
    }
  ])

  //Load controller
  .controller('MainController', ['$scope', 'GetStoreMarkers', mainCtrl]);

}());