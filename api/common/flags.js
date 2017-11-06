let flags = module.exports = {
    areSwitchesRegistered: false,
    isMapRecursive: false,
    iterateMap: 0,
    timer: {},
    setRecursiveMap: (flag)=>{
        flags.isMapRecursive = flag;
    },
    getRecursiveMap: ()=>{
        return flags.isMapRecursive;
    }
};

flags.timer.timeOutIDs = [];
flags.timer.isEveryDay = false;

module.exports = flags;