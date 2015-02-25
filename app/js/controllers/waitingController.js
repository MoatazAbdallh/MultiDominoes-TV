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
                $rootScope.DominoGame.players[i].type = "cards";
            //init score
            $scope.scoreSheet.push({"name": client.attributes.name, "score": 0});
                client.send(JSON.stringify($rootScope.DominoGame.players[i]), true);
            });
            $state.go('game');
           
        }

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