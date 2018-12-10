/**
 * APP MASTERS (Shiptech)
 * Directives
 */
+(function() {
    /**
     * Configurable Masters Structure
     */
    APP_MASTERS.directive('elementDraggable', ['$document', function($document) {
        return {
            link: function(scope, element, attr) {
                element.on('dragstart', function(event) {
                    // console.log('test');
                    event.originalEvent.dataTransfer.setData('templateIdx', $(element).data('index'));
                });
            }
        };
    }]);
    APP_MASTERS.directive('elementDrop', ['$document', function($document) {
        return {
            link: function(scope, element, attr) {
                element.on('dragover', function(event) {
                    event.preventDefault();
                });
                $('.drop').on('dragenter', function(event) {
                    event.preventDefault();
                })
                element.on('drop', function(event) {
                    event.stopPropagation();
                    var self = $(this);
                    scope.$apply(function() {
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
    APP_MASTERS.directive('initializeProperty', function() {
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
    APP_MASTERS.directive('indeterminateCheckbox', ['HierarchyNodeService', function(HierarchyNodeService) {
        return {
            restrict: 'A',
            scope: {
                node: '='
            },
            link: function(scope, element, attr) {
                scope.$watch('node', function(nv) {
                    var flattenedTree = HierarchyNodeService.getAllChildren(scope.node, []);
                    flattenedTree = flattenedTree.map(function(n) {
                        return n.isSelected
                    });
                    var initalLength = flattenedTree.length;
                    var compactedTree = _.compact(flattenedTree);
                    var r = compactedTree.length > 0 && compactedTree.length < flattenedTree.length;
                    element.prop('indeterminate', r);
                }, true);
            }
        }
    }]);
    (function() {
        APP_MASTERS.directive('hierarchySearch', ['HierarchyNodeService', '$timeout', '$templateCache', '$compile', function(HierarchyNodeService, $timeout, $templateCache, $compile) {
            return {
                restrict: 'E',
                template: $templateCache.get('app-admin/views/hierarchySearch.html'),
                scope: {
                    dataset: '=',
                    datasrc: '=',
                    data: '=',
                    screenid: '=',
                    datavalues: '='
                },
                controller: ['$rootScope', '$scope', '$compile', function($rootScope, $scope, $compile) {
                    $scope.numSelected = 0;
                    //$scope.list is used by ng-tree, dataset should never be modified
                    $scope.list = angular.copy($scope.dataset);
                    $scope.options = {};
                    $scope.selectedItems = {};
                    if ($scope.datavalues.accessVessels && $scope.datavalues.accessBuyers && $scope.datavalues.accessCompanies) {
                        dataSrcs = {
                            'vessel_access': 'accessVessels',
                            'buyer_access': 'accessBuyers',
                            'company_access': 'accessCompanies'
                        };
                        if ($scope.datavalues[dataSrcs[$scope.datasrc]].length > 0) {
                            $.each($scope.datavalues[dataSrcs[$scope.datasrc]], function(k, v) {
                                findInObject(v);
                            })
                        }
                    }

                    function findInObject(v, list) {
                        if (!list) {
                            list = $scope.list
                        }
                        $.each(list, function(ki, item) {
                            if (v.name == item.name) {
                                item.isSelected = true;
                            } else {
                                if (item.children) {
                                    findInObject(v, item.children)
                                }
                            }
                        })
                    }
                    $scope.expandNode = function(n, $event) {
                        $event.stopPropagation();
                        n.toggle();
                    }
                    $scope.filter = function(item, pattern) {
                        if (pattern) {
                            found = 0;
                            if (item.name.toLowerCase().indexOf(pattern.toLowerCase()) == -1) {
                                found = 0;
                                if (item.children) {
                                    if (item.children.length > 0) {
                                        $.each(item.children, function(k, v) {
                                            if (v.name.toLowerCase().indexOf(pattern.toLowerCase()) > -1) {
                                                found++;
                                            }
                                        })
                                    }
                                }
                                if (found > 0) {
                                    return false
                                } else {
                                    return true
                                }
                            }
                        }
                        return false
                    }
                    $scope.selectAll = function(list, val) { 
                   
                        console.log(val)
                        if (val) {
                            $.each(list, function(k, item) {
                                item.isSelected = false;
                                HierarchyNodeService.selectChildren(item, false)
                            })
                        } else {
                            $.each(list, function(k, item) {
                                item.isSelected = true;
                                HierarchyNodeService.selectChildren(item, true)
                            })
                        }
                    }
                    $scope.itemSelect = function(item) {
                        var rootVal = !item.isSelected;
                        HierarchyNodeService.selectChildren(item, rootVal)
                        // HierarchyNodeService.findParent($scope.list[0], null, item, selectParent);
                        var s = _.compact(HierarchyNodeService.getAllChildren($scope.list[0], []).map(function(c) {
                            return c.isSelected && !c.children;
                        }));
                        $scope.numSelected = s.length;
                        // $scope.selectItem(item, $scope.datasrc)
                        // console.log($scope.list)
                    }

                    function selectParent(parent) {
                        var children = HierarchyNodeService.getAllChildren(parent, []);
                        if (!children) return;
                        children = children.slice(1).map(function(c) {
                            return c.isSelected;
                        });
                        parent.isSelected = children.length === _.compact(children).length && !parent.unSelectable;
                        HierarchyNodeService.findParent($scope.list[0], null, parent, selectParent)
                    }
                    $scope.nodeStatus = function(node) {
                        var flattenedTree = getAllChildren(node, []);
                        flattenedTree = flattenedTree.map(function(n) {
                            return n.isSelected
                        });
                        return flattenedTree.length === _.compact(flattenedTree);
                    }
                }],
                link: function(scope, el, attr) {
                    scope.$watch('pastUsersFilter', function(nv) {
                        if (_.isUndefined(nv)) return;
                        if (nv) {
                            HierarchyNodeService.trimLeafs(scope.list[0]);
                        } else {
                            scope.list = angular.copy(scope.dataset);
                        }
                    });
                    var inputTimeout;
                    var time = 300;
                    scope.$watch('searchValue', function(nv) {
                        if (!nv && nv !== '') {
                            return;
                        }
                        var previousDataset = angular.copy(scope.list);
                        var newData = (scope.searchValue === '') ? angular.copy(scope.dataset) : [HierarchyNodeService.treeSearch(angular.copy(scope.dataset[0]), scope.searchValue)];
                        if (newData.length === 1 && _.isEmpty(newData[0])) {
                            scope.emptyData = true;
                            return;
                        }
                        scope.emptyData = false;
                        if (_.isEqual(previousDataset, newData)) {
                            clearTimeout(inputTimeout);
                            return;
                        }
                        scope.list = newData;
                        $timeout.cancel(inputTimeout);
                        inputTimeout = $timeout(function() {
                            var els = document.querySelectorAll('[ui-tree-node]');
                            Array.prototype.forEach.call(els, function(el) {
                                el = angular.element(el);
                                var elScope = el.scope();
                                if (elScope.$modelValue.match) {
                                    elScope.expand();
                                    //loop through all parents and keep expanding until no more parents are found
                                    var p = elScope.$parentNodeScope;
                                    while (p) {
                                        p.expand();
                                        p = p.$parentNodeScope;
                                    }
                                }
                            });
                        }, 500);
                    });
                    scope.$watch('list', function(nv, ov) {
                        // console.log(nv)
                        if (!nv) return;
                        if (nv && !ov) {
                            scope.$apply();
                        }
                        //UPDATE SELECTED IDs FOR QUERY
                        //get the root node
                        //
                        var rootNode = nv[1];
                        // console.log(nv);
                        result = []
                        $.each(nv, function(k, v) {
                            var a = HierarchyNodeService.getSelected(v, []);
                            // console.log(a)
                            if (a.length > 0) {
                                _.each(a, function(itm) {
                                    if (!itm.unSelectable) {
                                        result.push(_.pick(itm, "id", "name"))
                                    }
                                });
                                // scope.selected = scope.changedSelection;
                            }
                        })
            			console.log(scope.sel);
                        if (typeof scope.sel == 'undefined') {
                            scope.sel = {}
                        } else {
                        	setTimeout(function(){
	                    		// $compile($(".hierarchy-header"))(scope);
								scope.$apply();
                        	},500)
                        }
                        // console.log(scope.dataset.length)
                        // console.log(result.length)
                        // console.log(scope.flattenedTree)
                        if (scope.datasrc == 'vessel_access') {
                            length = 0;
                            $.each(nv, function(nvk,nvv){
                            	length+=nvv.children.length	
                            })
                            // length = nv.length;
                        	
                        } else {
                            length = scope.dataset[0].totalCount
                        }
                        if (length == result.length) {
                            scope.sel[scope.datasrc] = true;
                        } else {
                            scope.sel[scope.datasrc] = false;
                        }
                        scope.changedSelection = {};
                        scope.changedSelection[scope.datasrc] = result;
                        // console.log(scope.changedSelection)
                        scope.$emit('changedSelection', scope.changedSelection);
                        //get all elements where isSelected == true
                        //get the ids of each element
                        // console.log(a)
                    }, true);
                }
            }
        }])
    }).call(this);
})();