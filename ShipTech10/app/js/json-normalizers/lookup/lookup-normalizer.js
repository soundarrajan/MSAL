/**
* Implements normalizing data obtained from server as JSON, to be used in vessel lookups.
* @param {JSON} data - The vessel data JSON:
*/

function normalizeJSONLookupData(data) {
    let result = [];

    $.each(data, (index, item) => {
        result.push(item.name);
    });

    return result;
}

function normalizeJSONRequestsLookupData(data) {
    let result = [];

    $.each(data, (index, item) => {
        result.push(item.name);
    });

    return result;
}
