angular.module("shiptech.pages")
    .controller("HomePageController", ["$scope", "$element", "$attrs", "$timeout",

        function($scope, $element, $attrs, $timeout) {

            $timeout(function(){

                HomeWidgetDatatable.init({
                	selector: "#alerts_table",
                    pageLength: 7
                });

                HomeWidgetDatatable.init({
                    selector: "#enquiries_table",
                    pageLength: 7
                });

                HomeWidgetDatatable.init({
                    selector: "#tasks_table",
                    pageLength: 7
                });

                var date = $(".form_meridian_datetime");

	            date.datetimepicker({
			        isRTL: App.isRTL(),
			        format: "dd MM yyyy - HH:ii P",
			        showMeridian: true,
			        autoclose: true,
			        pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left"),
			        todayBtn: false
			    });
            });
}]);


angular.module('shiptech.pages').component('homePage', {
    templateUrl: 'pages/home/views/home-page-component.html',
    controller: 'HomePageController'
});