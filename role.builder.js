/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */
let commonModule = require('commonModule');

var roleBuilder = {

    /** @param {Creep} creep */
    run: function(creep) {
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('⛏ harvest');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            var site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(site) {
                if(creep.build(site) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(site, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            // var mineral = creep.pos.findClosestByPath(FIND_SOURCES);
            // let mineral = commonModule.getPreferredSource(creep.room, true);
            // if (mineral) {
            //     if (creep.harvest(mineral) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(mineral, {visualizePathStyle: {stroke: '#ffffff'}});
            //     }
            // }
            var storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE) && 
                        structure.store.getUsedCapacity() > 0;
                }
            });
            if (creep.withdraw(storage, RESOURCE_ENERGY, creep.store.getFreeCapacity()) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage, { visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleBuilder;