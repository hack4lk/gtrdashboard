/// <reference path="events.ts" />
/// <reference path="websocket.ts" />
/// <reference path="display.ts" />

class App{
  
  sock: Socket;
  events: Events; 
  display: Display;
  ports;
  public tempData = '0C 00 00 7C 97 15 10 05 5E 00 64 64 C0 ';
    
    constructor(){
        this.display = new Display();
        this.events = new Events();
        
        //assign global app handlers...
        this.events.setGlobalEvents();
        
        document.addEventListener('startSuccess', (e) => {
            this.display.renderSplashPage("Starting App...");
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
        
        document.addEventListener('commConnected', (e) => {
           if(this.sock.jsonData.status === "false"){
               this.showCOmConnectionError(this.sock.jsonData.error);
           }else{
               // this.sock.sendMessage("initStream"); 
               console.log("successful connection....waiting to open stream....");
               this.display.renderSplashPage("Connection Successful! Waiting for Data...");
               
               setTimeout( () => {
                   this.sock.sendMessage("ecuBridgeOpen");
               },2000);
               
           }
        });
        
        document.addEventListener('ecuStatus', (e) => {
            console.log("ecu status....");
            
            if(this.sock.jsonData == 10){
                this.display.renderSplashPage("Received Data...Loading Dashboard.");
                this.sock.sendMessage('getECUdata');                
            }else{
                this.display.renderErrorMessage('[Connection Error: ECU not Responding.]');
            }
        });
        
        document.addEventListener('updateDashboard', (e) => {
           console.log("update called");
           //this.display.updateDashboardComponents(this.sock.jsonData);
           this.display.updateDashboardComponents(this.tempData);
            
        });
        
        //attempt to start chat with server... 
        this.sock = new Socket('ws://localhost:8080/GTRDashboard/websocket');
        this.events.addTestButtonEvents(this.sock);
        
        this.display.renderdDashboardPage();
        
        //temp code below
        var interval = setInterval( () => {
           
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    this.tempData = xhttp.responseText;
                    Events.triggerPublicEvent('updateDashboard');
                }
            };
            xhttp.open("GET", "ecudata.txt", true);
            xhttp.send();
           
        }, 500);
       
        
    }
    
    public chooseCommConnection = () => {
        if(this.ports.length > 1){
            this.display.renderCommSelector(this.ports);
        }else{
            Events.selectedComm = this.ports[0];
            this.connectToSerialComm(Events.selectedComm);
        }
    }
    
    public connectToSerialComm = (port) => {
        
        if(typeof port.key != 'undefined'){
               port = port.key;
        }
        
        //document.getElementById('splashDesc').innerHTML = "Attempting to Connect to Car...";
        this.display.renderSplashPage("Attempting to Connect to Car...");
        this.sock.sendMessage("commPort::" + port);
    }
    
    public showCOmConnectionError(error:string){
        if(error === 'java.lang.NullPointerException'){
            error = 'no connections available';   
        }else if(error === 'portInUse'){
            console.log("Port already in use!");
            error = "Port already in use!";
        }else{
            error = this.sock.jsonData.error;
        }   
        
        if(error != null) this.display.renderErrorMessage('[Connection Error: ' + error + ']');
    }
  
}