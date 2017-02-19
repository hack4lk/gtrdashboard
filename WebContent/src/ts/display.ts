/// <chutzpah_reference path='../libraries/jquery.js' />

class Display{
    
    templateHTML:string;
    callBack;
    appContent;
    appError;
    
    constructor(){
        this.appContent = document.getElementById('appContent'); 
        this.appError = document.getElementById('appError'); 
    }
    
    public renderSplashPage(){
        this.getTemplate("splash.html", (data) => {
            if(data != ""){
                this.appContent.innerHTML = data;
            }else{
                alert("application error!");    
            }
        });
    }
    
    public renderErrorMessage(){
         this.getTemplate("loadError.html", (data) => {
            if(data != ""){
                this.appError = data;
            }else{
                alert("application error!");   
            }
        });
    } 
    
    private getTemplate(templateName:string, callBack){
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'templates/' + templateName);
        
        xhr.onload = () => {
            let response = "";
            if(xhr.status === 200){
                response = xhr.responseText;
            }else{ 
                response = ""; 
            }

            if(typeof callBack  === 'function'){ 
                callBack(response); 
            }else{
                //do nothing...
            }
       };
       xhr.send();
    }
}