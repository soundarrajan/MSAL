angular.module('shiptech.models')
.factory('listsModel', ['listsResource', 'listsSupplierPortalResource', 'specGroupResource','payloadDataModel','productsResource', 
    function (listsResource, listsSupplierPortalResource, specGroupResource, payloadDataModel,productsResource) {
    
    var request_data;

    function listsModel(data) {
        result = {};

        for (var i=0; i<data.length; i++) {
            list = data[i];

            result[list.name] = list.items;
        }

        angular.extend(this, result);
    }

    /**
    * Retrieve all lists
    * @return {object} all lists.
    */
    function get() {
        if (angular.module("shiptech").value("$listsCache")) {
            return angular.module("shiptech").value("$listsCache");
        }

        request_data = payloadDataModel.create();

        return listsResource.get(request_data).$promise.then(function (data) {
            return new listsModel(data);
        });
    }

    // get spec group by products
    function getSpecGroupByProduct(productId,id,id2) {
        var payload = {
            "Filters": [{
                "ColumnName": "ProductId",
                "Value": productId
            }],
        };
        request_data = payloadDataModel.create(payload);
        return specGroupResource.getSpecsByProduct(request_data).
        $promise.
        then(function (data) {
            return { "data": data, "id":id, "id2":id2 };
        });
    }
    function getSpecGroupByProductAndVessel(productId,vesselId,id,id2) {
        var payload = {
            "Filters": [
	            {
	                "ColumnName": "ProductId",
	                "Value": productId
	            },{
	                "ColumnName": "VesselId",
	                "Value": vesselId
	            }
            ],
        };
        request_data = payloadDataModel.create(payload);
        return specGroupResource.getSpecGroupByProductAndVessel(request_data).
        $promise.
        then(function (data) {
            return { "data": data, "id":id, "id2":id2 };
        });
    }

    function getProductTypeByProduct(productId,id,id2)  {
        var payload = {
            "Filters": [{
                "ColumnName": "ProductId",
                "Value": productId
            }],
        };
        request_data = payloadDataModel.create(payload);
        return productsResource.getProductTypeByProduct(request_data).
        $promise.
        then(function (data) {
            return { "data": data, "id":id, "id2":id2 };
        });
    }

    /**
    * Retrieve all lists
    * @return {object} all lists.
    */
    function getForSupplierPortal(token) {
        request_data = {
            Token: token
        };

        return listsSupplierPortalResource.get(request_data).$promise.then(function (data) {
            return new listsModel(data);
        });
    }

    // return public model API  
    return {
        get: get,
        getForSupplierPortal: getForSupplierPortal,
        getProductTypeByProduct: getProductTypeByProduct,
        getSpecGroupByProductAndVessel: getSpecGroupByProductAndVessel,
        getSpecGroupByProduct: getSpecGroupByProduct
	};

}]);