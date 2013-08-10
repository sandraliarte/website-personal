

/**
 * GEneric button, two states button
 * @param {JQuery Object} btn
 * @param {URL-String} img1
 * @param {URL-String} img2
 */
function GenericButton(btn, img1, img2){
    
    var id = uid();
    
    $('<div class="container"></div>').appendTo(btn);
    var offBTN = $('<div class="off"><img src="'+img1+'" /></div>').appendTo(btn.find('.container'));
    var onnBTN = $('<div class="off"><img src="'+img2+'" /></div>').appendTo(btn.find('.container'));
    
    btn.find('.container').css('position', 'relative');
    offBTN.css('position', 'absolute');
    offBTN.css('top', '0px');
    onnBTN.css('position', 'absolute');
    onnBTN.css('top', '0px');
    
    
    var selectedVal;
    this.isSelected = function(val){
        selectedVal = val;
        if(val){
            offBTN.css('visibility', 'hidden');
            onnBTN.css('visibility', 'visible');
            btn.css('cursor', 'default');
        }else{
            offBTN.css('visibility', 'visible');
            onnBTN.css('visibility', 'hidden');
            btn.css('cursor', 'pointer');           
        }
    }
    
    var clickCall;
    //click callback
    this.clickCallback = function(clickCallF){
        clickCall = clickCallF;
    }
    
    btn.click(function(){
        if(!selectedVal){
            if(clickCall!=null&&clickCall!=undefined){
                clickCall(id);                
            }
        }
    });
    
    this.getID = function(){
        return id;
    }
    
    //generate unique ID
    function uid() {
        var S4 = function() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }    
}

/**
 * Start tootlip class
 */

function Tooltip(targetUI, tooltipContainer){
    
    var tooltipTxt = targetUI.attr('title');
    if(tooltipTxt!=undefined){                
        targetUI.attr('title', '');         
        targetUI.hover(function(){
            //add tooltip
            Tooltip.showTooltip(tooltipTxt, tooltipContainer, targetUI);
        }, function(){
            //remove tooltip
            Tooltip.removeTooltip();
        });
        targetUI.click(function(){
            Tooltip.removeTooltip();
        });
    }

}
Tooltip.uiInstance = null;
Tooltip.showTooltip = function(txt, tooltipContainer, targetUI){
    Tooltip.removeTooltip(); 
        $('<div id="toolTT"></div>').appendTo(tooltipContainer);
        Tooltip.uiInstance = $('#toolTT');
        Tooltip.uiInstance.css('opacity', 0);        

        Tooltip.uiInstance.css('height', '54px');        
        Tooltip.uiInstance.css('position', 'absolute');
        Tooltip.uiInstance.css('z-index', 40000);
        //add look and feel
        
        //add background container
        $('<div id="tooltipBackground"></div>').appendTo(Tooltip.uiInstance);
        $('#tooltipBackground').css('position', 'relative');
        $('#tooltipBackground').css('left', '0px');
        $('#tooltipBackground').css('top', '0px');        
        
        //add text container
        var extraMargin = 5;
        $('<div id="tooltipText">'+txt+'</div>').appendTo(Tooltip.uiInstance);
        $('#tooltipText').css('position', 'relative');
        $('#tooltipText').css('left', '0px');
        $('#tooltipText').css('top', '-54px');
        $('#tooltipText').css('margin-left', 8+extraMargin+'px');
        $('#tooltipText').css('margin-right', 12+extraMargin+'px');
        $('#tooltipText').css('margin-top', '17px');
                
        $('#tooltipBackground').css('width', $('#tooltipText').width()+8+12+extraMargin*2+'px');
        $('#tooltipBackground').css('height', '54px');
        
        //add backgrounds
        $('<div id="leftBTooltip"></div>').appendTo($('#tooltipBackground'));
        $('<div id="middleBTooltip"></div>').appendTo($('#tooltipBackground'));
        $('#middleBTooltip').css('width', $('#tooltipText').width()+extraMargin*2+'px');
        $('<div id="rightBTooltip"></div>').appendTo($('#tooltipBackground'));
        
        var offset = targetUI.offset();
        
        Tooltip.uiInstance.css('top', offset.top+'px');
        Tooltip.uiInstance.css('left', (offset.left-Tooltip.uiInstance.width()-20)+'px');
                
        Tooltip.uiInstance.stop().animate({
            opacity: 1
        }, 300);                       
}
Tooltip.removeTooltip = function(){
    //return;
    try{
        Tooltip.uiInstance.stop().remove();
    }catch(e){}
}



/**
 * End tooltip class
 */
