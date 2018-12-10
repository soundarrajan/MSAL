angular.module("shiptech").service("getExternalFilters", ['Factory_Master', function(Factory_Master) {
    function getFiltersList(entity_id, app_id, screen_id, clc_id) {
        var filters = [];

        // 1. documenttype entity_documents
        debugger;
        if(screen_id == 'documenttypelist' && clc_id == 'entity_documents'){
            // filter based on templates transaction type
            Factory_Master.get_master_entity(entity_id, screen_id, app_id, function(callback) {

                if (callback) {
                    var transactionTypes = [];
            
                    $.each(callback.templates, function(key,val){
                        var transactionType = {
                            id: val.transactionType.id,
                            name: val.transactionType.name,
                            code: "",
                            collectionName: null
                        };
                        transactionTypes.push(transactionType);
                    });

                    return transactionTypes;
                }
            });
        }

        // return filters;
    }


    function hasFilters(screen_id, clc_id){
        var map = {
            'documenttypelist': {
                'entity_documents': true
            }
        }
        return map[screen_id][clc_id];
    }



    return {
        getFiltersList: getFiltersList,
        hasFilters: hasFilters
    };
}]);
