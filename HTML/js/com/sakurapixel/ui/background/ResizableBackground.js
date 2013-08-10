function ResizableBackground(backgroundUI){
    this.backgroundContainer = backgroundUI;
    
    EventBus.addEventListener(Event.WINDOW_RESIZE, resizeBackground);
    
    var currentBackground;
    this.showNewBackground = function(img){
        
        var newBackground = $('<div style="position: absolute;overflow: hidden; width: 100%; height:100%;"></div>').appendTo(this.backgroundContainer);
        img.css('position', 'absolute');
        img.appendTo(newBackground);
                
        resizeBack(newBackground);
        
        var EFX = "FADEIN";
        
        if(EFX=='FALL'){
            var h = newBackground.height();
            newBackground.css('height', '0px');
            newBackground.animate({
                height: h+'px'
            }, 1000, 'easeInExpo', function onComplete(){
                if(currentBackground!=null){
                    currentBackground.remove();
                }
                currentBackground = newBackground;
                if(callBackComplete!=null){
                    try{
                        callBackComplete();
                        callBackComplete=null;
                    }catch(e){}
                }
            });
        }
        if(EFX=='FADEIN'){
            newBackground.css('opacity', 0);
            newBackground.animate({
                opacity: 1
            }, 1000, 'easeInExpo', function onComplete(){
                if(currentBackground!=null){
                    currentBackground.remove();
                }
                currentBackground = newBackground;
                if(callBackComplete!=null){
                    try{
                        callBackComplete();
                        callBackComplete=null;
                    }catch(e){}
                }
            });
        }        
    }
    
    var callBackComplete;
    this.showBackCallBack = function(callBackCompleteF){
        callBackComplete = callBackCompleteF;
    }
    
    function resizeBackground(){
        resizeBack(currentBackground);
    }
    
    function resizeBack(backUI){
        if(backUI!=null){
            backUI.css('height', $(window).height()+'px');
            var img = (backUI.find('img'));
            if(backUI.width()<img.width()){
                //center position
                img.css('left', (backUI.width()/2-img.width()/2)+'px');
            }else{
                //stretch
                img.css('left', '0px');
                img.css('width', backUI.width()+'px');            
            }
            if(backUI.height()<img.height()){
                //center position
                img.css('top', (backUI.height()/2-img.height()/2)+'px');
            }else{
                //stretch
                img.css('top', '0px');
                img.css('height', backUI.height()+'px');
            }            
        }        
    }
    
}
