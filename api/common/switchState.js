var Gpio = require('onoff').Gpio;


let self = module.exports = {
    activeSwitches: [],
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
                newSwitch.switch = new Gpio(theSwitch.pin, "out");
                self.activeSwitches.push(newSwitch);
            }
        });
    }
};