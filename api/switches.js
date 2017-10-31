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
                    flags.areSwitchesRegistered = true;
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
    let toTurnOnMap = switchState.createMap(body.switches);
    toTurnOnMap.forEach((switchOn)=>{
        switchState.on(switchOn, (turnedOn)=>{})
    });
    helper.everythingOk(res)
});

router.post("/off", (req, res, next)=>{
    let body = req.body;
    // if(!body.switches || !Array.isArray(body.switches)){
    //     helper.missingFields(res);
    // }else{
    //
    // }
    let toTurnOnMap = switchState.createMap(body.switches);
    toTurnOnMap.forEach((switchOn)=>{
        switchState.off(switchOn, (turnedOn)=>{})
    });
    helper.everythingOk(res);
});

router.post("/onOffSync", (req, res, next)=>{
    let body = req.body;
    if(!body.switches || !Array.isArray(body.switches)){
        helper.missingFields(res);
    }else{

    }

    switchState.allOff().then(()=>{
        helper.everythingOk(res);
        if(body.time === "INFINITY"){
            flags.setRecursiveMap(true);
        }else if(Number.isNaN(body.time) === false){
            console.log("converting time");
            flags.iterateMap = body.time;
        }
        console.log("all of them are stoped");
        let mapIteratorCallback = function (currentSwitch){
            // console.log(currentSwitch.uuid, "Current Switch");
        };
        switchState.onOffSync(body, mapIteratorCallback);

    }).catch(()=>{
        helper.serverError(res);
    });


});


router.post("/allOff", (req, res, next)=>{
    switchState.allOff().then(()=>{
        helper.everythingOk(res)
    });
});

module.exports = router;