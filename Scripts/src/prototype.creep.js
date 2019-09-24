'use strict';

var roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder'),
    repairer: require('role.repairer'),
    lorry: require('role.lorry'),
    attacker: require('role.attacker'),
    farbuilder: require('role.farbuilder'),
    miner: require('role.miner')
};

Creep.prototype.runRole = 
    function () {
        this.changeWorkingState();
        roles[this.memory.role].run(this);
    };

//改变工作状态
Creep.prototype.changeWorkingState = 
    function () {
        //切换状态
        if (this.memory.working == true && this.carry.energy == 0) {
            this.memory.working = false;
        }
        else if (this.memory.working == false && this.carry.energy == this.carryCapacity) {
            this.memory.working = true;
        }
    };

/** @function 
@param {bool} useContainer
@param {bool} useSource */
Creep.prototype.getEnergy = 
    function (useContainer, useSource) {
        //捡取掉在地上的能量
        let target = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: s => s.amount > 300 
        });
        if(target != undefined) {
            if(this.pickup(target) == ERR_NOT_IN_RANGE) {
                this.moveTo(target);
                return;
            }
        }
        let container;
        if (useContainer) {
            container = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_CONTAINER 
                            || s.structureType == STRUCTURE_STORAGE)
                            && s.store[RESOURCE_ENERGY] > this.carryCapacity
            });
            if (container != undefined) {
                if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(container);
                }
            }
        }

        // if no container was found and the Creep should look for Sources
        if (container == undefined && useSource) {
            var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (this.memory.sourceId != undefined) {
                source = Game.getObjectById(this.memory.sourceId);
            }

            if (this.harvest(source) == ERR_NOT_IN_RANGE) {
                this.moveTo(source);
            }
        }
    };