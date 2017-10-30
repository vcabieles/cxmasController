let flags = module.exports = {
    areSwitchesRegistered: false,
    isMapRecursive: false,
    setRecursiveMap: (flag)=>{
        flags.isMapRecursive = flag;
    },
    getRecursiveMap: ()=>{
        return flags.isMapRecursive;
    }

};

module.exports = flags;