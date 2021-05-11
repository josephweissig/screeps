var roleTower = {

    /** @param {StructureTower} tower */
    run: function(tower) {
        
        const brokenStruct = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax);
            }
        })
        tower.repair(brokenStruct);
    }
}

module.exports = roleTower;