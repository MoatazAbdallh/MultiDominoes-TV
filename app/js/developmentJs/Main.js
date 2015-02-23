var Main ={
	mainController: null
};

Main.onLoad = function()
{
	window.addEventListener('keyup', Main.keyDown, false);
	if( Main.mainController!=null
		&& Main.mainController.onApplicationOnLoadComplete!=null){
		Main.mainController.onApplicationOnLoadComplete();
	}
};

Main.onUnload = function()
{
};

Main.keyDown = function(event){
	var keyCode = event.keyCode;
	if(Main.mainController!==null && Main.mainController!==undefined){
		Main.mainController.handleKeyDown(keyCode);
	}
};