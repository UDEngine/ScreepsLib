'use strict';

StructureTower.prototype.run =
    function () {
        let structures = this.room.find(FIND_STRUCTURES, {
            filter: (s) => s.hits / s.hitsMax < 0.9 
                        && s.structureType != STRUCTURE_WALL
                        && s.structureType != STRUCTURE_RAMPART
        });

        if (structures.length > 0) {
            this.repair(structures[0]);
        }

        this.defend();
    };


StructureTower.prototype.defend =
    function () {
        var target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target != undefined) {
            this.attack(target);
        }
    };
