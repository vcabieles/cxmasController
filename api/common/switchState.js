var Gpio = require('onoff').Gpio;


let self = module.exports = {
    activeSwitches: [],
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
            setTimeout(()=>{
                let toTurnOn = self.activeSwitches.filter(theSwitch => theSwitch.uuid === singleSwitch.uuid);
                if(singleSwitch.switchIs === "ON"){
                    console.log(singleSwitch.uuid, "turnin on");
                    toTurnOn[0].switch.writeSync(0);
                    callback(singleSwitch,i);

                }else if(singleSwitch.switchIs === "OFF"){
                    console.log(singleSwitch.uuid, "turnin OFF");
                    toTurnOn[0].switch.writeSync(1);
                    callback(singleSwitch,i);
                }else if(switchMap.time === "INFINITY" && i === (switchMap.switches.length-1)){
                    console.log("we reach the end call me again");
                    self.onOffSync(switchMap, callback);
                }
            },singleSwitch.wait*1000);

        });
    }

};