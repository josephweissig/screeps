var common = {

    // parts: [WORK,CARRY,MOVE,CARRY,WORK,MOVE,WORK,CARRY,WORK,MOVE,CARRY,CARRY,WORK,MOVE,CARRY,CARRY,WORK,MOVE,CARRY,CARRY],

    /** @param {Creep} creep */
    run: function(creep) {
        this.swampCheck(creep);
    },

    /** @param {Creep} creep */
    swampCheck: function(creep) {
        const terrain = creep.room.getTerrain();
        switch(terrain.get(creep.pos.x, creep.pos.y)) {
            case TERRAIN_MASK_WALL:
                break;
            case TERRAIN_MASK_SWAMP:
                const road = creep.room.lookForAt(LOOK_STRUCTURES, creep.pos);
                if (road.length == 0) {
                    creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
                }
                break;
            default:
                break;
        }
    },

    /** @param {Creep} creep */
    roadCheck: function(creep) {
        const road = creep.room.lookForAt(LOOK_STRUCTURES, creep.pos);
        if (road.length == 0) {
            creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
        }
    },

    /** 
     * This method sucks, but in the first room, this is the "closest" source to the Spawn
     * @param {Room} room
     * @returns {RoomPosition}
     */
    getCloseSource: function(room) {
        let primarySource = room.lookForAt(LOOK_SOURCES, 9, 23)[0];
        if (primarySource.energy > 0) {
            return primarySource;
        } else {
            return this.getFarthestSource(room);
        }
    },

    /** 
     * This method sucks, but in the first room, this is the "farthest" source to the Spawn
     * @param {Room} room
     * @returns {RoomPosition}
     */
    getFarthestSource: function(room) {
        return room.lookForAt(LOOK_SOURCES, 4, 21)[0];
    },

    /**
     * Finds the preferred source in a room based on if you want the closest or furthest.
     * @param {Room} room 
     * @param {Boolean} prefClosest
     * @returns {RoomPosition}
     */
    getPreferredSource: function(room, prefClosest) {
        const closest = room.lookForAt(LOOK_SOURCES, 9, 23)[0];
        const farthest = room.lookForAt(LOOK_SOURCES, 4, 21)[0];
        if (prefClosest) {
            if (closest.energy > 0) {
                return closest;
            } else if (farthest.energy > 0) {
                return farthest;
            }
        } else {
            if (farthest.energy > 0) {
                return farthest;
            } else if (closest.energy > 0) {
                return closest;
            }
        }
    }
}

module.exports = common;