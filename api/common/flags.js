let flags = module.exports = {
    areSwitchesRegistered: false,
    isMapRecursive: false,
    iterateMap: 0,
    setRecursiveMap: (flag)=>{
        flags.isMapRecursive = flag;
    },
    getRecursiveMap: ()=>{
        return flags.isMapRecursive;
    }

};

module.exports = flags;