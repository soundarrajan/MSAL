// Load MASTERS APP (module)
var APP_DELIVERY = angular.module('shiptech.app.delivery', [
    // 3rd party
    'ui.router',
    // 'ngCookies',
    'ui.tree',
    'ui.sortable',
    // Specific modules
    'shiptech.app.api',
    'shiptech.app.general.components'
]);

// Constants
APP_DELIVERY.constant('DELIVERY_STATE', {
    DEFAULT: 'delivery',
    HOME: 'delivery.home',
    SINGLE: 'delivery.single',
    AUDIT: 'delivery.audit',
    DOCUMENTS: 'delivery.documents',
    EMAIL: 'delivery.email',
    STRUCTURE: 'delivery.structure',
    EDIT: 'delivery.edit'
});

// Config
APP_DELIVERY.config([ '$stateProvider', '$urlRouterProvider', 'DELIVERY_STATE', function($stateProvider, $urlRouterProvider, DELIVERY_STATE) {
    $stateProvider

        .state(DELIVERY_STATE.DEFAULT, {
            abstract: true,
            templateUrl: 'layouts/default.html'
        })

        .state(DELIVERY_STATE.HOME, {
            params: {
                path: [
                    {
                        label: 'Delivery',
                        uisref: DELIVERY_STATE.HOME
                    }
                ],
                title: 'Delivery'
            },
            url: '/delivery',
            templateUrl: 'app-delivery/views/catalog.html'
        })

    // DELIVERY view (single master list)
        .state(DELIVERY_STATE.SINGLE, {
            params: {
                path: [
                    {
                        label: 'Delivery',
                        uisref: DELIVERY_STATE.HOME
                    },
                    {
                        label: 'Delivery List',
                        uisref: DELIVERY_STATE.SINGLE
                    }
                ],
                title: 'Delivery List'
            },
            url: '/delivery/:screen_id',
            templateUrl: function($stateParams) {
                return `app-delivery/views/list/${ $stateParams.screen_id }.html`;
            }
        })

    // .state(DELIVERY_STATE.ORDERS_DELIVERY, {
    //     params: {
    //         path: [
    //             {
    //                 label: 'Delivery',
    //                 uisref: DELIVERY_STATE.HOME
    //             },
    //             {
    //                 label: 'Orders Delivery List',
    //                 uisref: DELIVERY_STATE.ORDERS_DELIVERY
    //             }
    //         ],
    //         title: 'Orders Delivery View'
    //     },
    //     url: '/delivery/ordersdelivery',
    //     templateUrl: 'app-delivery/views/list/ordersdelivery.html'
    // })

    // DELIVERY - AUDIT view (single master-audit list)
        .state(DELIVERY_STATE.AUDIT, {
            params: {
                path: [
                    {
                        label: 'Delivery',
                        uisref: DELIVERY_STATE.HOME
                    },
                    {
                        label: 'Audit View',
                        uisref: DELIVERY_STATE.AUDIT
                    }
                ],
                title: 'Audit View'
            },
            url: '/delivery/:screen_id/audit/:entity_id',
            templateUrl: 'app-delivery/views/list_audit.html'
        })

    // DELIVERY - DOCUMENTS view (single master-documents list)
        .state(DELIVERY_STATE.DOCUMENTS, {
            params: {
                path: [
                    {
                        label: 'Delivery',
                        uisref: DELIVERY_STATE.HOME
                    },
                    {
                        label: 'Documents View',
                        uisref: DELIVERY_STATE.DOCUMENTS
                    }
                ],
                title: 'Documents View'
            },
            url: '/delivery/:screen_id/documents/:entity_id',
            templateUrl: 'app-delivery/views/list_documents.html'
        })

        .state(DELIVERY_STATE.EMAIL, {
            params: {
                path: [
                    {
                        label: 'Delivery',
                        uisref: DELIVERY_STATE.HOME
                    },
                    {
                        label: 'Email Log',
                        uisref: DELIVERY_STATE.EMAIL
                    }
                ],
                title: 'Email Log'
            },
            url: '/delivery/:screen_id/email-log/:entity_id',
            templateUrl: 'app-delivery/views/list_email.html'
        })

    // DELIVERY structure view (single master structure list)
        .state(DELIVERY_STATE.STRUCTURE, {
            params: {
                path: [
                    {
                        label: 'Delivery',
                        uisref: DELIVERY_STATE.HOME
                    },
                    {
                        label: 'Delivery Structure',
                        uisref: DELIVERY_STATE.STRUCTURE
                    }
                ],
                title: 'Delivery Structure'
            },
            url: '/delivery/:screen_id/structure',
            templateUrl: 'app-delivery/views/structure.html'
        })

    // DELIVERY entity edit view (single master entity -- edit screen)
        .state(DELIVERY_STATE.EDIT, {
            params: {
                path: [
                    {
                        label: 'Delivery',
                        uisref: DELIVERY_STATE.HOME
                    },
                    {
                        label: 'Delivery Entity Edit',
                        uisref: DELIVERY_STATE.EDIT
                    }
                ],
                title: 'Delivery Entity Edit',
                status: {
            	color : '',
            	bg : '',
            	name: ''
                }
            },
            url: '/delivery/:screen_id/edit/:entity_id',
            templateUrl: 'app-delivery/views/edit.html'
        });
} ]);

