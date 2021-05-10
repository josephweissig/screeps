var common = require('common');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    const room = Game.spawns['Spawn1'].room;
    // const numCreeps = Object.keys(Memory.creeps).length;

    var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

    if (room.controller.ticksToDowngrade <= 10000) {
        var newName = "EmergencyUpgrader" + Game.time;
        var partArray = common.parts;
        while (spawn.spawnCreep(partArray, newName, {memory: {role: 'upgrader', seekSource: true, depositEnergy: false}}) == ERR_NOT_ENOUGH_ENERGY && partArray.length > 3) {
            partArray.pop();
        }
    }

    if (harvester.length < 1) {
        var newName = "Harvester" + Game.time;
        // Game.spawns['Spawn1'].spawnCreep(common.parts, newName, {memory: {role: 'harvester'}});
        var partArray = common.parts;
        while (spawn.spawnCreep(partArray, newName, {memory: {role: 'harvester', seekSource: true, depositEnergy: false}}) == ERR_NOT_ENOUGH_ENERGY && partArray.length > 3) {
            partArray.pop();
        }
    } else if (harvester.length < 2) {
        var newName = "Harvester" + Game.time;
        Game.spawns['Spawn1'].spawnCreep(common.parts, newName, {memory: {role: 'harvester', seekSource: true, depositEnergy: false}});
    } else {
        // Prioritize 
        if (room.find(FIND_CONSTRUCTION_SITES).length > 0) {
            if (builder.length < 1) {
                var newName = "Builder" + Game.time;
                Game.spawns['Spawn1'].spawnCreep(common.parts, newName, {memory: {role: 'builder'}});
            }
        } else {
            if (builder.length > 0) {
                builder.forEach(creep => {
                    creep.suicide();
                })
            }
        }
        
        if (upgrader.length < 5) {
            var newName = "BigUpgrader" + Game.time;
            Game.spawns['Spawn1'].spawnCreep(common.parts, newName, {memory: {role: 'upgrader'}});
        }
    }
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        common.run(creep);
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}

/**
 * Sophisticated spawning function
 * @param {StructureSpawn} spawn
 * @param {string} name
 * @param {string} role
 */
function efficientSpawn(spawn, name, role) {
    var partArray = common.parts;
    while (spawn.spawnCreep(partArray, name, {memory: {role: role}}) == ERR_NOT_ENOUGH_ENERGY && partArray.length > 3) {
        partArray.pop();
    }
}