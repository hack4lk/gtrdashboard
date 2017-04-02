/// <reference path="events.ts" />
/// <reference path="websocket.ts" />
/// <reference path="display.ts" />
var App = (function () {
    function App() {
        var _this = this;
        this.tempData = '0C 00 00 7C 97 15 10 05 5E 00 64 64 C0 ';
        this.chooseCommConnection = function () {
            if (_this.ports.length > 1) {
                _this.display.renderCommSelector(_this.ports);
            }
            else {
                Events.selectedComm = _this.ports[0];
                _this.connectToSerialComm(Events.selectedComm);
            }
        };
        this.connectToSerialComm = function (port) {
            if (typeof port.key != 'undefined') {
                port = port.key;
            }
            //document.getElementById('splashDesc').innerHTML = "Attempting to Connect to Car...";
            _this.display.renderSplashPage("Attempting to Connect to Car...");
            _this.sock.sendMessage("commPort::" + port);
        };
        this.display = new Display();
        this.events = new Events();
        //assign global app handlers...
        this.events.setGlobalEvents();
        document.addEventListener('startSuccess', function (e) {
            _this.display.renderSplashPage("Starting App...");
        });
        document.addEventListener('startFail', function (e) {
            _this.display.renderErrorMessage("");
        });
        document.addEventListener('splashPageLoaded', function (e) {
            console.log('load comms.....');
            _this.sock.sendMessage("getPorts");
        });
        document.addEventListener('commError', function (e) {
            _this.display.renderErrorMessage('[Cannot Talk to Car]');
        });
        document.addEventListener('commsLoaded', function (e) {
            _this.ports = _this.sock.jsonData;
            _this.chooseCommConnection();
        });
        document.addEventListener('commSelected', function (e) {
            _this.connectToSerialComm(Events.selectedComm);
        });
        document.addEventListener('commConnected', function (e) {
            if (_this.sock.jsonData.status === "false") {
                _this.showCOmConnectionError(_this.sock.jsonData.error);
            }
            else {
                // this.sock.sendMessage("initStream"); 
                console.log("successful connection....waiting to open stream....");
                _this.display.renderSplashPage("Connection Successful! Waiting for Data...");
                setTimeout(function () {
                    _this.sock.sendMessage("ecuBridgeOpen");
                }, 2000);
            }
        });
        document.addEventListener('ecuStatus', function (e) {
            console.log("ecu status....");
            if (_this.sock.jsonData == 10) {
                _this.display.renderSplashPage("Received Data...Loading Dashboard.");
                _this.sock.sendMessage('getECUdata');
            }
            else {
                _this.display.renderErrorMessage('[Connection Error: ECU not Responding.]');
            }
        });
        document.addEventListener('updateDashboard', function (e) {
            console.log("update called");
            //this.display.updateDashboardComponents(this.sock.jsonData);
            _this.display.updateDashboardComponents(_this.tempData);
        });
        //attempt to start chat with server... 
        this.sock = new Socket('ws://localhost:8080/GTRDashboard/websocket');
        this.events.addTestButtonEvents(this.sock);
        this.display.renderdDashboardPage();
        //temp code below
        var interval = setInterval(function () {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    _this.tempData = xhttp.responseText;
                    Events.triggerPublicEvent('updateDashboard');
                }
            };
            xhttp.open("GET", "ecudata.txt", true);
            xhttp.send();
        }, 500);
    }
    App.prototype.showCOmConnectionError = function (error) {
        if (error === 'java.lang.NullPointerException') {
            error = 'no connections available';
        }
        else if (error === 'portInUse') {
            console.log("Port already in use!");
            error = "Port already in use!";
        }
        else {
            error = this.sock.jsonData.error;
        }
        if (error != null)
            this.display.renderErrorMessage('[Connection Error: ' + error + ']');
    };
    return App;
}());
