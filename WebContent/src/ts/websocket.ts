/// <reference path='events.ts' />
/// <reference path="display.ts" />

class Socket {
  
    wSocket;
    socketURL: string;
    socketData; //string
    jsonData; //json
    events;
    
    constructor(url: string){
        //do nothing for now...
        this.socketURL = url;
        this.events = new Events();        
    }
  
    public createConn(){
      if(this.wSocket !== undefined && this.wSocket.readyState !== this.wSocket.CLOSED){
          console.log('socket exists');
          return false;
      }else{
          console.log('socket created'); 
          this.wSocket = new WebSocket(this.socketURL);
      
      }
        
      if(this.wSocket !== undefined){
         this.assignwSocketHandlers();
      }else{
         return false;
      }
    }
     
    public sendMessage(msg){
        this.wSocket.send(msg);
    }
  
    public closeSocket(){
        console.log('socket closed');
         this.wSocket.send("closeConn");
         this.wSocket.close();
    }
  
    public assignwSocketHandlers(){
    
        this.wSocket.onopen = function(e){
          let events = new Events();
            
          if(e.returnValue === undefined){
            events.trigger('startFail');
          }else{
            events.trigger('startSuccess');
          }
        }
      
        this.wSocket.onmessage = (event) =>{
            this.socketData =  event.data;
            let response = {'responseCode':'', 'data': ''};
            
            try{
                response = JSON.parse(this.socketData);
            }catch(e){
                console.log(event.data);
                console.log(e);
                Events.triggerPublicEvent('commError');
                return;
            }
            
            if(typeof response.responseCode === 'undefined') response.responseCode = null;
            
            switch(response.responseCode){
                case 'ecuData':
                    this.jsonData = response.data;
                    Events.triggerPublicEvent('updateDashboard');
                    break;
                case 'commError':
                    Events.triggerPublicEvent('commError'); 
                    break;
                case null:
                    Events.triggerPublicEvent('commError'); 
                    break;
                case 'commsAvailable':
                    this.jsonData = response.data;
                    Events.triggerPublicEvent('commsLoaded');
                    break;
                case 'commConnStatus':
                    this.jsonData = response.data;
                    console.log(response.data);
                    Events.triggerPublicEvent('commConnected');
                    break;
                case 'ecuStatus':
                     this.jsonData = response.data;
                     console.log(response.data);
                    Events.triggerPublicEvent('ecuStatus');
                default:
                    console.log(response);
                    break; //do nothing for now...later we'll add method for update data...
            }
        }
      
        this.wSocket.onclose = function(event){
            var display = new Display();
            display.renderErrorMessage("Lost Connection to Car");
        }
    }
}

