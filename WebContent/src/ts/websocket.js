/// <reference path='events.ts' />
var Socket = (function () {
    function Socket(url) {
        //do nothing for now...
        this.socketURL = url;
        this.events = new Events();
    }
    Socket.prototype.createConn = function () {
        if (this.wSocket !== undefined && this.wSocket.readyState !== this.wSocket.CLOSED) {
            console.log('socket exists');
            return false;
        }
        else {
            console.log('socket created');
            this.wSocket = new WebSocket(this.socketURL);
        }
        if (this.wSocket !== undefined) {
            this.assignwSocketHandlers();
        }
        else {
            return false;
        }
    };
    Socket.prototype.sendMessage = function (msg) {
        this.wSocket.send(msg);
    };
    Socket.prototype.closeSocket = function () {
        console.log('socket closed');
        this.wSocket.close();
    };
    Socket.prototype.assignwSocketHandlers = function () {
        var _this = this;
        this.wSocket.onopen = function (e) {
            var events = new Events();
            if (e.returnValue === undefined) {
                events.trigger('startFail');
            }
            else {
                events.trigger('startSuccess');
            }
        };
        this.wSocket.onmessage = function (event) {
            _this.socketData = event.data;
            var response = { 'responseCode': '', 'data': '' };
            try {
                response = JSON.parse(_this.socketData);
            }
            catch (e) {
                console.log(e);
                Events.triggerPublicEvent('commError');
                return;
            }
            if (typeof response.responseCode === 'undefined')
                response.responseCode = null;
            switch (response.responseCode) {
                case 'commError':
                    Events.triggerPublicEvent('commError');
                    break;
                case null:
                    Events.triggerPublicEvent('commError');
                    break;
                case 'commsAvailable':
                    _this.jsonData = response.data;
                    Events.triggerPublicEvent('commsLoaded');
                    break;
                default:
                    console.log(response);
                    break; //do nothing for now...later we'll add method for update data...
            }
        };
        this.wSocket.onclose = function (event) {
            console.log('connection closed');
        };
    };
    return Socket;
}());
