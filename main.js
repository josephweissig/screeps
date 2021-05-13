var commonModule = require('commonModule');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleTower = require('role.tower');
var roleTowerkeeper = require('role.towerkeeper');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // const parts = [WORK,CARRY,MOVE,CARRY,WORK,MOVE,WORK,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,WORK,MOVE,CARRY,CARRY,WORK,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,WORK,CARRY,MOVE,CARRY,CARRY];
    const parts = [WORK,CARRY,MOVE,CARRY,WORK,MOVE,WORK,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,WORK,MOVE,CARRY,CARRY,WORK,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE];
    // const parts = [WORK,CARRY,MOVE,CARRY,WORK,MOVE,WORK,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,WORK,MOVE,CARRY,CARRY,WORK,MOVE];
    
    const room = Game.spawns['Spawn1'].room;
    // const numCreeps = Object.keys(Memory.creeps).length;

    var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var towerkeeper = _.filter(Game.creeps, (creep) => creep.memory.role == 'towerkeeper');

    let nextSpawn = "";

    if (room.controller.ticksToDowngrade <= 10000) {
        var newName = "EmergencyUpgrader" + Game.time;
        var partArray = parts;
        while (spawn.spawnCreep(partArray, newName, {memory: {role: 'upgrader', seekSource: true, depositEnergy: false}}) == ERR_NOT_ENOUGH_ENERGY && partArray.length > 3) {
            partArray.pop();
        }
    }

    if (harvester.length < 1) {
        // console.log("We should build the biggest harvester we can with our current energy!");
        nextSpawn = "🚨"
        var newName = "Harvester" + Game.time;
        // Game.spawns['Spawn1'].spawnCreep(parts, newName, {memory: {role: 'harvester'}});
        var partArray = parts;
        while (Game.spawns['Spawn1'].spawnCreep(partArray, newName, {memory: {role: 'harvester', seekSource: true, depositEnergy: false}}) == ERR_NOT_ENOUGH_ENERGY && partArray.length > 3) {
            partArray.pop();
        }
    } else if (harvester.length < 2) {
        // console.log("We should build a bigger harvester!");
        nextSpawn = "⛏"
        var newName = "Harvester" + Game.time;
        Game.spawns['Spawn1'].spawnCreep(parts, newName, {memory: {role: 'harvester', seekSource: true, depositEnergy: false}});
    } else {
        if (towerkeeper.length < 1) {
            nextSpawn = "🧙‍♂️"
            var newName = "TowerKeeper" + Game.time;
            Game.spawns['Spawn1'].spawnCreep([TOUGH,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, {memory: {role: 'towerkeeper'}});
        }

        // Prioritize 
        if (room.find(FIND_CONSTRUCTION_SITES).length > 0) {
            if (builder.length < 2) {
                // console.log("We should build a builder!");
                nextSpawn = "🚧"
                var newName = "Builder" + Game.time;
                Game.spawns['Spawn1'].spawnCreep(parts, newName, {memory: {role: 'builder'}});
            } else {
                if (upgrader.length < 1) {
                    nextSpawn = "⚡"
                    // console.log("We should build an upgrader!");
                    var newName = "BigUpgrader" + Game.time;
                    Game.spawns['Spawn1'].spawnCreep(parts, newName, {memory: {role: 'upgrader'}});
                }
            }
        } else {
            if (builder.length > 0) {
                builder.forEach(creep => {
                    creep.suicide();
                })
            }
        
            if (upgrader.length < 1) {
                // console.log("We should build an upgrader!");
                nextSpawn = "⚡"
                var newName = "BigUpgrader" + Game.time;
                Game.spawns['Spawn1'].spawnCreep(parts, newName, {memory: {role: 'upgrader'}});
            }
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

    Game.spawns['Spawn1'].room.visual.text(
        // 'Next: ' + nextSpawn,
        nextSpawn,
        Game.spawns['Spawn1'].pos.x + 0.5,
        Game.spawns['Spawn1'].pos.y + 0.5,
        {align: 'center', opacity: 1.0, font: '20px'}
    );

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        // commonModule.run(creep);
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
            // common.roadCheck(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'towerkeeper') {
            roleTowerkeeper.run(creep);
        }
    }

    var tower = room.find(FIND_STRUCTURES, {
        filter: { structureType: STRUCTURE_TOWER }
    })[0];
    roleTower.run(tower);

    let storage = room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_STORAGE;
    }})
    if (storage[0]) {
        room.visual.text(
            storage[0].store.getUsedCapacity(),
            storage[0].pos.x + 1,
            storage[0].pos.y + 0.5,
            {align: 'left', opacity: 0.75, font: '12px'}
        );
    }
}