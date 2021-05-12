let common = require('common');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            let mineral = common.getPreferredSource(creep.room, true);
            if (mineral) {
                if (creep.harvest(mineral) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(mineral, {visualizePathStyle: {sroke: '#ffffff'}});
                }
            }
        }
	}
};

module.exports = roleUpgrader;