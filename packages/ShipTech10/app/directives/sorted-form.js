angular.module('shiptech.pages').directive('sortedForm', function(){

    function link(scope, element, attrs, controller, transcludeFn) {
        // console.log(attrs);
        // var source = angular.element(attrs.getFromId);
        // for(var i = 0; i < attrs.fieldIds.length; i++) {
        //     console.log(attrs.fieldIds[i]);
        // }
    }

    return {
        restrict: 'AE',
        scope: {
            fieldIds: "=",
            getFromId: '='
        },
        link: link
    };
});