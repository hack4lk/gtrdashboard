/// <chutzpah_reference path='../libraries/jquery.js' />
/// <reference path='events.ts' />

class Display{
    
    templateHTML:string;
    callBack;
    appContent;
    appError;
    dashboardElements = {};
    
    constructor(){
        this.appContent = document.getElementById('appContent'); 
        this.appError = document.getElementById('appError'); 
    }
    
    public renderSplashPage(desc:string){
        let description = desc;
        
        this.getTemplate('splash.html', (data) => {
            if(data != ''){
                this.appContent.innerHTML = data;
                
                if(description != ""){
                    document.getElementById('splashDesc').innerHTML = description;
                }
                
                Events.setSplashPageHandlers();
            }else{
                alert('application error!');    
            }
        });
    }
    
    public renderErrorMessage(msg:string){
        this.getTemplate('loadError.html', (data) => {
            if(data != ''){
                this.appContent.innerHTML = data;
                Events.setLoadErrorPageHandlers();
                document.getElementById('viewLoadError').className = "load-error show";
                if(msg != ""){
                    let errorMsg = document.getElementById('errorStatus');
                    errorMsg.innerHTML = msg;
                }
                
            }else{
                alert('application error!');   
            }
        });
    }
    
    public renderCommSelector(ports){
        this.getTemplate('commSelect.html', (data) => {
            if(data != ''){
                this.appContent.innerHTML = data;
                document.getElementById('commSelect').className = "comm-select show";
                Events.setCommSelectHandlers(ports);
            }else{
                alert('application error!');   
            }
        });    
    }
    
    public renderdDashboardPage(){
        this.getTemplate('dashboard.html', (data) => {
            if(data != ''){
                this.appContent.innerHTML = data;
                this.dashboardElements = {
                    rpmWarning: <HTMLScriptElement>document.getElementById('redLineIndicator'),
                    maxSpeed : <HTMLScriptElement>document.getElementById('maxSpeed'),
                    milesPerHour : <HTMLScriptElement>document.getElementById('milesPerHour'),
                    rpm : <HTMLScriptElement>document.getElementById('rpm'),
                    cas : <HTMLScriptElement>document.getElementById('cas'),
                    batteryBar : <HTMLScriptElement>document.getElementById('batteryBar'),
                    battery : <HTMLScriptElement>document.getElementById('battery'),
                    coolant : <HTMLScriptElement>document.getElementById('coolant'),
                    accBar : <HTMLScriptElement>document.getElementById('accBar'),
                    acc : <HTMLScriptElement>document.getElementById('acc'),
                    afBar : <HTMLScriptElement>document.getElementById('afBar'),
                    af : <HTMLScriptElement>document.getElementById('af'),
                    mafBar : <HTMLScriptElement>document.getElementById('mafBar'),
                    maf : <HTMLScriptElement>document.getElementById('maf'),
                    tpsBar : <HTMLScriptElement>document.getElementById('tpsBar'),
                    tps : <HTMLScriptElement>document.getElementById('tps'),
                    tick1 : <HTMLScriptElement>document.getElementById('tick1'),
                    tick2 : <HTMLScriptElement>document.getElementById('tick2'),
                    tick3 : <HTMLScriptElement>document.getElementById('tick3'),
                    tick4 : <HTMLScriptElement>document.getElementById('tick4'),
                    tick5 : <HTMLScriptElement>document.getElementById('tick5'),
                    tick6 : <HTMLScriptElement>document.getElementById('tick6'),
                    tick7 : <HTMLScriptElement>document.getElementById('tick7'),
                    tick8 : <HTMLScriptElement>document.getElementById('tick8'),
                    tick9 : <HTMLScriptElement>document.getElementById('tick9')
                    
                };
            }else{
                alert('application error!');    
            }
        });
    }
    
    public updateDashboardComponents(newValues:string){
        let milesPerHour =  Math.floor(parseInt(newValues.substring(3,6), 16) * 0.621371);
        let rpm = Math.floor(parseInt(newValues.substring(6,9), 16) * 12.5);
        let coolant = Math.floor(parseInt(newValues.substring(9,12), 16) * 1.8 + 32);
        let battery =  parseInt(newValues.substring(12,15), 16) * 80 / 1000;
        let tps =  parseInt(newValues.substring(15,18), 16) * 20 / 1000;
        let maf =  parseInt(newValues.substring(18,21), 16) * 5 / 1000;
        let cas =  110 - parseInt(newValues.substring(24,27), 16);
        let acc =  parseInt(newValues.substring(27,30), 16);
        let af =  parseInt(newValues.substring(30,33), 16);
        
        this.dashboardElements.milesPerHour.innerHTML = milesPerHour;
        this.dashboardElements.rpm.innerHTML = rpm;
        this.dashboardElements.coolant.innerHTML = coolant + '&deg;F';
        this.dashboardElements.battery.innerHTML = battery + "v";
        this.dashboardElements.tps.innerHTML = tps;
        this.dashboardElements.maf.innerHTML = maf;
        this.dashboardElements.cas.innerHTML = cas + '&deg;';
        this.dashboardElements.acc.innerHTML = acc;
        this.dashboardElements.af.innerHTML = af;
        
        this.dashboardElements.batteryBar.style.height = battery/16*100 + "%";
        this.dashboardElements.accBar.style.height = acc + "%";
        this.dashboardElements.afBar.style.height = af/200*100 + "%";
        this.dashboardElements.mafBar.style.height = maf/6*100 + "%";
        this.dashboardElements.tpsBar.style.height = tps/6*100 + "%";
        
        this.dashboardElements.tick1.style.opacity = rpm /1000;
        this.dashboardElements.tick2.style.opacity = (rpm-1000) /1000;
        this.dashboardElements.tick3.style.opacity = (rpm-2000) /1000;
        this.dashboardElements.tick4.style.opacity = (rpm-3000) /1000;
        this.dashboardElements.tick5.style.opacity = (rpm-4000) /1000;
        this.dashboardElements.tick6.style.opacity = (rpm-5000) /1000;
        this.dashboardElements.tick7.style.opacity = (rpm-6000) /1000;
        this.dashboardElements.tick8.style.opacity = (rpm-7000) /1000;
        this.dashboardElements.tick9.style.opacity = (rpm-8000) /1000;
        
        console.log(this.dashboardElements.maxSpeed.innerHTML + " : " +  milesPerHour);
        if(this.dashboardElements.maxSpeed.innerHTML < milesPerHour){
            this.dashboardElements.maxSpeed.innerHTML = milesPerHour;  
        }
        
        if(rpm > 8000){
            this.dashboardElements.rpmWarning.style.opacity = 1;
        }else{
            this.dashboardElements.rpmWarning.style.opacity = 0;
        }
    }
    
    public static toggleScreenLeftRight(targetScreen:string, baseClass:string){
        let target = document.getElementById(targetScreen);
        
        if(target.className === baseClass){ 
            target.className = baseClass + ' show';
        }else if(target.className === (baseClass + ' hide')){
            target.className = baseClass + ' show';
        }else if(target.className === (baseClass + ' show')){
            target.className = 'splash hide';
        }
    }
    
    public static slideScreenLeft(target:string){
        //TODO
    }
    
    private getTemplate(templateName:string, callBack){
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'templates/' + templateName);
        
        xhr.onload = () => {
            let response = '';
            if(xhr.status === 200){
                response = xhr.responseText;
            }else{ 
                response = ''; 
            }

            if(typeof callBack  === 'function'){ 
                callBack(response); 
            }else{
                //do nothing...
            }
       };
       xhr.send();
    }
}