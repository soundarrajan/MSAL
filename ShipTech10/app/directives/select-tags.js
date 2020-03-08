angular.module('shiptech.pages').directive('formSelectTags', () => {
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


angular.module('shiptech.pages').directive('file', () => {
    return {
        require:'ngModel',
        restrict: 'A',
        link: function($scope, el, attrs, ngModel) {
            el.bind('change', (event) => {
                let files = event.target.files;
                let file = files[0];

                ngModel.$setViewValue(file);
                $scope.$apply();
            });
        }
    };
});
