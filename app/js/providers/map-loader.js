angular.module('uiGmapgoogle-maps.providers').factory('uiGmapMapScriptLoader', [
  '$q', 'uiGmapuuid', function($q, uuid) {
    console.log('ant man!!')
    var getScriptUrl, scriptId;
    scriptId = void 0;
    getScriptUrl = function(options) {
      if (options.china) {
        return 'http://maps.google.cn/maps/api/js?';
      } else {
        return 'https://maps.googleapis.com/maps/api/js?';
      }
    };
    return {
      load: function(options) {
        var deferred, query, randomizedFunctionName, script;
        deferred = $q.defer();
        if (angular.isDefined(window.google) && angular.isDefined(window.google.maps)) {
          deferred.resolve(window.google.maps);
          return deferred.promise;
        }
        randomizedFunctionName = options.callback = 'onGoogleMapsReady' + Math.round(Math.random() * 1000);
        window[randomizedFunctionName] = function() {
          window[randomizedFunctionName] = null;
          deferred.resolve(window.google.maps);
        };
        query = _.map(options, function(v, k) {
          return k + '=' + v;
        });
        if (scriptId) {
          document.getElementById(scriptId).remove();
        }
        query = query.join('&');
        script = document.createElement('script');
        scriptId = "ui_gmap_map_load_" + uuid.generate();
        script.id = scriptId;
        script.type = 'text/javascript';
        script.src = getScriptUrl(options) + query;
        document.body.appendChild(script);
        return deferred.promise;
      }
    };
  }
]).provider('uiGmapGoogleMapApi', function() {
  this.options = {
    china: false,
    v: '3.17',
    libraries: '',
    language: 'en',
    sensor: 'false'
  };
  this.configure = function(options) {
    angular.extend(this.options, options);
  };
  this.$get = [
    'uiGmapMapScriptLoader', (function(_this) {
      return function(loader) {
        return loader.load(_this.options);
      };
    })(this)
  ];
  return this;
});
