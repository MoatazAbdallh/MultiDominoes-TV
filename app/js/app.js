/**
 * ---------------------------------------
 * Application Initialisation Phase
 * ---------------------------------------
 */
var app = angular.module("MultiDominoes", ["ionic",
                                           "app.configuration"
										,"app.directives"
									  	,"app.services"
									  	,"app.utils"]);
/**
 * ---------------------------------------
 * Application Configuration Phase
 * ---------------------------------------
 */
app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('menu', {
            url: '/menu',
            templateUrl: 'app/views/menu.html',
            controller:'menuController'
        })
        .state('waiting', {
            url: '/waiting',
            templateUrl: 'app/views/waiting.html',
            controller: 'waitingController'
        })
    .state('game', {
        url: '/game',
        templateUrl: 'app/views/game.html',
        controller: 'gameController'
    })
    .state('test', {
        url: '/test',
        templateUrl: 'app/views/test.html',
        controller: 'testController'
    })
})

/**
 * ---------------------------------------
 * Application Creation Complete phase
 * ---------------------------------------
 */
app.run(["$http","ConfigData","Utils","$rootScope",'FocusHandlerFactory',function( $http,ConfigData,Utils,$rootScope,FocusHandlerFactory){
	var TAG = "***Application RUN PHASE***",
		path = document.URL,
		configUrl = path.substring(0, path.lastIndexOf('/')) + "/" + "config.json";
	$http.get(configUrl).then(function(data){
		    ConfigData.init(data.data);
			Utils.log("Application Config loaded completed", TAG);
		});

	$rootScope.safeApply = function (scope, fn) {
	    var phase = $rootScope.$$phase;
	    if (phase == '$apply' || phase == '$digest') {
	        if (fn && (typeof (fn) === 'function'))
	        { fn(); }
	    }
	    else { scope.$apply(fn); }
	};

	$rootScope.setControllerFocus = function (_this) {
	    if (_this != FocusHandlerFactory.getCurrentController)
	        FocusHandlerFactory.setCurrentFocusController(_this);
	}
}]);