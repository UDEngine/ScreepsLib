'use strict';

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.room.name == creep.memory.roomName) {

            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                console.log(creep.room.controller);
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            const exitDir = Game.map.findExit(creep.room.name, creep.memory.roomName);
            const exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
        }
    }
};