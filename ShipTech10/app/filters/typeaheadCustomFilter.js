
(function() {
    'use strict';

    angular.module('shiptech.pages').filter('typeaheadCustomFilter', function () {
    	return function (items, searchTerm, objProperty) {
    		if (!objProperty) {
    			objProperty = "name";
    		}
    		searchTerm = searchTerm.toLowerCase()
    		var filtered = angular.copy(items);
			for (var i = filtered.length - 1; i >= 0; i--) {
				var item = filtered[i];
				if (!item || item.id == -1) {
					continue;
				}
				if (item[objProperty].toLowerCase().indexOf(searchTerm) == -1) {
	    			filtered.splice(i,1); 
    			}
			}
    		filtered = _.orderBy(filtered, function(item){
				if (item) {
					if (item[objProperty]) {
		    			if (item[objProperty].toLowerCase().indexOf(searchTerm) != -1) {
			    			return item[objProperty].toLowerCase().indexOf(searchTerm); 
		    			}
					}
				}
    		}, ['asc']);
            console.log(filtered);
            filtered = _.filter(filtered, function(object) {
                return typeof(object) !=  "undefined";
            });
    		console.log(items);
    		console.log(filtered);
    		console.log(searchTerm, objProperty);
    		if (!filtered[0]) {
    			return [];
    		}
            if (filtered[0].searchString == 'No options available!') {
                return [];
            }
    		return filtered.slice(0,10);
    	};
    });

}());
