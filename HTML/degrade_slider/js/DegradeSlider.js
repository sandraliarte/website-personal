function DegradeSlider(sliderContainerID, options){
   
   var sliderContainer = $('#'+sliderContainerID);
   addHTML();
   (options==undefined||options==null)?options=new Object():null;   
   options.normalWidth = sliderContainer.width();
   options.normalHeight = sliderContainer.height();
   validateOptions();
      
   var slides = [];
   var scaleProportion;
   init();
   
   //init slider
   function init(){
       sliderContainer.css('width', options.normalWidth+'px');
       sliderContainer.css('height', options.normalHeight+'px');
       if(options.autoScale){          
           scaleProportion = (options.normalHeight*100)/options.normalWidth;
           sliderContainer.css('width', '100%');
           sliderContainer.css('max-width', options.normalWidth+'px');
       }
       
       if(options.showSliderBackground){
           //show background
           sliderMargin = 20;                      
           sliderContainer.find('.degradeSliderBackground').css('background-color', options.sliderBackgroundColor);
           sliderContainer.find('.degradeSliderBackground').css('opacity', options.sliderBackgroundOpacity);
           if(options.sliderShowBorder){
               sliderContainer.find('.sliderBorder').css('border-color', options.sliderBorderColor);
           }else{
               sliderContainer.find('.sliderBorder').remove();
           }
       }else{
           //no background
           sliderMargin = 0;
       }
       sliderContainer.find('.slidesContent').css('margin', sliderMargin/2+'px');
              
       sliderContainer.find('.degradeSlide').each(function(index){           
           var captions=[];
           $(this).find('.captionItem').each(function(indx){
               var captionHTML = $(this).html();
               var captionProperties = buildCaptionItemProps($(this));
               captions.push({captionProperties:captionProperties, captionHTML:captionHTML});
           });           
           //save slide image and slide captions           
           slides.push({imageURL: $(this).find('.degradeSlideImage').attr('src'), captions: captions});           
           $(this).remove();                      
       });
       
       //check shadow option
       if(!options.showShadow){
           try{
                sliderContainer.find('.degradeSliderShadow').css('display', 'none');
           }catch(e){}
       }else{
           //check shadow type
           checkShadowType();
       }
       //check bottom corners option
       if(!options.showBottomCorners){
           try{
                sliderContainer.find('.degradeSliderLeftCorner').remove();
                sliderContainer.find('.degradeSliderRightCorner').remove();
           }catch(e){}
       }else{
           //select corner style
           selectCornerStyle();
       }
       
       //check center buttons existence
       if(!options.showCenterButtons){
           try{
                sliderContainer.find('.centerButtons').remove();
           }catch(e){}
       }else{       
          //center buttons initial width
          sliderContainer.find('.centerButtons').css('width', sliderMargin*2+'px');
          //check center bulttons background
          if(!options.showCenterButtonsBackground){
              sliderContainer.find('.centerButtonsBackground').css('opacity', 0);
              sliderContainer.find('.centerButtons').css('border', 'none');
          }
       }
       //check key navigation availabiliy
       if(options.enableKeyboardNav){
           enableKeyNavigation();
       }
       
       //slider left right navigation
       if(options.showLeftRightNav){
           var obj = selectLeftRightNavStyle();
           leftBtn = new GenericArrowButton(sliderContainer.find('.sliderLeftArrow'), obj.left, options);
           leftBtn.isEnabled(false);
           leftBtn.clickCallback(navigateLeft);
           rightBtn = new GenericArrowButton(sliderContainer.find('.sliderRightArrow'), obj.right, options);
           rightBtn.isEnabled(false);
           rightBtn.clickCallback(navigateRight);
           sliderContainer.find('.sliderLeftArrow').css('opacity', 0);
           sliderContainer.find('.sliderRightArrow').css('opacity', 0);                    
       }else{
           sliderContainer.find('.sliderLeftArrow').remove();
           sliderContainer.find('.sliderRightArrow').remove();
       }
       
       //check inner border
       if(options.sliderShowInnerBorder){
           //border color
           sliderContainer.find('.degradeInnerBorderLeft').css('background-color', options.sliderInnerBorderColor);
           sliderContainer.find('.degradeInnerBorderTop').css('background-color', options.sliderInnerBorderColor);
           sliderContainer.find('.degradeInnerBorderRight').css('background-color', options.sliderInnerBorderColor);
           sliderContainer.find('.degradeInnerBorderBottom').css('background-color', options.sliderInnerBorderColor);                  
       }else{
           sliderContainer.find('.degradeInnerBorderLeft').remove();
           sliderContainer.find('.degradeInnerBorderTop').remove();
           sliderContainer.find('.degradeInnerBorderRight').remove();
           sliderContainer.find('.degradeInnerBorderBottom').remove();            
       }
       
       //ceck slides number
       if(slides.length==1){
           //hide center buttons and arrows           
           try{
               options.showLeftRightNav = false;
               options.showCenterButtons = false;
               sliderContainer.find('.sliderLeftArrow').remove();
               sliderContainer.find('.sliderRightArrow').remove();
               sliderContainer.find('.centerButtons').remove();
               //dotButton
           }catch(e){}
       }
       
       //check autoplay option
       if(options.autoPlay){
           if(slides.length==1){
               return;
           }
           sliderContainer.hover(function(){
               if(options.pauseAutoplayOnHover){
                   stopAutoplay();
               }
           }, function(){
               if(options.pauseAutoplayOnHover){
                   startAutoPlay();
               }               
           });
           if(options.autoPlayStopAtEnd){
               autoPlayStopAtTheEnd = true;
           }
           startAutoPlay();
       }
       
       //check full screen option
       if(options.enableFullScreen){
           addFullScreenSupport();
       }else{
            //remove fs buttons            
            $('.fullScreenButtons').remove();           
       }
       
       countLoadedImages = -1;
       currentSlideNo = 0;
       centerButtons = [];
       loadSlides();      
       resizeEvent();
   }
   
   //var fsUtil;
   //add full screen support
   function addFullScreenSupport(){
        var fsUtil = new FullScreenUtil(document.getElementById(sliderContainerID));
        if(fsUtil.isFullScreenAvailable()){
            //show fs buttons
            fsUtil.setStateCallBack(fullScreenStatus);
            var tooltipOff = new Tooltip(sliderContainer.find('.fs_off'), sliderContainer);
            var tooltipOnn = new Tooltip(sliderContainer.find('.fs_on'), sliderContainer);           
            sliderContainer.find('.fs_off').click(function(){
                sliderContainer.find('.degradeShineContainer').css('visibility', 'hidden');
                fsUtil.enterFullScreen();
            });
            if(fsUtil.isExitFullScreenAvailable){
                sliderContainer.find('.fs_on').click(function(){
                    fsUtil.exitFullScreen();
                });                
            }else{
                sliderContainer.find('.fs_on').css('opaciy', 0);
            }
            fullScreenStatus(false);
        }else{
            //remove fs buttons            
            sliderContainer.find('.fullScreenButtons').remove();
        }
        
        sliderContainer.find('.fs_off').click(function(){
            fsUtil.enterFullScreen();
        });        
   }
   //full screen status
   function fullScreenStatus(val){
        if(val){                        
            sliderContainer.find('.fs_on').css('visibility', 'visible');
            sliderContainer.find('.fs_off').css('visibility', 'hidden');
            sliderContainer.find('.degradeShineContainer').css('visibility', 'hidden');            
        }else{
            sliderContainer.find('.fs_on').css('visibility', 'hidden');
            sliderContainer.find('.fs_off').css('visibility', 'visible');
            sliderContainer.find('.degradeShineContainer').css('visibility', 'visible');            
        }
   }
   //end full screen 
    
   
   var autoPlayStopAtTheEnd;
   var autoplayInterval;
   var imediatellyStopAutoplay;
   //start autoplay
   function startAutoPlay(){
       if(imediatellyStopAutoplay){
           return;
       }
       try{
            autoplayInterval = setInterval(autoplayTimeEvent, options.autoPlayInterval);
       }catch(e){}
   }
   //autoplay time event
   function autoplayTimeEvent(){
       currentSlideNo++;
       if(currentSlideNo==slides.length){           
           if(autoPlayStopAtTheEnd){
               imediatellyStopAutoplay = true;
               stopAutoplay();
               currentSlideNo=slides.length-1;
               return;
           }
           currentSlideNo=0;
       }
       goToCurrentSlide();
   }
   
   //stop autoplay
   function stopAutoplay(){
       try{
           clearInterval(autoplayInterval);
       }catch(e){}
   }
   
   //navigate left
   function navigateLeft(){
       imediatellyStopAutoplay = true;
       if(currentSlideNo>0){
           currentSlideNo--;
           goToCurrentSlide();
       }      
   }
   //navigate right
   function navigateRight(){
       imediatellyStopAutoplay = true;
       if(currentSlideNo<slides.length-1){
           currentSlideNo++;
           goToCurrentSlide();
       }      
   }   
   
   var leftBtn;
   var rightBtn;
   //left / reight navigation style
   function selectLeftRightNavStyle(){
       var left;
       var right;
       switch(options.leftRightNavType){
           case "Nav01":
               left = "degrade_slider/img/left_right_nav/left_arrow_01.png";
               right = "degrade_slider/img/left_right_nav/right_arrow_01.png";
           break;
           case "Nav02":
               left = "degrade_slider/img/left_right_nav/left_arrow_02.png";
               right = "degrade_slider/img/left_right_nav/right_arrow_02.png";
           break;
           case "Nav03":
               left = "degrade_slider/img/left_right_nav/left_arrow_03.png";
               right = "degrade_slider/img/left_right_nav/right_arrow_03.png";
           break;
           case "Nav04":
               left = "degrade_slider/img/left_right_nav/left_arrow_04.png";
               right = "degrade_slider/img/left_right_nav/right_arrow_04.png";
           break;                                 
           default:
               left = "degrade_slider/img/left_right_nav/left_arrow_01.png";
               right = "degrade_slider/img/left_right_nav/right_arrow_01.png";           
       }
       return {left: left, right:right};
   }
   
   //select corner style
   function selectCornerStyle(){
       var left = "corner_style1_left.png";
       var right = "corner_style1_right.png";       
       switch(options.bottomCornersStyle){
           case "CornerStyle01":
                left = "corner_style1_left.png";
                right = "corner_style1_right.png";
           break;
           case "CornerStyle02":
                left = "corner_style2_left.png";
                right = "corner_style2_right.png";
           break;
           case "CornerStyle03":
                left = "corner_style3_left.png";
                right = "corner_style3_right.png";
           break;
           case "CornerStyle04":
                left = "corner_style4_left.png";
                right = "corner_style4_right.png";
           break;                                 
           
           default:
                left = "corner_style1_left.png";
                right = "corner_style1_right.png";           
       }
       var leftImg = $('<img src="degrade_slider/img/corners/'+left+'" />');
       var rightImg = $('<img src="degrade_slider/img/corners/'+right+'" />');
       leftImg.appendTo(sliderContainer.find('.degradeSliderLeftCorner'));
       rightImg.appendTo(sliderContainer.find('.degradeSliderRightCorner'));
   }
   
   //enable key navigation
   function enableKeyNavigation(){
        $(this).keydown(function(event) {
          if (event.which == 13) {
             event.preventDefault();
           }
           if(event.keyCode==39){
               if(currentSlideNo<slides.length-1){
                   currentSlideNo++;
                   goToCurrentSlide();
               }
           }
           if(event.keyCode==37){
               if(currentSlideNo>0){
                   currentSlideNo--;
                   goToCurrentSlide();
               }
           }           
        });       
   }
   
   var currentSlideNo=0;
   //drag behavior
   function initDragBehavior(){
       if(!options.enableTouchDragSlides){
           return;
       }
       if(options.showDragCursor){
           sliderContainer.find('.degradeSlides').css('cursor', 'move');
       }
       sliderContainer.find('.degradeSlides').draggable({axis: 'x', drag: function(event, ui){
           if(ui.position.left>100){               
               return false;
           }           
           var containerW = -sliderContainer.find('.degradeSlides').width();
           if(ui.position.left<(containerW+(currentWidth-sliderMargin)-100)){                             
               return false;
           }           
       }, stop: function(event,ui){
           validateDraggablePozition(ui.position.left);
           //switch slide
           var originalLeft = ui.originalPosition.left;
           var currentLeft = ui.position.left;
           if(originalLeft>currentLeft){
               imediatellyStopAutoplay = true;
               //has been dragged left
               if(currentLeft<originalLeft-50 && currentSlideNo<(slides.length-1)){
                   //get next slide
                   currentSlideNo++;
                   goToCurrentSlide();
               }else{
                   goToCurrentSlide();
               }
           }else{
               imediatellyStopAutoplay = true;
               //has been dragged right
               if(currentLeft>originalLeft+50 && currentSlideNo>0){
                   //previous slide
                   currentSlideNo--;
                   goToCurrentSlide();
               }else{
                   goToCurrentSlide();
               }
           }               
       }});
   }
   
   //build captionItem properties
   function buildCaptionItemProps(objUI){
       var properties = {positionX:"0", positionY:"0", animation:"None", animationType:"easeOutQuint", animationDuration: 500, delayAnimation:0, isBackground: false, backgroundColor: "#212121", backgrondTransparency: .5, fullWidthVideo: "false", videoOriginalW: 0, videoOriginalH:0};       
       properties.positionX = validateItemCaptionProp(properties.positionX, objUI.attr('data-positionX'));
       properties.positionY = validateItemCaptionProp(properties.positionY, objUI.attr('data-positionY'));
       properties.animation = validateItemCaptionProp(properties.animation, objUI.attr('data-animation'));
       properties.animationType = validateItemCaptionProp(properties.animationType, objUI.attr('data-animationType'));
       properties.animationDuration = validateItemCaptionProp(properties.animationDuration, objUI.attr('data-animationDuration'));
       properties.delayAnimation = validateItemCaptionProp(properties.delayAnimation, objUI.attr('data-delayAnimation'));
       properties.isBackground = validateItemCaptionProp(properties.isBackground, objUI.attr('data-isBackground'));
       properties.backgroundColor = validateItemCaptionProp(properties.backgroundColor, objUI.attr('data-backgroundColor'));
       properties.backgrondTransparency = validateItemCaptionProp(properties.backgrondTransparency, objUI.attr('data-backgrondTransparency'));
       //fullWidthVideo - used for full width video captions
       properties.fullWidthVideo = validateItemCaptionProp(properties.fullWidthVideo, objUI.attr('data-fullWidthVideo'));       
       if(properties.fullWidthVideo=="true"){
         properties.videoOriginalW = objUI.find('iframe').width();
         properties.videoOriginalH = objUI.find('iframe').height();
       }
       properties.percentX=(properties.positionX*100)/options.normalWidth;
       properties.percentY=(properties.positionY*100)/options.normalHeight;                                 
       return properties;
   }
   //validate caption item prop
   function validateItemCaptionProp(defaultvalue, incommingValue){
       var val = defaultvalue;
       if(incommingValue!=null && incommingValue!=undefined){
           val = incommingValue;
       }
       return val;      
   }
   
   var currentSlideIndex=-1;
   //go to current slide
   function goToCurrentSlide(){
       var slideW = currentWidth-sliderMargin;
       sliderContainer.find('.degradeSlides').stop().animate({
               left: -(currentSlideNo*slideW)+'px'
       }, options.slideAnimationDuration, options.slideAnimationType, function onComplete(){
           //prevent caption animation on resize
           if(currentSlideIndex!=currentSlideNo){
              showCurrentSlideCaptions();
           }
       });
       checkLeftRightButtonAvailability();       
       selectSpecificCenterButton(currentSlideNo);                   
   }
   
   //check left/right buttons
   function checkLeftRightButtonAvailability(){      
       if(options.showLeftRightNav){
           if(currentSlideNo<=0){
               leftBtn.isEnabled(false);
           }else{
               leftBtn.isEnabled(true);
           }
           if(currentSlideNo<slides.length-1){
               rightBtn.isEnabled(true);
           }else{
               rightBtn.isEnabled(false);
           }
       }       
   }
   
   //show current slide captions
   function showCurrentSlideCaptions(){
       var slide = slides[currentSlideNo].jquerySlide;
       for(var i=0;i<slides[currentSlideNo].captions.length;i++){ 

          var captionItem = slides[currentSlideNo].captions[i].captionJquery;
          captionItem.appendTo(slide);

           positionCaptionBeforeAnimation(captionItem, slides[currentSlideNo].captions[i].captionProperties);
           animateCaptionsIn(slides[currentSlideNo].captions[i].captionJquery, slides[currentSlideNo].captions[i].captionProperties);
       }
       try{
          removePreviousSlideCaptions();
       }catch(e){};
       currentSlideIndex =  currentSlideNo;
   }
   
   //remove previous slide captions
   function removePreviousSlideCaptions(){
       for(var i=0;i<slides.length;i++){
          ///*
           if(i!=currentSlideNo){
               for(var j=0;j<slides[i].captions.length;j++){
                   var captionObj = slides[i].captions[j];
                   captionObj.captionJquery.remove();
               }
           }
           //*/
       }
   }
   
   function positionCaptionBeforeAnimation(captionUI, properties){
       if(captionUI==undefined||captionUI==null){
           return;
       }
       switch(properties.animation){
           case "None":
              captionUI.css('left', properties.positionX);
              captionUI.css('top', properties.positionY);
           break;
           case "FadeIn":
              captionUI.css('left', properties.positionX);
              captionUI.css('top', properties.positionY);
           break;
           case "SlideFromLeft":           
              captionUI.css('left', -captionUI.width()+'0px');
              captionUI.css('top', properties.positionY);
           break;
           case "SlideFromRight":           
              captionUI.css('left', slides[currentSlideNo].jquerySlide.width()+'0px');
              captionUI.css('top', properties.positionY);
           break;
           case "SlideFromTop":           
              captionUI.css('left', properties.positionX);
              captionUI.css('top', -captionUI.height()+'px');
           break;
           case "SlideFromBottom":           
              captionUI.css('left', properties.positionX);
              captionUI.css('top', slides[currentSlideNo].jquerySlide.height()+'px');
           break;                                                         
           default:
              captionUI.css('left', properties.positionX);
              captionUI.css('top', properties.positionY);           
       }
       //captionUI.css('opacity', 0);
       //captionUI.css('visibility', 'hidden');   
   }
   
   function animateCaptionsIn(captionUI, properties){
       if(captionUI==undefined||captionUI==null){
           return;
       }    
       //captionUI.css('opacity', 0).css('visibility', 'visible');
       //captionUI.css('visibility', 'visible');
       captionUI.stop().delay(properties.delayAnimation).animate({
           left: properties.positionX+'px',
           top: properties.positionY+'px',
           opacity: 1
       },  parseInt(properties.animationDuration), properties.animationType);     
   }
   
   //validate left/right draggable
   function validateDraggablePozition(left){
           if(left>0){               
               sliderContainer.find('.degradeSlides').stop().animate({
                   left: '0px'
               }, 500, 'easeOutQuint');
           }
           var containerW = -sliderContainer.find('.degradeSlides').width();
           if(left<(containerW+(currentWidth-sliderMargin))){                             
               sliderContainer.find('.degradeSlides').stop().animate({
                   left: (containerW+(currentWidth-sliderMargin))+'px'
               }, 500, 'easeOutQuint');
           }       
   }
   
   var countLoadedImages=0;
   var centerButtons;
   /**
    * load slides images
    */
   function loadSlides(){
       countLoadedImages++;
       if(countLoadedImages<slides.length){           
           if(countLoadedImages==0){
               //show preloader, remove shadow, remove shine
               if(!options.showSliderPreloader){
                   sliderContainer.find('.degradeSliderPreloader').css('visibility', 'hidden');
               }               
               if(options.showShadow){
                   sliderContainer.find('.degradeSliderShadow').css('opacity', 0);
               }
               sliderContainer.find('.degradeShineContainer').css('visibility', 'hidden');
           }
           //return;               
           var ajxReq = new JQueryAjax();
           ajxReq.loadImage(slides[countLoadedImages].imageURL, function success(img){
               var slide = $('<div class="degradeSlide"></div>');
               slide.appendTo(sliderContainer.find('.degradeSlides'));
               slides[countLoadedImages].jquerySlide = slide;
               img.appendTo(slide);
               img.addClass('degradeSlideImage');
                             
               //add captions               
               for(var i=0;i<slides[countLoadedImages].captions.length;i++){
                   var captionItem = $('<div class="captionItem"><div class="captionItemBackground"></div></div>');
                   $('<div class="captionItemContent"></div>').appendTo(captionItem);
                   captionItem.css('opacity', 0);
                   //captionItem.appendTo(slide);                   
                   $(slides[countLoadedImages].captions[i].captionHTML).appendTo(captionItem.find('.captionItemContent'));                   
                   slides[countLoadedImages].captions[i].captionJquery = captionItem;
                   //add caption properties
                   if(slides[countLoadedImages].captions[i].captionProperties.isBackground!="true"){
                       captionItem.find('.captionItemBackground').remove();
                       captionItem.find('.captionItemContent').css('padding', '0px');
                   }else{
                       captionItem.find('.captionItemBackground').css('background-color', slides[countLoadedImages].captions[i].captionProperties.backgroundColor);
                       captionItem.find('.captionItemBackground').css('opacity', slides[countLoadedImages].captions[i].captionProperties.backgrondTransparency);
                   } 
                                    
                   
                   captionItem.css('left', slides[countLoadedImages].captions[i].captionProperties.positionX+'px');
                   captionItem.css('top', slides[countLoadedImages].captions[i].captionProperties.positionY+'px');
               }                              

               if(countLoadedImages==0){
                   img.css('opacity', 0);
                   img.animate({
                       opacity: 1
                   }, 800, 'easeOutQuint');
                   if(options.showShadow){
                       sliderContainer.find('.degradeSliderShadow').animate({
                           opacity: 1
                       }, 800, 'easeOutQuint', function onComplete(){
                           sliderContainer.find('.degradeShineContainer').css('visibility', 'visible');
                       });
                   }
                   sliderContainer.find('.degradeSliderPreloader').animate({
                       opacity: 0
                   }, 600, 'easeOutQuint', function onComplete(){
                       sliderContainer.find('.degradeSliderPreloader').remove();
                   });
                   if(options.showLeftRightNav){
                        sliderContainer.find('.sliderLeftArrow').animate({
                            opacity: 1
                        });
                        sliderContainer.find('.sliderRightArrow').animate({
                            opacity: 1
                        });                                                          
                   }
                   initDragBehavior();                   
               }
               
               if(options.showCenterButtons){
                   var btnUI = $('<div class="dotButton"></div>');
                   var dotNormal = "degrade_slider/img/center_buttons/dot_normal.png";
                   var dotSelected = "degrade_slider/img/center_buttons/dot_selected.png";
                   if(options.showCenterButtonsStyle=="Style02"){
                     dotNormal = "degrade_slider/img/center_buttons/dot_normal2.png";
                     dotSelected = "degrade_slider/img/center_buttons/dot_selected2.png";                      
                   }
                   var btn = new GenericButton(btnUI, dotNormal, dotSelected);
                   btn.clickCallback(changeSlide);
                   (countLoadedImages==0)?btn.isSelected(true):btn.isSelected(false);
                   centerButtons.push(btn);
                   var centerBTNS = sliderContainer.find('.centerButtons');        
                   centerBTNS.css('width', centerBTNS.width()+28+'px');
                   btnUI.appendTo(sliderContainer.find('.centerButtonsContainer'));
               }
               
               resizeEvent();
               loadSlides();
           });
       }else{
           //done loading
           $('<div class="clear-fx"></div>').appendTo(sliderContainer.find('.degradeSlides'));
           if(options.showCenterButtons){
                $('<div class="clear-fx"></div>').appendTo(sliderContainer.find('.centerButtonsContainer'));
           }
       }
   }
   
    //change slider content
    function changeSlide(id){
        for(var i=0;i<centerButtons.length;i++){            
            if(id==centerButtons[i].getID()){
                currentSlideNo = i;
                imediatellyStopAutoplay = true;
                goToCurrentSlide();
                break;               
            }
        }
    }
    
    //check shadow type
    function checkShadowType(){
        var shadowIndex = 0;
        switch(options.shadowType){
            case "ShadowType01":
                shadowIndex = 0;
            break;
            case "ShadowType02":
                shadowIndex = 1;
            break;
            case "ShadowType03":
                shadowIndex = 2;
            break;
            case "ShadowType04":
                shadowIndex = 3;
            break;
            case "ShadowType05":
                shadowIndex = 4;
            break;
            case "ShadowType06":
                shadowIndex = 5;
            break;
            case "ShadowType07":
                shadowIndex = 6;
            break;                                                                                    
            
            default:
             shadowIndex = 0;
        }
        var shadows = new Array('shadow1.png', 'shadow2.png', 'shadow3.png', 'shadow4.png', 'shadow5.png', 'shadow6.png', 'shadow7.png');
        //add shadow
        $('<img src="degrade_slider/img/shadows/'+shadows[shadowIndex]+'" />').appendTo(sliderContainer.find('.degradeSliderShadow'));
    }

    
    //select specific center button
    function selectSpecificCenterButton(no){
        try{
            for(var i=0;i<centerButtons.length;i++){
                centerButtons[i].isSelected(false);
                if(no==i){
                    centerButtons[i].isSelected(true);
                }
            }
        }catch(e){}
    } 
   
   
   var currentWidth;
   var currentHeight;
   var timer;
   function resizeEvent(){
       currentWidth = sliderContainer.width();
       currentHeight = sliderContainer.height();
       if(options.autoScale){
           currentHeight = (scaleProportion*currentWidth)/100;
       }              
       adjustBackground();
       adjustSlidesContainer();
       adjustCorners();
       shadowPosition();
       positionPreloader();
       positionCenterButtons();
       positionLeftRightNav();       
       calculateCaptionsPosition();
       positionInnerBorder();
       //used for API
       if(resizeCallback!=undefined && resizeCallback!=null){
           try{
               resizeCallback();
           }catch(e){}
       }
       
       clearTimeout(timer);
       timer = setTimeout(validateSlides, 700);                   
   }
   
   //position inner border
   function positionInnerBorder(){
       if(options.sliderShowInnerBorder){
           sliderContainer.find('.degradeInnerBorderLeft').css('height', currentHeight-40+'px');
           sliderContainer.find('.degradeInnerBorderTop').css('width', currentWidth-40+'px');
           sliderContainer.find('.degradeInnerBorderRight').css('height', currentHeight-40+'px');
           sliderContainer.find('.degradeInnerBorderBottom').css('width', currentWidth-40+'px');          
       }
   }
   
   //position left/right navigation
   function positionLeftRightNav(){
       if(options.showLeftRightNav){
           var leftArrow = sliderContainer.find('.sliderLeftArrow');
           leftArrow.css('left', (-leftArrow.width()-9)+options.leftNavAdjustPosition+'px');
           leftArrow.css('top', currentHeight/2-leftArrow.height()/2+'px');
           var rightArrow = sliderContainer.find('.sliderRightArrow');
           rightArrow.css('left', (currentWidth+9)+options.rightNavAdjustPosition+'px');
           rightArrow.css('top', currentHeight/2-rightArrow.height()/2+'px');           
       }
   }
   
   //calculate caption positions based on percente
   function calculateCaptionsPosition(){
       
       for(var i=0;i<slides.length;i++){
           for(var j=0;j<slides[i].captions.length;j++){                                                          
               slides[i].captions[j].captionProperties.positionX = (slides[i].captions[j].captionProperties.percentX*currentWidth)/100;
               slides[i].captions[j].captionProperties.positionY = (slides[i].captions[j].captionProperties.percentY*currentHeight)/100;
               var captionUI = slides[i].captions[j].captionJquery;
               if(captionUI!=undefined && captionUI!=null){
                   try{
                      captionUI.css('left', slides[i].captions[j].captionProperties.positionX+'px');
                      captionUI.css('top', slides[i].captions[j].captionProperties.positionY+'px');
                      if(slides[i].captions[j].captionProperties.fullWidthVideo=="true"){
                          //position slide 0,0 with all width
                        captionUI.css('left', '0px');
                        captionUI.css('top', '0px');
                        captionUI.css('width', '100%');

                        var newCaptionW = slides[i].jquerySlide.width();
                        captionUI.find('iframe').css('width', newCaptionW+'px');

                        var resizePercent = (newCaptionW*100)/slides[i].captions[j].captionProperties.videoOriginalW;

                        var newCaptionH = (slides[i].captions[j].captionProperties.videoOriginalH*resizePercent)/100;

                        captionUI.find('iframe').css('height', newCaptionH+'px');                           
                      }else{
                          //hide captions that go outside
                          if(slides[i].captions[j].captionProperties.positionX+captionUI.width()>currentWidth){
                              captionUI.css('visibility', 'hidden');
                          }else{
                              captionUI.css('visibility', 'visible');
                          }                    
                      }
                   }catch(e){}                   
               }
           }
       }
   }
   
   //position center buttons
   function positionCenterButtons(){
       if(options.showCenterButtons){
           var centerButtons = sliderContainer.find('.centerButtons');
           centerButtons.css('left', currentWidth/2-centerButtons.width()/2+'px');
           centerButtons.css('top', (currentHeight-centerButtons.height()/2)+options.centerButtonsAdjustPosition+'px');
           
       }
       //centerButtons
   }
   
   //reposition current slide on resize
   function validateSlides(){
       goToCurrentSlide();
   }
   
   //position preloader
   function positionPreloader(){
       var preloaderUI = sliderContainer.find('.degradeSliderPreloader');
       preloaderUI.css('left', currentWidth/2-preloaderUI.width()/2+'px');
       preloaderUI.css('top', currentHeight/2-preloaderUI.height()/2+'px');
   }
   
   //adjust shadow position
   function shadowPosition(){
       if(!options.showShadow){
           return;
       }
       sliderContainer.find('.degradeSliderShadow').css('top', currentHeight-10+'px');
   }
   
   //position slider corners
   function adjustCorners(){
       if(!options.showBottomCorners){
           return;
       }
       var topDistance = (currentHeight-sliderContainer.find('.degradeSliderLeftCorner').height())+3;
       sliderContainer.find('.degradeSliderLeftCorner').css('top', topDistance+'px');
       sliderContainer.find('.degradeSliderRightCorner').css('top', topDistance+'px');
   }
   
   var slidesContainerWidth=0;
   var sliderMargin;
   //slides continer
   function adjustSlidesContainer(){
       //main container / mask
       sliderContainer.find('.slidesContent').css('width', currentWidth-sliderMargin+'px');
       sliderContainer.find('.slidesContent').css('height', currentHeight-sliderMargin+'px');
       
       //slides container
       slidesContainerWidth = 0;
       sliderContainer.find('.degradeSlide').each(function(index){
           slidesContainerWidth+=(currentWidth-sliderMargin);
           $(this).find('.degradeSlideImage').css('width', (currentWidth-sliderMargin)+'px');           
       });
       
       //degradeSlides 
       sliderContainer.find('.degradeSlides').css('width', slidesContainerWidth+'px');
   }
   
   //adjust background size
   function adjustBackground(){
       //background
       sliderContainer.find('.degradeSliderBackground').css('width', currentWidth+'px');
       sliderContainer.find('.degradeSliderBackground').css('height', currentHeight+'px');
       
       //border
       sliderContainer.find('.sliderBorder').css('width', currentWidth-2+'px');
       sliderContainer.find('.sliderBorder').css('height', currentHeight-2+'px');       

       if(options.autoScale){
           sliderContainer.css('height', currentHeight+'px');
       }           
   }
   
   //add required HTML controls
   function addHTML(){
       $('<div class="degradeSliderBackground"></div><div class="degradeShineContainer"></div><div class="sliderBorder"></div><div class="degradeSliderShadow"></div>').insertBefore(sliderContainer.find('.slidesContent'));
       //preloader
       $('<div class="degradeSliderPreloader"><img src="degrade_slider/img/preloader.gif" /></div>').appendTo(sliderContainer);
       
       //inner border
       $('<div class="degradeInnerBorderLeft"></div>').appendTo(sliderContainer);
       $('<div class="degradeInnerBorderTop"></div>').appendTo(sliderContainer);
       $('<div class="degradeInnerBorderRight"></div>').appendTo(sliderContainer);
       $('<div class="degradeInnerBorderBottom"></div>').appendTo(sliderContainer);
       
       //corners
       $('<div class="degradeSliderLeftCorner"></div><div class="degradeSliderRightCorner"></div>').appendTo(sliderContainer);
       //center buttons
       $('<div class="centerButtons"><div class="centerButtonsBackground"></div><div class="centerButtonsContainer"></div></div>').appendTo(sliderContainer);
       //aside navigation
       $('<div class="sliderLeftArrow"></div><div class="sliderRightArrow"></div>').appendTo(sliderContainer);       
       //full screen button
       $('<div class="fullScreenButtons"><div class="fs_on" title="Click to exit full screen!"><img src="degrade_slider/img/full_screen/full_screen_on.png" /></div><div class="fs_off" title="Click to enter full screen!"><img src="degrade_slider/img/full_screen/full_screen_off.png" /></div></div>').appendTo(sliderContainer);                       
   }   
   
   //init default options
   function validateOptions(){
       var defaultOptions = {
           normalWidth: 800,
           normalHeight: 400,
           slideAnimationType: "easeOutQuint",
           slideAnimationDuration: 600,
           autoPlay: false,
           autoPlayInterval: 5000,
           pauseAutoplayOnHover: true,
           autoPlayStopAtEnd: true,        
           autoScale: true,
           showShadow: true,
           shadowType: 'ShadowType01',
           showBottomCorners: true,
           bottomCornersStyle: "CornerStyle01",
           showCenterButtons: true,
           showCenterButtonsBackground: false,
           centerButtonsAdjustPosition: 20,
           showCenterButtonsStyle: "Style01",
           enableKeyboardNav: true,
           showSliderBackground: true,
           sliderBackgroundColor: "#FFFFFF",
           sliderBackgroundOpacity: .2,
           sliderShowBorder: true,
           sliderBorderColor: "#FFFFFF",
           sliderShowInnerBorder: true,
           sliderInnerBorderColor: "#FFFFFF",
           showLeftRightNav: true,
           showLeftRightNavIsBackground: false,
           leftRightNavBackgroundColor: "#212121",
           leftRightNavType: "Nav04",
           leftNavAdjustPosition: 10,
           rightNavAdjustPosition: -10,
           showSliderPreloader: true,
           enableTouchDragSlides: true,
           showDragCursor: false,
           enableFullScreen: true
       }       
       for(var key in defaultOptions){
           if(options[key]!=undefined && options[key]!=null){
               defaultOptions[key] = options[key];
           }
       }
       options = defaultOptions;
   }   
   
   //add resize listener
   $(window).resize(function(){
       resizeEvent();
   });
   
    /**
     * Utils
     */ 
    //extract number
    function extractNumber(pxValue){
        var striped = pxValue.substring(0, pxValue.length-2);
        var val = parseFloat(striped);
        return val;
    }
    
    
    /**
     * DEGRADE SLIDER API
     */
    //get slider width
    this.getSliderWidth = function(){
        return currentWidth;
    }    
    //get slider height
    this.getSliderHeight = function(){
        return currentHeight;
    }
    //return current slide
    this.getCurrentSlide = function(){
        return currentSlideNo;
    }    
    //go to slide @slideNo - slide number
    //returns true or false
    this.goToSlide = function(slideIndex){
        var val=false;
        if(slideIndex>-1 && slideIndex<slides.length && slideIndex!=currentSlideNo){
            currentSlideNo = slideIndex;
            goToCurrentSlide();
        }
        return val;
    }
    
    var resizeCallback;
    //callback on resize 
    this.onResize=function(val){
        resizeCallback = val;
    }

    
    /**
     * END DEGRADE SLIDER API
     */     
   
}



