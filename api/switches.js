const express = require('express'),
      router = express.Router(),
      jsonfile = require('jsonfile'),
      helper = require("./common/helpers"),
      flags = require("./common/flags"),
      file = './switches.json',
      switchState = require("./common/switchState");
// var Gpio = require('onoff').Gpio;
// var led = new Gpio(14, 'out');

router.post("/register", (req, res, next)=>{
    let body = req.body;
    if(!body.switches || !Array.isArray(body.switches)){
        helper.missingFields(res);
    }else{
        jsonfile.writeFile(file, body, (err) => {
            if (err){
                helper.serverError(res,err);
            }else{
                switchState.activateSwitches(body.switches).then((activeSwithces)=>{
                    helper.everythingOk(res, body);
                }).catch((err)=>{
                    helper.serverError(res,err);
                });
            }
        });
    }
});

router.post("/modifySwitches", (req, res, next)=>{
    let body = req.body;
    if(!body.switches || !Array.isArray(body.switches)){
        helper.missingFields(res);
    }else{
        if(flags.areSwitchesRegistered === false){
            res.status(400).json({
                status: "ERROR",
                transaction: "UNPAID",
                message: "The Switches are not registered. Please add them first."
            });
        }else{
            jsonfile.readFile(file, (err, obj) =>{
                let currentSwitches = obj.switches;
                let toModify = body.switches;
                let modifiedSwitches = currentSwitches.map((theSwitch, i)=>{
                    if(toModify[i] === undefined){
                        return theSwitch;
                    }else if(theSwitch.uuid === toModify[i].uuid){
                        switchState.replaceSwitch(theSwitch, toModify[i]);
                        return toModify[i];
                    }else{
                        return theSwitch;
                    }
                });
                jsonfile.writeFile(file, {switches: modifiedSwitches}, (err) => {
                    if (err){
                        helper.serverError(res,err);
                    }else{
                        helper.everythingOk(res, modifiedSwitches);
                    }
                });
            })
        }
    }
});


router.post("/on", (req, res, next)=>{
    let body = req.body;
    // if(!body.switches || !Array.isArray(body.switches)){
    //     helper.missingFields(res);
    // }else{
    //
    // }
    let switches = switchState.getActiveSwitches();
    let toTurnOnArr = body.switches.map((currentSwitch)=>{
        let toTurnOn = switches.filter(theSwitch => theSwitch.uuid === currentSwitch.uuid);
        toTurnOn[0].wait = currentSwitch.wait;
        return toTurnOn[0];
    });
    toTurnOnArr.forEach((switchOn)=>{
       setTimeout(()=>{
            switchOn.switch.writeSync(0);
            console.log("turningOn", switchOn.pin);
       },switchOn.wait*1000)
    });
console.log(toTurnOnArr);
    // var onOrOFF = 0, count = 0;
    // var theInterval = setInterval(()=>{
    //     count++;
    //     console.log(count);
    //     if(count >= 50){
    //         // led.unexport();
    //         clearInterval(theInterval);
    //         console.log("turning off system");
    //     }else{
    //         console.log("count not 50");
    //         if(onOrOFF === 0){
    //             onOrOFF = 1;
    //             console.log("turning on");
    //             led.writeSync(1);
    //         }else{
    //             onOrOFF = 0;
    //             console.log("turning off");
    //             led.writeSync(0)
    //         }
    //     }
    // },500);
    res.status(200).json({
        status: "I think is on?!",
        transaction: "PAID",
        message: "But Not Really"
    });
});

router.post("/off", (req, res, next)=>{
    let body = req.body;
    // if(!body.switches || !Array.isArray(body.switches)){
    //     helper.missingFields(res);
    // }else{
    //
    // }
    let switches = switchState.getActiveSwitches();
    let toTurnOnArr = body.switches.map((currentSwitch)=>{
        let toTurnOn = switches.filter(theSwitch => theSwitch.uuid === currentSwitch.uuid);
        toTurnOn[0].wait = currentSwitch.wait;
        return toTurnOn[0];
    });
    toTurnOnArr.forEach((switchOn)=>{
        setTimeout(()=>{
            switchOn.switch.writeSync(1);
            console.log("turningOn", switchOn.pin);
        },switchOn.wait*1000)
    });
    console.log(toTurnOnArr);
    // var onOrOFF = 0, count = 0;
    // var theInterval = setInterval(()=>{
    //     count++;
    //     console.log(count);
    //     if(count >= 50){
    //         // led.unexport();
    //         clearInterval(theInterval);
    //         console.log("turning off system");
    //     }else{
    //         console.log("count not 50");
    //         if(onOrOFF === 0){
    //             onOrOFF = 1;
    //             console.log("turning on");
    //             led.writeSync(1);
    //         }else{
    //             onOrOFF = 0;
    //             console.log("turning off");
    //             led.writeSync(0)
    //         }
    //     }
    // },500);
    res.status(200).json({
        status: "I think is on?!",
        transaction: "PAID",
        message: "But Not Really"
    });
});




module.exports = router;