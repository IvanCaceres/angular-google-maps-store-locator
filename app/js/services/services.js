var Services = angular.module('AppServices', ['ngResource']);

Services.factory('GetStoreMarkers', function($resource){
    return {
      query: function(radius, lat, lng) { 
        return $resource('http://largesshosting.com/mapapi/markers', {}, {
            query: {method:'GET', params:{radius: radius, lat: lat, lng: lng}, isArray:true}
    }).query();
     }
    }
});