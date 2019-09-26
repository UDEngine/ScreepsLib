'use strict';

StructureLink.prototype.run =
    function () {
        if (this.energy < this.energyCapacity - 40) {
            return;
        }

        let structures = this.room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_LINK
                        && s.pos.inRangeTo(this.room.storage, 2)
        });

        if (structures.length > 0) {
            this.transferEnergy(structures[0]);
        }
    };