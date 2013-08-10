function IsotopePortfolio(){
    
    var section;
    this.init=function(sectionUI){
        section = sectionUI;        
        initIsotopeMenu();
        itemsBehavior();        
        EventBus.addEventListener(Event.WINDOW_RESIZE, resizeEventHandler);
        resizeEventHandler();       
    }
    
    var isotopeMenu;
    function initIsotopeMenu(){
        isotopeMenu = new Array();     
        $('.isotopeMenu li').each(function(index){
            var link = $(this).find('a');
            isotopeMenu.push({categoryID: link.attr('href'), link: link, iconClass: link.attr('class')});            
            link.click(function(e){
                e.preventDefault();
                selectMenuItem(index);              
            });
        });
        selectMenuItem(0);
    }
    //select isotope menu
    function selectMenuItem(indx){
        for(var i=0;i<isotopeMenu.length;i++){
            if(i==indx){
                isotopeMenu[i].link.addClass(isotopeMenu[i].iconClass+'-Selected');
                isotopeMenu[i].link.removeClass(isotopeMenu[i].iconClass);
                filterIsotopeItems(indx);
            }else{
                isotopeMenu[i].link.addClass(isotopeMenu[i].iconClass);
                isotopeMenu[i].link.removeClass(isotopeMenu[i].iconClass+'-Selected');
            }
        }
    }
    
    function filterIsotopeItems(index){
     var selector = "."+isotopeMenu[index].categoryID;
     (selector==".*")?selector="*":null;
     section.find('.isotopeContainer').isotope({
           filter: selector,
           animationOptions: {
               duration: 750,
               easing: 'linear',
               queue: false,
          }});       
    }
    
    
    //items roll over/out
    function itemsBehavior(){
        var isotopeContainer = section.find('.isotopeContainer');        
        //handle hover for white containers
        $('.whiteHoverItem').each(function(index){
            $(this).hover(function(){
                $(this).find('.plusIco').stop().animate({
                    opacity: 1
                }, 700, 'easeOutQuint');                                
                $(this).find('.whiteHover').stop().animate({
                    opacity: .05
                }, 700, 'easeOutQuint');
            }, function(){
                $(this).find('.plusIco').stop().animate({
                    opacity: 0
                }, 700, 'easeOutQuint');                 
                $(this).find('.whiteHover').stop().animate({
                    opacity: .55
                }, 700, 'easeOutQuint');                                
            });
        });
        
        //handle items with capion
        $('.captionHoverItem').each(function(index){
            $(this).hover(function(){
                $(this).find('.plusIco').stop().animate({
                    opacity: 1
                }, 700, 'easeOutQuint');                                
                $(this).find('.whiteCaption').stop().animate({
                    bottom: -55+'px'
                }, 500, 'easeOutQuint');            
            }, function(){
                $(this).find('.plusIco').stop().animate({
                    opacity: 0
                }, 700, 'easeOutQuint');                 
                $(this).find('.whiteCaption').stop().animate({
                    bottom: 0+'px'
                }, 500, 'easeOutQuint');                                                 
            });            
        });
    }
    
    //resize event
    function resizeEventHandler(){
        //position plus ico
        $('.whiteHoverItem').each(function(index){
            positionPlusIcon($(this));
        });
        $('.captionHoverItem').each(function(index){
            positionPlusIcon($(this));
        });        
    }
    
    function positionPlusIcon(item){
            var plusIco = item.find('.plusIco');
            plusIco.css('left', item.width()/2-plusIco.width()/2+'px');
            plusIco.css('top', item.height()/2-plusIco.height()/2+'px');
            plusIco.css('opacity', 0);        
    }
    
}
