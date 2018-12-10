angular.module('shiptech.models').factory('emailModel', ['emailResource', 'payloadDataModel', 'newRequestResource',
    function(emailResource, payloadDataModel, newRequestResource) {
        function getTemplates(transactionId) {
          
            var payload = {
                "Filters": [{
                    "ColumnName": "EmailTransactionTypeId",
                    "Value": transactionId
                }]
            };
            request_data = payloadDataModel.create(payload);
            return emailResource.getTemplates(request_data).$promise.then(function(data) {
                return data;
            }).finally(function(){
              
            });
        }

        function saveComments(emailData, comment, template, extraFields) {
            if (typeof comment === "undefined" && comment === null) {
                return false;
            }
            var toOthers = null;
            var ccOthers = null;

            if (extraFields.toOthers) {
                toOthers = extraFields.toOthers;
            }
            else if (extraFields.toEmailOthers) {
                toOthers = extraFields.toEmailOthers;
            }


            if (extraFields.ccOthers) {
                ccOthers = extraFields.ccOthers;
            }
            else if (extraFields.ccEmailOthers) {
                ccOthers = extraFields.ccEmailOthers;
            }

            //make string --- string is used for send email; for save you need array
            // var toOthersString = "";
            // if(toOthers)
            //     toOthersString = toOthers.toString().replace(/;/g, "");

            // var ccOthersString = "";
            // if(ccOthers)
            //     ccOthersString = ccOthers.toString().replace(/;/g, "");
            


            var payload = {
                "id": comment.id,
                "name": comment.name,
                "emailTemplate": template,
                "businessId": emailData.businessId,
                "businessIds": emailData.businessIds,
                "secondBusinessId": emailData.secondBusinessId,
                "thirdBusinessId": emailData.thirdBusinessId,
                "isDeleted": false,
                "Content": extraFields.content,
                "To": extraFields.to,
                "Cc": extraFields.cc,
                "ToOthers": toOthers,
                "CcOthers": ccOthers,
                "From": extraFields.from,
            };
            request_data = payloadDataModel.create(payload);


            return emailResource.saveComments(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function saveForBusinessIds(emailData, comment, template, extraFields) {
            if (typeof comment === "undefined" && comment === null) {
                return false;
            }
            var toOthers = null;
            var ccOthers = null;

            if (extraFields.toOthers) {
                toOthers = extraFields.toOthers;
            }
            else if (extraFields.toEmailOthers) {
                toOthers = extraFields.toEmailOthers;
            }


            if (extraFields.ccOthers) {
                ccOthers = extraFields.ccOthers;
            }
            else if (extraFields.ccEmailOthers) {
                ccOthers = extraFields.ccEmailOthers;
            }
            var payload = {
                "id": comment.id,
                "name": comment.name,
                "emailTemplate": template,
                "businessId": emailData.businessId,
                "businessIds": emailData.businessIds.split(","),
                "secondBusinessId": emailData.secondBusinessId,
                "thirdBusinessId": emailData.thirdBusinessId,
                "isDeleted": false,
                "Content": extraFields.content,
                "To": extraFields.to,
                "Cc": extraFields.cc,
                "ToOthers": toOthers,
                "CcOthers": ccOthers,
                "From": extraFields.from,
            };
            request_data = payloadDataModel.create(payload);


            return emailResource.saveForBusinessIds(request_data).$promise.then(function(data) {
                return data;
            });
        }


        // function discardPreview(emailData, template) {
        //     var payload = {
        //         "EmailTemplateId": template.id,
        //         "businessId": emailData.businessId,
        //         "secondBusinessId": emailData.secondBusinessId,
        //         "thirdBusinessId": emailData.thirdBusinessId
        //     };
        //     request_data = payloadDataModel.create(payload);
        //     return emailResource.discardPreview(request_data).$promise.then(function(data) {
        //         return data;
        //     });
        // }

        function discardPreview(emailData,template){

            var formArray = function(str){
                var ids = str.split(",");
                $.each(ids, function(key,value){
                    ids[key] = parseInt(value);
                })
                return ids;
            }
            var payload = {
                "EmailTemplateId": template.id,
                "businessId": emailData.businessId,
                "businessIds": formArray(emailData.businessIds),
            };
            request_data = payloadDataModel.create(payload);
            return emailResource.discardPreview(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function sendEmail(email, template) {
            
            if (typeof email === "undefined" && email === null) {
                return false;
            }
            if (!email.to) return false;
            var toString = [],
                ccString = [],
                toOthersString = [],
                ccOthersString = [];

            $.each(email.to, function(k, v) {
                toString.push(v.idEmailAddress);
            })
      
            if (email.cc) {
                
                $.each(email.cc, function(k, v) {
                    ccString.push(v.idEmailAddress);
                })
            } else {
                email.cc = null
            }
            toString = toString.toString();
            ccString = ccString.toString();

            if(typeof email.toOthers == 'string'){
                toOthersString = email.toOthers;
            }else{
                $.each(email.toOthers, function(k, v) {
                    toOthersString.push(v);
                });
                toOthersString = toOthersString.toString();
            }
            if(typeof email.ccOthers == 'string'){
                ccOthersString = email.ccOthers;
            }else{
                $.each(email.ccOthers, function(k, v) {
                    ccOthersString.push(v);
                });
                ccOthersString = ccOthersString.toString();
            }


            var payload = {
                "subject": email.subject,
                "content": email.content,
                "to": toString,
                "cc": ccString,
                "from": email.from,
                "businessId": email.businessId,
                "businessIds": email.businessIds,
                "comment": email.comment,
                "EmailTemplateId": template.id,
                "ToOthers": toOthersString,
                "CcOthers": ccOthersString
            };
            if (typeof(email.attachments) != 'undefined') {
                payload.attachments = email.attachments;
            }
            request_data = payloadDataModel.create(payload);
            return emailResource.sendEmail(request_data).$promise.then(function(data) {
                return data;
            });
        }


        function sendContractPlanningEmail(data) {
            var payload = {
                "Filters": [{
                    "ColumnName": "RequestId",
                    "Value": data.requestId
                }, {
                    "ColumnName": "LocationId",
                    "Value": data.locationId
                }, {
                    "ColumnName": "ProductId",
                    "Value": data.productId
                }, {
                    "ColumnName": "TemplateName",
                    "Value": "ContractPlanningEmailTemplate"
                }]
            }
            request_data = payloadDataModel.create(payload);
            // request_data.Payload = null;
            return newRequestResource.sendContractPlanningEmail(request_data).$promise.then(function(data) {
                return data;
            });
        }

        // return public model API
        return {
            getTemplates: getTemplates,
            saveComments: saveComments,    
            saveForBusinessIds: saveForBusinessIds,    
            discardPreview: discardPreview,
            sendEmail: sendEmail,
            sendContractPlanningEmail: sendContractPlanningEmail
        };
    }
]);