'use strict';

var roleUpgrader = require('role.upgrader');
var roleHarvester = require('role.harvester');

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        // if (creep.room.energyAvailable < 600) {
        //     roleHarvester.run(creep);
        //     return;
        // }
        // creep.changeWorkingState();

        if (creep.memory.working == true) {
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

            if (constructionSite != undefined) {
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite);
                }
            }
            else {
                roleUpgrader.run(creep);
            }
        }
        else {
            creep.getEnergy(true, true);
        }
    }
};