var roleTower = {

    /** @param {StructureTower} tower */
    run: function(tower) {

        const invader = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        
        const brokenStruct = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.hits == 1;
            }
        })

        const brokenContainer = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax) &&
                structure.structureType == STRUCTURE_CONTAINER;
            }
        })
        const brokenRoad = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax) &&
                structure.structureType == STRUCTURE_ROAD;
            }
        })
        const brokenRampart = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax) &&
                (structure.hits < 10000000) &&
                structure.structureType == STRUCTURE_RAMPART;
            }
        })
        // const brokenWall = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        //     filter: (structure) => {
        //         return (structure.hits < structure.hitsMax) &&
        //         structure.structureType == STRUCTURE_WALL;
        //     }
        // })
        const brokenWall = null;

        if (invader) {
            tower.attack(invader);
        } else if (brokenStruct) {
            tower.repair(brokenStruct);
        } else if (brokenContainer) {
            tower.repair(brokenContainer);
        } else if (brokenRoad) {
            tower.repair(brokenRoad);
        } else if (brokenRampart) {
            tower.repair(brokenRampart);
        } else if (brokenWall) {
            tower.repair(brokenWall);
        }
        // tower.repair(brokenStruct);
    }
}

module.exports = roleTower;