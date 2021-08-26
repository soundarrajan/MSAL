angular.module('shiptech').controller('navigationSidebarController', [ '$scope', '$rootScope', '$state', 'STATE', '$timeout', "$listsCache", '$tenantSettings', '$filter', '$window', '$location', '$tenantConfiguration',
    function($scope, $rootScope, $state, STATE, $timeout, $listsCache, $tenantSettings, $filter, $window, $location, $tenantConfiguration) {
        $scope.state = $state;
        $scope.STATE = STATE;
        $scope.tenantSettings = $tenantSettings;
        $scope.isShowCalanderView = $tenantConfiguration.scheduleDashboardConfiguration? $tenantConfiguration.scheduleDashboardConfiguration.showCalenderView: false;
        $timeout(() => {
            let menu = $('.page-sidebar-menu');
            menu.find('li.active').removeClass('active');
            menu.find('li.open').removeClass('open');
        });
        $timeout(() => {
            $('.form-control[type="search"]').click(() => {
                if (!$('body').hasClass('page-sidebar-closed')) {
                    $('.sidebar-toggler').click();
                }
            });
        }, 10);
        $scope.gotoPage = function(page) {
            $state.go(page);
            $('body').addClass('page-sidebar-closed');
        };
        $scope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
            $('body').addClass('page-sidebar-closed');
            $timeout(() => {
                $('.form-control[type="search"]').click(() => {
                    if (!$('body').hasClass('page-sidebar-closed')) {
                        $('.sidebar-toggler').click();
                    }
                });
            }, 10);
        });

        $scope.setProductTypeView = function() {
            localStorage.setItem('productTypeView', JSON.stringify($listsCache.ProductView[0]));
            $rootScope.productTypeView = angular.copy($listsCache.ProductView[0]);
        }


        $scope.openInNewTab = function(type, data) {
            // debugger;
            let openNew = true;
            if($location.absUrl().indexOf('localhost') >= 0) {
                openNew = false;
            }


            if(type == 'url') {
                // direct url has been given

                if($state.current.name == 'default.home') {
                    let url = $location.$$absUrl.slice(0, -1);
                    url = url + data;

                    if(openNew) {
                        $('body').addClass('page-sidebar-closed');
                        window.open(url, '_blank');
                    }else{
                        $location.path(data);
                    }
                }else if(openNew) {
                    $('body').addClass('page-sidebar-closed');
                    window.open($location.$$absUrl.replace($location.$$path, data), '_blank');
                }else{
                    $location.path(data);
                }
            }else{
                var newUrl = '';

                if(type == 'state') {
                    newUrl = $state.href(STATE[data]);
                }

                if(type == 'company') {
                    newUrl = `#/masters/${ $scope.tenantSettings.companyDisplayName.name.toLowerCase()}`;
                    newUrl = newUrl + data; // data is edit / ''
                }

                if(type == 'service') {
                    var newUrl = `#/masters/${ $scope.tenantSettings.serviceDisplayName.name.toLowerCase()}`;
                    newUrl = newUrl + data; // data is edit / ''
                }

                if(openNew) {
                    $('body').addClass('page-sidebar-closed');
                    $window.open(newUrl, '_blank');
                }else{
                    // $window.open(newUrl);
                    $location.path(newUrl.replace('#', ''));
                }
            }
        };

        $scope.translateLabel = function(string) {
            var translated = $filter('translate')(string);
            var translatedString;
            if(translated) {
                translatedString = translated;
            } else {
                translatedString = '';
            }
            return translatedString;
        };
    }
]);
