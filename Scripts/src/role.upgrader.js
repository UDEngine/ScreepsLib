'use strict';

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {

        creep.changeWorkingState();

        if (creep.memory.working == true) {
            for (let name in Game.rooms) {
                console.log(name);
            }
            let controller = creep.room.controller;
            if (creep.memory.roomName != undefined) {
                controller = Game.rooms[creep.memory.roomName];
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