function SpotlessWebsite(){
   
    //activate deactivate website sound
    var isWebsiteSound = true;
    var soundVolume = .8; //goes from 0 to 1 (.8 means 80%)
    //sounds URL
    var soundResource = [
            {src:"sounds/sound1.mp3|sounds/sound1.ogg", id:1}
    ];
    
    
    var backgroundUtil;
    this.init = function(){
        addContainers();
        sections = new Array();
        backgroundUtil = new ResizableBackground($('#backgroundContainer'));//showBackCallBack
        backgroundUtil.showBackCallBack(backgroundAnimationComplete);        
        addBusyContainer();
        initMobileMenu();
        initMenu();        
        addFullScreenSupport();
        try{
            addSoundSupport();
        }catch(e){
            //if IE
            $('#audioButtons').remove();
        }
        addWindowListener();               
    }
    
    //add busy container
    function addBusyContainer(){
        $('<div id="busyContainer"><div><img src="images/preloader.gif" /></div></div>').appendTo($('body'));
    }    
    
    //add containers
    function addContainers(){
        //background, overlay grid pattern and pages background
        $('<div id="backgroundContainer"></div><div id="overlayGridPatern"></div><div class="pagesBackground backgroundColor01"></div><div id="pagesContainer"><div class="pagesContent"></div></div><div class="topBottomBase top backgroundColor02"></div><div class="topBottomBase bottom backgroundColor02"></div><div id="pageNumber"></div><div id="fullScreenButtons" class="backgroundColor02"><div id="fs_on" title="Click to exit full screen!"><img src="images/full_screen_on.png" /></div><div id="fs_off" title="Click to enter full screen!"><img src="images/full_screen_off.png" /></div></div><div id="audioButtons" class="backgroundColor02"><div id="a_on"><img src="images/sound_on.png" /></div><div id="a_off"><img src="images/sound_off.png" /></div></div><div class="mobileDevicesMenu backgroundColor02"><div class="mobileMenuButton textColor01">Menu</div><ul id="mobile-nav" class="backgroundColor01"></ul>            </div>').insertBefore($('#mainMenu'));
                
    }
    
    /*
     * MENU functionality
     */
    var menuItems = [];
    function initMenu(){
        openCloseMenu();
        menuItems = new Array();
 
        $('#menuItems ul li').each(function(index){
            var link = $(this).find('a');
            link.click(function(){
                if($(this).attr('href').substring(0, 2)=="#!"){
                    return;
                }
                //openPage
            });
            menuItems.push({menuItem: $(this), menuURL: link.attr('href')});
            
            //mobile
            addMobileMenuItem($(this).clone());
        });
    }
    
    var menuIsOpen = true;
    //menu open close click handler
    function openCloseMenu(){
        $('#menuOpenCloseBTN').css('cursor', 'pointer');
        $('#menuOpenCloseBTN').click(function(){
            if(menuIsOpen){
                //close menu
                hideMainMenu();
            }else{
                //open menu
                showMainMenu();
            }
        });
        $('#menuOpenCloseBTN').hover(function(){
            showMainMenu();
        });
        $('#mainMenu').hover(function(){
            //showMainMenu();
        }, function(){
            hideMainMenu();
        });
    }
    
    //hide main menu
    function hideMainMenu(delayed){       
        var delay = 0;
        (delayed!=undefined&&delayed!=null)?delay=delayed:null;        
        $('#mainMenu').stop().delay(delay).animate({
            left: -$('#mainMenu').width()+$('#menuOpenCloseBTN').width()+'px'
        }, 700, 'easeOutQuint', function onComplete(){
            menuIsOpen = false;
        });
    }
    
    //close menu imediately
    function hideMenuImediatelly(){
        $('#mainMenu').css('left', -$('#mainMenu').width()+33+'px');        
    }
    
    //show main menu
    function showMainMenu(){
        menuIsOpen = true;
        $('#mainMenu').stop().animate({
            left: 0+'px'
        }, 700, 'easeOutQuint', function onComplete(){
            menuIsOpen = true;
        });        
    }
    
    //adjust menu on resize
    function adjustMenuResize(){
        $('#menuOpenCloseBTN').css('top', currentHeight/2-$('#menuOpenCloseBTN').height()/2+'px');
        $('#menuItems').css('top', currentHeight/2-$('#menuItems').height()/2+'px');
    }        
    /*
     * END MENU functionality
     */
    
    
    /**
     * LOAD PAGE
     */
    var currentSectionUI;
    var currentSection;
    var firstTimeLoad=true;
    //open a specific section    
    function openSection(sectionURL){
        if(currentSection==sectionURL){
            return;
        }
        if(!isValidSection(sectionURL)){
            alert('Invalid page URL. Please check your path near '+sectionURL);
            return;
        }
        currentSection = sectionURL;
        if(window.location.href != currentSection){
            window.location.href = currentSection;
        }
        selectSectionButton(sectionURL);
        if(firstTimeLoad){
            PopUpManager.getInstance().showOpaque();            
        }else{
            PopUpManager.getInstance().showBusy();
        }                 
        if(currentSectionUI!=null){                     
            removeCurrentSection(currentSectionUI, sectionURL);
        }else{          
            loadSection(sectionURL);
        }            
    }
    
    //remove current section
    function removeCurrentSection(sectionUI, newSectionURL){
        if(sectionUI!=null&&sectionUI!=undefined){
            $("#pageNumber").animate({
                opacity: 0
            }, 300);           
            sectionUI.animate({
                opacity: 0
            }, 500, 'easeOutQuint', function onComplete(){
                $("#pageNumber p").remove();
                sectionUI.remove();
                loadSection(newSectionURL);
            });
        }
    }
    
    var sections=[];
    //load section
    function loadSection(sectionURL){
        var sectionPath = "pages/"+sectionURL.substr(2, sectionURL.length);
        var axjReq = new JQueryAjax();
        axjReq.getData(sectionPath, function(data){
            //section loaded
           var backgroundURL = getBackgrounImageURL(data);
           if(backgroundURL==undefined){
               alert('Background URL missing. Please check section: '+sectionURL);
           }
           axjReq.loadImage(getBackgrounImageURL(data), function(img){
               //background image loaded
               sections.push({sectionRawData: data, sectionURL: sectionURL, backgroundImage: img});
               displayNewSection(sectionURL);
           });
        }, function(){alert('could not load section: '+sectionURL)});
    }
         
    //return url of section's background image
    function getBackgrounImageURL(data){
        var obj = $(data);
        return obj.find('.sectionBackgroundImage').attr('src');
    }
    /**
     * display new section
     */
    function displayNewSection(sectionURL){
         var section = extractSection(sectionURL);
         showNewSection(section);
    }
    
    var pUtil;
    function showNewSection(section){
         if(!firstTimeLoad){
             PopUpManager.getInstance().dismiss(500, 'easeOutQuint');                        
         }         
                
         currentSectionUI = $(section.sectionRawData);         
         currentSectionUI.css('opacity', 0);         
         currentSectionUI.find('.sectionBackgroundImage').remove();
         //remove page number
         var pageNum = currentSectionUI.find('.pageNum');         
         pageNum.remove();         
         pageNum.appendTo($('#pageNumber'));
         $("#pageNumber").css('opacity', 0);
         $("#pageNumber").delay(900).animate({
                opacity: 1
         }, 800);         
                       
         currentSectionUI.appendTo('.pagesContent');
         pUtil = new PagesUtils(currentSectionUI);
         backgroundUtil.showNewBackground(section.backgroundImage);        
         currentSectionUI.delay(900).animate({          
             opacity: 1
         }, 1200, 'easeOutQuint', function onComplete(){
             if(firstTimeLoad){
                 firstTimeLoad = false;
                 PopUpManager.getInstance().dismiss(500, 'easeOutQuint');
                 hideMainMenu(500);          
             }             
         });       
    }    
    
    /**
     * extract specific section object
     */
    function extractSection(sectionURL){
        var section;
        for(var i=0;i<sections.length;i++){
            if(sections[i].sectionURL==sectionURL){
                section = sections[i];
                break;
            }
        }
        return section;
    }         
    
    //select clicked button
    function selectSectionButton(sectionURL){
          for(var i=0;i<menuItems.length;i++){
              menuItems[i].menuItem.removeClass('activeMenuLink');
              menuItems[i].menuItem.find('a').css('cursor', 'pointer');              
              if(menuItems[i].menuURL==sectionURL){                  
                  menuItems[i].menuItem.addClass('activeMenuLink');
                  menuItems[i].menuItem.find('a').css('cursor', 'default');
              }
          }
          //mobile menu
          if(!isMobileMenu){
              return;
          }
          try{
              for(var i=0;i<menuItemsMobile.length;i++){
                  menuItemsMobile[i].menuItem.removeClass('activeMenuLink');
                  menuItemsMobile[i].menuItem.find('a').css('cursor', 'pointer');              
                  if(menuItemsMobile[i].menuURL==sectionURL){                  
                      menuItemsMobile[i].menuItem.addClass('activeMenuLink');
                      menuItemsMobile[i].menuItem.find('a').css('cursor', 'default');
                  }
              }              
          }catch(e){}
    }     
    
    //check if section exists
    function isValidSection(sectionURL){
        var valid=false;
         for(var i=0;i<menuItems.length;i++){
              if(menuItems[i].menuURL==sectionURL){
                  valid = true;
                  break;
              }             
         }
        return true;
    }     
    
    /**
     * called when background animation is complete
     */
    function backgroundAnimationComplete(){
        windowResize();
        PopUpManager.getInstance().dismiss();
    } 
        
    /**
     * END LOAD PAGE
     */        
    
    
    //handle pages content, top container and footer container
    function handlePagesContainer(){
        var wdth = $('#pagesContainer').width();
            
        if(currentWidth<1040){            
            $('#pagesContainer').css('width', currentWidth+'px');
            $('#pagesContainer').css('left', 0+'px'); 
        }else{
            $('#pagesContainer').css('width', 1040+'px');
            $('#pagesContainer').css('left', currentWidth/2-$('#pagesContainer').width()/2+'px'); 
        }
        
        //align pages background
        $('.pagesBackground').css('width',  $('#pagesContainer').width()+'px');
        $('.pagesBackground').css('left',  $('#pagesContainer').css('left'));
        
        //handle top and footer
        //top 
        $('.top').css('width',  $('#pagesContainer').width()+((currentWidth-$('#pagesContainer').width())/2)+'px');
        $('.top').css('left',  $('#pagesContainer').css('left'));
        if(isMobileMenu){
            $('.top').css('top', mobileMenuHeight+'px');
        }else{
            $('.top').css('top', '0px');
        }
        
        $('.bottom').css('width',  $('#pagesContainer').width()+((currentWidth-$('#pagesContainer').width())/2)+'px');
        $('.bottom').css('left',  '0px');
        
        //fs button
        $('#fullScreenButtons').css('left', $('.bottom').width()-$('#fullScreenButtons').width()+'px');
        $('#fullScreenButtons').css('bottom', $('.bottom').height()+'px');
        
        //audion
        $('#audioButtons').css('left', $('.top').css('left'));
        $('#audioButtons').css('top', extractNumber($('.top').css('top'))+$('.top').height()+'px');
        
        //page number
        $('#pageNumber').css('left', $('.top').css('left'));                        
    }    
    
    
    //menu items mobile
    var menuItemsMobile = [];
    function initMobileMenu(){      
        
        menuItemsMobile = new Array();
        $('.mobileMenuButton').click(function(){
            $('#mobile-nav').slideToggle();
        });               
    }
    //add mobile menu item
    function addMobileMenuItem(liItem){
            var li = liItem;
            var link = li.find('a');
            link.click(function(){
                if($(this).attr('href').substring(0, 2)=="#!"){
                    if(isMobileMenu){
                        $('#mobile-nav').slideToggle();
                     }
                    return;
                }
                //openPage
            });
            menuItemsMobile.push({menuItem: li, menuURL: link.attr('href')});
            li.appendTo($('#mobile-nav'));        
    }
    
    var isMobileMenu;
    var mobileMenuHeight=40;
    //handle mobile menu
    function handleMobileMenu(){
        if(currentWidth<600){
            //show mobile menu
            isMobileMenu = true;
            $('.mobileDevicesMenu').removeClass('mobileMenuHide');
            $('#mainMenu').addClass('mobileMenuHide');
            $('#pagesContainer').css('padding-top', mobileMenuHeight+'px');
        }else{
            //hide mobile menu
            isMobileMenu = false;
            $('.mobileDevicesMenu').addClass('mobileMenuHide');
            $('#mainMenu').removeClass('mobileMenuHide');
            $('#pagesContainer').css('padding-top', '0px');
        }
    }    
    
    
    
     var fsUtil;
    /**
     * implement full screen
     */
    function addFullScreenSupport(){
        
        fsUtil = new FullScreenUtil(document.getElementById('contentWrapper'));
        if(fsUtil.isFullScreenAvailable()){
            //show fs buttons
            fsUtil.setStateCallBack(fullScreenStatus);
           
            $('#fs_off').click(function(){
                fsUtil.enterFullScreen();
            });
            if(fsUtil.isExitFullScreenAvailable){
                $('#fs_on').click(function(){
                    fsUtil.exitFullScreen();
                });                
            }else{
                $('#fs_on').css('opaciy', 0);
            }
            fullScreenStatus(false);
        }else{
            //remove fs buttons
            $('#fullScreenButtons').remove();
        }
        
        $('.fullScreenBtn').click(function(){
            fsUtil.enterFullScreen();
        });        
    }
    
    function fullScreenStatus(val){
        if(val){
            $('#fs_on').css('visibility', 'visible');
            $('#fs_off').css('visibility', 'hidden');            
        }else{
            $('#fs_on').css('visibility', 'hidden');
            $('#fs_off').css('visibility', 'visible');            
        }
    }
    //end full screen implementation
    
    
    var soundUtil;
    var queue;
    /* Add sound support
    ================================================== */
    function addSoundSupport(){
        soundStatus(false);
        //return;
        if(!isWebsiteSound){
            $('#audioButtons').remove();
            return;
        }
        SoundJS.FlashPlugin.BASE_PATH = "js/external/jquery/soundjs/" // Initialize the base path from this document to the Flash Plugin        
        soundUtil = new SoundUtil();
        if(!soundUtil.isAvailable()){
            $('#audioButtons').remove();
            return;
        }
        $('#audioButtons').css('visibility', 'hidden');
        $('#a_on').css('visibility', 'hidden');
        $('#a_off').css('visibility', 'hidden');
        
        // Instantiate a queue.
        queue = new PreloadJS();         
        queue.installPlugin(SoundJS); // Plug in SoundJS to handle browser-specific paths       
        queue.onComplete = loadComplete;
        queue.onFileError = handleFileError;
        queue.loadManifest(soundResource, true);
        
        $('#a_on').click(function(){
            stopSound();
        });
        $('#a_off').click(function(){
            playSound(1, true);            
        });                         
    }
    //sound on/off
    function soundStatus(val){
        if(val){
            $('#a_on').css('visibility', 'visible');
            $('#a_off').css('visibility', 'hidden');            
        }else{
            $('#a_on').css('visibility', 'hidden');
            $('#a_off').css('visibility', 'visible');            
        }
    }    
    function handleFileError(o) {
        // An error occurred.
        $('#audioButtons').remove();
    }
    function loadComplete() {
        // Load completed.
        $('#audioButtons').css('visibility', 'visible');
        $('#a_on').css('visibility', 'visible');
        $('#a_off').css('visibility', 'visible');
        playSound(1, true);
    }
    function playSound(name, loop) {
        soundStatus(true);
        // Play the sound using the ID created above.
        var loops = 1;
        (loop)?loops=9999:null;
        return SoundJS.play(name, SoundJS.INTERRUPT_NONE, 0, 0, loops, soundVolume);
    }
    function stopSound() {
        soundStatus(false);
        if (queue != null) { queue.cancel(); }
        try{
        SoundJS.stop();
        }catch(e){}
    }       
    
    
    /* End sound support
    ================================================== */    
        

    var currentWidth;
    var currentHeight;
    /**
     * handle window resize
     */
    function windowResize(event){
        currentWidth = $('#contentWrapper').width();
        currentHeight = $('#contentWrapper').height();
        adjustMenuResize();
        handlePagesContainer();
        handleMobileMenu();
    }
    
    //location has changed
    function windowlocationChange(){
        //console.log(window.location.href);
        var indexOf = window.location.href.indexOf('#!');
        if(indexOf==-1){
            openSection(menuItems[0].menuURL);
            return;
        }
        openSection(window.location.href.substr(indexOf, window.location.href.length));
    }     
        
    
    
    //dispatch event to all listeners
    function addWindowListener(){
        EventBus.addEventListener(Event.WINDOW_RESIZE, windowResize);
        EventBus.addEventListener(Event.WINDOW_LOCATION_CHANGE, windowlocationChange);
        $(window).resize(function(){
            EventBus.dispatchEvent(new Event(Event.WINDOW_RESIZE, ""));
        });
        $(window).bind('hashchange', function() {
          EventBus.dispatchEvent(new Event(Event.WINDOW_LOCATION_CHANGE, ""));
        });        
        windowResize();  
        windowlocationChange();    
    }
    
    /**
     * Utils
     */ 
    //extract number
    function extractNumber(pxValue){
        var striped = pxValue.substring(0, pxValue.length-2);
        var val = parseFloat(striped);
        return val;
    }     
     
}





