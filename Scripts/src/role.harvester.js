'use strict';

var roleBuilder = require('role.builder');

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        creep.changeWorkingState();
        
        //存储能量
        if (creep.memory.working == true) {
            let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN
                             || s.structureType == STRUCTURE_EXTENSION
                             || s.structureType == STRUCTURE_TOWER
                             || s.structureType == STRUCTURE_CONTAINER)
                             && s.energy < s.energyCapacity
            });

            if (structure == undefined) {
                structure = creep.room.storage;
            }

            //存储能量
            if (structure != undefined) {
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }
            else {
                roleBuilder.run(creep);
            }
        }
        //采矿
        else {
            creep.getEnergy(false, true);
        }
    }
};