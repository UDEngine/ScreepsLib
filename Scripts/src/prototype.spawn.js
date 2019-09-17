'use strict';

var listOfRoles = ['harvester', 'upgrader', 'builder', 'repairer'];

// create a new function for StructureSpawn
StructureSpawn.prototype.spawnCreepsIfNecessary = 
    function () {
        let room = this.room;
        let creepsInRoom = room.find(FIND_MY_CREEPS);

        let numberOfCreeps = {};
        for (let role of listOfRoles) {
            numberOfCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role);
        }

        //
        if (numberOfCreeps['harvester'] < 2 ) {
            this.createCustomCreep(room.energyAvailable, 'harvester');
            return;
        }

        if (numberOfCreeps['upgrader'] < 2) {
            this.createCustomCreep(room.energyAvailable, 'upgrader');
            return;
        }

        if (numberOfCreeps['builder'] < 2) {
            this.createCustomCreep(room.energyAvailable, 'builder');
            return;
        }

        if (numberOfCreeps['repairer'] < 1) {
            this.createCustomCreep(room.energyAvailable, 'repairer');
        }
    };

// create a new function for StructureSpawn
StructureSpawn.prototype.createCustomCreep =
    function (energy, roleName) {
        // create a balanced body as big as possible with the given energy
        var numberOfParts = Math.floor(energy / 200);
        // make sure the creep is not too big (more than 50 parts)
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
        var body = [];
        for (let i = 0; i < numberOfParts; i++) {
            body.push(WORK);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }

        // create creep with the created body and the given role
        let creepName = roleName + Game.time;
        return this.createCreep(body, creepName, { role: roleName, working: false });
    };