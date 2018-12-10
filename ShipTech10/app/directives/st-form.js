angular.module('shiptech.pages').directive('stForm', function(){
    return {
        restrict: 'E',
        templateUrl: 'directives/st-form.html',
        scope: {
            form: '=form',
            inputContainerClass: '=inputContainerClass',
            inputGroupClass: '=inputGroupClass',
            labelClass: '=labelClass'
        }
    };
});