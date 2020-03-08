angular.module('shiptech').controller('WidgetsContainerController', [ '$scope', function($scope) {
    this.options = {
        cellHeight: 110,
        verticalMargin: 20
    };

    this.kpiOptions = {
        cellHeight: 110,
        verticalMargin: 10
    };

    let scrollHeightDifference;

    this.onResizeStart = function(event, ui) {
    	let portlet = ui.element.find('.portlet');
        let scrollDiv = ui.element.find('.slimScrollDiv');
        let portletHeight = portlet.height();
        let scrollHeight = scrollDiv.height();
        scrollHeightDifference = portletHeight - scrollHeight;
    };

    this.onResizeStop = function(event, ui) {
        let portlet = ui.element.find('.portlet');
        let scrollDiv = ui.element.find('.slimScrollDiv');
        let innerScrollDiv = ui.element.find('.scroller');
        let portletHeight = portlet.height();
        let newScrollHeight = portletHeight - scrollHeightDifference;
        scrollDiv.height(newScrollHeight);
        innerScrollDiv.height(newScrollHeight);
    };

    this.deleteWidget = function(event) {
        let gridstack = $(event.currentTarget).closest('.grid-stack');
        let widget = $(event.currentTarget).closest('.grid-stack-item');

        gridstack.data('gridstack').removeWidget(widget);
    };
} ]);

