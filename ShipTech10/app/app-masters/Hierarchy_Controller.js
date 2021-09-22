/**
 * Master_Hierarchy Controller
 */

APP_MASTERS.controller('Master_Hierarchy', [
	'API',
	'$tenantSettings',
	'tenantService',
	'$scope',
	'$rootScope',
	'$sce',
	'$Api_Service',
	'Factory_Master',
	'$state',
	'$location',
	'$q',
	'$compile',
	'$timeout',
	'$interval',
	'$templateCache',
	'$listsCache',
	'$uibModal',
	'uibDateParser',
	'uiGridConstants',
	'$filter',
	'$http',
	'$window',
	'$controller',
	'payloadDataModel',
	'statusColors',
	'screenLoader',
	'$parse',
	'orderModel',
	'API',
	function (API, $tenantSettings, tenantService, $scope, $rootScope, $sce, $Api_Service, Factory_Master, $state, $location, $q, $compile, $timeout, $interval, $templateCache, $listsCache, $uibModal, uibDateParser, uiGridConstants, $filter, $http, $window, $controller, payloadDataModel, statusColors, screenLoader, $parse, orderModel, API) {
		let vm = this;
		$scope.screen_id = $state.params.screen_id;

		var getListUrl = function () {
			var map = {
				"counterparty": "counterparties",
				"location": "locations",
				"buyer": "buyer",
				"strategy": "strategies",
				"service": "services",
				"product": "products",
				"company": "companies"
			};
			var currentList = map[$scope.screen_id];

			return `${API.BASE_URL_DATA_MASTERS}/api/masters/${currentList}/listMasters`;
		}

		vm.getData = function (callback) {
			apiJSON = {
				"Payload": {
					"Pagination": {
						"Skip": 0,
						"Take": 9999999
					}
				}
			}
			url = getListUrl();
			$http.post(url, angular.toJson(apiJSON)).then(
				(response) => {
					if (response.data) {
						console.log("Start", Date.now());
						callback(response.data.payload);
					} else {
						callback(false);
					}
				},
				(response) => {
					console.log('HTTP ERROR');
					callback(false);
				}
			);
		}

		vm.getData(function (response) {
			$scope.hierarchy = buildHierarchy(response);
			console.log($scope.hierarchy);
			// initExpanders();
		})

		// function initExpanders() {
		// 	jQuery(document).ready(function(){
		//  	$(document).on("click", "#hierarchical-tree .expander i", function(){
		//  		$(this).parent().next().slideToggle();
		//  	})
		// 	})
		// }

		$scope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
			$("#hierarchical-tree .expander i").unbind();
		});

		window.expandHierarchyChildren = function (e) {
			console.log(e);
			if ($(e).hasClass("collapsed")) {
				if ($scope.searched) {
					$(e).parent().next().find(".search-list").show();
				}
				$(e).parent().next().slideDown();
			} else {
				$(e).parent().next().find(".children").hide();
				$(e).parent().next().find(".expander i").addClass("collapsed");
				$(e).parent().next().slideUp();
			}
			$(e).toggleClass("collapsed");
		}


		var getListName = function (array) {
			var allChildrens = [];
			var getRecursive = function (array1) {
				for (var i = 0; i < array1.children.length; i++) {
					allChildrens.push(array1.children[i].name);
					getRecursive(array1.children[i]);
				}
			}
			getRecursive(array);
			return allChildrens;
		}

		function buildHierarchy(list) {
			for (var i = list.length - 1; i >= 0; i--) {
				list[i].parentId = list[i].parent ? list[i].parent.id : 0;
			}
			var map = {}, node, roots = [], i;
			for (i = 0; i < list.length; i += 1) {
				map[list[i].id] = i;
				list[i].children = [];
				list[i].nameList = [];
			}
			for (i = 0; i < list.length; i += 1) {
				node = list[i];
				if (node.parentId !== 0) {
					if (map[node.parentId] && list[map[node.parentId]]) {
						list[map[node.parentId]].children.push(node);
						list[map[node.parentId]].nameList.push(node.name);
					} else {
						roots.push(node);
					}
				} else {
					roots.push(node);
				}

			}
			console.log(roots);
			console.log("End", Date.now());
			return roots;
		}

		$scope.newEntity = function () {
			if ($state.$current.url.prefix.indexOf("edit") > 0) {
				$state.$current.url.prefix = $state.$current.url.prefix.replace("edit/", "");
			}

			var url = $state.$current.url.prefix + $state.params.screen_id + "/edit/";
			if ($state.params.entity_id) {
				url = JSON.stringify(url);
				url = url.replace(/:entity_id/g, $state.params.entity_id);
				url = JSON.parse(url);
			}

			window.open($location.$$absUrl.replace($location.$$path, url), '_blank');
			$state.reload();
		}

		$scope.openChild = function (id) {
			var url = $state.$current.url.prefix + $state.params.screen_id + "/edit/" + id;
			window.open($location.$$absUrl.replace($location.$$path, url), '_blank');
			// $state.reload();
		}

		$scope.searchHierarchy = function (val) {
			if (val == "" || val == undefined) {
				$scope.searched = false;
				$scope.search_terms = "";
				$scope.redrawTree();
			} else {
				$(".search-list").show();
				$.each($(".search-list"), function (){
					if ($(this).text().toLowerCase().indexOf(val.toLowerCase()) != -1) {
						$(this).show();
						$(this).children(".children").show();
						$(this).children(".expander").find("i").addClass("collapsed");
					}else {
						$(this).children(".children").hide();
						$(this).children(".expander").find("i").addClass("collapsed");
						$(this).hide();
					}
				});0.
				$.each($(".search-list"), function (){
					if ($(this).text().toLowerCase().indexOf(val.toLowerCase()) != -1) {
						let elements = $(this).find(".children .search-list");
						let hasHiddenAllChildren = true;
						for (let i = 0; i < elements.length; i++) {
							if (elements[i].style.display == "block" || !elements[i].style.display) {
								hasHiddenAllChildren = false;
							}
						}
						if (!hasHiddenAllChildren) {
							$(this).children(".expander").find("i").removeClass("collapsed");
						}
					}
				});
				$scope.noResultsFound = ($("#hierarchical-tree").text().toLowerCase().indexOf(val.toLowerCase()) == -1);
				$scope.searched = true;
			}
		}
		$scope.redrawTree = function () {
			$scope.noResultsFound = false;
			$(".not-first-level").hide();
			$(".search-list").show();
			$(".search-list").find(".expander i").addClass("collapsed");
		}
	}

]);
