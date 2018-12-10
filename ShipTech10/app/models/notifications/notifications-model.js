angular.module('shiptech.models')
.factory('notificationsModel', [ '$rootScope', 'CUSTOM_EVENTS','API',
    function ($rootScope, CUSTOM_EVENTS, API) {

        var jobHub = $.connection.notificationsHub;
        $.connection.hub.url = API.BASE_URL_DATA_PROCUREMENT + "/signalr/hubs";

        // var originalHeaderValue = "http://mail.24software.ro:452";
        var originalHeaderValue = API.BASE_URL_OPEN_SERVER;

        jobHub.client.update  = function (notification) {
            $rootScope.$broadcast(CUSTOM_EVENTS.NOTIFICATION_RECEIVED, notification);
        };

        var jsOptions = { withCredentials: false };

        function start(requestIds) {
            $.connection.hub.start(jsOptions).done(function () {
                jobHub.server.subscribe(requestIds, originalHeaderValue);
            });
        }

        function stop() {
            $.connection.hub.stop();
        }


        return {
            start: start,
            stop: stop
        };
    }]);