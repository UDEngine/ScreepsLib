'use strict';

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {

        creep.changeWorkingState();
        //存放能量
        //优先补充能量
        if (creep.memory.working == true) {
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN
                            || s.structureType == STRUCTURE_EXTENSION
                            || s.structureType == STRUCTURE_TOWER)
                            && s.energy < s.energyCapacity
            });

            //如果都满了就补充容器
            if (structure == undefined) {
                structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_CONTAINER
                                && s.store[RESOURCE_ENERGY] < s.storeCapacity 
                                && (s.pos.findInRange(FIND_SOURCES_ACTIVE, 4)).length < 1
                });
            }
            
            if (structure == undefined) {
                structure = creep.room.storage;
            }

            if (structure != undefined) {
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }
        }
        // if creep is supposed to get energy
        else {
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_CONTAINER 
                             && s.store[RESOURCE_ENERGY] > creep.carryCapacity
                             && (s.pos.findInRange(FIND_SOURCES_ACTIVE, 3)).length > 0
            });

            if (container == undefined || container.store[RESOURCE_ENERGY] / container.storeCapacity < 0.7) {
                let containerArr = creep.room.find(FIND_STRUCTURES, {
                    filter: s => s.structureType == STRUCTURE_CONTAINER 
                                && s.store[RESOURCE_ENERGY] > creep.carryCapacity
                                && (s.pos.findInRange(FIND_SOURCES_ACTIVE, 3)).length > 0
                });
                if (container == undefined) {
                    container = containerArr[0]; 
                }
                else {
                    for (let c of containerArr) {
                        if ((c.store[RESOURCE_ENERGY] / c.storeCapacity) > 0.7) {
                            container = c;
                        }
                    }
                }
            }

            if (container == undefined) {
                container = creep.room.storage;
            }

            // if one was found
            if (container != undefined) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
        }
    }
};