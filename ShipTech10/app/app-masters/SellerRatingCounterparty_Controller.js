/**
 * Seller_Rating_Counterparty Controller
 */

APP_MASTERS.controller('Master_Seller_Rating_Counterparty', [
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
		$scope.entity_id = $state.params.entity_id;
		$scope.location_id = $state.params.location_id;
		$scope.options = [];
		$scope.tenantSettings = $tenantSettings;


		vm.getData = function (callback) {
			payload = {
				"locationId": $scope.location_id,
				"moduleId": 12
			}
			Factory_Master.getSellerRatingConfig(payload, (response) => {
            	callback(response);
    		});

		}

		vm.getData(function (response) {
			$scope.formValues.applications = {};
			$scope.formValues.applications = response;
			// $scope.formValues.applications1 = {
			// 	"allLocations": null,
			// 	"specificLocations": null
			// }
	  //     	console.log($scope.formValues.applications, $scope.formValues.applications1);
	  //     	if ($scope.formValues.applications1.allLocations) {
	  //     		angular.merge($scope.formValues.applications, $scope.formValues.applications1);
	  //     	}
	      	console.log($scope.formValues.applications);
			// initExpanders()

		})

 		$scope.formatDateTime = function(elem) {
            if (elem) {
                var dateFormat = $scope.tenantSettings.tenantFormats.dateFormat.name;
            	let hasDayOfWeek = false;
	            if (dateFormat.startsWith('DDD ')) {
	            	hasDayOfWeek = true;
	            	dateFormat = dateFormat.split('DDD ')[1];
	            }
                dateFormat = dateFormat.replace(/D/g, 'd').replace(/Y/g, 'y');
                formattedDate = $filter('date')(elem, dateFormat);
                if (hasDayOfWeek) {
                	formattedDate = `${moment.utc(elem).format('ddd') } ${ formattedDate}`;
                }
                if (formattedDate.endsWith('00:00')) {
                	formattedDate = formattedDate.split('00:00')[0];
                }
                return formattedDate;
            }
        };


        $scope.rating = function() {
			//or for example
			let options = {
				min_value: 1,
			    max_value: 5,
			    step_size: 1,
    			initial_value: 0,
			}
			$(".rating").rate(options);
			let rating = $(".rating");
			for (let i = 0; i < rating.length; i++) {
				let rate =  $(rating[i]).attr("rating");
				if (Number(rate) > 0) {
					$(rating[i]).rate("setValue", Number(rate));
				}			
			}
        }

        $scope.setRating = function() {
			let rating = $(".rating");
			for (let i = 0; i < rating.length; i++) {
				let rate =  $(rating[i]).attr("rating");
				if (Number(rate) &&  $(event).rate("getValue") != 0) {
					$(rating[i]).rate("setValue", Number(rate));
				}			
			}
        }

		    
        window.setModelOfRatingForSpecificLocation = function(event) {
        	let locationKey =  JSON.parse($(event).attr("location-key"));
        	let categoryKey =  JSON.parse($(event).attr("category-key"));
        	let detailKey =  JSON.parse($(event).attr("detail-key"));
        	console.log(locationKey, categoryKey, detailKey);
        	$scope.formValues.applications[locationKey].categories[categoryKey].details[detailKey].rating = $(event).rate("getValue");
        	console.log($scope.formValues.applications[locationKey].categories[categoryKey].details[detailKey].rating);
        	$scope.$apply();
        }

        window.changeNameAndDateForSpecificLocation = function(event) {
        	let locationKey =  JSON.parse($(event).attr("location-key"));
        	let categoryKey =  JSON.parse($(event).attr("category-key"));
        	let detailKey =  JSON.parse($(event).attr("detail-key"));
        	console.log(locationKey, categoryKey, detailKey);
        	$scope.formValues.applications[locationKey].categories[categoryKey].createdBy = $rootScope.user;
        	$scope.formValues.applications[locationKey].categories[categoryKey].createdOn = moment().format();
        	$scope.$apply();
        }


        $scope.save = function() {
        	$scope.formValues.applicationsSave = angular.copy($scope.formValues.applications);
    		for (let i = 0; i < $scope.formValues.applicationsSave.specificLocations.length; i++) {
    			for (let j = 0; j < $scope.formValues.applicationsSave.specificLocations[i].categories.length; j++) {
    				console.log($scope.formValues.applicationsSave.specificLocations[i].categories[j]);
    				const model = {
    					'details': null,
    					'createdBy': null,
    					'createdOn': null,
    					'id': null
    				}
    				const value = _.pick($scope.formValues.applicationsSave.specificLocations[i].categories[j], _.keys(model));
    				console.log(value);
    				$scope.formValues.applicationsSave.specificLocations[i].categories[j] = angular.copy(value);
    				for (let k = 0; k < $scope.formValues.applicationsSave.specificLocations[i].categories[j].details.length; k++) {
    					if (!$scope.formValues.applications1.specificLocations) {
    						$scope.formValues.applicationsSave.specificLocations[i].categories[j].details[k].detailId = $scope.formValues.applicationsSave.specificLocations[i].categories[j].details[k].id;
    						$scope.formValues.applicationsSave.specificLocations[i].categories[j].details[k].id = 0;
    					}
    					const model1 = {
        					'detailId': null,
        					'rating': null,
        					'id': null,
        					'comments': null
    					}
        				const detailValue = _.pick($scope.formValues.applicationsSave.specificLocations[i].categories[j].details[k], _.keys(model1));
        				$scope.formValues.applicationsSave.specificLocations[i].categories[j].details[k] = angular.copy(detailValue);
    				}
    			}
    		}

    		for (let i = 0; i < $scope.formValues.applicationsSave.allLocations.categories.length; i++) {
				console.log($scope.formValues.applicationsSave.allLocations.categories[i]);
				const model = {
					'details': null,
					'createdBy': null,
					'createdOn': null,
					'id': null
				}
				const value = _.pick($scope.formValues.applicationsSave.allLocations.categories[i], _.keys(model));
				console.log(value);
				$scope.formValues.applicationsSave.allLocations.categories[i] = angular.copy(value);
				for (let k = 0; k < $scope.formValues.applicationsSave.allLocations.categories[i].details.length; k++) {
					if (!$scope.formValues.applications1.allLocations) {
						$scope.formValues.applicationsSave.allLocations.categories[i].details[k].detailId = $scope.formValues.applicationsSave.allLocations.categories[i].details[k].id;
						$scope.formValues.applicationsSave.allLocations.categories[i].details[k].id = 0;
					}
					const model1 = {
    					'detailId': null,
    					'rating': null,
    					'id': null,
    					'comments': null
					}
    				const detailValue = _.pick($scope.formValues.applicationsSave.allLocations.categories[i].details[k], _.keys(model1));
    				$scope.formValues.applicationsSave.allLocations.categories[i].details[k] = angular.copy(detailValue);
				}
       		}
    		console.log($scope.formValues.applications);
        	console.log($scope.formValues);
        	//$state.reload();
        }


        $scope.discardChanges = function() {
        	$state.reload();
        }
	}

]);
