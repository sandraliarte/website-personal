function ContactSection(){
    var section;
    this.init=function(sectionUI){
        section = sectionUI;
        handleContactForm();
    }
    
    
    
    /**
     * handle contact form
     */
    var contactFormFields=[];
    var thankYouMsg;
    function handleContactForm(){
        contactFormFields = new Array();
        thankYouMsg = $('.contactForm').find('.formThankYou').html();
        $('.contactForm').find('.formThankYou').html('');        
        contactFormFields = new Array();
        $('.contactForm').find('.inputField').each(function(index){
            contactFormFields.push({element: $(this), id: $(this).attr('id'), placeholder: $(this).find('input').attr('placeholder'), val: ""});           
        });
        $('.contactForm').find('.inputTextArea').each(function(){
            contactFormFields.push({element: $(this), id: $(this).attr('id'), placeholder: $(this).find('textarea').attr('placeholder'), val: ""});
        });
        
        $('.contactForm').find('#sendBTN').click(function(e){
            e.preventDefault();
            var allValid = true;                        
            for(var i=0;i<contactFormFields.length;i++){
                var valid = true;
                var val = contactFormFields[i].element.find('input').val();
                if(!validateFormValue(val)){
                    valid = false;
                }
                if(contactFormFields[i].id=="email"){
                    if(!validateEmail(val)){
                        valid = false;
                    }else{
                        valid = true;
                    }
                }
                if(contactFormFields[i].id=="message"){
                    val = document.getElementById('txt').value;
                    if(!validateFormValue(val)){
                        valid = false;
                    }else{
                        valid = true;
                    }               
                }
                if(!valid){                    
                    contactFormFields[i].element.addClass('error');
                    allValid = false;                    
                }else{
                    contactFormFields[i].val = val;
                    contactFormFields[i].element.removeClass('error');
                }
            }
        
            if(allValid){
                //send email
                $.post('mail.php', {name:contactFormFields[0].val, website:contactFormFields[1].val, email:contactFormFields[2].val, phone:contactFormFields[3].val, message:contactFormFields[4].val}, function(data){
                    if(data.success){
                        $('.contactForm').find('.formThankYou').html(thankYouMsg);
                    }else{
                        //console.log('NOT OK')
                    }
                    
                }, 'json');                
            }
        });
    }
    function validateFormValue(val){
        var valid = false;
            if(val!=undefined && val.length>2){
                valid = true;
            }
        return valid;       
    }
    function validateEmail(val){
            var atpos = val.indexOf("@");
            var dotpos = val.lastIndexOf(".");
            var valid = true;
            if (atpos<1 || dotpos<atpos+2 || dotpos+2>=val.length){
               valid = false;
            }
        return valid;        
    }    
    
    
}
