/**
 * FULL SCREEN utils
 */
function FullScreenUtil(node){
    var elementUI = node;
    
    var fullScreenAvailable;
    //check if full screen is available
    this.isFullScreenAvailable = function(){
        try{
            if (elementUI.requestFullscreen) {
                fullScreenAvailable = true;
            }
            else if (elementUI.mozRequestFullScreen) {
                fullScreenAvailable = true;
            }
            else if (elementUI.webkitRequestFullScreen) {
                fullScreenAvailable = true;
            }
        }catch(e){}
        if(fullScreenAvailable){
            addFSListeners();
        }
        return fullScreenAvailable;
    }
    
    var isExitFullScreenAvailable;
    //check if isExit FS available
    this.isExitFullScreenAvailable = function(){
        try{
            if (document.exitFullscreen) {
                isExitFullScreenAvailable = true;
            }
            else if (document.mozCancelFullScreen) {
                isExitFullScreenAvailable = true;
            }
            else if (document.webkitCancelFullScreen) {
                isExitFullScreenAvailable = true;
            }
        }catch(e){}
        return isExitFullScreenAvailable;
    }    
    
    //exit FS
    this.exitFullScreen=function(){
        try{
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }catch(e){}
    }
    
    //enter FS
    this.enterFullScreen = function(){
        try{
            if (elementUI.requestFullscreen) {
                elementUI.requestFullscreen();
            }
            else if (elementUI.mozRequestFullScreen) {
                elementUI.mozRequestFullScreen();
            }
            else if (elementUI.webkitRequestFullScreen) {
                elementUI.webkitRequestFullScreen();
            }
        }catch(e){}
    }
    
    //add fullscreen listeners
    function addFSListeners(){
        document.addEventListener("fullscreenchange", function () {
            fullscreenStateChange(document.fullscreen);
        }, false);
        
        document.addEventListener("mozfullscreenchange", function () {
            fullscreenStateChange(document.mozFullScreen);
        }, false);
        
        document.addEventListener("webkitfullscreenchange", function () {
            fullscreenStateChange(document.webkitIsFullScreen);
        }, false);        
    }
    
    //changed fs state
    function fullscreenStateChange(isFullScreen){
        if(changeStateCallBack!=null && changeStateCallBack!=undefined){
            changeStateCallBack(isFullScreen)
        }
    }
    
    this.setStateCallBack=function(val){
        changeStateCallBack = val;
    }
    var changeStateCallBack;
}
/**
 * END FULL SCREEN utils
 */


/* Sound util
================================================== */

function SoundUtil(){
    
    this.isAvailable = function(){
        var available=true;
        if (!SoundJS.checkPlugin(true)) {
            available = false;
        }
        return available;        
    }
}

/* End Sound util
================================================== */



/* Generic Widghet button
================================================== */

function GenericWidghetButton(){
    var buttonUI;
    this.createButton = function(w, h, name, color){
        buttonUI = $(name);
        buttonUI.css('position', 'absolute');
        buttonUI.css('width', w+'px');
        buttonUI.css('width', h+'px');
        buttonUI.css('background-color', color);
        return buttonUI;
    }
}
/* Generic Widghet button
================================================== */

