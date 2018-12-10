(function(angular) {

    'use strict';

    angular.module("ng-smartlook", []);

    angular.module("ng-smartlook").provider('Smartlook', [function SmartlookProvider(){
        var smartlookActivated = true;
        var applicationStart;

        this.init = function(config){
            if(!config || !config.apiKey)
                throw new Error("no apiKey index");
            if(typeof config.apiKey != "string")
                throw new Error("apiKey must be a string");
            window.smartlook||(function(d) {
                var o = window.smartlook = function(){
                    o.api.push(arguments);
                }
                var h = document.getElementsByTagName('head')[0];
                var c = document.createElement('script');
                o.api = new Array();
                c.async = true;
                c.type = "text/javascript";
                c.charset = "utf-8";
                c.src = 'https://rec.smartlook.com/recorder.js';
                h.appendChild(c);
            })(document);
            if(smartlookActivated){
                smartlook('init', config.apiKey);
                applicationStart = new Date();
            }
        }

        getter.$inject = ['$log', '$window'];

        function getter($log, $window) {

            function _bindSmartlookMethod(methodName){
                return function(){
                    $window.smartlook[methodName].apply($window.smartlook, arguments);
                };
            }

            function startToNow(){
              return  new Date(new Date() - applicationStart).getUTCSeconds();
            }

            var service = {
                smartlook: $window.smartlook,
                startToNow: startToNow
            }
            return service;
        }
        this.$get = getter;
    }]);

})(angular);
