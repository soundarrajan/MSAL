angular.module('shiptech.pages').directive('formSelectTags', function(){
    return {
        restrict: 'E',
        templateUrl: 'directives/select-tags.html',
        scope: {
            params: '=params',
            containerClass: '=containerClass',
            labelClass: '=labelClass',
            selectContainerClass: '=selectContainerClass'
        }
    };
});



angular.module('shiptech.pages').directive('file', function() {
    return {
        require:"ngModel",
        restrict: 'A',
        link: function($scope, el, attrs, ngModel){
            el.bind('change', function(event){
                var files = event.target.files;
                var file = files[0];

                ngModel.$setViewValue(file);
                $scope.$apply();
            });
        }
    };
});