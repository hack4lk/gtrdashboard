/// <reference path="events.ts" />
/// <reference path="websocket.ts" />
/// <reference path="display.ts" />

class App{
  
  sock: Socket;
  events: Events; 
  display: Display;
    
    constructor(){
        this.display = new Display();
        this.events = new Events();
        
        //assign global app handlers...
        this.events.setGlobalEvents();
        document.addEventListener('startSuccess', (e) => {
            this.display.renderSplashPage();
        });
        document.addEventListener('startFail', (e) => {
            this.display.renderErrorMessage();
        });
        
        //attempt to start chat with server...
        this.sock = new Socket('ws://localhost:8080/GTRDashboard/websocket');
        this.events.addTestButtonEvents(this.sock);
    }
  
}