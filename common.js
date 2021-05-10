var common = {

    parts: [WORK,CARRY,MOVE,CARRY,WORK,MOVE,WORK,CARRY,WORK,MOVE,CARRY,CARRY,WORK,MOVE,CARRY,CARRY,WORK,MOVE,CARRY,CARRY],

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

    /** 
     * This method sucks, but in the first room, this is the "closest" source to the Spawn
     * @param {Room} room
     * @returns {RoomPosition}
     */
    getCloseSource: function(room) {
        return room.lookForAt(LOOK_SOURCES, 9, 23)[0];
    },

    /** 
     * This method sucks, but in the first room, this is the "farthest" source to the Spawn
     * @param {Room} room
     * @returns {RoomPosition}
     */
    getFarthestSource: function(room) {
        return room.lookForAt(LOOK_SOURCES, 4, 21)[0];
    }
}

module.exports = common;