/// <chutzpah_reference path='../libraries/jquery.js' />
/// <reference path='events.ts' />
var Display = (function () {
    function Display() {
        this.appContent = document.getElementById('appContent');
        this.appError = document.getElementById('appError');
    }
    Display.prototype.renderSplashPage = function () {
        var _this = this;
        this.getTemplate('splash.html', function (data) {
            if (data != '') {
                _this.appContent.innerHTML = data;
                Events.setSplashPageHandlers();
            }
            else {
                alert('application error!');
            }
        });
    };
    Display.prototype.renderErrorMessage = function (msg) {
        var _this = this;
        this.getTemplate('loadError.html', function (data) {
            if (data != '') {
                _this.appContent.innerHTML = data;
                Events.setLoadErrorPageHandlers();
                document.getElementById('viewLoadError').className = "load-error show";
                if (msg != "") {
                    var errorMsg = document.getElementById('errorStatus');
                    errorMsg.innerHTML = msg;
                }
            }
            else {
                alert('application error!');
            }
        });
    };
    Display.prototype.renderCommSelector = function (ports) {
        var _this = this;
        this.getTemplate('commSelect.html', function (data) {
            if (data != '') {
                _this.appContent.innerHTML = data;
                document.getElementById('commSelect').className = "comm-select show";
                Events.setCommSelectHandlers(ports);
            }
            else {
                alert('application error!');
            }
        });
    };
    Display.toggleScreenLeftRight = function (targetScreen, baseClass) {
        var target = document.getElementById(targetScreen);
        if (target.className === baseClass) {
            target.className = baseClass + ' show';
        }
        else if (target.className === (baseClass + ' hide')) {
            target.className = baseClass + ' show';
        }
        else if (target.className === (baseClass + ' show')) {
            target.className = 'splash hide';
        }
    };
    Display.slideScreenLeft = function (target) {
        //TODO
    };
    Display.prototype.getTemplate = function (templateName, callBack) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'templates/' + templateName);
        xhr.onload = function () {
            var response = '';
            if (xhr.status === 200) {
                response = xhr.responseText;
            }
            else {
                response = '';
            }
            if (typeof callBack === 'function') {
                callBack(response);
            }
            else {
            }
        };
        xhr.send();
    };
    return Display;
}());
