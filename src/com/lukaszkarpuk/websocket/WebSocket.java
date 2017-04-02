package com.lukaszkarpuk.websocket;

import com.lukaszkarpuk.websocket.SerialConnector;

import gnu.io.CommPortIdentifier;

import java.io.Console;
import java.io.IOException;
import java.nio.ByteBuffer;

import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import java.util.concurrent.*;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import java.awt.Color;
import java.io.IOException;
import java.io.InputStream; 
import java.io.OutputStream;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.TooManyListenersException;

import org.json.*;
import com.google.gson.*; 

import java.util.Observer;
import java.util.Observable;

/**
 *
 * @author Lukasz Karpuk
 */
@ServerEndpoint(value="/websocket")
public class WebSocket implements Observer{
	
	static ScheduledExecutorService timer;
	SerialConnector serialConn;
	public GsonBuilder builder = new GsonBuilder();
	
	public static void main(String[] args){
		
	}
	
    @OnOpen
    public void onOpen(Session session){
        System.out.println(session.getId() + " has opened a connection");
        timer = Executors.newSingleThreadScheduledExecutor();
        
        try{
        	session.getBasicRemote().sendText("{\"responseCode\":\"OK\"}");
        }catch(IOException e){
        	System.out.print("error opening session!");
        }
        
    }
    
    @OnMessage
    public void onMessage(String message, Session session){
        try{
        	String text = performTask(message);
        	session.getBasicRemote().sendText(text);
        }catch(IOException e){
        	System.out.print("error sending message!");
        }
    }
    
    @OnClose
    public void onClose(Session session){
        System.out.println("Session " + session.getId() + " has ended");
    }
    
    
    @OnError
    public void onError(Session session, Throwable e){
    	e.printStackTrace();
    	
    	try{
    		serialConn.disconnect();
    	}catch(Exception e2){
    		System.out.println("unable to disconnect");
    	}
    }
    
    public void update(Observable obs, Object obj){
    	//System.out.println("data: >>>" + serialConn.logText + "<<<");
    }
    
    
    public String performTask(String task){
    	if(task.equalsIgnoreCase("getPorts")){
    		return this.getCommPorts();
    	}else if(task.indexOf("commPort") != -1){
    		return this.connectToComm(task); 
    	}else if(task.equalsIgnoreCase("initStream")){
    		return this.initiateStream();
    	}else if(task.equalsIgnoreCase("closeConn")){
    		return this.disconnect();
    	}else if(task.equalsIgnoreCase("ecuBridgeOpen")){
    		return this.ecuBridgeOpen();
    	}else if(task.equalsIgnoreCase("getECUdata")){
    		return this.getECUdata();
    	}else{
    		return "{\"responseCode\":\"commError\"}";
    	}
    }

    private String getCommPorts(){
    	String result = "";
    	
    	serialConn = new SerialConnector();
    	serialConn.addObserver(this);
    	
    	HashMap<String, CommPortIdentifier> portMap = serialConn.searchForPorts(true);
    	
    	if(portMap.size() > 0){
			String response = "{\"responseCode\":\"commsAvailable\", \"data\": [";
			String data = "";
			
			for(HashMap.Entry<String, CommPortIdentifier> entry : portMap.entrySet()){
				String key = entry.getKey();
				data += "{\"key\":\"" + key + "\"},";
			}
			data = data.substring(0, data.length() - 1);
			response = response + data + "]}";
			System.out.println(response);
    		return response;
		}else{
			//return "{\"responseCode\":\"commError\"}";
			return "{\"responseCode\":\"commsAvailable\", \"data\": [{\"key\":\"COM4\"}]}";
		}
    }
    
    private String connectToComm(String task){
    	System.out.println(task);
    	String[] commData = task.split("::"); //split the string to get the key...
    	//Boolean connected = serialConn.connect(commData[1]);
    	Boolean connected = serialConn.connect(commData[1]);
    	String error = serialConn.connectError;
    	
    	System.out.println(commData[1]);
    	System.out.println("---connnection data----");
    	System.out.println(connected.toString());
    	
    	if(error.indexOf("PortInUseException") > 0){
    		error = "portInUse";
    		System.out.println("port in use");
    		//System.out.println(serialConn.getPortInfo());
    	}else if(connected == true){
    		this.initiateStream();
    	}
    	
    	String result = "{\"responseCode\":\"commConnStatus\", \"data\": {\"status\":\"" + connected.toString() + "\", \"error\":\"" + error + "\"}}";;
    	
    	return result;
    }
    
    private String initiateStream(){
    	String result = "";
    	//Boolean status = false;
    	Boolean status = serialConn.initIOStream();
    	
    	if(status){
    		System.out.println("init success");
    		serialConn.initListener();
    		sendInitializationVector();
    	}else{
    		System.out.println("init failed");
    	}
    	
    	result = "{\"responseCode\":\"ioStreamStatus\", \"data\": {\"status\":\"" + status.toString() + "\"}}";;
    	return result;
    }
    
    private String disconnect(){
    	try{
    		serialConn.disconnect();
    	}catch(Exception e2){
    		System.out.println("unable to disconnect");
    	}
    	
    	return "";
    }
    
    private void sendInitializationVector(){
    	byte[] val = new byte[] { (byte)0xFF, (byte)0xFF, (byte)0xEF };
    	serialConn.writeData(val);
    	
    	try {
    	    Thread.sleep(2000);
    	} catch(InterruptedException ex) {
    	    Thread.currentThread().interrupt();
    	}
    }
    
    private String getECUdata(){
    	serialConn.sb = null;
    	byte[] val = new byte[] { (byte)0x5A, (byte)0x0B, (byte)0x5A, (byte)0x01, (byte)0x5A, (byte)0x08,
    							  (byte)0x5A, (byte)0x0C, (byte)0x5A, (byte)0x0D, (byte)0x5A, (byte)0x05, 
    							  (byte)0x5A, (byte)0x13, (byte)0x5A, (byte)0x16,
    							  (byte)0x5A, (byte)0x17, (byte)0x5A, (byte)0x1A, (byte)0x5A, (byte)0x1C,
    							  (byte)0x5A, (byte)0x21, (byte)0xF0};
    	
    	//byte[] val = new byte[] { (byte)0x5A, (byte)0x16, (byte)0xF0 };
    	
    	serialConn.writeData(val);
    	
    	try{
    		Thread.sleep(2000);
    		serialConn.writeData(new byte[]{(byte)0x30});
    	}catch(InterruptedException ex){
    		Thread.currentThread().interrupt();
    	}
    	
    	String response = "{\"responseCode\":\"ecuData\", \"data\":'" + serialConn.logText + "'}";
    	return response;
    }
    
    private String ecuBridgeOpen(){
    	return "{\"responseCode\":\"ecuStatus\", \"data\":" + serialConn.logText + "}";
    }
}
