angular.module('shiptech').service('statusColors', [
        function() { 

            var defaultColor = '#ffffff';

            var colorCodes = {
              "BunkerStrategy": "#eb9b65",
              "NearingEta": "#889ec9",
              "Created": "#ad93cc",
              "ReOpen": "#C0C0C0",
              "Planned": "#6252b3",
              "PlannedVoid": "#DF0000",
              "Questionnaire": "#E1C9BA",
              "Validated": "#7bd4aa",
              "PartiallyInquired": "#CA0000",
              "Inquired": "#72e091",
              "Amended": "#4498d2",
              "PartiallyQuoted": "#d1d14b",
              "Quoted": "#87870b",
              "PartiallyStemmed": "#aed6af",
              "Stemmed": "#1AB01E",
              "Confirmed": "#a9d372",
              "PartiallyDelivered": "#f5c955",
              "Delivered": "#db7c00",
              "Cancelled": "#ee4535",
              "Overlapped": "#808080",
              "Redelivery": "#DF0000",
              "Approved": "#a9d372",
              "Completed": "#4498d2",
              "Discrepancy": "#ee4535",
              "Invoiced": "#a9d372",
              "New": "#373a37",
              "PartiallyInvoiced": "#4498d2",
              "Rejected": "#ee4535",
              "Resolved": "#a9d372",
              "Revoked": "#ee4535",
              "Sent": "#a9d372",
              "WaitingForApproval": "#f5c955",
              "Open": "#373a37",
              "NotVerified": "#4498d2",
              "Verified": "#a9d372",
              "Draft": "#bdbbbc",
              "Amend": "#a9d372",
              "Deleted": "#ee4535",
              "Expired": "#ee4535",
              "Matched": "#a9d372",
              "In Spec": "#a9d372",
              "Off Spec": "#ee4535",
              "Invalid": "#ee4535",
              "Passed": "#a9d372",
              "Yes": "#a9d372",
              "No": "#ee4535",
              "Unmatched": "#ee4535",
              "Failed": "#ee4535",
              "Pending": "#ffee00",
            };

            function getDefaultColor() {
                return defaultColor;
            }

            function getColorCode(statusName) {
                return colorCodes[statusName] || defaultColor;
            }

            function getColorCodeFromLabels(statusObj, labels) {
                for(var i = 0; i < labels.length; i++) {
                	if (statusObj) {
		                if(statusObj.id === labels[i].id && statusObj.transactionTypeId === labels[i].transactionTypeId) {
		                    return labels[i].code;
		                }
                	}
                }
                if (statusObj) {
	                return getColorCode(statusObj.displayName || statusObj.name);
                }
                return false;
            }

        return {
            getDefaultColor: getDefaultColor,
            getColorCode: getColorCode,
            getColorCodeFromLabels: getColorCodeFromLabels,
        };
    }
]);
