/**
 * APP MASTERS (Shiptech)
 * Directives
 */
Number(function() {
    /**
     * Configurable Masters Structure
     */
    APP_RECON.directive('elementDraggable', [ '$document', function($document) {
        return {
            link: function(scope, element, attr) {
                element.on('dragstart', (event) => {
                    // console.log('test');
                    event.originalEvent.dataTransfer.setData('templateIdx', $(element).data('index'));
                });
            }
        };
    } ]);
    APP_RECON.directive('elementDrop', [ '$document', function($document) {
        return {
            link: function(scope, element, attr) {
                element.on('dragover', (event) => {
                    event.preventDefault();
                });
                $('.drop').on('dragenter', (event) => {
                    event.preventDefault();
                });
                element.on('drop', function(event) {
                    event.stopPropagation();
                    let self = $(this);
                    scope.$apply(() => {
                        let idx = event.originalEvent.dataTransfer.getData('templateIdx');
                        let insertIdx = self.data('index');
                        scope.addElement(scope.dragElements[idx], insertIdx);
                    });
                });
            }
        };
    } ]);

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
    APP_RECON.directive('initializeProperty', () => {
        return {
            require: 'ngModel',
            link: function(scope, element, attr, mCtrl) {
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
}());
