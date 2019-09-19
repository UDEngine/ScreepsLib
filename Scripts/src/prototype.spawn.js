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

        if (numberOfCreeps['builder'] < 2) {
            this.createCustomCreep(room.energyAvailable, 'builder');
        }

        if (numberOfCreeps['repairer'] < 2) {
            this.createCustomCreep(room.energyAvailable, 'repairer');
        }

        //每个矿暂时配两个矿工
        let sourceList = this.room.find(FIND_SOURCES_ACTIVE);
        for (let i in sourceList) {
            let source = sourceList[i];
            let creeps = _.filter(creepsInRoom, c => c.memory.role == 'harvester' && c.memory.sourceId == source.id);
            if (creeps.length < 2) {
                this.createWorker(room.energyAvailable, 'harvester', source.id);
            }
        }
    };

//制造货车
StructureSpawn.prototype.createLorry =
    function () {
        let structures = room.find(FIND_MY_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_STORAGE
                         || s.structureType == STRUCTURE_CONTAINER)
                         && s.store[RESOURCE_ENERGY] < s.storeCapacity
        });

        //如果有容器，就制造货车
        if (structures.length > 0) {

        }
    };

// create a new function for StructureSpawn
StructureSpawn.prototype.createCustomCreep =
    function (energy, roleName) {

        let body = [];
        let numberOfParts = Math.floor(energy / 200);
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
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
        return this.createCreep(body, creepName, { role: roleName, working: false, roomName:this.room.name });
    };

// create a new function for StructureSpawn
StructureSpawn.prototype.createWorker =
    function (energy, roleName, sourceId) {
        let structureArr = this.room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_CONTAINER 
        });
        let body = [];
        if (structureArr.length > 0) {
            let numberOfParts = Math.floor(energy / 300);
            numberOfParts = Math.min(numberOfParts, Math.floor(50 / 4));
            if (numberOfParts > 0) {
                console.log("createWorker: new worker");
                for (let i = 0; i < numberOfParts * 2; i++) {
                    body.push(WORK);
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(CARRY);
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(MOVE);
                }
            }
        }
        else {
            let numberOfParts = Math.floor(energy / 200);
            numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));

            if (numberOfParts > 0) {
                console.log("createWorker: old worker");
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(WORK);
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(CARRY);
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(MOVE);
                }
            }
        }

        if (body.length > 0) {
            let creepName = roleName + Game.time;
            return this.createCreep(body, creepName, { role: roleName, working: false, sourceId: sourceId, roomName: this.room.name });
        }
    };