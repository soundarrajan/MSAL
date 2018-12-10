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