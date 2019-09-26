'use strict';

var listOfRoles = ['harvester', 'upgrader', 'builder', 'repairer', 'lorry', 'attacker', 'farbuilder', 'miner'];

// create a new function for StructureSpawn
StructureSpawn.prototype.spawnCreepsIfNecessary = 
    function () {
        let room = this.room;
        let creepsInRoom = room.find(FIND_MY_CREEPS);

        let numberOfCreeps = {};
        for (let role of listOfRoles) {
            numberOfCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role);
        }

        // let sources = this.room.find(FIND_SOURCES_ACTIVE);
        // if ((room.energyAvailable / room.energyCapacityAvailable < 0.8) && numberOfCreeps["harvester"] >= sources.length && numberOfCreeps["lorry"] > 0) {
        //     return;
        // }
        // if (numberOfCreeps['attacker'] < 1) {
        //     this.createAttacker('attacker');
        // }

        // let extractors = this.room.find(FIND_STRUCTURES, {
        //     filter: (s) => s.structureType == STRUCTURE_EXTRACTOR
        // });

        // if (numberOfCreeps['miner'] < 1 && extractors.length > 0) {
        //     this.createMiner('miner');
        // }

        if (numberOfCreeps['builder'] < 2) {
            this.createCustomCreep(room.energyAvailable, 'builder');
        }

        if (numberOfCreeps['repairer'] < 1) {
            this.createCustomCreep(room.energyAvailable, 'repairer');
        }

        //创造足够多的的卡车
        this.createEnoughLorry(creepsInRoom);
        //创建足够的Harvester
        this.createEnoughHarvester(creepsInRoom);


        let creepsInE11S39 = Game.rooms['E11S39'].find(FIND_MY_CREEPS);
        if (creepsInE11S39.length + numberOfCreeps['farbuilder'] < 1) {
            this.createFarBuilder('farbuilder');
        }
    };

//创建足够的Harvester
StructureSpawn.prototype.createEnoughHarvester =
    function (creepsInRoom) {
        //每个矿暂时配两个矿工
        let sourceList = this.room.find(FIND_SOURCES_ACTIVE);
        for (let source of sourceList) {
            let creeps = _.filter(creepsInRoom, c => c.memory.role == 'harvester' && c.memory.sourceId == source.id);
            let workBodySum = _.sum(creeps, c => Math.floor(c.body.length / 2));
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
        numberOfParts = Math.min(numberOfParts, 6);
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
StructureSpawn.prototype.createFarBuilder =
    function (roleName) {
        let body = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
        let creepName = roleName + Game.time;
        return this.spawnCreep(body, creepName, {
            memory: { role: roleName, working: false, roomName:"E11S39" }
        });
    };

// create a new function for StructureSpawn
StructureSpawn.prototype.createAttacker =
    function (roleName) {
        let body = [CLAIM, WORK, CARRY, MOVE, MOVE, MOVE];
        let creepName = roleName + Game.time;
        return this.spawnCreep(body, creepName, {
            memory: { role: roleName, working: false, roomName:"E11S39" }
        });
    };

StructureSpawn.prototype.createMiner=
function (roleName) {
    let body = [WORK, WORK, WORK, CARRY, MOVE, MOVE];
    let creepName = roleName + Game.time;
    let minerals = this.room.find(FIND_MINERALS);
    return this.spawnCreep(body, creepName, {
        memory: { role: roleName, working: false, roomName:this.room.name, sourceId: minerals[0].id }
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
    function (creepsInRoom) {
        let structures = this.room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_CONTAINER
                         && (s.pos.findInRange(FIND_SOURCES_ACTIVE, 3)).length > 0
                         && s.store[RESOURCE_ENERGY] > 0
                         || s.structureType == STRUCTURE_LINK
        });
        //如果装载能力大于500，就不制造货车了
        let creeps = _.filter(creepsInRoom, c => c.memory.role == 'lorry');
        let carryCapacitySum = _.sum(creeps, c => c.carryCapacity);
        //如果有容器，就制造货车
        if (carryCapacitySum < 500 && structures.length > 0) {
            this.createLorry();
        }
    };

StructureSpawn.prototype.createLorry = 
    function () {
        let energy = this.room.energyAvailable;
        let numberOfParts = Math.floor(energy / 150);
        //最多有14个carry组件就够用了
        numberOfParts = Math.min(numberOfParts, 6);
        let body = [];
        for (let i = 0; i < numberOfParts * 2; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }

        let creepName = "lorry" + Game.time;
        return this.spawnCreep(body, creepName, { 
            memory: {role: 'lorry', working: false, roomName: this.room.name}
        });
    };