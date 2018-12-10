/**
 * APP Contract (Shiptech)
 * Directives
 */
+(function () {
    /**
     * Configurable Masters Structure
     */
    APP_CONTRACT.directive('elementDraggable', ['$document', function ($document) {
        return {
            link: function (scope, element, attr) {
                element.on('dragstart', function (event) {
                    // console.log('test');
                    event.originalEvent.dataTransfer.setData('templateIdx', $(element).data('index'));
                });
            }
        };
    }]);
    APP_CONTRACT.directive('elementDrop', ['$document', function ($document) {
        return {
            link: function (scope, element, attr) {
                element.on('dragover', function (event) {
                    event.preventDefault();
                });
                $('.drop').on('dragenter', function (event) {
                    event.preventDefault();
                })
                element.on('drop', function (event) {
                    event.stopPropagation();
                    var self = $(this);
                    scope.$apply(function () {
                        var idx = event.originalEvent.dataTransfer.getData('templateIdx');
                        var insertIdx = self.data('index')
                        scope.addElement(scope.dragElements[idx], insertIdx);
                    });
                });
            }
        };
    }]);
    /*    APP_MASTERS.directive('initializeProperty', function() {
            return {
                restrict: 'A',
                link: function(scope, element, attr) {
                    // $(window).load(function() {
                    //     if (!element.val()) {
                    //         element.val('').trigger('change');
                    //     }
                    // });
                }
            };
        });*/
    APP_CONTRACT.directive('initializeProperty', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, mCtrl) {
                // function myValidation(value) {
                //     if (value.length() > 0) {
                //         mCtrl.$setValidity('charE', true);
                //     } else {
                //         mCtrl.$setValidity('charE', false);
                //     }
                //     return value;
                // }
                // mCtrl.$parsers.push(myValidation);
            }
        };
    });
})();