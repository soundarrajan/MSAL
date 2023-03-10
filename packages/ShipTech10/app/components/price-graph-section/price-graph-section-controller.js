angular.module('shiptech').controller('PriceGraphController', ['$scope', '$state', 'STATE', 'VisDataSet', 'groupOfRequestsModel', '$listsCache', 'screenLoader',
    function($scope, $state, STATE, VisDataSet, groupOfRequestsModel, $listsCache, screenLoader) {
        $scope.state = $state;
        $scope.STATE = STATE;
        $scope.logs = {};
        var ctrl = this;
        ctrl.listsCache = $listsCache;
        ctrl.timelineresults = 0;
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
            
            productsList = []
            $.each(obj.locations, function(locK, locV) {
                $.each(locV.products, function(prodK, prodV) {
                	currentProduct = angular.copy(prodV.product);
                	currentProduct.id = prodV.id
                    productsList.push(currentProduct);
                })
            })
            return _.uniqBy(productsList, 'id');

        }
        ctrl.$onChanges = function(changes) {
            ctrl.timelineresults = 0;
        }
        var options = {
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
        ctrl.generateTimeline = function(request, product, uom, addlCost) {
        	// groupOfRequestsModel.getRequests();
        	screenLoader.showLoader()
            groupOfRequestsModel.getPriceTimeline(request, product, uom).then(function(data) {
                ctrl.timelineresults = data.payload.items.length;
                if (ctrl.timelineresults > 0) {
                    groups = [];
                    items = [];
                    timelineData = data.payload.items;
                    price = addlCost ? 'totalPrice' : 'price';
                    baseData = [];
                    $.each(timelineData, function(k,v){
                        v.sellerLocationId = v.seller.id + '_' + v.location.id;
                        baseData.push(v)
                    })
                    groupedItems = _.uniqBy(baseData, 'sellerLocationId');

                    minimumPrice = _.minBy(timelineData, function(o) {
                        return o[price]
                    })[price];
                    _.forEach(groupedItems, function(value) {
                        item = {
                            id: value.sellerLocationId,
                            className: 'groupTable',
                            content: '<div class="timelineRow"><div class="timelineCell"><b>' + value.seller.name + '</b></div><div class="timelineCell"><b>' + value.location.name + '</b></div></div>',
                        }
                        groups.push(item)
                    }); 
                    _.forEach(timelineData, function(value, key) {
                        item = {
                            id: key,
                            group: value.sellerLocationId,
                            className: minimumPrice == value[price] ? 'minimumPrice' : '',
                            content: '<b>' + value[price].toString() + '</b>',
                            start: value.date,
                            type: "box"
                        }
                        items.push(item)
                    });
                    groups = VisDataSet(groups);
                    items = VisDataSet(items);
                    ctrl.data = {
                        groups: groups,
                        items: items
                    };
                    ctrl.options = angular.extend(options)
                    setTimeout(function(){
		            	screenLoader.hideLoader()
                    },1000)
                } else {
                    toastr.error('Price Timeline isn`t available for current selection')
                }
            },function(){
            	screenLoader.hideLoader()
            });
        }
    }
]);