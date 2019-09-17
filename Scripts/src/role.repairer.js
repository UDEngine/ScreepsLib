'use strict';

var roleBuilder = require('role.builder');

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {

        creep.changeWorkingState();

        if (creep.memory.working == true) {
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
            });

            if (structure != undefined) {
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }
            else {
                roleBuilder.run(creep);
            }
        }
        else {
            creep.getEnergy(true, true);
        }
    }
};