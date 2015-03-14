var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();
var pluginAPI = new Common.API.Plugin();

var Main =
{
    mainController: null
};

Main.onLoad = function()
{
    alert("************************Main.onLoad()*************************");
    //Send ready event - ready to boostrap app
    widgetAPI.sendReadyEvent();

    //Enable key
    document.getElementById("anchor_main").focus();

    alert("************************Main.onLoad() - COMPLETE *************************");
    if( Main.mainController!=null
        && Main.mainController.onApplicationOnLoadComplete!=null){
        Main.mainController.onApplicationOnLoadComplete();
    }
};

//This process is to active the native volume control
Main.onUnload = function(){
    //Stop the Player plugin right after the app exit
    alert("************************Main.onUnload()*************************");
    if( Main.mainController!=null
        && Main.mainController.onApplicationUnload!=null){
        Main.mainController.onApplicationUnload();
    }
};

Main.keyDown = function()
{
    var keyCode = event.keyCode;
    if(Main.mainController!==null && Main.mainController!==undefined){
        Main.mainController.handleKeyDown(keyCode,event);
    }else{
        alert("Main.mainController is NULL");
    }
};