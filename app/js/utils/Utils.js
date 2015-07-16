(function(){
	angular.module("app.utils", ["app.configuration"])
		.provider("Utils", function(){
			var logMessageEnabled = null,
				useConsoleLogMethod = null;

			this.$get = function($timeout, ConfigData){
				var publicMethods = {},
					targetLogTag = null;

				publicMethods.log = function(message, logTag, isError){
					var logMsg = "Log message is not available",
						extraTag = (isError===true) ? "[ERROR] " : "";

					//We can only use console.log() if current running environment is not smart TV
					if(useConsoleLogMethod===null){
						useConsoleLogMethod = !ConfigData.isSmartTVMode();
					}

					if(logMessageEnabled == null || logMessageEnabled == undefined){
						logMessageEnabled = ConfigData.isLogMessageEnabled();
						//We should not do any logging at all if logMessage is not enabled
						//so we notify user that Log message is not available the first time when log function is first called
						if(logMessageEnabled===false){
							performLogging();
						}
					}

					if( logMessageEnabled===true){
						if(!angular.isString(logTag)){
							logTag = "Application";
						}
						logMsg = "---" + logTag + "---" + extraTag + message + "\n";

						performLogging();
					}

					function performLogging(){
						if(useConsoleLogMethod === true){
							console.log(logMsg);
						}else{
							console.log(logMsg);
						}
					}
				};

				publicMethods.dispatchCallbackUsingAngularTimeout = function(callback, delay){
					if(angular.isFunction(callback)){
						if(!delay){
							return $timeout(callback);
						}else{
							return $timeout(callback, delay);
						}
					}
				};

				return publicMethods;
			};
		})
	;
})();