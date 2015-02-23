/**
 * Created by Jack Vo on 20/10/2014.
 */
(function() {
	angular.module("app.configuration", [])
		.factory("ConfigData", function () {
			var isProductionMode = false,
				isSmartTVMode,
				logMessageEnabled,
				publicMethods = {};

			//widgetAPI object only exists in real device mode so we base on this variable to tell if the app is being run
			//on a real tv device or on a web browser
			if (typeof widgetAPI != 'undefined') {
				isSmartTVMode = true;
			} else {
				isSmartTVMode = false;
			}

			publicMethods.init = function (configData) {
				if(configData.appConfig){
					var appConfig = configData.appConfig;
					isProductionMode = (appConfig.isProductionMode) ? true : false;

					if(isProductionMode==true){
						logMessageEnabled = false;
					}else{
						logMessageEnabled = appConfig.logMessageEnabled;
					}
				}
			};

			publicMethods.isProductionMode = function(){
				return isProductionMode;
			};

			publicMethods.isSmartTVMode = function(){
				return isSmartTVMode;
			};

			publicMethods.isLogMessageEnabled = function(){
				return logMessageEnabled;
			};

			return publicMethods;
		});
})();