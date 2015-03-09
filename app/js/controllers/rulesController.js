//This Controller will wait until we have minumim no. of players required to start game & then the start button will be appeared.
app.controller('rulesController', ['$scope', 'FocusHandlerFactory', 'Utils', '$rootScope', '$state', function ($scope, FocusHandlerFactory, Utils, $rootScope, $state) {
        var TAG = "Rules View";
        var _THIS = this;

        Utils.log("Intializing", TAG);
        $rootScope.setControllerFocus(_THIS);

        this.handleKeyDown = function (keyCode,event) {
        Utils.log("handleKeyDown(" + keyCode + ")", TAG);
            switch (keyCode) {
                case tvKey.KEY_UP:
                    break;
                case tvKey.KEY_DOWN:
                    break;
                case tvKey.KEY_ENTER:
                case tvKey.KEY_PANEL_ENTER:
                    break;

                case tvKey.KEY_RETURN:
                case tvKey.KEY_PANEL_RETURN:
                    widgetAPI.blockNavigation(event);
                    $state.go('menu');
                    break;
            }
        };

    }]);