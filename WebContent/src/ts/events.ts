/// <reference path="display.ts" />

class Events{
 
    openSocketBtn;
    sendBessageBtn;
    splashPage;
    startSuccessEvt;
    startFailEvt;
    splashPageLoadedEvt;
    closeConn;
    dashboardBtn;
    public static selectedComm;
    public static commErrorEvt;
    public static commsLoadedEvt;
    public static commSelectedEvt;
    public static commAbleToConnectEvt;
    public static ecuStatusEvt;
    public static updateDashboardEvt;
    public display = new Display();
    
    constructor(){
        this.startSuccessEvt = new Event('startSuccess'); 
        this.startFailEvt = new Event('startFail');
        Events.commErrorEvt = new Event('commError');
        Events.commsLoadedEvt = new Event('commsLoaded');
        Events.commSelectedEvt = new Event('commSelected');
        Events.commAbleToConnectEvt = new Event('commConnected'); //event when we're able to connect to car!
        Events.ecuStatusEvt = new Event('ecuStatus');
        Events.updateDashboardEvt = new Event('updateDashboard');
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
        if(eventType === 'commConnected'){
            document.dispatchEvent(Events.commAbleToConnectEvt);   
        }
        if(eventType === 'ecuStatus'){
            document.dispatchEvent(Events.ecuStatusEvt);
        }
        if(eventType === 'updateDashboard'){
            document.dispatchEvent(Events.updateDashboardEvt);   
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
        let commSelect = <HTMLSelectElement>document.getElementById('comms');
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
        this.closeConn = document.getElementById('closeSocket');
        this.dashboardBtn = document.getElementById('loadDashboard');
    }
    
    public addTestButtonEvents(sock: Socket){
        this.openSocketBtn.addEventListener('click', (e) => {
            sock.createConn();
        });
        
        this.closeConn.addEventListener('click', (e) => {
            sock.closeSocket();
        });
        
        this.sendBessageBtn.addEventListener('click', () =>{
            console.log("send message pressed....");
            sock.sendMessage('this works!');
        });
        
        this.dashboardBtn.addEventListener('click', () =>{
            this.display.renderdDashboardPage();
        });
    }
}


