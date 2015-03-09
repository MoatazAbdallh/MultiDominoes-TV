//This Controller will handle 1st player connection then he will be redirected to waiting state, also handle clicking on 3 buttons & go to appreaciated states.
app.controller('menuController', ['$scope', 'FocusHandlerFactory', 'Utils', '$rootScope', '$state', function ($scope, FocusHandlerFactory, Utils, $rootScope, $state) {

        var TAG = "Menu View";
        var _THIS = this;

        Utils.log("Intializing", TAG);

        // Get the local Device (SmartTV)
        if ($scope.ms) {
            Utils.log("MultiScreen Lib is Loaded : ", TAG);
            $scope.ms.Device.getCurrent($scope.onDeviceRetrieved, function (error) {
                Utils.log("Device.getCurrent() Error : " + error, TAG);
            });
        }
        $rootScope.setControllerFocus(_THIS);
       

        $scope.highlight = function (index) {
            Utils.log("Highlight Index" + index, TAG);
            $rootScope.safeApply($scope);
            switch (index) {
                case 0:
                    $scope.selectedIndex = 0;
                    $('.rules').css("background-image", "url(app/images/Rules-Button.png)");
                    $('.about').css("background-image", "url(app/images/About-Button.png)");
                    $('.scan').css("background-image", "url(app/images/Scan-Button-HL.png)");
                    break;
                case 1:
                    $scope.selectedIndex = 1;
                    $('.scan').css("background-image", "url(app/images/Scan-Button.png)");
                    $('.about').css("background-image", "url(app/images/About-Button.png)");
                    $('.rules').css("background-image", "url(app/images/Rules-Button-HL.png)");
                    break;
                case 2:
                    $scope.selectedIndex = 2;
                    $('.scan').css("background-image", "url(app/images/Scan-Button.png)");
                    $('.rules').css("background-image", "url(app/images/Rules-Button.png)");
                    $('.about').css("background-image", "url(app/images/About-Button-HL.png)");
                    break;
            }
        }
        $scope.selectedIndex = 0;
        $scope.highlight($scope.selectedIndex);

        $scope.keyAction = function () {
            Utils.log("Key Action", TAG);
            switch ($scope.selectedIndex) {
                case 0:
                    $state.go('qrcode');
                    break;
                case 1:
                    $state.go('rules');
                    break;
                case 2:
                    $state.go('about');
                    break;
            }
        }
        this.handleKeyDown = function (keyCode,event) {
            Utils.log("handleKeyDown(" + keyCode + ")");
            switch (keyCode) {
                case tvKey.KEY_UP:
                    $scope.selectedIndex--;
                    if ($scope.selectedIndex < 0)
                        $scope.selectedIndex = 0;
                    $scope.highlight($scope.selectedIndex)
                    break;
                case tvKey.KEY_DOWN:
                    $scope.selectedIndex++;
                    if ($scope.selectedIndex > 2)
                        $scope.selectedIndex = 2;
                    $scope.highlight($scope.selectedIndex)
                    break;
                case tvKey.KEY_ENTER:
                case tvKey.KEY_PANEL_ENTER:
                    $scope.keyAction();
                    break;

                case tvKey.KEY_RETURN:
                case tvKey.KEY_PANEL_RETURN:
                    widgetAPI.sendReturnEvent();
                    break;
            }
        };


    }]);
