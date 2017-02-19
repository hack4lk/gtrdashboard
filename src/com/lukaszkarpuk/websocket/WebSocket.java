package com.lukaszkarpuk.websocket;

import com.lukaszkarpuk.websocket.SerialConnector;

import gnu.io.CommPortIdentifier;

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


/**
 *
 * @author Lukasz Karpuk
 */
@ServerEndpoint(value="/websocket")
public class WebSocket{
	
	static ScheduledExecutorService timer;
	SerialConnector serialConn;
	
	public static void main(String[] args){
		
	}
	
    @OnOpen
    public void onOpen(Session session){
        System.out.println(session.getId() + " has opened a connection");
        timer = Executors.newSingleThreadScheduledExecutor();
        
        try{
        	session.getBasicRemote().sendText("Connection Established!");
        	serialConn = new SerialConnector();
        }catch(IOException e){
        	System.out.print("error opening session!");
        }
        
    }
    
    @OnMessage
    public void onMessage(String message, Session session){
        try{
        	String test = performTask(message);
        	session.getBasicRemote().sendText(test);
        }catch(IOException e){
        	System.out.print("error sending message!");
        }
    }
    
    @OnClose
    public void onClose(Session session){
        System.out.println("Session " + session.getId() + " has ended");
    }
    
    
//    @OnError
//    public void onError(Session session, Throwable e){
//    	System.out.println(e.toString());
//    }
    
    
    public String performTask(String task){
    	if(task.equalsIgnoreCase("getPorts")){
    		HashMap<String, CommPortIdentifier> portMap = serialConn.searchForPorts(true);
    		
    		if(portMap.size() > 0){
    			JSONArray portArray = new JSONArray(portMap);
    			return portArray.toString();
    		}else{
    			return "{}";
    		}
    		
    		
    	}else{
    		return "null";
    	}
    }
}
