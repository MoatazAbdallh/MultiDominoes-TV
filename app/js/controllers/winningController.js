//This Controller will wait until we have minumim no. of players required to start game & then the start button will be appeared.
app.controller('winningController', ['$scope', 'FocusHandlerFactory', 'Utils', '$rootScope', '$state', function ($scope, FocusHandlerFactory, Utils, $rootScope, $state) {
    var TAG = "Winning View";
    var _THIS = this;

    Utils.log("Intializing", TAG);
    $rootScope.setControllerFocus(_THIS);
    $scope.index = 0;
    document.getElementById("anchor_main").focus();

    $scope.channel.removeAllListeners("message")
    $scope.channel.on("message", function (msg, client) {
        $scope.data = JSON.parse(msg);
        //in case continue button has been pressed from mobile
     if ($scope.data.type == "continuePlay" && $scope.data.flag == true){
        Utils.log("recieved Continue Play form Mobile", TAG);
        $rootScope.continue();
    }
        //in case exit button has been pressed from mobile
     else if ($scope.data.type == "exitPlay" && $scope.data.flag == true) {
         $scope.exit();
     }
        
    });

    $rootScope.continue = function () {
        $rootScope.DominoGame = null;
        $rootScope.safeApply($scope);
        $rootScope.start();
    }

    //$scope.keyAction = function () {
    //    switch ($scope.index) {
    //        case 0:
    //            $scope.continue();
    //            break;
    //        case 1:
    //            $scope.exit();
    //            break;
    //    }
    //}
    $scope.return = function () {
        $state.go('menu');
    }
    //$scope.highlight = function (index) {
    //    Utils.log("Highlight Index" + index, TAG);
    //    $rootScope.safeApply($scope);
    //    switch (index) {
    //        case 0:
    //            $scope.index = 0;
    //            $('.return').css('background-image', "url('../images/Return-Button.png')")
    //            $('.continue').css('background-image', "url('../images/PlayAgain-Button-HL.png')")
    //            break;
    //        case 1:
    //            $scope.index = 1;
    //            $('.continue').css('background-image', "url('../images/PlayAgain-Button.png')")
    //            $('.return').css('background-image', "url('../images/Return-Button-HL.png')")

    //            break;
    //    }
    //    $rootScope.safeApply($scope);
    //}
    //$scope.highlight(0);
    this.handleKeyDown = function (keyCode,event) {
        Utils.log("handleKeyDown(" + keyCode + ")", TAG);
        switch (keyCode) {
            case tvKey.KEY_UP:
                //if ($scope.index == 1) {
                //    $scope.index = 0;
                //    $scope.highlight($scope.index);
                //}

                break;
            case tvKey.KEY_DOWN:
                //if ($scope.index == 0) {
                //    $scope.index = 1;
                //    $scope.highlight($scope.index);
                //}
                break;
            case tvKey.KEY_ENTER:
            case tvKey.KEY_PANEL_ENTER:
                //$scope.keyAction();
                $rootScope.continue();
                break;

            case tvKey.KEY_RETURN:
            case tvKey.KEY_PANEL_RETURN:
                widgetAPI.blockNavigation(event);
                $scope.exit();
                break;
        }
    };

}]);