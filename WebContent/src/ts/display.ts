/// <chutzpah_reference path='../libraries/jquery.js' />
/// <reference path='events.ts' />

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
        this.getTemplate('splash.html', (data) => {
            if(data != ''){
                this.appContent.innerHTML = data;
                Events.setSplashPageHandlers();
            }else{
                alert('application error!');    
            }
        });
    }
    
    public renderErrorMessage(msg:string){
        this.getTemplate('loadError.html', (data) => {
            if(data != ''){
                this.appContent.innerHTML = data;
                Events.setLoadErrorPageHandlers();
                document.getElementById('viewLoadError').className = "load-error show";
                if(msg != ""){
                    let errorMsg = document.getElementById('errorStatus');
                    errorMsg.innerHTML = msg;
                }
                
            }else{
                alert('application error!');   
            }
        });
    }
    
    public renderCommSelector(ports){
        this.getTemplate('commSelect.html', (data) => {
            if(data != ''){
                this.appContent.innerHTML = data;
                document.getElementById('commSelect').className = "comm-select show";
                Events.setCommSelectHandlers(ports);
            }else{
                alert('application error!');   
            }
        });    
    }
    
    public static toggleScreenLeftRight(targetScreen:string, baseClass:string){
        let target = document.getElementById(targetScreen);
        
        if(target.className === baseClass){ 
            target.className = baseClass + ' show';
        }else if(target.className === (baseClass + ' hide')){
            target.className = baseClass + ' show';
        }else if(target.className === (baseClass + ' show')){
            target.className = 'splash hide';
        }
    }
    
    public static slideScreenLeft(target:string){
        //TODO
    }
    
    private getTemplate(templateName:string, callBack){
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'templates/' + templateName);
        
        xhr.onload = () => {
            let response = '';
            if(xhr.status === 200){
                response = xhr.responseText;
            }else{ 
                response = ''; 
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