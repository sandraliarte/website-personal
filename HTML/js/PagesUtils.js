function PagesUtils(sectionUI){
    
    var pageType = sectionUI.attr('class');
    var indexOf = pageType.indexOf('genericSection');
    pageType = (pageType.substring(15, pageType.length));

    var section;
    var features = new Features();
    section = null;
    switch(pageType){
         case PagesUtils.ISOTOPE_PORTFOLIO:
             //home section
             section = new IsotopePortfolio();
             section.init(sectionUI);
         break;
         case PagesUtils.IGALLERY:
             //iGallery
             section = new IGallery();
             section.init(sectionUI);
         break;
         case PagesUtils.CONTACT:
             //iGallery
             section = new ContactSection();
             section.init(sectionUI);
         break;                                                                                                      
    }
}

PagesUtils.ISOTOPE_PORTFOLIO = 'section-ISOTOPE-PORTFOLIO';
PagesUtils.IGALLERY = 'section-IGALLERY';
PagesUtils.CONTACT = 'section-CONTACT';