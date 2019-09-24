'use strict';

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {

        // creep.changeWorkingState();

        if (creep.memory.working == true) {
            let controller = creep.room.controller;
            if (creep.memory.roomName != undefined) {
                controller = Game.rooms[creep.memory.roomName].controller;
            }

            if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller);
            }
        }
        else {
            creep.getEnergy(true, true);
        }
    }
};