'use strict';

var roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder'),
    repairer: require('role.repairer')
};

Creep.prototype.runRole = 
    function () {
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
        let container;
        if (useContainer) {

        }

        // if no container was found and the Creep should look for Sources
        if (container == undefined && useSource) {
            var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (this.harvest(source) == ERR_NOT_IN_RANGE) {
                this.moveTo(source);
            }
        }
    };