function Features(){
    
    init();
    //used for different component like horizontal carousel
    //allow generic components to run within any page of the website
    function init(){
        handleHorizontalCarousel();
        eiSliderStart();
        initDegradeSlider();
        initTagcloud();
    }
    
    //init tag cloud
    function initTagcloud(){
            $.fn.tagcloud.defaults = {
              size: {start: 14, end: 18, unit: 'pt'},
              color: {start: '#cde', end: '#f52'}
            };
        
            $(function () {
              $('#tagcloud a').tagcloud();
            });         
    }
    
    //init degrade slider
    function initDegradeSlider(){
         slider = new DegradeSlider("degradeSlider", {
              autoScale: true,
              showBottomCorners: false,
              sliderBackgroundColor: "#FFFFFF",
              leftRightNavType: "Nav03",
              sliderBackgroundOpacity: .2,
              enableFullScreen: false,
              sliderShowBorder: false,
              sliderShowInnerBorder: false,
              showSliderBackground: false,
              leftNavAdjustPosition: 52,
              rightNavAdjustPosition: -52
         });        
    }
    
    //init eislider
    function eiSliderStart(){
        $('#ei-slider').eislideshow({
             easing      : 'easeOutExpo',
             titleeasing : 'easeOutExpo',
             titlespeed  : 1200
         });     
    }

    //handle horizontal carousel behavior
    function handleHorizontalCarousel(){
       $('#carousel').elastislide({
           imageW  : 304,
           minItems    : 1,
           margin: 14
       });
       $('.horizontalCarouselItem').each(function(){
           $(this).find('.carouselItemCaption').css('opacity', 0);
           $(this).find('.carouselItemCaption').hover(function(){
               $(this).stop().animate({
                   opacity: 1
               }, 500, 'easeOutQuint');
           }, function(){
               $(this).stop().animate({
                   opacity: 0
               }, 400, 'easeOutQuint');               
           });
       });      
    }
}
