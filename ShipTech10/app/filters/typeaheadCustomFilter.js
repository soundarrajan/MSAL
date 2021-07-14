
(function() {
    'use strict';

    angular.module('shiptech.pages').filter('typeaheadCustomFilter', function () {

		function htmlDecode(input) {
			var doc = new DOMParser().parseFromString(input, "text/html");
			return doc.documentElement.textContent;
		  }


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
					// Item doesn't have searchTerm
	    			filtered.splice(i,1);
    			} else {
					// Escape html
					item.name = htmlDecode(item.name);
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

            filtered = _.filter(filtered, function(object) {
                return typeof(object) !=  "undefined";
            });
    		if (!filtered[0]) {
    			return [];
    		}
            if (filtered[0].searchString == 'No options available!') {
                return [];
            }

			const finalResponse = filtered.slice(0,10);
    		return finalResponse
    	};
    });

}());
