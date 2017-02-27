/// <reference path="events.ts" />
/// <reference path="websocket.ts" />
/// <reference path="display.ts" />
var App = (function () {
    function App() {
        var _this = this;
        this.chooseCommConnection = function () {
            if (_this.ports.length > 0) {
                console.log("this works");
                _this.display.renderCommSelector(_this.ports);
            }
            else {
                Events.selectedComm = _this.ports[0];
                _this.connectToSerialComm(Events.selectedComm);
            }
        };
        this.connectToSerialComm = function (port) {
            _this.sock.sendMessage("connPort:" + port);
        };
        this.display = new Display();
        this.events = new Events();
        //assign global app handlers...
        this.events.setGlobalEvents();
        document.addEventListener('startSuccess', function (e) {
            _this.display.renderSplashPage();
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
        //attempt to start chat with server...
        this.sock = new Socket('ws://localhost:8080/GTRDashboard/websocket');
        this.events.addTestButtonEvents(this.sock);
    }
    return App;
}());
