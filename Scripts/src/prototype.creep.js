'use strict';

var roles = {
    harvester: require('role.harvester')
};

Creep.prototype.runRole = 
    function () {
        roles[this.memory.role].run(this);
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