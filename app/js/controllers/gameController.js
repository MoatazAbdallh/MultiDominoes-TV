//This Controller will wait until we have minumim no. of players required to start game & then the start button will be appeared.
app.controller('gameController', ['$scope', 'FocusHandlerFactory', 'Utils', '$rootScope', function ($scope, FocusHandlerFactory, Utils, $rootScope) {
    var TAG = "Game View";
    var _THIS = this;

    Utils.log("Intializing", TAG);
    $rootScope.setControllerFocus(_THIS);

    $scope.firstPlayer = $rootScope.DominoGame.whichPlayer();
    Utils.log($scope.firstPlayer, "First Player Index");
    $scope.clients[$scope.firstPlayer].send(JSON.stringify({ type: "message", content: "It's your Turn" }), true);
    $.each($scope.clients, function (i, client) {
        if ($scope.firstPlayer != i)
            client.send(JSON.stringify({ type: "cardStatus", content: false }));
    });

    $scope.channel.on("message", function (msg, client) {
        $scope.data = JSON.parse(msg);
        //In case the message from client is playedcard
        if ($scope.data.type == "playedcard") {
            $scope.playedcard = $scope.data.card;
            $scope.side = $scope.data.side;
            Utils.log("played card left " + $scope.data.card.l + "Right: " + $scope.data.card.r, TAG);
            _.filter($rootScope.DominoGame.players, function (player, id) {
                if (player.name == client.attributes.name) {
                    $scope.idx = id;
                    return true;
                }
            });
            Utils.log("Player Turn ID " + $scope.idx, TAG);

            //In case the player can't make playe with the sent card.
            if (!$rootScope.DominoGame.makePlay($scope.idx, $scope.playedcard, $scope.side)) {
                if ($rootScope.DominoGame.players[$rootScope.DominoGame.currentPlayer].canPlay($rootScope.DominoGame.playstack[0].left(), $rootScope.DominoGame.playstack[$rootScope.DominoGame.playstack.length - 1].right())) //if player esta3bat we rama false card
                    client.send(JSON.stringify({ type: "message", content: "Please Choose another Card!" }), true);
                else if ($rootScope.DominoGame.remaningCards.length > 0) { //if player hasn't cards to play
                    Utils.log("sending drawcard event to mobile ", TAG);
                    client.send(JSON.stringify({ type: "drawCard", flag: true }), true);
                }
                else { //he draw until vanish remaningCards Arr.
                    $rootScope.DominoGame.chooseNextPlayer();
                    $scope.clients[$rootScope.DominoGame.currentPlayer].send(JSON.stringify({ type: "message", content: "It's your Turn" }), true);
                }
            }
            //In case the card sent is valid for ground.
            else {
                $scope.leftStack = _.initial($rootScope.DominoGame.playstack, $rootScope.DominoGame.playstack.length - $rootScope.DominoGame.firstCardIndex - 1);
                $scope.rightStack = _.rest($rootScope.DominoGame.playstack, $rootScope.DominoGame.firstCardIndex);
                Utils.log("Left Stack Count" + $scope.leftStack.length, TAG);
                Utils.log("Right Stack Count" + $scope.rightStack.length, TAG);


                //Splice first card element
                $scope.leftStack.splice($scope.leftStack.length - 1, 1);
                $scope.rightStack.splice(0, 1);
                Utils.log("Right Stack " + JSON.stringify($scope.rightStack), TAG);
                Utils.log("Left Stack " + JSON.stringify($scope.leftStack), TAG);
                $rootScope.safeApply($scope);
                client.send(JSON.stringify({ type: "cardsuccessed", card: $scope.playedcard }), true);
                // $scope.clients[$rootScope.DominoGame.currentPlayer].send(JSON.stringify({ type: "message", content: "It's your Turn" }), true);
                //count remaining cards for the player
                //case no cards or the remaining card and no one can play -> calculate score
                if ($rootScope.DominoGame.players[$rootScope.DominoGame.currentPlayer].countHand() == 0 || ($rootScope.DominoGame.remainingCards.length == 0 && !$rootScope.DominoGame.gameCanPlay())) {

                    //cal score
                    $scope.playerScore = $rootScope.DominoGame.calScore();
                    //update score sheet
                    $scope.scoreSheet[$scope.playerScore.player].score += $scope.playerScore.score;
                    $scope.clients[$scope.playerScore.player].send(JSON.stringify({ type: "message", content: "You are the winner" }), true);
                    //show dialog for the score
                }
                else {
                    $rootScope.DominoGame.chooseNextPlayer();
                    $scope.clients[$rootScope.DominoGame.currentPlayer].send(JSON.stringify({ type: "message", content: "It's your Turn" }), true);
                }

            }
        }
    });

    $scope.cardOrientation = function (card, type, index) {
        if (card.l != card.r)
            if (type == 'rightStack')
                if (index > 0 && $scope.rightStack[index - 1].or != 'r180')
                    return card.or + " margingright";
                else
                    return card.or;
            else {

                if ($scope.leftStack[1] && $scope.leftStack[1].or != 'r180') {
                    $($('img')[$scope.leftStack.length - 1]).removeClass("margingleft")
                    return card.or + " margingleft";
                }
                else
                    return card.or;
            }
        else
            return "r180";
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
                break;

            case tvKey.KEY_RETURN:
            case tvKey.KEY_PANEL_RETURN:
                break;
        }
    };

}]);