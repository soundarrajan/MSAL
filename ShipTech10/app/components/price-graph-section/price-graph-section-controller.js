angular.module('shiptech').controller('PriceGraphController', ['API', '$scope', '$state', 'STATE', 'groupOfRequestsModel', '$listsCache', 'screenLoader', '$tenantSettings','$http',
    function(API, $scope, $state, STATE, groupOfRequestsModel, $listsCache, screenLoader, $tenantSettings, $http) {
        $scope.state = $state;
        $scope.STATE = STATE;
        $scope.logs = {};
        let ctrl = this;
        ctrl.listsCache = $listsCache;
        ctrl.timelineresults = 0;
        ctrl.tenantSettings = $tenantSettings;
        ctrl.find_obj_by_name = function(obj, key, path) {
            // if (!(obj instanceof Array)) return [];

            // if (path) {
            //     myObj = angular.copy(obj[path]);
            // } else {
            //     myObj = angular.copy(obj);
            // }
            // if (!myObj || !key) return [];
            // if (key in myObj) return [myObj[key]];
            // var res = [];

            // _.forEach(myObj, function(v, k) {

            //         if (typeof v == "object" && (v = ctrl.find_obj_by_name(v, key)).length) {
            //             if (v[0] != null) {
            //                 if (_.findIndex(res, function(o) {
            //                         return o.id == v.id
            //                     }) == -1) {
            //                     res.push.apply(res, v);
            //                 }
            //             }
            //         }

            // });
            // return _.uniqBy(res, 'id');

            var productsList = [];
            ctrl.listOfProducts = [];
            $.each(obj.locations, (locK, locV) => {
                $.each(locV.products, (prodK, prodV) => {
                    var currentProduct = angular.copy(prodV.product);
                    ctrl.listOfProducts.push(prodV.product);
                	currentProduct.id = prodV.id;
                    productsList.push(currentProduct);
                });
            });
            ctrl.listOfProducts = _.uniqBy(ctrl.listOfProducts , 'id');
            return _.uniqBy(productsList, 'id');
        };
        ctrl.$onChanges = function(changes) {
            ctrl.timelineresults = 0;
        };
        let options = {
            align: 'center',
            autoResize: true,
            editable: false,
            selectable: false,
            width: '100%',
            margin: {
                axis: 20,
                item: 10
            },
            orientation: 'bottom',
            showCurrentTime: true,
            showMajorLabels: true,
            showMinorLabels: true,
            type: 'box',
            zoomMin: 1000 * 60,
            zoomMax: 1000 * 60 * 60 * 24 * 30 * 12 * 10,
            groupOrder: 'content'
        };

        $scope.filterSellersLatestOffer = function(timelineData) {
            var latestOffers = [];
        	$.each(timelineData, (tdk, tdv) => {
                var currentSellerHasOffer = 0;
                var currentSellerId = tdv.seller.id;
        		$.each(latestOffers, (lok, lov) => {
        			if (lov.seller.id == currentSellerId) {
		        		currentSellerHasOffer = lok;
        			}
        		});
        		if (!currentSellerHasOffer) {
        			latestOffers.push(tdv);
        		} else if (tdv.date > latestOffers[currentSellerHasOffer].date) {
	        			latestOffers[currentSellerHasOffer] = tdv;
        			}
        	});
        	return latestOffers;
        };

         ctrl.getDefaultUomForAdditionalCost = function(product) {
            if (product == null) {
                return;
            }
            let findProductId = _.find(ctrl.listOfProducts, function(object) {
                return object.name == product.name;
            });
            if (!findProductId) {
                return;
            }
            if (!ctrl.listProductTypeGroupsDefaults) {
                let payload1 = { Payload: {} };
                $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/listProductTypeGroupsDefaults`, payload1).then((response) => {
                    console.log(response);
                    if (response.data.payload != 'null') {
                        ctrl.listProductTypeGroupsDefaults = response.data.payload;
                       
                        let payload = { Payload: findProductId.id };
                        $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/get`, payload).then((response) => {
                            if (response.data.payload != 'null') {
                                let productTypeGroup  = response.data.payload.productTypeGroup;
                                let defaultUomAndCompany = _.find(ctrl.listProductTypeGroupsDefaults, function(object) {
                                        return object.id == productTypeGroup.id;
                                });
                                if (defaultUomAndCompany) {
                                    ctrl.grapUomID =  defaultUomAndCompany.defaultUom;
                                }                               
                            }
                        }); 
                    }
                });  
            } else {
                let payload = { Payload: findProductId.id };
                $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/get`, payload).then((response) => {
                    if (response.data.payload != 'null') {
                        let productTypeGroup  = response.data.payload.productTypeGroup;
                        let defaultUomAndCompany = _.find(ctrl.listProductTypeGroupsDefaults, function(object) {
                                return object.id == productTypeGroup.id;
                        });
                        if (defaultUomAndCompany) {
                            if (defaultUomAndCompany) {
                                ctrl.grapUomID =  defaultUomAndCompany.defaultUom;
                            }  
                        }   
                    }
                });
            }
            
        }

        ctrl.generateTimeline = function(request, product, uom, addlCost) {
        	// groupOfRequestsModel.getRequests();
            groupOfRequestsModel.getPriceTimeline(request, product, uom).then((data) => {
                ctrl.timelineresults = data.payload.items.length;
                if (ctrl.timelineresults > 0) {
                    var groups = [];
                    var items = [];
                    var timelineData = data.payload.items;
                    var price = addlCost ? 'totalPrice' : 'price';
                    var baseData = [];
                    $.each(timelineData, (k, v) => {
                        v.sellerLocationId = `${v.seller.id }_${ v.location.id}`;
                        baseData.push(v);
                    });
                    var groupedItems = _.uniqBy(baseData, 'sellerLocationId');

                    var latestSellerOfferTimelineData = $scope.filterSellersLatestOffer(timelineData);

                    var minimumPrice = _.minBy(latestSellerOfferTimelineData, (o) => {
                        return o[price];
                    })[price];
                    _.forEach(groupedItems, (value) => {
                        var item = {
                            id: value.sellerLocationId,
                            className: 'groupTable',
                            content: `<div class="timelineRow"><div class="timelineCell"><b>${ value.seller.name }</b></div><div class="timelineCell"><b>${ value.location.name }</b></div></div>`,
                        };
                        groups.push(item);
                    });
                    _.forEach(timelineData, (value, key) => {
                        var item = {
                            id: key,
                            group: value.sellerLocationId,
                            className: minimumPrice == value[price] ? 'minimumPrice' : '',
                            content: `<b>${ value[price].toString() }</b>`,
                            start: value.date,
                            type: 'box'
                        };
                        items.push(item);
                    });
                    groups = new vis.DataSet(groups);
                    items = new vis.DataSet(items);
                    ctrl.data = {
                        groups: groups,
                        items: items
                    };
                    ctrl.options = angular.extend(options);
                } else {
                    toastr.error('Price Timeline isn`t available for current selection');
                }
            });
        };
    }
]);
