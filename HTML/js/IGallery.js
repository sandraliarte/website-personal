
function IGallery(){
    
    var section;
    var randomRotations = [];
    var randomHoverPositions = [];
    var thumbW = 280;
    var thumbH = 180;
    var backButton;
    var loadingUI;
    
    this.init=function(sectionUI){
        backButton = $('#backButton a');
        loadingUI = $('.iGalleryLoading');
        showLoading();
        backButton.css('visibility', 'hidden');
        backButton.click(function(e){
            e.preventDefault();
            closeGallery();
        });
        section = sectionUI;
        randomRotations = new Array(0, 5, 7, 10, 13, -13, -10, -7, -5, 0);
        randomHoverPositions = new Array(0, 15, 30, 45, 60, -60, -45, -30, -15, 0);
        initGalleries();
        EventBus.addEventListener(Event.WINDOW_RESIZE, resizeEventHandler);
    }
    
    var galleries = [];
    //init galleries
    function initGalleries(){
        galleries = new Array();
        $('.gallery').each(function(index){
            var gallery=new Array();
            $(this).children('div').each(function(index){
                var largeImage = $(this).find('.largeImage').attr('href');
                var caption = $(this).find('.lightboxCaption').html();                
                gallery.push({thumbURL: $(this).find('img').attr('src'), imgURL: largeImage, itemDescription: caption, thumbItem: null, thumbRotation: 0, thumbHoverRotation: 0, thumbHoverPositionX: 0, thumbHoverPositionY: 0, px: 0, py:0});                
            });
            galleries.push(gallery);
            $(this).remove();            
        });
        countLoadedGallery=-1;
        loadGalleries();
    }
    
    var countLoadedGallery;
    var countLoadedThumb;
    //load galleries
    function loadGalleries(){
        countLoadedGallery++;
        countLoadedThumb=-1;
        if(countLoadedGallery<galleries.length){
            loadThumb();   
        }else{
            //console.log('finish loading all');           
            galleriesLoaded = true;
            removeLoading();
            addGalleries();
        }        
    }
    
    //load thumb
    function loadThumb(){
        countLoadedThumb++;
        if(countLoadedThumb<galleries[countLoadedGallery].length){       
            var axjReq = new JQueryAjax();
            axjReq.loadImage(galleries[countLoadedGallery][countLoadedThumb].thumbURL, function(img){
               //thumb loaded
               img.addClass('iThumb');                           
               galleries[countLoadedGallery][countLoadedThumb].thumbItem = img;
               loadThumb();
            });                                    
        }else{
            //console.log('finish load gallery');
            loadGalleries();
        }
    }
    
    var loadingOpacity = 1;
    //show loading
    function showLoading(){
        if(!galleriesLoaded){
            try{
                loadingUI.stop().animate({
                    opacity: loadingOpacity
                }, 1000, 'linear', function onComplete(){
                    if(loadingOpacity==.3){
                        loadingOpacity = 1;
                    }else{
                        loadingOpacity = .3;
                    }
                    showLoading();
                });
            }catch(e){}
        }
    }
    //remove loading
    function removeLoading(){
        try{
            loadingUI.remove();
        }catch(e){}
    }    
    
    //display galleries
    function addGalleries(){
        removeGalleries();
        for(var i=0;i<galleries.length;i++){
            for(var j=0;j<galleries[i].length;j++){
                var item = galleries[i][j].thumbItem;                
                item.appendTo($('.iGalleryContainer'));
                item.css('opacity', 0);
                item.animate({
                    opacity: 1
                }, 450, 'easeOutQuint');
            }
        }        
        displayGalleries();
    }
    
    function removeGalleries(){
        try{
            $('.iThumb').remove();
        }catch(e){}
    }
    
    var containerWidth;
    var galleryMovement;
    var galleryIsOpen;
    var spacingX = 50;
    var spacingY = 50;
    var initialPY = 0;
    var initialPX = 0;
    //display/rearange galleries
    function displayGalleries(){
        containerWidth = $('.iGalleryContainer').width();
        px = initialPX;
        py = initialPY;
        for(var i=0;i<galleries.length;i++){
            
            for(var j=0;j<galleries[i].length;j++){
                var item = galleries[i][j].thumbItem;
                galleries[i][j].thumbRotation = randomRotations[getRandomInt(0,9)];
                galleries[i][j].thumbHoverRotation = randomRotations[getRandomInt(0,9)];
                galleries[i][j].thumbHoverPositionX = randomHoverPositions[getRandomInt(0,10)];
                galleries[i][j].thumbHoverPositionY = randomHoverPositions[getRandomInt(0,10)];

                
                galleries[i][j].px = px;
                galleries[i][j].py = py;
                
                item.css('visibility', 'hidden');
                item.css('cursor', 'pointer');
                item.data('galleryIndex', i);
                item.data('itemIndex', j);
                item.click(function(){
                    if(galleryMovement){
                        return;
                    }
                    if(galleryIsOpen){
                        //open lightbox
                        openLightbox($(this));                        
                    }else{
                        //open gallery
                        if($(this).data('itemIndex')==galleries[$(this).data('galleryIndex')].length-1){
                            openGallery($(this));
                        }
                    }
                });            
                
                if(j==galleries[i].length-1){
                    item.css('visibility', 'visible');
                    galleries[i][j].thumbRotation = 0;                    
                    item.hover(function(){
                        //gallery roll over
                        rollOverGallery($(this));
                    }, function(){
                        //gallery roll out
                        rollOutGallery($(this));
                    });
                }
                                
                item.rotate(galleries[i][j].thumbRotation);              
                item.css('left', px+'px');
                item.css('top', py+'px');                                
            }
            px=px+thumbW+spacingX;
            if(px+thumbW>containerWidth){
                px = initialPX;
                py+=thumbH+spacingY;
            }
        }        
    }
    
    function rollOverGallery(item){
        if(galleryIsOpen || galleryMovement){
            return;
        }
        var gallery = galleries[item.data('galleryIndex')];
        for(var j=0;j<gallery.length;j++){
            var itemUI = gallery[j].thumbItem;
            if(j<gallery.length-1){
                itemUI.css('visibility', 'visible');
                itemUI.stop().animate({
                    opacity: 1,
                    left: gallery[j].px+gallery[j].thumbHoverPositionX+'px',
                    top: gallery[j].py+gallery[j].thumbHoverPositionY+'px'
                }, 300, 'easeOutQuint');
            }
        }
    }
    function rollOutGallery(item){
        if(galleryIsOpen || galleryMovement){
            return;
        }        
        var gallery = galleries[item.data('galleryIndex')];
        for(var j=0;j<gallery.length;j++){
            var itemUI = gallery[j].thumbItem;
            if(j<gallery.length-1){
                itemUI.stop().animate({
                    opacity: 0,
                    left: gallery[j].px+'px',
                    top: gallery[j].py+'px'
                }, 300, 'easeOutQuint', function onComplete(){
                    $(this).css('visibility', 'hidden');
                });                
            }
        }
    }
    
    var lightboxUI;
    //open lightbox
    function openLightbox(item){
        var galleryIndex = item.data('galleryIndex');
        var index = item.data('itemIndex');
        var gallery = galleries[galleryIndex];
        lightboxUI = new PhotoShootLightbox(gallery, index);        
    } 
     
    //open selected gallery
    function openGallery(item){
        galleryMovement = true;        
        var galleryIndex = item.data('galleryIndex');

        var gallery = galleries[galleryIndex];
        for(var i=0;i<galleries.length;i++){
            var tempGallery = galleries[i];
            var tempItem;
            if(galleryIndex==i){
                //open new gallery
                
                //scroll top
                $('html, body').stop().animate({
                    scrollTop: 0
                 }, 400);
                 
                 displayOpenedGallery(tempGallery);                                 
            }else{
                //remove other galleries
                for(var j=0;j<tempGallery.length;j++){
                    tempItem = tempGallery[j].thumbItem;
                    tempItem.animate({
                        opacity: 0
                    }, 400, 'easeOutQuint', function onComplete(){
                        //$(this).remove();
                        //$(this).css('visibility', 'hidden');
                        //$(this).css('display', 'none');
                        $(this).addClass('iThumbHidden');
                        backButton.css('visibility', 'visible');
                    });
                } 
            }
        }
    }
    
    function displayOpenedGallery(tempGallery, noAnimation){
        var tempItem;
        openedGallery = tempGallery;
        containerWidth = $('.iGalleryContainer').width();               
        px = initialPX;
        py = initialPY;
                for(var j=0;j<tempGallery.length;j++){
                    tempItem = tempGallery[j].thumbItem;
                    if(noAnimation){
                        tempItem.css('left', px+'px');
                        tempItem.css('top', py+'px');
                    }else{
                        tempItem.animate({
                            left: px+'px',
                            top: py+'px'
                        }, 450, 'easeOutQuint', function onComplete(){
                            galleryIsOpen = true;
                            galleryMovement = false;                                                
                        });
                    }
                    tempItem.rotate({duration:450, animateTo:0});
                    px+=thumbW+spacingX;
                    if(px+thumbW>containerWidth){
                        px = initialPX;
                        py+=thumbH+spacingY;
                    }                                           
                }        
    }
    
    //close current gallery
    function closeGallery(){
        containerWidth = $('.iGalleryContainer').width();
        backButton.css('visibility', 'hidden');
        galleryMovement = true;
        for(var i=0;i<openedGallery.length;i++){
            var item = openedGallery[i].thumbItem;
            item.stop().animate({
                left: containerWidth/2-thumbW/2,
                top: spacingY*3,
                opacity: 0
            }, 450, 'easeOutQuint', function onComplete(){
                galleryMovement = false;
                galleryIsOpen = false;
                //$('.iThumb').css('opacity', 1);
                $('.iThumb').removeClass('iThumbHidden');
                addGalleries();                
            });
            item.rotate({duration:450, animateTo:openedGallery[i].thumbRotation});
        }
    }
    
    
    var galleriesLoaded;
    var openedGallery;
    //resize event
    function resizeEventHandler(){
        if(galleriesLoaded && !galleryIsOpen && !galleryMovement){
            addGalleries();
        }
        if(galleryIsOpen){
            displayOpenedGallery(openedGallery, true);
        }
    }    
    /**
     * utils
     */
    function getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    //extract number
    function extractNumber(pxValue){
        var striped = pxValue.substring(0, pxValue.length-2);
        var val = parseFloat(striped);
        return val;
    }     
    
}
