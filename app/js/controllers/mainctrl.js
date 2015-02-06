module.exports = function($scope,GetStoreMarkers) {
  $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 4 },
  $scope.map.stores = {};
  $scope.radius = {value: '500'};
  $scope.distanceChoices = [
  {label: '5 Mi', value: '5'},
  {label: '10 Mi', value: '10'},
  {label: '20 Mi', value: '20'},
  {label: '25 Mi', value: '25'},
  {label: '50 Mi', value: '50'},
  {label: '100 Mi', value: '100'}
                             ];
  //function called when clicking on a store result
  $scope.selectStore = function (store){
    if($scope.map.active){
      $scope.map.active.show = false;
    }
    $scope.map.center = { latitude: store.latitude, longitude: store.longitude };
    $scope.map.zoom = 14;
    store.show = true;
    $scope.map.active = store;
    // $scope.map = { center: { latitude: store.latitude, longitude: store.longitude }, zoom: 8};
  };
  //our search submission function
  $scope.search = function (){
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': $scope.address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        $scope.map.stores = [];
         console.log(results);
         console.log($scope.radius);
         $scope.getStores(results[0].geometry.location.lat(), results[0].geometry.location.lng())
      } else {
        console.log("Geocode was not successful for the following reason: " + status);
      }
    });  
  }

  $scope.getStores = function(lat,lng){
        GetStoreMarkers.query($scope.radius.value, lat, lng)
        .$promise.then(function(result){
          console.log(result);
          $scope.map.stores = result;
          $scope.map.storesControl = {};
          $scope.map.rebuild = {};
          for(var i=0;i<result.length;i++){
            var coords = {
              latitude: result[i].latitude,
              longitude: result[i].longitude,
              title: 'm' + i
            };
          $scope.map.stores[i].coords = coords; 
          $scope.map.stores[i].control = {}; 
          }
        });
  }
  
  //get device location on load and run initial search
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position)
    // console.log('setting coordinateString')
    //   $scope.coordinateString = position.coords.latitude + ', ' + position.coords.longitude;
    //   console.log($scope.coordinateString)
    //   var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      $scope.getStores(position.coords.latitude, position.coords.longitude);
  }); 

};