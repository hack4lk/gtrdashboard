/// <reference path="display.ts" />
var Events = (function () {
    function Events() {
        this.startSuccessEvt = new Event('startSuccess');
        this.startFailEvt = new Event('startFail');
    }
    Events.setSplashPageHandlers = function () {
        var toggleSplashBtn = document.getElementById('toggleSplash');
        var splashPage = document.getElementById('viewSplash');
        Display.toggleScreenLeftRight('viewSplash', 'splash');
        toggleSplashBtn.addEventListener('click', function () {
            Display.toggleScreenLeftRight('viewSplash', 'splash');
        });
    };
    Events.prototype.setGlobalEvents = function () {
        this.openSocketBtn = document.getElementById('openSocket');
        this.sendBessageBtn = document.getElementById('sendMessage');
    };
    Events.prototype.addTestButtonEvents = function (sock) {
        this.openSocketBtn.addEventListener('click', function () {
            sock.createConn();
        });
        this.sendBessageBtn.addEventListener('click', function () {
            console.log("send message pressed....");
            sock.sendMessage('this works!');
        });
    };
    Events.prototype.trigger = function (eventType) {
        if (eventType === 'startSuccess') {
            document.dispatchEvent(this.startSuccessEvt);
        }
        if (eventType === 'startFail') {
            document.dispatchEvent(this.startFailEvt);
        }
    };
    return Events;
}());
