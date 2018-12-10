angular.module('shiptech.models')
.factory('screenActionsModel', [ '$filter', function ($filter) {
 
    /**
    * Intersect possible screen actions with a list of product actions to get the joint screen actions
    * @param {Array} screenLayoutActions - Possible screen layout actions.
    * @param {Array} productActions - list of product actions.
    * @return {Array} - Joint list of actions 
    */
    function intersectActionLists(screenLayoutActions, productActions) {

        var screenActions = [];
        var crosscheckAction, actionsInList;
        if (screenLayoutActions) {
            for (var i = screenLayoutActions.length - 1; i >= 0; i--)   {
                if (screenLayoutActions[i].isCrosschekRequired) {
                    actionsInList = [];
                    actionsInList = $filter("filter")(productActions, {id: screenLayoutActions[i].mappedScreenActionId}, true);    
                    if (actionsInList && actionsInList.length > 0) {
                        screenActions.push(screenLayoutActions[i]);
                    }
                } else {
                    screenActions.push(screenLayoutActions[i]);
                }
            }
        }

        return screenActions;

    }

    /**
    * Intersect two lists of product actions 
    * @param {Array} productActionList - list of product actions.
    * @param {Array} secondProductActionList - list of product actions.
    * @return {Array} - Joint list of actions 
    */
    function intersectProductActionLists(productActionList, secondProductActionList) {
        var intersectedActions = [];
        var actionsInList;
        if (productActionList) {
            for (var i = productActionList.length - 1; i >= 0; i--)   {
                actionsInList = [];
                actionsInList = $filter("filter")(secondProductActionList, {id: productActionList[i].id}, true);    
                if (actionsInList && actionsInList.length > 0) {
                    intersectedActions.push(productActionList[i]);
                }
            }
        }

        return intersectedActions;
    }

    /**
    * Extract all actions from a list of products
    * @param {Array} productList - list of products as ProductDTOs
    * @return {Array} - Joint list of actions 
    */
    function getActionsFromProductList(productList) {
        var actionList, actions;
        if (!angular.isArray(productList) || productList.length <= 0) {
            return null;
        }

        actionList = productList[0].screenActions;

        for (var i = 1; i < productList.length; i++) {
            actions = productList[i].screenActions;
            actionList = intersectProductActionLists(actionList, actions);
        }

        return actionList;
    }

    /**
    * Combine screen actions with a list of actions taken from a product to get the joint screen actions
    * @param {Array} screenLayoutActions - Possible screen layout actions.
    * @param {Array} product - product that provides extra actions
    * @return {Array} - Joint list of actions 
    */
    function addProductActionsToScreen(screenActions, product) {
        var productActions = getActionsFromProductList([product]);
        return intersectActionLists(screenActions, productActions);
    }

    /**
    * Check screen actions to see if save is enabled
    * @param {Array} screenActions - Possible screen layout actions.
    * @return {bool} - if save action is permitted
    */
    function canSave(screenActions) {
        if (screenActions) {
            for (var i=0; i< screenActions.length; i++) {
                if ((screenActions[i].mappedScreenActionName == "FullAccess") ||
                    (screenActions[i].mappedScreenActionName == "CreateNew") ||
                    (screenActions[i].mappedScreenActionName == "Edit")) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
    * Check screen actions to see if specified action is enabled
    * @param {Object} actions - action to search for
    * @param {Array} screenActions - Possible screen layout actions.
    * @return {bool} - if action is permitted
    */
    function hasAction(action, screenActions) {
        if (screenActions) {
            for (var i=0; i < screenActions.length; i++) {
                if (screenActions[i].mappedScreenActionName == action) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
    * Check product actions to see if specified action is enabled
    * @param {Object} actions - action to search for
    * @param {Array} productActions - Possible screen layout actions.
    * @return {bool} - if action is permitted
    */
    function hasProductAction(action, productActions) {
        if (productActions) {
            for (var i=0; i < productActions.length; i++) {
                if (productActions[i].name == action) {
                    return true;
                }
            }
        }

        return false;
    }


    // return public model API  
    return {
        intersectActionLists: intersectActionLists,
        intersectProductActionLists: intersectProductActionLists,
        getActionsFromProductList: getActionsFromProductList,
        addProductActionsToScreen: addProductActionsToScreen,
        canSave : canSave,
        hasAction : hasAction,
        hasProductAction : hasProductAction
    };

}]);