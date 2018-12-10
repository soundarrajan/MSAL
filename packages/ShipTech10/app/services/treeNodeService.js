/*
 * @Author: Irinel N
 * @Date:   2017-09-26 17:56:00
 * @Last Modified by:   Irinel N
 * @Last Modified time: 2017-10-10 18:12:44
 */
angular.module('shiptech').service('HierarchyNodeService', [function() {
    function lowerCase(str) {
        return str.split(' ').map(function(e) {
            return e.toString().toLowerCase();
        }).join(' ');
    }

    function treeSearch(tree, query) {
        if (!tree) {
            return {};
        }
        if (lowerCase(tree.name).indexOf(lowerCase(query)) > -1) {
            tree.match = true;
            return tree;
        }
        var branches = _.reduce(tree.children, function(acc, leaf) {
            var newLeaf = treeSearch(leaf, query);
            if (!_.isEmpty(newLeaf)) {
                acc.push(newLeaf);
            }
            return acc;
        }, []);
        if (_.size(branches) > 0) {
            var trunk = _.omit(tree, 'children');
            trunk.children = branches;
            return trunk;
        }
        return {};
    }

    function getAllChildren(node, arr) {
        if (!node) return;
        arr.push(node);
        if (node.children) {
            //if the node has children call getSelected for each and concat to array
            node.children.forEach(function(childNode) {
                arr = arr.concat(getAllChildren(childNode, []))
            })
        }
        return arr;
    }

    function findParent(node, parent, targetNode, cb) {
        if (_.isEqual(node, targetNode)) {
            cb(parent);
            return;
        }
        if (node.children) {
            node.children.forEach(function(item) {
                findParent(item, node, targetNode, cb);
            });
        }
    }

    function getSelected(node, arr) {
        if (!node) return [];
        //if this node is selected add to array
        if (node.isSelected) {
            arr.push(node);
            // return arr;
        }
        if (node.children) {
            //if the node has children call getSelected for each and concat to array
            node.children.forEach(function(childNode) {
                arr = arr.concat(getSelected(childNode, []))
            })
        }
        return arr;
    }

    function selectChildren(children, val) {
        //set as selected
        children.isSelected = val;
        if (children.children) {
            //recursve to set all children as selected
            children.children.forEach(function(el) {
                selectChildren(el, val);
            })
        }
    }

    function trimLeafs(node, parent) {
        if (!node.children) {
            //da end of the road
            delete parent.children;
        } else {
            node.children.forEach(function(item) {
                trimLeafs(item, node);
            })
        }
    }
    return {
        getAllChildren: getAllChildren,
        getSelected: getSelected,
        selectChildren: selectChildren,
        trimLeafs: trimLeafs,
        treeSearch: treeSearch,
        findParent: findParent
    };
}])