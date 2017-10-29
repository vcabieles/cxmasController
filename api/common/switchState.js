// var Gpio = require('onoff').Gpio;


let state = module.exports = {
    activeSwitches: [],
    activateSwitches: (switches)=>{
        return new Promise((resolve,reject)=>{
            switches.forEach((theSwitch, i)=>{
                // theSwitch.switch = new Gpio(theSwitch.pin, "out");
                state.activeSwitches.push(theSwitch);
                console.log("pushed and activated the gpio pin 00");
            });
            resolve(state.activeSwitches);
        });
    },
    getActiveSwitches: ()=>{
        return state.activeSwitches;
    },
    replaceSwitch: (currentSwitch, newSwitch)=>{
        let activeSwitches = state.activeSwitches;

        activeSwitches.forEach((activeSwitch, i)=>{
            if(activeSwitch.uuid === currentSwitch.uuid){
                console.log(activeSwitch, "\n switch to be replaced");
                // activeSwitch.switch.unexport();
                activeSwitches.splice(i,1);
                // newSwitch.switch = new Gpio(theSwitch.pin, "out");
                state.activeSwitches.push(newSwitch);
                console.log(state.activeSwitches, "new Active Switches");
            }
        });
    }
};