'use strict';

var listOfRoles = ['harvester', 'upgrader', 'builder', 'repairer', 'lorry'];

// create a new function for StructureSpawn
StructureSpawn.prototype.spawnCreepsIfNecessary = 
    function () {
        let room = this.room;
        let creepsInRoom = room.find(FIND_MY_CREEPS);

        let numberOfCreeps = {};
        for (let role of listOfRoles) {
            numberOfCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role);
        }

        let sources = this.room.find(FIND_SOURCES_ACTIVE);

        // if ((room.energyAvailable / room.energyCapacityAvailable < 0.8) && numberOfCreeps["harvester"] >= sources.length && numberOfCreeps["lorry"] > 0) {
        //     return;
        // }
        
        if (numberOfCreeps['builder'] < 2) {
            this.createCustomCreep(room.energyAvailable, 'builder');
        }

        if (numberOfCreeps['repairer'] < 2) {
            this.createCustomCreep(room.energyAvailable, 'repairer');
        }

        //创造足够多的的卡车
        this.createEnoughLorry(numberOfCreeps['lorry']);
        //创建足够的Harvester
        this.createEnoughHarvester(creepsInRoom);
    };

//创建足够的Harvester
StructureSpawn.prototype.createEnoughHarvester =
    function (creepsInRoom) {
        //每个矿暂时配两个矿工
        let sourceList = this.room.find(FIND_SOURCES_ACTIVE);
        for (let source of sourceList) {
            let creeps = _.filter(creepsInRoom, c => c.memory.role == 'harvester' && c.memory.sourceId == source.id);
            let workBodySum = _.sum(creeps, c => Math.floor(c.body.length / 2));
            console.log(workBodySum);
            if (workBodySum == undefined || workBodySum < source.energyCapacity / 300 / 2) {
                this.createWorker('harvester', source.id);
            }
        }
    };

// create a new function for StructureSpawn
StructureSpawn.prototype.createCustomCreep =
    function (energy, roleName) {
        // if (this.room.controller.level )

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
        return this.spawnCreep(body, creepName, {
            memory: { role: roleName, working: false, roomName:this.room.name }
        });
    };

// create a new function for StructureSpawn
StructureSpawn.prototype.createWorker =
    function (roleName, sourceId) {
        let energy = this.room.energyAvailable;
        let structureArr = this.room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_CONTAINER 
        });
        let body = [];
        if (structureArr.length > 0) {
            let numberOfParts = Math.floor((energy - 50) / 250);
            numberOfParts = Math.min(numberOfParts, 4);
            if (numberOfParts > 0) {
                console.log("createWorker: new worker");
                for (let i = 0; i < numberOfParts * 2; i++) {
                    body.push(WORK);
                }
                body.push(CARRY);
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

        let creepName = roleName + Game.time;
        return this.spawnCreep(body, creepName, { 
            memory: {role: roleName, working: false, sourceId: sourceId, roomName: this.room.name}
        });
    };

// create a new function for StructureSpawn
StructureSpawn.prototype.createEnoughLorry =
    function (aliveLorryNum) {
        let structures = this.room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_CONTAINER
                         && (s.pos.findInRange(FIND_SOURCES_ACTIVE, 3)).length > 0
                         && s.store[RESOURCE_ENERGY] > 0
        });

        //如果有容器，就制造货车
        for (let i = aliveLorryNum; i < Math.floor(structures.length); i++) {
            this.createLorry();
        }
    };

StructureSpawn.prototype.createLorry = 
    function () {
        let energy = this.room.energyAvailable;
        let numberOfParts = Math.floor(energy / 150);
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
        let body = [];
        for (let i = 0; i < numberOfParts * 2; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }
        console.log("createLorry: bodylength:" + body.length);
        let creepName = "lorry" + Game.time;
        return this.spawnCreep(body, creepName, { 
            memory: {role: 'lorry', working: false}
        });
    };