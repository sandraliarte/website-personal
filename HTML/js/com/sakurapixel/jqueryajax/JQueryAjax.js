
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
