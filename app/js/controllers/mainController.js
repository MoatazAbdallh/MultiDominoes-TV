(function () {
    //This controller act as our main entry point to receive and communicate with
    //Main.js. This controller should be seen as the master controller that will
    //receive all keydown events then cleverly select the right child controller to pass
    //the keydown event to

    app.controller('mainController', ['$scope', 'FocusHandlerFactory', 'Utils', '$rootScope', '$state', function ($scope, FocusHandlerFactory, Utils, $rootScope, $state) {

        //set application's global Main variable's controller to this controller
        $scope.playersLength = 0;
		$scope.scoreSheet = [];
        var TAG = "Controller - MainController",
			_THIS = this;
        Main.mainController = _THIS;
        Utils.log("Intiallized : ", TAG);
        $scope.channelId = "com.espritsolutions.multidominoes";
        $scope.ms = window.webapis.multiscreen;
        $scope.clients = [];


        $scope.onDeviceRetrieved = function (device) {
            Utils.log("Success Retrieved Device ", TAG);
            $scope.device = device;
            $scope.connectToChannel();
        }
        $scope.connectToChannel = function () {
            $scope.device.openChannel($scope.channelId, { name: "Host" }, $scope.onConnect, function (error) {
                Utils.log("device.openChannel() Error : " + error, TAG);
            });
        };
        $scope.onConnect = function (channel) {
            $scope.channel = channel;
            Utils.log("onConnect: " + arguments, TAG);

            // Wire up some event handlers
            $scope.channel.on("disconnect", function (client) {
                Utils.log("Channel has been disconnected", TAG);
            });

            $scope.channel.on("clientConnect", function (client) {
                $scope.clients.push(client);
                $scope.playersLength++;
                $rootScope.safeApply($scope);
                $scope.onClientConnect(client);
                if ($scope.playersLength == 1)
                    $state.go('waiting');
            });

            $scope.channel.on("clientDisconnect", function (client) {
                Utils.log("Client: " + client.attributes.name + " has been disconnected", TAG);
            });

            
        };
        $scope.onClientConnect = function (client) {
            var msg = {
                type: "connection",
                flag: true,
                message: "" + client.attributes.name + " Connected Successfully"
            };
            $scope.channel.broadcast(JSON.stringify(msg));
        }


        this.onApplicationOnLoadComplete = function () {
            Utils.log("***onApplicationOnLoadComplete()***", TAG);
            $state.go('menu');
        };

        this.onApplicationUnload = function () {
            Utils.log("***onApplicationUnload()***");
        };

        this.handleKeyDown = function (keyCode) {
            Utils.log("handleKeyDown(" + keyCode + ")", TAG);

            _THIS.currentController = FocusHandlerFactory.getCurrentController();
            if (_THIS.currentController != null) {
                _THIS.currentController.handleKeyDown(keyCode);
            }
        };
    }
    ]);
   
})();

