'use strict';

var roleUpgrader = require('role.upgrader');

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {

        creep.changeWorkingState();

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