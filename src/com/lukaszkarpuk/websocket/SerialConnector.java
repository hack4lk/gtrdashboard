package com.lukaszkarpuk.websocket;

import gnu.io.*;
import java.awt.Color;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.TooManyListenersException;
import java.util.Observable;


public class SerialConnector extends Observable implements SerialPortEventListener {
	//for containing the ports that will be found
    private Enumeration ports = null;
    //map the port names to CommPortIdentifiers
    private HashMap<String, CommPortIdentifier> portMap = new HashMap<String, CommPortIdentifier>();

    //this is the object that contains the opened port
    private CommPortIdentifier selectedPortIdentifier = null;
    private SerialPort serialPort = null;

    //input and output streams for sending and receiving data
    private InputStream input = null;
    private OutputStream output = null;

    private boolean bConnected = false;

    //the timeout value for connecting with the port
    final static int TIMEOUT = 2000;

    //some ascii values for for certain things
    final static int SPACE_ASCII = 32;
    final static int DASH_ASCII = 45;
    final static int NEW_LINE_ASCII = 10;

    public String logText = "";
    String connectError = "";
    
    Thread readThread;
    byte[] readBuffer;
    StringBuilder sb = new StringBuilder();
    String longText = "";
    String engineResponse = "";
    
    public static void main(String[] args){
	}
    
	public SerialConnector(){
		System.out.print("Serial Connection Created! \n");
	}
	
	public String getPortInfo(){
		return serialPort.toString();
	}
	
    public HashMap searchForPorts(Boolean doReturn){
        ports = CommPortIdentifier.getPortIdentifiers();
                
        while (ports.hasMoreElements())
        {
            CommPortIdentifier curPort = (CommPortIdentifier)ports.nextElement();
        	System.out.println(curPort.getPortType());
            //get only serial ports
            if (curPort.getPortType() == CommPortIdentifier.PORT_SERIAL)
            {
                //window.cboxPorts.addItem(curPort.getName());
                portMap.put(curPort.getName(), curPort);
            }else{
            	System.out.print(curPort.toString());
            }
        }
        
        if(doReturn){
        	return portMap;
        }else{
        	return portMap;
        }
    }
    
    public Boolean connect(String selectedPort){
        selectedPortIdentifier = (CommPortIdentifier)portMap.get(selectedPort);

        CommPort commPort = null;

        try{
            commPort = selectedPortIdentifier.open("GTRDashboard", TIMEOUT);
            serialPort = (SerialPort)commPort;

            System.out.println(serialPort.toString());
            return true;
        }
        catch (PortInUseException e)
        {
        	System.out.println(e);
        	connectError = e.toString();
        	return false;
        }
        catch (Exception e)
        {
        	e.printStackTrace();
        	connectError = e.toString();
        	return false;
        }
    }
    
    public boolean initIOStream(){
        boolean successful = false;

        try {
            System.out.println("stream open!");
            input = serialPort.getInputStream();
            output = serialPort.getOutputStream();

            successful = true;
            return successful;
        }
        catch (IOException e) {
            System.out.println("I/O Streams failed to open. (" + e.toString() + ")");
            return successful;
        }
    }
    
    public void initListener(){
        try
        {
        	System.out.println("listener successful!");
            serialPort.addEventListener(this);
            serialPort.notifyOnDataAvailable(true);
        }
        catch (TooManyListenersException e)
        {
            logText = "Too many listeners. (" + e.toString() + ")";
        }
        
        try {

            serialPort.setSerialPortParams(9600, SerialPort.DATABITS_8,
                    SerialPort.STOPBITS_1, SerialPort.PARITY_NONE);

            // no handshaking or other flow control
            serialPort.setFlowControlMode(SerialPort.FLOWCONTROL_NONE);

            // timer on any read of the serial port
            serialPort.enableReceiveTimeout(500);

            System.out.println("................");

        } catch (UnsupportedCommOperationException e) {
            System.out.println("UnSupported comm operation");
        }
    }
    
    public void disconnect(){
    	System.out.println("Disconnected!");
        try
        {
            serialPort.removeEventListener();
            serialPort.close();
            input.close();
            output.close();

            logText = "Disconnected.";
        }
        catch (Exception e)
        {
            logText = "Failed to close " + serialPort.getName()
                              + "(" + e.toString() + ")";
        }
    }
    
    public void serialEvent(SerialPortEvent evt) {
    	//System.out.println("event type: " + evt.getEventType());
    	
        if (evt.getEventType() == SerialPortEvent.DATA_AVAILABLE)
        {
        	//System.out.println("we have data!!");
        	try
            {
                byte singleData = (byte)input.read();

                if (singleData != NEW_LINE_ASCII)
                {
                    //logText += new String(new byte[] {singleData});
                	logText = (String.format("%02X ", singleData));
                	
                	if(logText.equalsIgnoreCase("FF ")){
                		engineResponse = longText;
                		longText = "";
                	}else{
                		longText += logText;
                	}
                	
                    //sb.append(logText);
                    System.out.println(engineResponse);
                }
                else
                {
                	System.out.println("single: " + singleData);
                }
               
                /////-------------------------//////
                
                /*
            	readBuffer = new byte[8];

                try {

                	while (input.available()>0) {
            		  int numBytes = input.read(readBuffer);
            		  
            		  sb.append(String.format("%02X ", numBytes));
            		  logText += new String(readBuffer);
            		  
            		  System.out.println(sb);
            		}
                	
                	System.out.println("log2: " + sb);

                } catch (IOException e) {
                    System.out.println("IO Exception in SerialEvent()");
                }
                */
                //System.out.println(sb.toString());
                setChanged();
                notifyObservers();
            }
            catch (Exception e)
            {
                logText = "Failed to read data. (" + e.toString() + ")";
                System.out.println(logText);
            }
        }
    }
    
    public void writeData(byte[] hexData){
    	System.out.println("writing....");
        try
        {
        	output.write(hexData);
            output.flush();
            //output.write(DASH_ASCII);
            //output.flush();
        }
        catch (Exception e)
        {
            logText = "Failed to write data. (" + e.toString() + ")";
        }
    }
}