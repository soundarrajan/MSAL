angular.module('shiptech.models').factory('payloadDataModel', [function() {
    self = this;
    this.payload_data = {
        "IsValid": false,
        "TenantMongoDbUrl": null,
        "TenantId": null,
        // "UiFilters": {
        //     "VesselId": null,
        //     "ProductId": null,
        //     "LocationId": null,
        //     "StatusId": null,
        //     "AgreementTypeId": null,
        //     "BuyerId": null,
        //     "ServiceId": null
        // },
        "IsAuthorized": false
    };

    function create(data) {
        var payload = angular.copy(self.payload_data);
        if (typeof data != "undefined" && data !== null) {
            payload.Payload = data;
        }
        return payload;
    }
    // return public model API
    return {
        payload_data: self.payload_data,
        create: create
    };
}]);
