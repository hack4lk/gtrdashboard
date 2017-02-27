/// <reference path="display.ts" />

class Events{
 
    openSocketBtn;
    sendBessageBtn;
    splashPage;
    startSuccessEvt;
    startFailEvt;
    splashPageLoadedEvt;
    public static selectedComm;
    public static commErrorEvt;
    public static commsLoadedEvt;
    public static commSelectedEvt;
    
    constructor(){
        this.startSuccessEvt = new Event('startSuccess'); 
        this.startFailEvt = new Event('startFail');
        Events.commErrorEvt = new Event('commError');
        Events.commsLoadedEvt = new Event('commsLoaded');
        Events.commSelectedEvt = new Event('commSelected');
    }
    
    public trigger = (eventType:string) => {
        if(eventType === 'startSuccess'){
            document.dispatchEvent(this.startSuccessEvt);   
        }
        if(eventType === 'startFail'){
            document.dispatchEvent(this.startFailEvt);   
        }
    }
    
    public static triggerPublicEvent(eventType:string){
        if(eventType === 'commError'){
            document.dispatchEvent(Events.commErrorEvt);   
        }
        if(eventType === 'commsLoaded'){
            document.dispatchEvent(Events.commsLoadedEvt);   
        }
    }
    
    public static setSplashPageHandlers(){
       let toggleSplashBtn = document.getElementById('toggleSplash');
       let getCommsBtn = document.getElementById('searchForComm');
       let splashPage = document.getElementById('viewSplash');
        
       Display.toggleScreenLeftRight('viewSplash', 'splash');
        
       toggleSplashBtn.addEventListener('click', () => {
           Display.toggleScreenLeftRight('viewSplash', 'splash');
       }); 
       
       getCommsBtn.addEventListener('click', (e) => {
          let splashPageLoadedEvt = new Event("splashPageLoaded"); 
          document.dispatchEvent(splashPageLoadedEvt); 
       });
    }
    
    public static setCommSelectHandlers(ports){
        let commSelect = document.getElementById('comms');
        let initOption = document.createElement('option');
        
        initOption.text = "Select";
        initOption.value = "0";
        commSelect.add(initOption);
        
        for(let x=0; x<ports.length; x++){
            let option = document.createElement('option');
            option.text = ports[x].key;
            option.value = ports[x].key;
            commSelect.add(option);
        }
        
        commSelect.addEventListener('change', (e) => {
           Events.selectedComm = e.target.value;
           document.dispatchEvent(Events.commSelectedEvt);
        });
    }
    
    public static setLoadErrorPageHandlers(){
           Display.toggleScreenLeftRight('viewLoadError', 'load-error');
    }
    
    public setGlobalEvents(){
        this.openSocketBtn = document.getElementById('openSocket'); 
        this.sendBessageBtn = document.getElementById('sendMessage'); 
    }
    
    public addTestButtonEvents(sock: Socket){
        this.openSocketBtn.addEventListener('click', () => {
            sock.createConn();
        });
        
        this.sendBessageBtn.addEventListener('click', () =>{
            console.log("send message pressed....");
            sock.sendMessage('this works!');
        });
    }
}


