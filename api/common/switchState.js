const Gpio = require('onoff').Gpio,
      flags = require('./flags');



let self = module.exports = {
    activeSwitches: [],
    activeTimeOuts: [],
    // switch so that it only deactivate the pin if its a different pin...
    activateSwitches: (switches)=>{
        return new Promise((resolve,reject)=>{
            switches.forEach((theSwitch, i)=>{
                theSwitch.switch = new Gpio(theSwitch.pin, "out");
                self.activeSwitches.push(theSwitch);
                console.log("pushed and activated the gpio pin: ", theSwitch.label);
            });
            resolve(self.activeSwitches);
        });
    },
    getActiveSwitches: ()=>{
        return self.activeSwitches;
    },
    replaceSwitch: (currentSwitch, newSwitch)=>{
        let activeSwitches = self.activeSwitches;

        activeSwitches.forEach((activeSwitch, i)=>{
            if(activeSwitch.uuid === currentSwitch.uuid){
                activeSwitch.switch.unexport();
                activeSwitches.splice(i,1);
                newSwitch.switch = new Gpio(newSwitch.pin, "out");
                self.activeSwitches.push(newSwitch);
            }
        });
    },
    on: (theSwitch, callback)=>{
        setTimeout(()=>{
            theSwitch.switch.writeSync(0);
            callback(theSwitch);
        },theSwitch.wait*1000)
    },
    off: (theSwitch)=>{
        setTimeout(()=>{
            theSwitch.switch.writeSync(1);
        },theSwitch.wait*1000)
    },
    createMap: (switches)=>{
        let activeSwitches = self.activeSwitches;
        let toTurnOnArr = switches.map((currentSwitch)=>{
            let toTurnOn = activeSwitches.filter(theSwitch => theSwitch.uuid === currentSwitch.uuid);
            toTurnOn[0].wait = currentSwitch.wait;
            toTurnOn[0].switchIs = currentSwitch.switchIs;
            return toTurnOn[0];
        });
        return toTurnOnArr;
    },
    onOffSync: (switchMap, callback)=>{
        switchMap.switches.forEach((singleSwitch,i)=>{
            let timeouts = setTimeout(()=>{
                self.activeTimeOuts.push(timeouts);
                let toTurnOn = self.activeSwitches.filter(theSwitch => theSwitch.uuid === singleSwitch.uuid);
                if(singleSwitch.switchIs === "ON"){
                    toTurnOn[0].switch.writeSync(0);
                    callback(singleSwitch,i);

                }else if(singleSwitch.switchIs === "OFF"){
                    toTurnOn[0].switch.writeSync(1);
                    callback(singleSwitch,i);
                }
                if(switchMap.time === "INFINITY" && i === (switchMap.switches.length-1) && flags.getRecursiveMap() === true){
                    self.onOffSync(switchMap, callback);
                }else if(Number.isNaN(switchMap.time) === false && i === (switchMap.switches.length-1) ){
                    if(flags.iterateMap !== 0){
                        flags.iterateMap--;
                        self.onOffSync(switchMap, callback);
                    }
                }
                console.log(flags.isMapRecursive, "is map recurive")
            },singleSwitch.wait*1000);
        });
    },
    allOff: ()=>{
        return new Promise((resolve, reject)=>{
            flags.setRecursiveMap(false);
            self.activeTimeOuts.forEach((timeOutId)=>{
                clearTimeout(timeOutId);
            });
            self.activeSwitches.forEach((singleSwitch, i)=>{
                singleSwitch.wait = 0;
                self.off(singleSwitch);
            });
            self.activeSwitches.forEach((singleSwitch, i)=>{
                singleSwitch.wait = 0;
                self.off(singleSwitch);
            });
            resolve();
        });

    },
    setTimer: (data)=>{
        if(flags.timer.timeOutIDs === 0){
            turnOffInTime(data, true);
        }else {
            flags.timer.timeOutIDs.forEach((id, i)=>{
                clearTimeout(id);
                flags.timer.timeOutIDs.splice(i,1);
            });
            turnOffInTime(data, false);
        }
    }


};

function turnOffInTime(data, isFirstTime){
    let currentTime = new Date().getTime();
    let inTime = new Date(data.date).getTime();
    let MillisecondTimeout = 0;
    if(isFirstTime === true){
        MillisecondTimeout = inTime - currentTime;
    }else{
        MillisecondTimeout = 86400000;
    }

    let timer = setTimeout(()=>{
        self.allOff();
        if(flags.timer.isEveryDay === true){

            self.setTimer(data,false);
        }
    }, MillisecondTimeout);
    flags.timer.timeOutIDs.push(timer);
}