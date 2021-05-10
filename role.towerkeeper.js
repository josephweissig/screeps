var towerkeeper = {

    /** @param {Creep} creep */
    run: function(creep) {
        if(creep.store.getFreeCapacity() > 0) {
            var mineral = creep.pos.findClosestByPath(FIND_SOURCES);
            if (mineral) {
                if (creep.harvest(mineral) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(mineral, {visualizePathStyle: {sroke: '#ffffff'}});
                }
            }
        }
        else {
            const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER) &&
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
                creep.moveTo(Game.spawns['Spawn1'].pos.x, Game.spawn['Spawn1'].pos.y + 1);
            }
        }

        const found = creep.room.lookForAt(LOOK_STRUCTURES, creep.pos);
        if (found.length == 0) {
            creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
        }
    }
}