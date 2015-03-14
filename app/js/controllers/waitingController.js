//This Controller will wait until we have minumim no. of players required to start game & then the start button will be appeared.
app.controller('waitingController', ['$scope', 'FocusHandlerFactory', 'Utils', '$rootScope', '$state', function ($scope, FocusHandlerFactory, Utils, $rootScope, $state) {
        var TAG = "Waiting View";
        var _THIS = this;

        Utils.log("Intializing", TAG);
        $rootScope.setControllerFocus(_THIS);

        $rootScope.start = function () {
            $rootScope.gameStartedFlag = true;
            $rootScope.DominoGame = new window.Game();
            $rootScope.DominoGame.playersLength = $scope.playersLength;
            $rootScope.DominoGame.shuffle();
            $rootScope.DominoGame.deal();
            $.each($scope.clients, function (i, client) {
                $rootScope.DominoGame.players[i].name = client.attributes.name;
                client.send(JSON.stringify({ type: "cards", cards: $rootScope.DominoGame.players[i].cards }), true);
            });
            $state.go('game');
           
        }
        $scope.checkStart = function () {
            if ($scope.playersLength > 1)
                $scope.start();
        }
        $scope.channel.removeAllListeners("message")
        $scope.channel.on("message", function (msg, client) {
            $scope.data = JSON.parse(msg);
            //In case the start button has been clicked from mobile side
            if ($scope.data.type == "startPlay" && $scope.data.flag == true)
                $rootScope.start();
        });
        this.handleKeyDown = function (keyCode) {
        Utils.log("handleKeyDown(" + keyCode + ")", TAG);
            switch (keyCode) {
                case tvKey.KEY_UP:
                    break;
                case tvKey.KEY_DOWN:
                    break;
                case tvKey.KEY_ENTER:
                case tvKey.KEY_PANEL_ENTER:
                    if ($scope.playersLength>1)
                    $scope.start();
                    break;

                case tvKey.KEY_RETURN:
                case tvKey.KEY_PANEL_RETURN:
                    break;
            }
        };

    }]);