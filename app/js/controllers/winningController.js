//This Controller will wait until we have minumim no. of players required to start game & then the start button will be appeared.
app.controller('winningController', ['$scope', 'FocusHandlerFactory', 'Utils', '$rootScope', '$state', function ($scope, FocusHandlerFactory, Utils, $rootScope, $state) {
    var TAG = "Winning View";
    var _THIS = this;

    Utils.log("Intializing", TAG);
    $rootScope.setControllerFocus(_THIS);
    $scope.index = 0;

    $scope.channel.removeAllListeners("message")
    $scope.channel.on("message", function (msg, client) {
        Utils.log("Recieving Message.....", TAG);

        $scope.data = JSON.parse(msg);
        //in case continue button has been pressed from mobile
     if ($scope.data.type == "continuePlay" && $scope.data.flag == true){
        Utils.log("recieved Continue Play form Mobile", TAG);
        $rootScope.continue();
    }
        //in case exit button has been pressed from mobile
    else if ($scope.data.type == "exitPlay" && $scope.data.flag == true)
        $rootScope.exit();
    });

    $rootScope.continue = function () {
        $rootScope.DominoGame = null;
        $rootScope.safeApply($scope);
        $rootScope.start();
    }
    $rootScope.exit = function () {
        widgetAPI.sendReturnEvent();
    }
    $scope.keyAction = function () {
        switch ($scope.index) {
            case 0:
                $scope.continue();
                break;
            case 1:
                $scope.exit();
                break;
        }
    }
    $scope.highlight = function (index) {
        Utils.log("Highlight Index" + index, TAG);
        $rootScope.safeApply($scope);
        switch (index) {
            case 0:
                $scope.index = 0;
                $('.exit').css('border-color', '#fff')
                $('.continue').css('border-color', '#00ccff')
                break;
            case 1:
                $scope.index = 0;
                $('.continue').css('border-color', '#fff')
                $('.exit').css('border-color', '#00ccff')
                break;
        }
        $rootScope.safeApply($scope);
    }
    $scope.highlight(0);
    this.handleKeyDown = function (keyCode) {
        Utils.log("handleKeyDown(" + keyCode + ")", TAG);
        switch (keyCode) {
            case tvKey.KEY_UP:
                if ($scope.index == 1) {
                    $scope.index = 0;
                    $('.exit').css('border-color', '#fff')
                    $('.continue').css('border-color', '#00ccff')
                    $rootScope.safeApply($scope);
                }

                break;
            case tvKey.KEY_DOWN:
                if ($scope.index == 0) {
                    $scope.index = 1;
                    $('.continue').css('border-color', '#fff')
                    $('.exit').css('border-color', '#00ccff')
                    $rootScope.safeApply($scope);
                }
                break;
            case tvKey.KEY_ENTER:
            case tvKey.KEY_PANEL_ENTER:
                $scope.keyAction();
                break;

            case tvKey.KEY_RETURN:
            case tvKey.KEY_PANEL_RETURN:
                widgetAPI.blockNavigation(event);
                $state.go('menu');
                break;
        }
    };

}]);