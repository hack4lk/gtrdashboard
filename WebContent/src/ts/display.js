/// <chutzpah_reference path='../libraries/jquery.js' />
/// <reference path='events.ts' />
var Display = (function () {
    function Display() {
        this.dashboardElements = {};
        this.appContent = document.getElementById('appContent');
        this.appError = document.getElementById('appError');
    }
    Display.prototype.renderSplashPage = function (desc) {
        var _this = this;
        var description = desc;
        this.getTemplate('splash.html', function (data) {
            if (data != '') {
                _this.appContent.innerHTML = data;
                if (description != "") {
                    document.getElementById('splashDesc').innerHTML = description;
                }
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
    Display.prototype.renderdDashboardPage = function () {
        var _this = this;
        this.getTemplate('dashboard.html', function (data) {
            if (data != '') {
                _this.appContent.innerHTML = data;
                _this.dashboardElements = {
                    rpmWarning: document.getElementById('redLineIndicator'),
                    maxSpeed: document.getElementById('maxSpeed'),
                    milesPerHour: document.getElementById('milesPerHour'),
                    rpm: document.getElementById('rpm'),
                    cas: document.getElementById('cas'),
                    batteryBar: document.getElementById('batteryBar'),
                    battery: document.getElementById('battery'),
                    coolant: document.getElementById('coolant'),
                    accBar: document.getElementById('accBar'),
                    acc: document.getElementById('acc'),
                    afBar: document.getElementById('afBar'),
                    af: document.getElementById('af'),
                    mafBar: document.getElementById('mafBar'),
                    maf: document.getElementById('maf'),
                    tpsBar: document.getElementById('tpsBar'),
                    tps: document.getElementById('tps'),
                    tick1: document.getElementById('tick1'),
                    tick2: document.getElementById('tick2'),
                    tick3: document.getElementById('tick3'),
                    tick4: document.getElementById('tick4'),
                    tick5: document.getElementById('tick5'),
                    tick6: document.getElementById('tick6'),
                    tick7: document.getElementById('tick7'),
                    tick8: document.getElementById('tick8'),
                    tick9: document.getElementById('tick9')
                };
            }
            else {
                alert('application error!');
            }
        });
    };
    Display.prototype.updateDashboardComponents = function (newValues) {
        var milesPerHour = Math.floor(parseInt(newValues.substring(3, 6), 16) * 0.621371);
        var rpm = Math.floor(parseInt(newValues.substring(6, 9), 16) * 12.5);
        var coolant = Math.floor(parseInt(newValues.substring(9, 12), 16) * 1.8 + 32);
        var battery = parseInt(newValues.substring(12, 15), 16) * 80 / 1000;
        var tps = parseInt(newValues.substring(15, 18), 16) * 20 / 1000;
        var maf = parseInt(newValues.substring(18, 21), 16) * 5 / 1000;
        var cas = 110 - parseInt(newValues.substring(24, 27), 16);
        var acc = parseInt(newValues.substring(27, 30), 16);
        var af = parseInt(newValues.substring(30, 33), 16);
        this.dashboardElements.milesPerHour.innerHTML = milesPerHour;
        this.dashboardElements.rpm.innerHTML = rpm;
        this.dashboardElements.coolant.innerHTML = coolant + '&deg;F';
        this.dashboardElements.battery.innerHTML = battery + "v";
        this.dashboardElements.tps.innerHTML = tps;
        this.dashboardElements.maf.innerHTML = maf;
        this.dashboardElements.cas.innerHTML = cas + '&deg;';
        this.dashboardElements.acc.innerHTML = acc;
        this.dashboardElements.af.innerHTML = af;
        this.dashboardElements.batteryBar.style.height = battery / 16 * 100 + "%";
        this.dashboardElements.accBar.style.height = acc + "%";
        this.dashboardElements.afBar.style.height = af / 200 * 100 + "%";
        this.dashboardElements.mafBar.style.height = maf / 6 * 100 + "%";
        this.dashboardElements.tpsBar.style.height = tps / 6 * 100 + "%";
        this.dashboardElements.tick1.style.opacity = rpm / 1000;
        this.dashboardElements.tick2.style.opacity = (rpm - 1000) / 1000;
        this.dashboardElements.tick3.style.opacity = (rpm - 2000) / 1000;
        this.dashboardElements.tick4.style.opacity = (rpm - 3000) / 1000;
        this.dashboardElements.tick5.style.opacity = (rpm - 4000) / 1000;
        this.dashboardElements.tick6.style.opacity = (rpm - 5000) / 1000;
        this.dashboardElements.tick7.style.opacity = (rpm - 6000) / 1000;
        this.dashboardElements.tick8.style.opacity = (rpm - 7000) / 1000;
        this.dashboardElements.tick9.style.opacity = (rpm - 8000) / 1000;
        console.log(this.dashboardElements.maxSpeed.innerHTML + " : " + milesPerHour);
        if (this.dashboardElements.maxSpeed.innerHTML < milesPerHour) {
            this.dashboardElements.maxSpeed.innerHTML = milesPerHour;
        }
        if (rpm > 8000) {
            this.dashboardElements.rpmWarning.style.opacity = 1;
        }
        else {
            this.dashboardElements.rpmWarning.style.opacity = 0;
        }
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
