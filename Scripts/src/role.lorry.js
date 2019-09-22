'use strict';

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {

        creep.changeWorkingState();

        if (creep.memory.working == false && creep.room.energyAvailable < 600 && creep.carry[RESOURCE_ENERGY] > 0) {
            creep.memory.working = true;
        }

        //存放能量
        //优先补充能量
        if (creep.memory.working == true) {
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_EXTENSION
                            || (s.structureType == STRUCTURE_TOWER && s.energy / s.energyCapacity < 0.8)
                            || s.structureType == STRUCTURE_SPAWN)
                            && s.energy < s.energyCapacity
            });

            //如果都满了就补充容器
            if (structure == undefined) {
                structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_CONTAINER
                                && s.store[RESOURCE_ENERGY] < s.storeCapacity 
                                && (s.pos.findInRange(FIND_SOURCES, 4)).length < 1
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

            //捡取掉在地上的能量
            let target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                filter: s => s.amount > 200 
            });

            if(target != undefined) {
                if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                    return;
                }
            }

            //优先取矿区的container
            let container;
            let containerArr = creep.room.find(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_CONTAINER 
                            && s.store[RESOURCE_ENERGY] > creep.carryCapacity / 2
                            && (s.pos.findInRange(FIND_SOURCES, 4)).length > 0
            });

            if (containerArr.length > 0) {
                container = _.max(containerArr, (c) => c.store[RESOURCE_ENERGY]);

                // container = containerArr[0]; 
            }

            if (container == undefined) {
                //其次取link里
                container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => s.structureType == STRUCTURE_LINK
                                && s.energy > 300
                });
            }

            //紧急情况取仓库里的
            if (container == undefined && creep.room.storage.store[RESOURCE_ENERGY] > creep.carryCapacity && creep.room.energy / creep.room.energyAvailable < 0.5) {
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