/// <reference path='events.ts' />

class Socket {
  
    wSocket;
    socketURL: string;
    socketData; //JSON
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
      
        this.wSocket.onmessage = function(event){
            this.socketData =  event.data;
        }
      
        this.wSocket.onclose = function(event){
            console.log('connection closed');
        }
    }
}