/**
 * Ajax utils
 */
function JQueryAjax(){
    /**
     * load data trough get
     */
    this.getData = function(path, successCallBack, failCallBack){
        $.get(path, function(response){
           //first responce                   
        }).error(function() { failCallBack(); })
        .success(function(response) {
            successCallBack(response);           
        })        
    }
    
    this.loadImage = function(path, successCallBack, failCallBack){
        var _url = path;
        var _im =$("<img />");
        _im.bind("load",function(){ 
                successCallBack($(this));
            });
        _im.attr('src',_url);
    }
}

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

//generic arrow button
function GenericArrowButton(baseUI, imgURL, options){
    
    var content = $('<div></div>');
    var background = $('<div class="sliderArrowBackground"></div>');
    background.css('background-color', options.leftRightNavBackgroundColor);
    if(!options.showLeftRightNavIsBackground){
        background.css('visibility', 'hidden');
    }
    background.appendTo(content);
    $('<img src="'+imgURL+'" />').appendTo(content);
    content.find('img').css('position', 'absolute');
    content.find('img').css('left', '0px');
    content.find('img').css('top', '0px');
    content.appendTo(baseUI);
        
    background.css('opacity', .5);
    baseUI.hover(function(){
        if(!isAvailable){
            return;
        }
        background.animate({
            opacity: .7
        }, 200);
    }, function(){
        if(!isAvailable){
            return;
        }        
        background.animate({
            opacity: .5
        }, 200);        
    });
    
    baseUI.click(function(){
        if(clickCall!=undefined && clickCall!=null){
            if(isAvailable){
                clickCall();
            }
        }
    });
    
    var clickCall;
    this.clickCallback = function(clickCallF){
        clickCall = clickCallF;
    }
    
    var isAvailable=false;
    this.isEnabled = function(val){        
        isAvailable = val;
        if(val){            
            baseUI.css('opacity', 1);
            baseUI.css('cursor', 'pointer');
            background.css('opacity', .5);
        }else{
            baseUI.css('opacity', .3);
            baseUI.css('cursor', 'default');            
        }
    }
}
//end generic arrow button

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
        
        Tooltip.uiInstance.css('top', 10+'px');
        Tooltip.uiInstance.css('left', (tooltipContainer.width()-(Tooltip.uiInstance.width()+targetUI.width()+27))+'px');
                
        Tooltip.uiInstance.stop().animate({
            opacity: 1
        }, 300);                       
}
Tooltip.extractNumber = function(pxValue){
        var striped = pxValue.substring(0, pxValue.length-2);
        var val = parseFloat(striped);
        return val;
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
