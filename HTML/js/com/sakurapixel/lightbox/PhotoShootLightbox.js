//items {imgURL: val, itemDescription: val}
function PhotoShootLightbox(items, startIndex){
    
    var lightBoxImageMouseMove = false;//change to false if you don't want image to move'
    
    var galleryItems = items;
    var currentIndex = startIndex;
    var preloader;
    
    init();
    /**
     * init lightbox container
     */
    function init(){
        //main lightbox container
        $('<div id="photoShootLightbox"></div>').appendTo($('#contentWrapper'));
        $('#photoShootLightbox').css('position', 'fixed');
        $('#photoShootLightbox').css('top', '0px');
        $('#photoShootLightbox').css('left', '0px');
        $('#photoShootLightbox').css('width', '100%');
        $('#photoShootLightbox').css('height', '100%');
        $('#photoShootLightbox').css("background-image", "url('photoshootlightbox/blackBackground.png')");
        $('#photoShootLightbox').css('z-index', 9000);
                
        
        //lightbox content
        $('<div id="lightboxContent"></div>').appendTo($('#photoShootLightbox'));
        $('#lightboxContent').css('opacity', 0);
        $('#lightboxContent').css('position', 'absolute');
        $('#lightboxContent').css('z-index', 2001);
        $('#lightboxContent').css('width', '80%');
        $('#lightboxContent').css('height', '80%');
        $('#lightboxContent').css('background-color', '#FFFFFF');
        $('#lightboxContent').animate({
            opacity: 1
        }, 200);
        
        //image content
        $('<div id="imageContent"></div>').appendTo($('#lightboxContent'));
        $('#imageContent').css('background-color', '#0e0e0e');
        $('#imageContent').css('position', 'relative');
        $('#imageContent').css('left', '10px');
        $('#imageContent').css('top', '10px');
        $('#imageContent').css('overflow', 'hidden');
        
        $('#imageContent').bind('mousemove', function(event){
            onMouseMove(event);            
        });
                
        
        //left button
        $('<div id="leftBTN"><img src="photoshootlightbox/left_btn.png" alt="left" /></div>').appendTo($('#lightboxContent'));
        $('#leftBTN').css('position', 'absolute');
        $('#leftBTN').css('z-index', 2005);
        $('#leftBTN').css('left', '-40px');
        $('#leftBTN').css('cursor', 'pointer');
        $('#leftBTN').hover(function(){
            $(this).css('left', '-41px');
        }, function(){
            $(this).css('left', '-40px');
        });
        $('#leftBTN').click(function(){
            currentIndex--;
            openImage(currentIndex);
        });
        
        //right button
        $('<div id="rightBTN"><img src="photoshootlightbox/right_btn.png" alt="right" /></div>').appendTo($('#lightboxContent'));
        $('#rightBTN').css('position', 'absolute');
        $('#rightBTN').css('z-index', 2006);
        $('#rightBTN').css('right', '-40px');
        $('#rightBTN').css('cursor', 'pointer');
        $('#rightBTN').hover(function(){
            $(this).css('right', '-41px');
        }, function(){
            $(this).css('right', '-40px');
        });
        $('#rightBTN').click(function(){
            currentIndex++;
            openImage(currentIndex);
        });                       
        
        //close lightbox button
        $('<div id="lightboxClose"><img src="photoshootlightbox/close_lightbox.png" alt="" /></div>').appendTo($('#lightboxContent'));
        $('#lightboxClose').css('position', 'absolute');
        $('#lightboxClose').css('z-index', 2010);
        $('#lightboxClose').css('top', '0px');
        $('#lightboxClose').css('right', '0px');
        $('#lightboxClose').css('cursor', 'pointer');
        $('#lightboxClose').click(function(){
            try{
                $('#imageContent').unbind("mousemove");
            }catch(e){}
            $('#photoShootLightbox').animate({
            opacity: 0
            }, 300, 'easeOutQuint', function onComplete(){
               $('#photoShootLightbox').remove(); 
            });            
        });
        
        //text container
        $('<div id="textContainer"></div>').appendTo($('#lightboxContent'));
        $('#textContainer').css('position', 'absolute');
        $('#textContainer').css('z-index', 2020);
        $('#textContainer').css('bottom', '-50px');
        $('#textContainer').css('height', '40px');
        $('#textContainer').css('overflow', 'hidden');
        $('<p id="txt"></p>').appendTo($('#textContainer'));
        $('#txt').css('width', '100%');
        $('#txt').css('font-family', 'Open Sans, sans-serif');
        $('#txt').css('font-weight', '300');
        $('#txt').css('font-size', '20px');
        $('#txt').css('position', 'relative');
        $('#txt').css('color', '#FFFFFF');
        $('#txt').css('text-align', 'center');
        $('#txt').css('height', '22px');
        $('#txt').css('overflow', 'hidden');
        $('#txt').css('opacity', 0);

        //preloader
        $('<div id="lightBoxPreloader"><img src="photoshootlightbox/preloader.gif" /></div>').appendTo($('#photoShootLightbox'));
        preloader = $('#lightBoxPreloader');
        preloader.css('position', 'absolute');
        preloader.css('z-index', 2050);
        
        
        //lightbox restrict
        $('<div id="restrictLightbox"></div>').appendTo($('#photoShootLightbox'));
        $('#restrictLightbox').css('position', 'fixed');
        $('#restrictLightbox').css('width', '100%');
        $('#restrictLightbox').css('height', '100%');
        $('#restrictLightbox').css('z-index', 2100);        
        
                     
        //add resize listener
        $(window).resize(function(){
            widowResized();
        });
        widowResized();
        showPreloader(false);
        openImage(currentIndex);        
    }
    
    var loadingNewImage=false;
    //move picture
    function onMouseMove(e){
        if(!lightBoxImageMouseMove){
            return;
        }
        if(loadingNewImage){
            return;
        }
        if(currentImageUI==null||currentImageUI==undefined){
            return;
        }
        var img = currentImageUI.find('img');
        if(img.width()<$('#imageContent').width() && img.height()<$('#imageContent').height()){
            return;
        }
        
        var mouseCoordsX=(e.pageX - $('#imageContent').offset().left);
        var mouseCoordsY=(e.pageY - $('#imageContent').offset().top);
        var mousePercentX=mouseCoordsX/$('#imageContent').width();
        var mousePercentY=mouseCoordsY/$('#imageContent').height();
                
        var xratio = (img.width() - $('#imageContent').width())/($('#imageContent').width()); //Map the difference of the picframe and the width of the image to the mouseX of the picframe as a ratio.
        var yratio = (img.height() - $('#imageContent').height())/($('#imageContent').height());
        
        var xoff = -mouseCoordsX * xratio; //We want the mouseX of the frame, not the stage so it starts at 0
        var yoff = -mouseCoordsY * yratio; //same for the mouseY.                
      
        currentImageUI.stop().animate({
            left: xoff,
            top: yoff
        }, 2000, 'easeOutCirc');                                                     
    }
    
    //check display left right buttons
    function checkLeftRightButtons(){
        if(currentIndex<=0){
            currentIndex = 0;
            $('#leftBTN').css('visibility', 'hidden');
        }else{
            $('#leftBTN').css('visibility', 'visible');
        }
        if(currentIndex>=galleryItems.length-1){
            currentIndex = galleryItems.length-1;
            $('#rightBTN').css('visibility', 'hidden');
        }else{
            $('#rightBTN').css('visibility', 'visible');
        }
    }
    
    var currentText;
    function openImage(index){
        loadingNewImage = true;
        try{
            currentImageUI.stop();
        }catch(e){}
        currentText = "";
        showRestrict(true);
        checkLeftRightButtons();
        showPreloader(true);
        try{
            currentText = galleryItems[index].itemDescription;
        }catch(e){}        
        loadImage(galleryItems[index].imgURL, imageLoaded);
    }
    
    var currentImageUI;
    var tempImageUI;
    function imageLoaded(img){
        loadingNewImage = false;
        showPreloader(false);
        if(currentImageUI!=null&&currentImageUI!=undefined){
            removeExistingImage();
        }
        tempImageUI = $('<div></div>');
        img.appendTo(tempImageUI);
        tempImageUI.appendTo($('#imageContent'));
        $('#imageContent img').bind('contextmenu', function(e){
    return false;
}); 
        tempImageUI.css('opacity', 0);     
        showNewImage();        
    }
    //remove existing image
    function removeExistingImage(){
        currentImageUI.animate({
           opacity: 0 
        }, 300, 'easeInQuad', function onComplete(){
            currentImageUI.remove();
        });
        $('#txt').animate({
            opacity: 0
        }, 300, 'easeInQuad');        
    }
    function showNewImage(){
        var img = tempImageUI.find('img');
        tempImageUI.css('position', 'relative');
        tempImageUI.css('left', $('#imageContent').width()/2-img.width()/2);
        tempImageUI.css('top', $('#imageContent').height()/2-img.height()/2);
        checkResponsiveImage(tempImageUI);
        tempImageUI.animate({
           opacity: 1 
        }, 700, 'easeInQuad', function onComplete(){
            currentImageUI = tempImageUI;
            showRestrict(false);
            //add text
            $('#txt').css('opacity', 0);
            $('#txt').html(currentText);
            $('#txt').animate({
                opacity: 1
            }, 700, 'easeOutQuad');                        
        });        
    }
    
    function showPreloader(val){
        if(val){
            preloader.css('visibility', 'visible');
        }else{
            preloader.css('visibility', 'hidden');
        }
    }
    
    //restrict click
    function showRestrict(val){
        if(val){
            $('#restrictLightbox').css('visibility', 'visible');
        }else{
            $('#restrictLightbox').css('visibility', 'hidden');
        }
    }
    
    function loadImage(path, successCallBack){
        var _url = path;
        var _im =$("<img />");
        _im.bind("load",function(){ 
                successCallBack($(this));
            });
        _im.attr('src',_url);
    }
    
    /**
     * resize image within the lightbox
     */
    function checkResponsiveImage(imageUI){
        if(!lightBoxImageMouseMove){
           if(imageUI!=undefined){
               var img = imageUI.find('img');
               var responsiveTriger = 80;
               if(img.width() > ($('#lightboxContent').width()+responsiveTriger) && img.height() > ($('#lightboxContent').height()+responsiveTriger)){
                    img.css('width', $('#lightboxContent').width()+'px');   
               }
               if(img.width() < ($('#lightboxContent').width()-responsiveTriger) && img.height() < ($('#lightboxContent').height()-responsiveTriger)){
                    img.css('width', $('#lightboxContent').width()+'px');   
               }                                
               imageUI.css('left', $('#imageContent').width()/2-img.width()/2);
               imageUI.css('top', $('#imageContent').height()/2-img.height()/2);                               
           }           
        }          
    }
    
    /**
     * resized window
     */
    function widowResized(){
        $('#lightboxContent').css('top', $('#photoShootLightbox').height()/2-$('#lightboxContent').height()/2);
        $('#lightboxContent').css('left', $('#photoShootLightbox').width()/2-$('#lightboxContent').width()/2);
        
        $('#imageContent').css('width', $('#lightboxContent').width()-20+'px');
        $('#imageContent').css('height', $('#lightboxContent').height()-20+'px');
        
        
        checkResponsiveImage(currentImageUI);    
        
        $('#textContainer').css('width', $('#lightboxContent').width());
        
        preloader.css('top', $('#photoShootLightbox').height()/2-50/2);
        preloader.css('left', $('#photoShootLightbox').width()/2-50/2);
        
        $('#leftBTN').css('top', $('#lightboxContent').height()/2-37/2+'px');
        $('#rightBTN').css('top', $('#lightboxContent').height()/2-37/2+'px');
        
        if(!lightBoxImageMouseMove){
            return;
        }
        if(currentImageUI!=null && currentImageUI!=undefined){
            var img = currentImageUI.find('img');
            currentImageUI.css('left', $('#imageContent').width()/2-img.width()/2);
            currentImageUI.css('top', $('#imageContent').height()/2-img.height()/2);
        }            
    }
}
