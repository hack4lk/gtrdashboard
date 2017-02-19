/// <chutzpah_reference path='../libraries/jquery.js' />
var Display = (function () {
    function Display() {
        this.appContent = document.getElementById('appContent');
        this.appError = document.getElementById('appError');
    }
    Display.prototype.renderSplashPage = function () {
        var _this = this;
        this.getTemplate("splash.html", function (data) {
            if (data != "") {
                _this.appContent.innerHTML = data;
            }
            else {
                alert("application error!");
            }
        });
    };
    Display.prototype.renderErrorMessage = function () {
        var _this = this;
        this.getTemplate("loadError.html", function (data) {
            if (data != "") {
                _this.appError = data;
            }
            else {
                alert("application error!");
            }
        });
    };
    Display.prototype.getTemplate = function (templateName, callBack) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'templates/' + templateName);
        xhr.onload = function () {
            var response = "";
            if (xhr.status === 200) {
                response = xhr.responseText;
            }
            else {
                response = "";
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
