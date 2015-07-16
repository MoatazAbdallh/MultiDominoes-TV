var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();
var pluginAPI = new Common.API.Plugin();
var networkPlugin 

var Main =
{
    mainController: null
};

Main.onLoad = function()
{
    console.log("************************Main.onLoad2()*************************");
    networkPlugin = document.getElementById('pluginObjectNetwork');
    //Send ready event - ready to boostrap app
    widgetAPI.sendReadyEvent();

    //Enable key
    document.getElementById("anchor_main").focus();

    console.log("************************Main.onLoad() - COMPLETE *************************");
    if( Main.mainController!=null
        && Main.mainController.onApplicationOnLoadComplete!=null){
        Main.mainController.onApplicationOnLoadComplete();
    }
};

//This process is to active the native volume control
Main.onUnload = function(){
    //Stop the Player plugin right after the app exit
    console.log("************************Main.onUnload()*************************");
    if( Main.mainController!=null
        && Main.mainController.onApplicationUnload!=null){
        Main.mainController.onApplicationUnload();
    }
};

Main.keyDown = function()
{
    var keyCode = event.keyCode;
    console.log("====Pressed Key====="+keyCode)
    if(Main.mainController!==null && Main.mainController!==undefined){
        Main.mainController.handleKeyDown(keyCode,event);
    }else{
        console.log("Main.mainController is NULL");
    }
};