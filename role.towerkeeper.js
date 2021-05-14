var towerkeeper = {

    task: {
        NULL: -1,
        FILL_STORAGE: 0,
        REFILL_TOWER: 1,
        REFILL_SPAWN: 2,
        LINK_TRANSFER: 3,
        EMPTY_TOMBSTONE: 4,
        PICKUP_DROPPED_RESOURCE: 5
    },

    /** @param {Creep} creep */
    run: function(creep) {
        if (creep.memory.task == towerkeeper.task.NULL) {
            this.determineTask(creep);
            console.log(creep.memory.task);
        } else {
            switch (creep.memory.task) {
                case towerkeeper.task.FILL_STORAGE:
                    let storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (store_struc) => {
                            return store_struc.structureType == STRUCTURE_STORAGE;
                        }
                    })
                    this.fillStorage(creep, storage);
                    break;
                case towerkeeper.task.REFILL_TOWER:
                    let tower = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (tower_struc) => {
                            return tower_struc.structureType == STRUCTURE_TOWER;
                        }
                    })
                    this.refillTower(creep, tower);
                    break;
                case towerkeeper.task.REFILL_SPAWN:
                    this.refillSpawn(creep, Game.spawns['Spawn1']);
                    break;
                case towerkeeper.task.LINK_TRANSFER:
                    let link = Game.spawns['Spawn1'].findClosestByPath(FIND_STRUCTURES, {
                        filter: (link_struc) => {
                            return link_struc.structureType == STRUCTURE_LINK;
                        }
                    })
                    this.linkTransfer(creep, link);
                    break;
                case towerkeeper.task.EMPTY_TOMBSTONE:
                    let tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
                        filter: (ts) => {
                            return ts.store.getUsedCapacity() > 0;
                        }
                    })
                    this.emptyTombstone(creep, tombstone);
                    break;
                case towerkeeper.task.PICKUP_DROPPED_RESOURCE:
                    let energy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                        filter: (res) => {
                            return res.resourceType == RESOURCE_ENERGY;
                        }
                    })
                    this.pickupDroppedResource(creep, energy);
                    break;
                default:
                    console.log(creep.memory.task);
                    creep.memory.task = towerkeeper.task.NULL;
            }
        }
    },

    /**
     * Determine Creep task
     * @param {Creep} creep
     */
    determineTask: function(creep) {
        // DETERMINE TASK PRIORITY
        let energy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
            filter: (res) => {
                return res.resourceType == RESOURCE_ENERGY &&
                res.amount > 10;
            }
        })
        if (energy && (creep.store.getUsedCapacity() == 0)) {
            creep.memory.task = towerkeeper.task.PICKUP_DROPPED_RESOURCE;
            return;
        }

        let tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
            filter: (ts) => {
                return ts.store.getUsedCapacity() > 0;
            }
        })
        if (tombstone && (creep.store.getUsedCapacity() == 0)) {
            creep.memory.task = towerkeeper.task.EMPTY_TOMBSTONE;
            return;
        }

        let link = Game.spawns['Spawn1'].pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (link_struc) => {
                return link_struc.structureType == STRUCTURE_LINK;
            }
        })
        if (link.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            creep.memory.task = towerkeeper.task.LINK_TRANSFER;
            return;
        }

        if (Game.spawns['Spawn1'].store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            creep.memory.task = towerkeeper.task.REFILL_SPAWN;
            return;
        }

        let tower = Game.spawns['Spawn1'].pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (tower_struc) => {
                return (tower_struc.structureType == STRUCTURE_TOWER) &&
                (tower_struc.store.getUsedCapacity(RESOURCE_ENERGY) < 500);
            }
        })
        if (tower) {
            creep.memory.task = towerkeeper.task.REFILL_TOWER;
            return;
        }
        
        if (creep.store.getUsedCapacity() > 0) {
            creep.memory.task = towerkeeper.task.FILL_STORAGE;
            return;
        }

        creep.memory.task = towerkeeper.task.NULL;
    },

    /**
     * Fill the storage with energy
     * @param {Creep} creep 
     * @param {StructureStorage} storage 
     */
    fillStorage: function(creep, storage) {
        let result = creep.transfer(storage, RESOURCE_ENERGY);
        switch (result) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(storage);
                break;
            case ERR_FULL:
                // TODO: Find something to do when there's no room for energy?
                break;
            case OK:
                creep.memory.task = towerkeeper.task.NULL;
                break;
            default:
                creep.say('⛔' + result);
        }
    },

    /**
     * Pull energy from the storage
     * @param {Creep} creep 
     */
    pullFromStorage: function(creep) {
        let storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (store_struc) => {
                return store_struc.structureType == STRUCTURE_STORAGE;
            }
        })
        let result = creep.withdraw(storage, RESOURCE_ENERGY, creep.store.getFreeCapacity());
        switch (result) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(storage);
                break;
            case ERR_NOT_ENOUGH_RESOURCES:
                creep.withdraw(storage, RESOURCE_ENERGY, storage.store.getUsedCapacity());
            case OK:
                creep.memory.task = towerkeeper.task.NULL;
                break;
            default:
                creep.say('⛔' + result);
        }
    },

    /**
     * Put energy in the tower
     * @param {Creep} creep 
     * @param {StructureTower} tower 
     */
    refillTower: function(creep, tower) {
        if (creep.store.getUsedCapacity() == 0) {
            this.pullFromStorage(creep);
            return;
        }
        let result = creep.transfer(tower, RESOURCE_ENERGY);
        switch (result) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(tower, {visualizePathStyle: {stroke: '#ffffff', lineStyle: 'dotted'}});
                break;
            case OK:
                creep.memory.task = towerkeeper.task.NULL;
                break;
            default:
                creep.say('⛔' + result);
        }
    },

    /**
     * Put energy in the spawn
     * @param {Creep} creep 
     * @param {StructureSpawn} spawn 
     */
    refillSpawn: function(creep, spawn) {
        if (creep.store.getUsedCapacity() == 0) {
            this.pullFromStorage(creep);
            return;
        }
        let result = creep.transfer(spawn, RESOURCE_ENERGY);
        switch (result) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffffff', lineStyle: 'dotted'}});
                break;
            case OK:
                creep.memory.task = towerkeeper.task.NULL;
                break;
            default:
                creep.say('⛔' + result);
        }
    },

    /** 
     * Take energy from the link and transfer it to the storage
     * @param {Creep} creep
     * @param {StructureLink} link
     */
    linkTransfer: function(creep, link) {
        let result = creep.transfer(spawn, RESOURCE_ENERGY);
        switch (result) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(link, {visualizePathStyle: {stroke: '#ffffff', lineStyle: 'dotted'}});
                break;
            case OK:
                creep.memory.task = towerkeeper.task.NULL;
                break;
            default:
                creep.say('⛔' + result);
        }
    },

    /**
     * 
     * @param {Creep} creep 
     * @param {Tombstone} tombstone 
     */
    emptyTombstone: function(creep, tombstone) {
        let result = creep.withdraw(tombstone, RESOURCE_ENERGY);
        switch (result) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(tombstone, {visualizePathStyle: {stroke: '#ffffff', lineStyle: 'dotted'}});
                break;
            case ERR_INVALID_TARGET:
                creep.say('⛔' + "invalid target");
                creep.memory.task = towerkeeper.task.NULL;
                break;
            case OK:
                creep.memory.task = towerkeeper.task.NULL;
                break;
            default:
                creep.say('⛔' + result);
        }
    },

    /**
     * 
     * @param {Creep} creep 
     * @param {Resource} resource 
     */
    pickupDroppedResource: function(creep, resource) {
        let result = creep.pickup(resource);
        switch (result) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(resource, {visualizePathStyle: {stroke: '#ffff00', lineStyle: 'dotted'}});
                break;
            case ERR_INVALID_TARGET:
                creep.say('⛔' + "invalid target");
                creep.memory.task = towerkeeper.task.NULL;
                break;
            case OK:
                creep.memory.task = towerkeeper.task.NULL;
                break;
            default:
                creep.say('⛔' + result);
        }
    }
}

module.exports = towerkeeper;