/**
 * Created by Jack Vo on 20/10/2014.
 */
(function(){
	angular.module("app.services", ["app.utils"])
	/**
	 * The following service factory will help to ease the switching focus process
	 * The factory will keep track of which controller has just been removed focus
	 * and the controller that will take over the focus
	 */
		.factory("FocusHandlerFactory", function(Utils) {
			var TAG = "Services - FocusHandlerFactory",
				previousController,
				currentController,
				publicMethods = {};

			publicMethods.setCurrentFocusController = function(controller){
				if( controller!==null
					&& controller!==undefined
					&& currentController!= controller){
					Utils.log("setCurrentFocusController()", TAG);
					previousController = currentController;
					if(previousController!=null){
						//previousController.setFocus(false);
					}
					currentController = controller;

				}
			};

			publicMethods.getCurrentController = function(){
				return currentController;
			};

			return publicMethods;
		});
})();