/**
 * popup manager class
 */ 
function PopUpManager(popupContainer){
     var popupContainer = popupContainer;
     stageResize();
     EventBus.addEventListener(Event.WINDOW_RESIZE, stageResize);
     
     var isFirstTime = true;
     //hide content while loading
     this.showOpaque = function(){
         popupContainer.addClass('busyContainerOpaque');
         popupContainer.find('img').css('visibility', 'visible');
         popupContainer.css('visibility', 'visible');
     }
     //show busy loading icon
     this.showBusy = function(){
         popupContainer.removeClass('busyContainerOpaque');
         popupContainer.find('img').css('visibility', 'visible');
         popupContainer.css('visibility', 'visible');
         popupContainer.css('opacity', 1);        
     }
     //prevent clicks during animation
     this.showRestrict = function(){
         popupContainer.removeClass('busyContainerOpaque');
         popupContainer.find('img').css('visibility', 'hidden');
         popupContainer.css('visibility', 'visible');
         popupContainer.css('opacity', 1);
     }
     //dismiss popup
     this.dismiss = function(time, efx){
         isFirstTime = false;
         (time==undefined)?time=800:null;
         (efx==undefined)?efx='easeInExpo':null;  
         popupContainer.animate({
             opacity: 0
         }, time, efx, function onComplete(){
             $(this).css('visibility', 'hidden');
             $(this).find('img').css('visibility', 'hidden');
         });
     }
     
     this.getStatus = function(){
         return isFirstTime;
     }
     
     function stageResize(){
        popupContainer.find('div').css('top', popupContainer.height()/2-popupContainer.find('div').height()/2+'px');
     }    
 }
 
PopUpManager.getInstance=function(){
    if(PopUpManager.instance==null){
        PopUpManager.instance = new PopUpManager($('#busyContainer'));
    }
    return PopUpManager.instance;
}
