/// <reference path="events.ts" />
/// <reference path="websocket.ts" />
/// <reference path="display.ts" />

class App{
  
  sock: Socket;
  events: Events; 
  display: Display;
  ports;
    
    constructor(){
        this.display = new Display();
        this.events = new Events();
        
        //assign global app handlers...
        this.events.setGlobalEvents();
        
        document.addEventListener('startSuccess', (e) => {
            this.display.renderSplashPage();
        });
        
        document.addEventListener('startFail', (e) => {
            this.display.renderErrorMessage("");
        });
        
        document.addEventListener('splashPageLoaded', (e) => {
            console.log('load comms.....'); 
            this.sock.sendMessage("getPorts");
        });
        
        document.addEventListener('commError', (e) => {
            this.display.renderErrorMessage('[Cannot Talk to Car]');
        });
        
        document.addEventListener('commsLoaded', (e) => {
            this.ports = this.sock.jsonData;
            this.chooseCommConnection();
        });
        
        document.addEventListener('commSelected', (e) => {
           this.connectToSerialComm(Events.selectedComm);
        });
        
        //attempt to start chat with server...
        this.sock = new Socket('ws://localhost:8080/GTRDashboard/websocket');
        this.events.addTestButtonEvents(this.sock);
    }
    
    public chooseCommConnection = () => {
        if(this.ports.length > 0){
            console.log("this works");
            this.display.renderCommSelector(this.ports);
        }else{
            Events.selectedComm = this.ports[0];
            this.connectToSerialComm(Events.selectedComm);
        }
    }
    
    public connectToSerialComm = (port) => {
        this.sock.sendMessage("connPort:" + port);
    }
  
}