/// <reference path="display.ts" />

class Events{
 
    openSocketBtn;
    sendBessageBtn;
    splashPage;
    startSuccessEvt;
    startFailEvt;
    
    constructor(){
        this.startSuccessEvt = new Event('startSuccess'); 
        this.startFailEvt = new Event('startFail'); 
    }
    
    public static setSplashPageHandlers(){
       let toggleSplashBtn = document.getElementById('toggleSplash');
       let splashPage = document.getElementById('viewSplash');
       
       Display.toggleScreenLeftRight('viewSplash', 'splash');
        
       toggleSplashBtn.addEventListener('click', function(){
           Display.toggleScreenLeftRight('viewSplash', 'splash');
       }); 
    }
    
    public setGlobalEvents(){
        this.openSocketBtn = document.getElementById('openSocket'); 
        this.sendBessageBtn = document.getElementById('sendMessage'); 
    }
    
    public addTestButtonEvents(sock: Socket){
        this.openSocketBtn.addEventListener('click', function(){
            sock.createConn();
        });
        
        this.sendBessageBtn.addEventListener('click', function(){
            console.log("send message pressed....");
            sock.sendMessage('this works!');
        });
    }
     
    public trigger(eventType:string){
        if(eventType === 'startSuccess'){
            document.dispatchEvent(this.startSuccessEvt);   
        }
         if(eventType === 'startFail'){
            document.dispatchEvent(this.startFailEvt);   
        }
    }    
}


