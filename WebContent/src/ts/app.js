/// <reference path="events.ts" />
/// <reference path="websocket.ts" />
/// <reference path="display.ts" />
var App = (function () {
    function App() {
        var _this = this;
        this.display = new Display();
        this.events = new Events();
        //assign global app handlers...
        this.events.setGlobalEvents();
        document.addEventListener('startSuccess', function (e) {
            _this.display.renderSplashPage();
        });
        document.addEventListener('startFail', function (e) {
            _this.display.renderErrorMessage();
        });
        //attempt to start chat with server...
        this.sock = new Socket('ws://localhost:8080/GTRDashboard/websocket');
        this.events.addTestButtonEvents(this.sock);
    }
    return App;
}());
