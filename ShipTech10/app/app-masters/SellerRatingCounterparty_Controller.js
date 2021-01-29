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
				if (response) {
					callback(response);
				} else {
                    toastr.error('An error has occured!');
				}
    
    		});

		}

		$scope.mappedRating = function(applications, sellerRatingReviewCategories) {
			for (let i = 0; i < applications.length; i++) {
				for (let j = 0; j < applications[i].categories.length; j++) {
					let currentCategory = applications[i].categories[j];
					let findCategory = _.find(sellerRatingReviewCategories, function(object) {
						return object.sellerRatingCategoryId == currentCategory.id;
					});
					if (findCategory) {
						applications[i].categories[j].createdOn = findCategory.createdOn;
						applications[i].categories[j].createdBy = findCategory.createdBy;
						applications[i].categories[j].sellerRatingReviewCategoryId = findCategory.id;
						for (let k = 0; k < applications[i].categories[j].details.length; k++) {
							let currentDetail =  applications[i].categories[j].details[k];
							let findDetail = _.find(findCategory.details, function(object) {
								return object.sellerRatingCategoryDetailId == currentDetail.id;
							});
							if (findDetail) {
								applications[i].categories[j].details[k].rating = findDetail.rating;
								applications[i].categories[j].details[k].comments = findDetail.comments;
								applications[i].categories[j].details[k].sellerRatingReviewDetailId = findDetail.id;
							}
						}
					}				
				}
			}
		}

		vm.getData(function (response) {
			$scope.formValues.applications = {};
			$scope.formValues.applications = response;
			Factory_Master.getSellerRatingReview($scope.entity_id, (response) => {
				if (response) {
					$scope.formValues.sellerRatingReviewCategories = response.sellerRatingReviewCategories;
					$scope.formValues.applications.counterparty = response.counterParty;
					$scope.mappedRating($scope.formValues.applications, $scope.formValues.sellerRatingReviewCategories);				
				} else {
					toastr.error('An error has occured!');
				}
			})
	

			console.log($scope.formValues.applications1);
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
        	$scope.formValues.applications[locationKey].categories[categoryKey].newCreatedBy = $rootScope.user;
        	$scope.formValues.applications[locationKey].categories[categoryKey].newCreatedOn = moment().format();
        	$scope.$apply();
        }


        $scope.changeNameAndDate = function(category) {
        	category.createdOn = moment().format();
        	category.createdBy = $rootScope.user;
        }


        $scope.save = function() {
        	$scope.formValues.sellerRatingReviewCategories = [];
        	for (let i = 0; i < $scope.formValues.applications.length; i++) {
        		for (let j = 0; j < $scope.formValues.applications[i].categories.length; j++) {
        			const categoryModel = {
    					'id': $scope.formValues.applications[i].categories[j].sellerRatingReviewCategoryId ? $scope.formValues.applications[i].categories[j].sellerRatingReviewCategoryId : 0,
    					'sellerRatingCategoryId':  $scope.formValues.applications[i].categories[j].id,
    					'createdOn': $scope.formValues.applications[i].categories[j].newCreatedOn ? $scope.formValues.applications[i].categories[j].newCreatedOn  :  $scope.formValues.applications[i].categories[j].createdOn,
    					'createdBy': $scope.formValues.applications[i].categories[j].newCreatedBy ? $scope.formValues.applications[i].categories[j].newCreatedBy : $scope.formValues.applications[i].categories[j].createdBy,
    					'details': null
        			};
        			let ratingDetails = [];
        			for (let k = 0; k < $scope.formValues.applications[i].categories[j].details.length; k++) {
        				const model = {
        					'id': $scope.formValues.applications[i].categories[j].details[k].sellerRatingReviewDetailId ? $scope.formValues.applications[i].categories[j].details[k].sellerRatingReviewDetailId : 0,
        					'sellerRatingCategoryDetailId': $scope.formValues.applications[i].categories[j].details[k].id,
        					'rating':  $scope.formValues.applications[i].categories[j].details[k].rating ? $scope.formValues.applications[i].categories[j].details[k].rating : null,
        					'comments': $scope.formValues.applications[i].categories[j].details[k].comments ? $scope.formValues.applications[i].categories[j].details[k].comments : null
        				};
        				ratingDetails.push(model);
        			}
        			categoryModel.details = ratingDetails;
        			$scope.formValues.sellerRatingReviewCategories.push(categoryModel);
        			console.log(ratingDetails);
        		}
        	}

        	$scope.formValues.sellerRatingReviewCategories = _.filter($scope.formValues.sellerRatingReviewCategories, function(object) {
        		return object.createdBy && object.createdOn;
        	});

        	payload = { 
                'sellerRatingReviewCategories': $scope.formValues.sellerRatingReviewCategories,
                'counterparty': {
                	'id': $scope.entity_id
              	}
            };
            screenLoader.showLoader();
            Factory_Master.updateSellerRatingReview(payload, (response) => {
            	if (response) {
                    toastr.success('Operation completed successfully');
                    screenLoader.hideLoader();
                    $state.reload();
                } else {
                    toastr.error('Could not save rating!');
                    screenLoader.hideLoader();
                }
    		});

    		console.log($scope.formValues.applications);
        	console.log($scope.formValues);
        }


        $scope.discardChanges = function() {
        	$state.reload();
        }

	}

]);
