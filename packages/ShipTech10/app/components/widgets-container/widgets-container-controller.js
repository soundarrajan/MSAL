angular.module('shiptech').controller('WidgetsContainerController', ['$scope', function($scope) {

    this.options = {
        cellHeight: 110,
        verticalMargin: 20
    };

    this.kpiOptions = {
        cellHeight: 110,
        verticalMargin: 10
    };

    var scrollHeightDifference;

    this.onResizeStart = function(event, ui){
    	var portlet = ui.element.find(".portlet");
        var scrollDiv = ui.element.find(".slimScrollDiv");
        var portletHeight = portlet.height();
        var scrollHeight = scrollDiv.height();
        scrollHeightDifference = portletHeight - scrollHeight;
    };

    this.onResizeStop = function(event, ui) {
        var portlet = ui.element.find(".portlet");
        var scrollDiv = ui.element.find(".slimScrollDiv");
        var innerScrollDiv = ui.element.find(".scroller");
        var portletHeight = portlet.height();
        var newScrollHeight = portletHeight - scrollHeightDifference;
        scrollDiv.height(newScrollHeight);
        innerScrollDiv.height(newScrollHeight);
    };

    this.deleteWidget = function(event) {
        var gridstack = $(event.currentTarget).closest(".grid-stack");
        var widget = $(event.currentTarget).closest(".grid-stack-item");
        
        gridstack.data('gridstack').removeWidget(widget);
    };

}]);

