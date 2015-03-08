//This Controller will wait until we have minumim no. of players required to start game & then the start button will be appeared.
app.controller('winningController', ['$scope', 'FocusHandlerFactory', 'Utils', '$rootScope', '$state', function ($scope, FocusHandlerFactory, Utils, $rootScope, $state) {
        var TAG = "Winning View";
        var _THIS = this;

        Utils.log("Intializing", TAG);
        $rootScope.setControllerFocus(_THIS);
    
        $rootScope.continue = function () {
            $scope.destroy();
            $rootScope.start();
        }
        $rootScope.exit = function () {
            widgetAPI.sendReturnEvent();
        }
        $scope.highlight = function (index) {
            Utils.log("Highlight Index" + index, TAG);
            $rootScope.safeApply($scope);
            switch (index) {
                case 0:
                    $('.exit').css('border-color', '#fff')
                    $('.continue').css('border-color', '#00ccff')
                    break;
                case 1:
                    $('.continue').css('border-color', '#fff')
                    $('.exit').css('border-color', '#00ccff')
                    break;
            }
        }
        $scope.highlight(0);
        this.handleKeyDown = function (keyCode) {
        Utils.log("handleKeyDown(" + keyCode + ")", TAG);
            switch (keyCode) {
                case tvKey.KEY_UP:
                    break;
                case tvKey.KEY_DOWN:
                    break;
                case tvKey.KEY_ENTER:
                case tvKey.KEY_PANEL_ENTER:
                    $scope.start();
                    break;

                case tvKey.KEY_RETURN:
                case tvKey.KEY_PANEL_RETURN:
                    break;
            }
        };

    }]);