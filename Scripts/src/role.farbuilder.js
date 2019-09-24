'use strict';

var roleBuilder = require('role.builder');

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.room.name == creep.memory.roomName) {
            roleBuilder.run(creep);
        }
        else {
            const exitDir = Game.map.findExit(creep.room.name, creep.memory.roomName);
            const exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
        }
    }
};