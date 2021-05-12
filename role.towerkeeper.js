var towerkeeper = {

    /** @param {Creep} creep */
    run: function(creep) {

        // TODO: tombstone checking and gathering
        let tombstones = creep.room.find(FIND_TOMBSTONES);
        for (let tombstone in tombstones) {
            if (creep.store.getFreeCapacity() > 0) {
                
            }
        }

        if(creep.store.getFreeCapacity() == creep.store.getCapacity()) {

            // let otherResource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            //     filter: (resource) => {
            //         otherResource
            //     }
            // })

            let energy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
            if (creep.pickup(energy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(energy.pos);
                return;
                
            }
            var storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE) && 
                        structure.store.getUsedCapacity() > 0;
                }
            });
            if (storage) {
                let result = creep.withdraw(storage, RESOURCE_ENERGY, creep.store.getFreeCapacity());
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
                } else if (result == ERR_NOT_ENOUGH_RESOURCES) {
                    result = creep.withdraw(storage, RESOURCE_ENERGY, storage.store.getUsedCapacity());
                }
            }
        }
        else {
            // console.log("Energy " + creep.store[RESOURCE_ENERGY]);
            // console.log("All Res " + creep.store.getUsedCapacity());
            // if (creep.store.getUsedCapacity() > creep.store[RESOURCE_ENERGY]) {
            //     let storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            //         filter: (structure) => {
            //             return structure.structureType == STRUCTURE_CONTAINER &&
            //             structure.store.getUsedCapacity() == 0;
            //         }
            //     })
            //     let transferResult = creep.transfer(storage, RESOURCE_GHODIUM_OXIDE);
            //     console.log("Transfer result: " + transferResult);
            //     if (transferResult == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(storage);
            //     }
            //     return;
            // }
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
            }
        }

        // const found = creep.room.lookForAt(LOOK_STRUCTURES, creep.pos);
        // if (found.length == 0) {
        //     creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
        // }
    }
}

module.exports = towerkeeper;