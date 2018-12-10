/**
* Implements normalizing data obtained from server as JSON, to be used in vessel lookups.
* @param {JSON} data - The vessel data JSON:
*/

function normalizeJSONLookupData(data) {
    
    var result = [];
    
    $.each(data, function(index, item){
        result.push(item.name);
    }); 

    return result;
}

function normalizeJSONRequestsLookupData(data) {
    
    var result = [];
    
    $.each(data, function(index, item){
        result.push(item.name);
    }); 

    return result;
}