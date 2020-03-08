function DirectoryController() {
    console.log('DirectoryController');
}

angular.module('shiptech').component('directory', {
    templateUrl: 'components/sidebar/views/directory.html',
    controller: DirectoryController,
    bindings: {
        settings: '='
    }
});
