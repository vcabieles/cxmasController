const express = require('express'),
      router = express.Router();
var Gpio = require('onoff').Gpio;
var led = new Gpio(14, 'out');

router.post("/on", (req, res, next)=>{
    let body = req.body;

    var onOrOFF = 0, count = 0;
    var theInterval = setInterval(()=>{
        count++;
        console.log(count);
        if(count >= 50){
            // led.unexport();
            clearInterval(theInterval);
            console.log("turning off system");
        }else{
            console.log("count not 50");
            if(onOrOFF === 0){
                onOrOFF = 1;
                console.log("turning on");
                led.writeSync(1);
            }else{
                onOrOFF = 0;
                console.log("turning off");
                led.writeSync(0)
            }
        }
    },500);
    res.status(200).json({
        status: "I think is on?!",
        transaction: "PAID",
        message: "But Not Really"
    });
});


module.exports = router;