angular.module('shiptech.pages')
    .directive('calendarContextmenu', [ '$timeout', '$window', function($timeout, $window) {
        return {

            restrict: 'E',
            templateUrl: 'directives/calendar-contextmenu.html',
            scope: {
                voyageStop: '=voyageStop',
                onClick: '='
            },

            link: function(scope, element, attrs) {
                $timeout(() => {
                    element.on('click', '.close', (event) => {
                        $(element).hide();
                        event.preventDefault();
                    });
                });
            },

            controller: [ '$scope', '$element', '$state', 'STATE', function($scope, $element, $state, STATE) {
                if(!$scope.voyageStop.request) {
                    $scope.linkText = 'Create Pre-Request';
                } else {
                    $scope.linkText = 'Edit Pre-Request';
                }

                $scope.gotoNewRequest = function(voyageStop) {
                    let href;

                    if(!voyageStop) {
                        return;
                    }

                    if(voyageStop.request && voyageStop.request.id != 0) {
                        href = $state.href(STATE.EDIT_REQUEST, { requestId: voyageStop.request.id }, { absolute: false });
                    } else {
                        href = $state.href(STATE.NEW_REQUEST, { voyageId: voyageStop.id }, { absolute: false });
                    }

                    $window.open(href, '_blank');
                };
            }
            ] };
    } ]);
