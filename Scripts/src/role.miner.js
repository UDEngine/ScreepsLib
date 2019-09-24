'use strict';

module.exports = {

    run: function (creep) {

        //存储能量
        if (creep.memory.working == true) {
            let structure = creep.room.storage;
            let structureArr = creep.pos.findInRange(FIND_STRUCTURES, 3, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER 
                             && s.store[RESOURCE_ENERGY] < s.storeCapacity
            });

            if (structureArr.length > 0) {
                structure = structureArr[0];
            }

            if (structure != undefined) {
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }
        }
        //采矿
        else {
            let mineral = Game.getObjectById(creep.memory.sourceId);
            let container = mineral.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: s => s.structureType == STRUCTURE_CONTAINER
            })[0];
    
            if (creep.pos.isEqualTo(container.pos)) {
                creep.harvest(mineral);
            }
            else {
                creep.moveTo(container);
            }
        }


    }
};