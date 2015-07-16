//This Controller will wait until we have minumim no. of players required to start game & then the start button will be appeared.
app.controller('qrController', ['$scope', 'FocusHandlerFactory', 'Utils', '$rootScope', '$state', function ($scope, FocusHandlerFactory, Utils, $rootScope, $state) {
        var TAG = "Rules View";
        var _THIS = this;
        document.getElementById("anchor_main").focus();
        Utils.log("Intializing", TAG);
        $rootScope.setControllerFocus(_THIS);
        $scope.return = function () {
            $state.go('menu');
        }
        
        $.ajax({
            url: "http://esprit-solutions.com/apps/multidominoes/devices.json",
            method: "GET",
            success: function (data) {
                $scope.ios = JSON.parse(data).ios;
                $scope.windows = JSON.parse(data).windows;
                $rootScope.safeApply($scope)
            }
        })
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
                    console.log("Rules Return")
                    widgetAPI.blockNavigation(event);
                    $scope.return();
                    break;
            }
        };

    }]);