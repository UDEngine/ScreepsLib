'use strict';

var roleBuilder = require('role.builder');
var roleHarvester = require('role.harvester');

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.room.energyAvailable < 600) {
            roleHarvester.run(creep);
            return;
        }
        creep.changeWorkingState();

        if (creep.memory.working == true) {

            let towers = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_TOWER
            })
            if (towers.length > 0) {
                roleBuilder.run(creep);
                return;
            }

            let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
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