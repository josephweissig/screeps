/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */
let common = require('common');

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
            let mineral = common.getPreferredSource(creep.room, true);
            if (mineral) {
                if (creep.harvest(mineral) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(mineral, {visualizePathStyle: {sroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleBuilder;