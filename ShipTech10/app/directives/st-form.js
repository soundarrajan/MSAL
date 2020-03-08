angular.module('shiptech.pages').directive('stForm', () => {
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
