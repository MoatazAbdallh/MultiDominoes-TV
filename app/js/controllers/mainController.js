(function () {
    //This controller act as our main entry point to receive and communicate with
    //Main.js. This controller should be seen as the master controller that will
    //receive all keydown events then cleverly select the right child controller to pass
    //the keydown event to

    app.controller('mainController', ['$scope', 'FocusHandlerFactory', 'Utils', '$rootScope', '$state','ngAudio', function ($scope, FocusHandlerFactory, Utils, $rootScope, $state,ngAudio) {

        //set application's global Main variable's controller to this controller
        $scope.playersLength = 0;
        $scope.scoreSheet = [];
        var TAG = "Controller - MainController",
			_THIS = this;
        Main.mainController = _THIS;
       // Utils.log("Intiallized : ", TAG);
        $scope.channelId = "com.espritsolutions.multidominoes";
        $scope.ms = window.webapis.multiscreen;
        $scope.clients = [];
        $scope.audios =[];

        $scope.destroy = function () {
           // Utils.log("Destroying $rootScope", TAG);
            $scope.clients = [];
            $scope.scoreSheet = [];
            $scope.playersLength = 0;
            $rootScope.gameStartedFlag = false;
            $rootScope.DominoGame = null;
            $rootScope.safeApply($scope);
        }
        $scope.continueDestroy = function () {
            $rootScope.DominoGame = null;
            $rootScope.safeApply($scope);
        }

        $scope.onDeviceRetrieved = function (device) {
            //swal("Success Retrieved Device")
            //Utils.log("Success Retrieved Device ", TAG);
            $scope.device = device;
            $scope.connectToChannel();
        }
        $scope.connectToChannel = function () {
            //Utils.log("Open Channel : ", TAG);
            //swal("Connect To Channel Function")
            $scope.device.openChannel($scope.channelId, { name: "Host" }, $scope.onConnect, function (error) {
                swal({ title: "Error!", text: "Can't Open this channel, Try again later", type: "error", confirmButtonText: "Ok" });
                //Utils.log("device.openChannel() Error : " + error, TAG);
            });
        };
        $scope.onConnect = function (channel) {
            $scope.channel = channel;
            //Utils.log("onConnect: ", TAG);
            //swal("Connected To Channel Function")
            // Wire up some event handlers
            $scope.channel.on("disconnect", function (client) {
                swal({ title: "Error!", text: "Channel has been disconnected", type: "error", confirmButtonText: "Ok" });
                //Utils.log("Channel has been disconnected", TAG);
            });

            $scope.channel.on("clientConnect", function (client) {
                if (!$rootScope.gameStartedFlag) { //in case we don't start game so accept any client request
                    $scope.clients.push(client);
                    var player = {};
                    player.name = client.attributes.name;
                    player.score = 0;
                    $scope.scoreSheet.push(player);
                    $scope.playersLength++;
                    //Utils.log("players Length: " + $scope.playersLength, TAG);
                    $rootScope.safeApply($scope);
                    $scope.onClientConnect(client);
                    if ($scope.playersLength > 4) //in case we have reached max number of players
                        client.send(JSON.stringify({ type: "message", content: "Sorry we have reached max. number of players" }), true);
                    if ($scope.playersLength == 1)
                        $state.go('waiting');
                    if ($scope.playersLength >= 2) //in case we are ready for play we send broadcast message to all players
                        $scope.channel.broadcast(JSON.stringify({ type: "readyToPlay", flag: true }), true);
                }
                else
                    client.send(JSON.stringify({ type: "message", content: "Sorry Game has been started, you can join in the next session" }), true);
            });
       
            $scope.channel.on("clientDisconnect", function (client) {
                //Utils.log("Client: " + client.attributes.name + " has been disconnected", TAG);
                $scope.channel.broadcast(JSON.stringify({ type: "message", content: client.attributes.name + " has been disconnected" }));
                $scope.destroy();
                $state.go('menu');

            });


        };
        $scope.onClientConnect = function (client) {
            var msg = {
                type: "connection",
                flag: true,
                message: "" + client.attributes.name + " Connected Successfully",
                playerslength: $scope.playersLength
            };
            $scope.channel.broadcast(JSON.stringify(msg));
        }


        this.onApplicationOnLoadComplete = function () {
            //Utils.log("***onApplicationOnLoadComplete()***", TAG);
            $scope.audios = [
                ngAudio.load('sounds/domino-start.wav'),
                ngAudio.load('sounds/domino-shuffle.wav'),
                ngAudio.load('sounds/domino-stone-on-the-table.wav'),
                ngAudio.load('sounds/winner-dialog.wav')
            ];
            $state.go('menu');
        };

        this.onApplicationUnload = function () {
            //Utils.log("***onApplicationUnload()***");
        };

        this.handleKeyDown = function (keyCode,event) {
           // Utils.log("handleKeyDown(" + keyCode + ")", TAG);

            _THIS.currentController = FocusHandlerFactory.getCurrentController();
            if (_THIS.currentController != null) {
                _THIS.currentController.handleKeyDown(keyCode,event);
            }
        };
    }
    ]);

})();

