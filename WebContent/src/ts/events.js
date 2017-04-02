/// <reference path="display.ts" />
var Events = (function () {
    function Events() {
        var _this = this;
        this.display = new Display();
        this.trigger = function (eventType) {
            if (eventType === 'startSuccess') {
                document.dispatchEvent(_this.startSuccessEvt);
            }
            if (eventType === 'startFail') {
                document.dispatchEvent(_this.startFailEvt);
            }
        };
        this.startSuccessEvt = new Event('startSuccess');
        this.startFailEvt = new Event('startFail');
        Events.commErrorEvt = new Event('commError');
        Events.commsLoadedEvt = new Event('commsLoaded');
        Events.commSelectedEvt = new Event('commSelected');
        Events.commAbleToConnectEvt = new Event('commConnected'); //event when we're able to connect to car!
        Events.ecuStatusEvt = new Event('ecuStatus');
        Events.updateDashboardEvt = new Event('updateDashboard');
    }
    Events.triggerPublicEvent = function (eventType) {
        if (eventType === 'commError') {
            document.dispatchEvent(Events.commErrorEvt);
        }
        if (eventType === 'commsLoaded') {
            document.dispatchEvent(Events.commsLoadedEvt);
        }
        if (eventType === 'commConnected') {
            document.dispatchEvent(Events.commAbleToConnectEvt);
        }
        if (eventType === 'ecuStatus') {
            document.dispatchEvent(Events.ecuStatusEvt);
        }
        if (eventType === 'updateDashboard') {
            document.dispatchEvent(Events.updateDashboardEvt);
        }
    };
    Events.setSplashPageHandlers = function () {
        var toggleSplashBtn = document.getElementById('toggleSplash');
        var getCommsBtn = document.getElementById('searchForComm');
        var splashPage = document.getElementById('viewSplash');
        Display.toggleScreenLeftRight('viewSplash', 'splash');
        toggleSplashBtn.addEventListener('click', function () {
            Display.toggleScreenLeftRight('viewSplash', 'splash');
        });
        getCommsBtn.addEventListener('click', function (e) {
            var splashPageLoadedEvt = new Event("splashPageLoaded");
            document.dispatchEvent(splashPageLoadedEvt);
        });
    };
    Events.setCommSelectHandlers = function (ports) {
        var commSelect = document.getElementById('comms');
        var initOption = document.createElement('option');
        initOption.text = "Select";
        initOption.value = "0";
        commSelect.add(initOption);
        for (var x = 0; x < ports.length; x++) {
            var option = document.createElement('option');
            option.text = ports[x].key;
            option.value = ports[x].key;
            commSelect.add(option);
        }
        commSelect.addEventListener('change', function (e) {
            Events.selectedComm = e.target.value;
            document.dispatchEvent(Events.commSelectedEvt);
        });
    };
    Events.setLoadErrorPageHandlers = function () {
        Display.toggleScreenLeftRight('viewLoadError', 'load-error');
    };
    Events.prototype.setGlobalEvents = function () {
        this.openSocketBtn = document.getElementById('openSocket');
        this.sendBessageBtn = document.getElementById('sendMessage');
        this.closeConn = document.getElementById('closeSocket');
        this.dashboardBtn = document.getElementById('loadDashboard');
    };
    Events.prototype.addTestButtonEvents = function (sock) {
        var _this = this;
        this.openSocketBtn.addEventListener('click', function (e) {
            sock.createConn();
        });
        this.closeConn.addEventListener('click', function (e) {
            sock.closeSocket();
        });
        this.sendBessageBtn.addEventListener('click', function () {
            console.log("send message pressed....");
            sock.sendMessage('this works!');
        });
        this.dashboardBtn.addEventListener('click', function () {
            _this.display.renderdDashboardPage();
        });
    };
    return Events;
}());