// ON RUN
APP_DELIVERY.run([ '$state', '$rootScope','$window', '$location', 'DELIVERY_STATE', function($state, $rootScope, $window, $location, DELIVERY_STATE) {
    // if ($state.params.entity_id < 1) { $state.params.status = {} }

    let titleMap = {};
    titleMap[DELIVERY_STATE.HOME] = 'Delivery Screens';
    titleMap[DELIVERY_STATE.SINGLE] = ':screen_id List';
    titleMap[DELIVERY_STATE.STRUCTURE] = ':screen_id :: Structure';
    // titleMap[DELIVERY_STATE.EDIT] = 'Delivery - :delivery_id - :order_id - :vessel_name';
    titleMap[DELIVERY_STATE.EDIT] = 'Del :delivery_id';

    let screenMap = {
        deliverylist: 'Orders - Delivery',
        delivery: 'Delivery',
        deliveriestobeverified: 'Deliveries to be verified',
    };

    let entityMap = {}; // if needed :)

    // do not edit below
    $rootScope.$on('$includeContentLoaded', () => {
        changeTitle();
    });

    $rootScope.$on('$stateChangeStart', (event, fromState, stateParams) => {
        if(fromState.name === DELIVERY_STATE.EDIT){
            event.preventDefault();
            $window.open($location.$$absUrl.replace('#'+$location.$$path, 'v2/delivery/delivery/'+stateParams.entity_id+'/details'), '_self');
            //$window.open('http://localhost:9016/v2/delivery/delivery/'+stateParams.entity_id+'/details', '_self');
        }
    });

    $rootScope.$on('$stateChangeSuccess', () => {
        changeTitle();
    });

    var changeTitle = function() {
        if(typeof $state.params.title != 'undefined') {
            // check if name is already set to delivery name in controller
            if($state.params.title.split('CTRL')) {
                $state.params.title = $state.params.title.split('CTRL')[1];
                return;
            }
        }
        if (titleMap[$state.current.name]) {
            let newTitle = titleMap[$state.current.name];
            if ($state.params.entity_id < 1) {
            	var deliveryId = 0;
                newTitle = 'New Delivery';
                $state.params.path[1].label = newTitle;
            } else {
            	deliveryId = $state.params.entity_id;
            }
            newTitle = newTitle.replace(/:screen_id/i, screenMap[$state.params.screen_id]).replace(/:delivery_id/i, deliveryId);
            $state.params.title = newTitle;

            // if (($state.params.entity_id > 0) && ($state.current.name == "delivery.edit")){
            //     $state.params.title = "";
            // }
        }
    };
} ]);
