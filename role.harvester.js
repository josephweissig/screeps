var commonModule = require('commonModule');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.seekSource) {
            const mineral = commonModule.getPreferredSource(creep.room, false);
            if (creep.harvest(mineral) == ERR_NOT_IN_RANGE) {
                creep.moveTo(mineral, {visualizePathStyle: {sroke: '#ffffff'}});
            }
            if (creep.store.getFreeCapacity() <= 0) {
                creep.memory.seekSource = false;
                creep.memory.depositEnergy = true;
            }
        }

        if(creep.memory.depositEnergy) {
            const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION 
                        || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            })
            // if(targets.length > 0) {
            //     if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            //     }
            // } else {
            //     creep.moveTo(Game.spawns['Spawn1'].pos.x, Game.spawns['Spawn1'].pos.y + 1);
            // }
            if (target != null) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                const lesserTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE) && 
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                })
                if (lesserTarget != null) {
                    if (creep.transfer(lesserTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(lesserTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    creep.moveTo(Game.spawns['Spawn1'].pos.x, Game.spawns['Spawn1'].pos.y + 1);
                }
            }
            if (creep.store.getUsedCapacity() <= 0) {
                creep.memory.depositEnergy = false;
                creep.memory.seekSource = true;
            }
        }

	    // if(creep.store.getFreeCapacity() > 0) {
        //     // FIXME: Hardcoded for harvesters, this sucks, replace it eventually
        //     // const mineral = creep.room.getPositionAt(4, 21);
        //     const mineral = common.getFarthestSource(creep.room);
        //     if (mineral) {
        //         if (creep.harvest(mineral) == ERR_NOT_IN_RANGE) {
        //             creep.moveTo(mineral, {visualizePathStyle: {sroke: '#ffffff'}});
        //         }
        //     }
        // }
        // else {
        //     const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        //         filter: (structure) => {
        //             return (structure.structureType == STRUCTURE_EXTENSION 
        //                 || structure.structureType == STRUCTURE_SPAWN) &&
        //                 structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        //         }
        //     })
        //     // if(targets.length > 0) {
        //     //     if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //     //         creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        //     //     }
        //     // } else {
        //     //     creep.moveTo(Game.spawns['Spawn1'].pos.x, Game.spawns['Spawn1'].pos.y + 1);
        //     // }
        //     if (target != null) {
        //         if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //             creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        //         }
        //     } else {
        //         creep.moveTo(Game.spawns['Spawn1'].pos.x, Game.spawn['Spawn1'].pos.y + 1);
        //     }
        // }

        // const found = creep.room.lookForAt(LOOK_STRUCTURES, creep.pos);
        // if (found.length == 0) {
        //     creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
        // }
	}
};

module.exports = roleHarvester;