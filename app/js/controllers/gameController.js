//This Controller will wait until we have minumim no. of players required to start game & then the start button will be appeared.
app.controller('gameController', ['$scope', 'FocusHandlerFactory', 'Utils', '$rootScope', '$state', function ($scope, FocusHandlerFactory, Utils, $rootScope, $state) {
    var TAG = "Game View";
    var _THIS = this;
    $scope.leftStackPos = 605;
    Utils.log("Intializing", TAG);
    $scope.gamePlaylist = [{
        src: 'app/sounds/domino-shuffle.mp3',
        type: 'audio/mp3'
    },
      {
          src: 'app/sounds/domino-stone-on-the-table.mp3',
          type: 'audio/mp3'
      }];
    $scope.$on('$viewContentLoaded', function (event) {
        console.log("View has been laoded")

        $scope.gameaudio.play(0, true);
    })
    $rootScope.setControllerFocus(_THIS);

    $scope.firstPlayer = $rootScope.DominoGame.whichPlayer();
    Utils.log($scope.firstPlayer, "First Player Index");
    $scope.clients[$scope.firstPlayer].send(JSON.stringify({ type: "message", content: "It's your Turn" }), true);
    $.each($scope.clients, function (i, client) {
        if ($scope.firstPlayer != i)
            client.send(JSON.stringify({ type: "cardStatus", content: false }));
    });
    //intializing left and right stack
    $scope.leftStack = [];
    $scope.rightStack = [];
    $scope.rightStackRow = [];
    $scope.channel.removeAllListeners("message")
    $scope.channel.on("message", function (msg, client) {
        $scope.data = JSON.parse(msg);
        if ($scope.data.type == "message") {
            if ($scope.data.content == "Disconnected from game")
                $scope.exit();
        }
        //In case the message from client is playedcard
        if ($scope.data.type == "playedcard") {
            $scope.playedcard = $scope.data.card;
            $scope.side = $scope.data.side;
            //Utils.log("played card left " + $scope.data.card.l + "Right: " + $scope.data.card.r, TAG);
            _.filter($rootScope.DominoGame.players, function (player, id) {
                if (player.name == client.attributes.name) {
                    $scope.idx = id;
                    return true;
                }
            });
            //Utils.log("Player Turn ID " + $scope.idx, TAG);

            if (!$rootScope.DominoGame.makePlay($scope.idx, $scope.playedcard, $scope.side)) {
                if ($rootScope.DominoGame.firstcard)
                    client.send(JSON.stringify({ type: "cardFailed", content: "Please Choose highest Common Card!", card: $scope.playedcard }), true);
                else
                    client.send(JSON.stringify({ type: "cardFailed", content: "Please Choose another Card!", card: $scope.playedcard }), true);
            }

                //In case the card sent is valid for ground.
            else {
                $scope.clients[$scope.idx].passFlag = false; //reset the pass Flag
                if ($scope.leftStack && $scope.leftStack.length == 4 && !$scope.leftFirstRow && $scope.side == "head") { //we reached max. cards on 1st left stack row so we create the left stack edge card
                    $scope.leftStackEdge = $rootScope.DominoGame.playstack[0];
                    $rootScope.DominoGame.leftStackEdgeIndex = 0;
                    $rootScope.DominoGame.leftStackEdgeFlag = true;
                    $scope.leftFirstRow = true;
                    $scope.leftStackRow = [];
                    $rootScope.safeApply($scope);
                }
                else if ($scope.rightStack && $scope.rightStack.length == 4 && !$scope.rightFirstRow && $scope.side == "tail") {
                    $scope.rightStackEdge = $rootScope.DominoGame.playstack[$rootScope.DominoGame.playstack.length - 1];
                    $rootScope.DominoGame.rightStackEdgeIndex = $rootScope.DominoGame.playstack.length;
                    $rootScope.DominoGame.rightStackEdgeFlag = true;
                    $scope.rightFirstRow = true;
                    $scope.rightStackRow = [];
                    $rootScope.safeApply($scope);
                }
                else if ($scope.leftStackEdge && $scope.side == "head" && $scope.leftStackRow.length < 7) {
                    //Utils.log("Left Stack 2nd row", TAG);
                    var temp = _.initial($rootScope.DominoGame.playstack, $rootScope.DominoGame.playstack.length - $rootScope.DominoGame.leftStackEdgeIndex - 1);
                    temp.splice(temp.length - 1, 1);
                    $scope.leftStackRow.push(temp[0]);
                    $rootScope.safeApply($scope);
                }
                else if ($scope.rightStackEdge && $scope.side == "tail" && $scope.rightStackRow.length < 7) {
                    // Utils.log("Right Stack 2nd row", TAG);
                    $scope.rightStackRow = _.rest($rootScope.DominoGame.playstack, $rootScope.DominoGame.rightStackEdgeIndex);
                    $rootScope.safeApply($scope);
                }
                    //Second Edge Row
                else if ($scope.leftStackRow && $scope.leftStackRow.length == 7 && $scope.side == "head" && !$scope.leftSecondRow) { // 2nd left row edge
                    $scope.leftStackSecondEdge = $rootScope.DominoGame.playstack[0];
                    $rootScope.DominoGame.leftStackSecondEdgeIndex = 1;
                    $rootScope.DominoGame.leftStackSecondEdgeFlag = true;
                    $scope.leftSecondRow = true;
                    $scope.leftStackSecondRow = [];
                    $rootScope.safeApply($scope);
                }
                else if ($scope.rightStackRow && $scope.rightStackRow.length == 7 && $scope.side == "tail" && !$scope.rightSecondRow) { // 2nd right row edge
                    $scope.rightStackSecondEdge = $rootScope.DominoGame.playstack[$rootScope.DominoGame.playstack.length - 1];
                    $rootScope.DominoGame.rightStackSecondEdgeIndex = $rootScope.DominoGame.playstack.length;
                    $rootScope.DominoGame.rightStackSecondEdgeFlag = true;
                    $scope.rightSecondRow = true;
                    $scope.rightStackSecondRow = [];
                    $rootScope.safeApply($scope);
                }
                    //Second Row
                else if ($scope.leftStackSecondEdge && $scope.side == "head") {
                    // Utils.log("Right Stack 3rd row", TAG);
                    // console.log($rootScope.DominoGame.leftStackSecondEdgeIndex);
                    var temp = _.initial($rootScope.DominoGame.playstack, $rootScope.DominoGame.playstack.length - $rootScope.DominoGame.leftStackSecondEdgeIndex - 1);
                    //console.log(JSON.stringify(temp));
                    //console.log("temp length" + temp.length);

                    temp.splice(temp.length - 1, 1);
                    $scope.leftStackSecondRow.push(temp[0]);
                    //console.log(JSON.stringify($scope.leftStackSecondRow))
                    $rootScope.safeApply($scope);
                }
                else if ($scope.rightStackSecondEdge && $scope.side == "tail") {
                    // Utils.log("Right Stack 3rd row", TAG);
                    $scope.rightStackSecondRow = _.rest($rootScope.DominoGame.playstack, $rootScope.DominoGame.rightStackSecondEdgeIndex);
                    $rootScope.safeApply($scope);
                }
                else {
                    if ($scope.leftStack.length < 4) {
                        $scope.leftStack = _.initial($rootScope.DominoGame.playstack, $rootScope.DominoGame.playstack.length - $rootScope.DominoGame.firstCardIndex - 1);
                        $scope.leftStack.splice($scope.leftStack.length - 1, 1);
                        $scope.leftStackPos = $scope.leftStackPosition(); //handling position of leftStack cards
                    }

                    if ($scope.rightStack.length < 4) {
                        $scope.rightStack = _.rest($rootScope.DominoGame.playstack, $rootScope.DominoGame.firstCardIndex);
                        $scope.rightStack.splice(0, 1);
                    }
                    $rootScope.safeApply($scope);
                }
                client.send(JSON.stringify({ type: "cardsuccessed", card: $scope.playedcard }), true);
                $scope.PlayTableSound();

                //count remaining cards for the player
                //case no cards or the remaining card and no one can play -> calculate score
                if ($rootScope.DominoGame.players[$rootScope.DominoGame.currentPlayer].cards.length == 0 || ($rootScope.DominoGame.remainingCards.length == 0 && !$rootScope.DominoGame.gameCanPlay())) {
                    $scope.getWinner();
                }
                else {
                    $scope.getNextPlayer();
                }
            }
        }
            //draw card and check if the card can be played to disable draw button
        else if ($scope.data.type == "yDrawCard") {
            if ($rootScope.DominoGame.remainingCards.length > 0) {
                if ($rootScope.DominoGame.drawCard($rootScope.DominoGame.currentPlayer))
                    $scope.clients[$rootScope.DominoGame.currentPlayer].send(JSON.stringify({ type: "drawCard", flag: false }), true);
                $scope.clients[$rootScope.DominoGame.currentPlayer].send(JSON.stringify({ type: "drawedCard", card: $rootScope.DominoGame.drawedCard }), true);
            }
            else {
                $scope.clients[$rootScope.DominoGame.currentPlayer].send(JSON.stringify({ type: "drawCard", flag: false }), true);
                $scope.clients[$rootScope.DominoGame.currentPlayer].send(JSON.stringify({ type: "passTurn", flag: true }), true);

            }
            $rootScope.safeApply($scope);
        }

        else if ($scope.data.type == "yPassTurn") {
            var passCounts = 0;
            $scope.clients[$rootScope.DominoGame.currentPlayer].passFlag = true; //raise passFlag for the current player
            $scope.clients[$rootScope.DominoGame.currentPlayer].send(JSON.stringify({ type: "passTurn", flag: false }), true);
            //client.send(JSON.stringify({ type: "cardsuccessed", card: null }), true); // to block on the current player
            $.each($scope.clients, function (i, client) {
                if (client.passFlag)
                    passCounts++;
            });
            if (passCounts == $scope.clients.length) //Get The winner of the game as the game has a tie
                $scope.getWinner();
            else
                $scope.getNextPlayer();
        }
    });

    $scope.getWinner = function () {
        // calcScore
        $rootScope.winnerPlayerIndex = $rootScope.DominoGame.getWinner();
        Utils.log("Winner Player Index: " + $rootScope.winnerPlayerIndex, TAG)
        $scope.scoreSheet[$rootScope.winnerPlayerIndex].score += $rootScope.DominoGame.calScore();
        $rootScope.winnerPlayer = $scope.scoreSheet[$rootScope.winnerPlayerIndex];
        $rootScope.safeApply($scope);
        $scope.clients[$rootScope.winnerPlayerIndex].send(JSON.stringify({ type: "winner", flag: true }), true);
        $scope.channel.broadcast(JSON.stringify({ type: "message", content: $scope.scoreSheet[$rootScope.DominoGame.currentPlayer].name + " is the winner" }), true);
        $.each($scope.clients, function (i, client) { //send false winner to other player to go to waiting screen which wait the winner player to continue game
            if (i != $rootScope.winnerPlayerIndex)
                client.send(JSON.stringify({ type: "winner", flag: false }), true);
        })
        //show dialog for the score
        $state.go('winning');
    }

    $scope.playerCardStatus = function (cardstatus) {
        // Utils.log("Player Card Status: "+cardstatus, TAG);
        switch (cardstatus) {
            case "canPlay":
                break;
            case "drawCard":
                $scope.clients[$rootScope.DominoGame.currentPlayer].send(JSON.stringify({ type: "drawCard", flag: true }), true);
                break;
            case "passTurn":
                $scope.clients[$rootScope.DominoGame.currentPlayer].send(JSON.stringify({ type: "passTurn", flag: true }), true);
                break;

        }
    }
    $scope.getNextPlayer = function () {
        $scope.status = $rootScope.DominoGame.nextPlayer();
        $scope.playerCardStatus($scope.status);
        $scope.clients[$rootScope.DominoGame.currentPlayer].send(JSON.stringify({ type: "message", content: "It's your Turn" }), true);
    }

    $scope.leftStackPosition = function () {
        $scope.position = 597;
        $.each($scope.leftStack, function (i, card) {
            if (card.l != card.r)
                $scope.position -= 142;
            else
                $scope.position -= 73;
        });
        //Utils.log("LeftStack Position: " + $scope.position, TAG)
        return $scope.position;
    }
    //This will maintain the style of Left Stack Edge Card according to previous card
    $scope.StackEdgeStyle = function (type) {
        //Utils.log("Stack Edge Style: " + type, TAG);
        var style = {};

        if (type && type == 'left' && $scope.leftStack) {
            var leftwidth = 0;
            $.each($scope.leftStack, function (i, card) {
                if (card.l != card.r)
                    leftwidth += 142;
                else
                    leftwidth += 73;
            });
            if ($scope.leftStack[0] && $scope.leftStack[0].l != $scope.leftStack[0].r) {
                style["top"] = '445px';
                style["left"] = (600 - leftwidth).toString() + 'px';
                $scope.secondRowLeftStack = 600 - leftwidth + 67; //last position of leftStack 1st row + with of the Edge Stack Card
            }
            else {
                style["top"] = '483px';
                style["left"] = (604 - leftwidth).toString() + 'px';
                $scope.secondRowLeftStack = 604 - leftwidth + 67; //last position of leftStack 1st row + with of the Edge Stack Card
            }
        }

        else if (type && type == 'right' && $scope.rightStack) {
            var rightwidth = 595;
            $.each($scope.rightStack, function (i, card) {
                if (card.l != card.r)
                    rightwidth += 142;
                else
                    rightwidth += 73;
            });
            style["left"] = rightwidth.toString() + 'px';
            $scope.secondRowRightStack = 1285 - rightwidth; //last position of rightStack 1st row + with of the Edge Stack Card

            if ($scope.rightStack[$scope.rightStack.length - 1] && $scope.rightStack[$scope.rightStack.length - 1].l != $scope.rightStack[$scope.rightStack.length - 1].r)
                style["top"] = '235px'
            else
                style["top"] = '198px'
        }
        else if (type && type == 'right2' && $scope.rightStackRow) {
            var rightwidth = $scope.secondRowRightStack;
            $.each($scope.rightStackRow, function (i, card) {
                if (card.l != card.r)
                    rightwidth += 142;
                else
                    rightwidth += 73;
            });
            // Utils.log("Right Width: " + rightwidth, TAG)
            if (rightwidth < 1116) {
                style["right"] = (rightwidth - 18).toString() + 'px';
                $scope.thirdRowRightStack = 1280 - rightwidth + 8;
            }
            else {
                style["right"] = (rightwidth + 35).toString() + 'px';
                $scope.thirdRowRightStack = 1280 - rightwidth - 12;
            }
            style["top"] = '140px';
        }
        if (type && type == 'left2' && $scope.leftStackRow) {
            var leftwidth = 0;
            $.each($scope.leftStackRow, function (i, card) {
                if (card.l != card.r)
                    leftwidth += 142;
                else
                    leftwidth += 73;
            });
            if (leftwidth == 994) {
                style["left"] = (leftwidth + $scope.secondRowLeftStack - 50).toString() + 'px';
                $scope.thirdRowLeftStack = 1285 - leftwidth - $scope.secondRowLeftStack-50;
            }
            else{
                style["left"] = (leftwidth + $scope.secondRowLeftStack).toString() + 'px';
                $scope.thirdRowLeftStack = 1285 - leftwidth - $scope.secondRowLeftStack;
            }
            style["top"] = '580px';
        }
        return style;
    }
    //this will maintain 2nd leftStack row style
    $scope.stackRowStyle = function (type) {
        var style = {};
        if (type && type == 'left') {
            if ($scope.secondRowLeftStack)
                style["left"] = $scope.secondRowLeftStack.toString() + 'px';
            if ($scope.leftStack[0] && $scope.leftStack[0].l != $scope.leftStack[0].r)
                style["top"] = '480px'
            else
                style["top"] = '515px'
        }
        else if (type && type == "left2") {
            if ($scope.thirdRowLeftStack)
                style["right"] = $scope.thirdRowLeftStack.toString() + 'px'
            style["top"] = '610px'
        }
        else if (type && type == 'right') {
            if ($scope.secondRowRightStack)
                style["right"] = $scope.secondRowRightStack.toString() + 'px';
            if ($scope.rightStack[$scope.rightStack.length - 1] && $scope.rightStack[$scope.rightStack.length - 1].l != $scope.rightStack[$scope.rightStack.length - 1].r)
                style["top"] = '198px'
            else
                style["top"] = '160px'
        }
        else if (type && type == "right2") {
            style["left"] = $scope.thirdRowRightStack.toString() + 'px'
            style["top"] = '75px'
        }

        return style;
    }
    $scope.cardOrientation = function (card, type, index) {
        if (card) {
            //Utils.log("Card Or is:" + card.or, TAG);
            if (type == 'leftStack') {

                if (card.l != card.r) {
                    if ($scope.leftStack[index - 1] && $scope.leftStack[index - 1].l == $scope.leftStack[index - 1].r)
                        return card.or + " mgleft180";
                    else
                        return card.or + " margingleft";
                }
                else
                    return "r180 pdright180";
            }
            if (type == 'rightStack') {
                if (card.l != card.r)
                    if ($scope.rightStack[index - 1] && $scope.rightStack[index - 1].l == $scope.rightStack[index - 1].r)
                        return card.or + " mgleft180";
                    else
                        return card.or + " margingleft";
                else
                    return "r180 margingleft180"
            }
            else if (type == 'leftStack1') {
                if (card.l != card.r) {
                    switch (card.or) {
                        case "r90":
                            if ($scope.leftStackRow[index - 1] && $scope.leftStackRow[index - 1].l == $scope.leftStackRow[index - 1].r)
                                return "r270 mgleft180";
                            else
                                return "r270 margingleft";
                            break;
                        case "r270":
                            if ($scope.leftStackRow[index - 1] && $scope.leftStackRow[index - 1].l == $scope.leftStackRow[index - 1].r)
                                return "r90 mgleft180";
                            else
                                return "r90 margingleft";
                            break;
                    }
                }
                else
                    if (index == 0)//in case if the 1st card in the 2nd row is r180
                        return "r90 margingleft";
                    else
                        return "r180 pdright180";
            }
            else if (type == 'rightStack1') {
                if (card.l != card.r) {
                    switch (card.or) {
                        case "r90":
                            if ($scope.rightStackRow[index + 1] && $scope.rightStackRow[index + 1].l == $scope.rightStackRow[index + 1].r)
                                return "r270 mgleft180";
                            else
                                return "r270 margingleft";
                            break;
                        case "r270":
                            if ($scope.rightStackRow[index + 1] && $scope.rightStackRow[index + 1].l == $scope.rightStackRow[index + 1].r)
                                return "r90 mgleft180";
                            else
                                return "r90 margingleft";
                            break;
                    }
                }
                else
                    if (index == 0)//in case if the 1st card in the 2nd row is r180
                        return "r90 margingleft";
                    else
                        return "r180";
            }
            else if (type == 'leftStack2') {
                if (card.l != card.r) {
                    if ($scope.leftStackSecondRow[index + 1] && $scope.leftStackSecondRow[index + 1].l == $scope.leftStackSecondRow[index + 1].r)
                        return card.or + " mgleft180";
                    else
                        return card.or + " margingleft";
                }
                else
                    return "r90 margingleft"

            }
            else if (type == 'rightStack2') {
                if (card.l != card.r) {
                    if ($scope.rightStackSecondRow[index - 1] && $scope.rightStackSecondRow[index - 1].l == $scope.rightStackSecondRow[index - 1].r)
                        return card.or + " mgleft180";
                    else
                        return card.or + " margingleft";
                }
                else
                    return "r90 margingleft"

            }
        }
    }
    $scope.EdgeOrientation = function (card) {
        if (card) {
            if (card.or != "r270") {
                var or = card.or.slice(0);
                var finalOr = parseInt(or) + 90;
                return 'r' + finalOr;
            }
            else
                return "r180";
        }

    }



    this.handleKeyDown = function (keyCode, event) {
        Utils.log("handleKeyDown(" + keyCode + ")", TAG);
        switch (keyCode) {
            case tvKey.KEY_UP:
                break;
            case tvKey.KEY_DOWN:
                break;
            case tvKey.KEY_ENTER:
            case tvKey.KEY_PANEL_ENTER:
                if ($('.sweet-alert').css('display') == 'block')
                    $('.confirm').trigger('click');
                break;
            case tvKey.KEY_MUTE:
                $scope.mute();
                break;
            case tvKey.KEY_VOL_UP:
                $scope.volUp();
                break;
            case tvKey.KEY_VOL_DOWN:
                $scope.volDown();
                break;
            case tvKey.KEY_RETURN:
            case tvKey.KEY_PANEL_RETURN:
                widgetAPI.blockNavigation(event);
                $scope.exit();
                break;
        }
    }
    $scope.PlayTableSound = function () {
        $scope.gameaudio.play(1, true);

    }



}])
;