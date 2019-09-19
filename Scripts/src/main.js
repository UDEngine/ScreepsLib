// import modules
require('prototype.creep');
require('prototype.spawn');
require('prototype.tower');

module.exports.loop = function () {

   for (let name in Game.creeps) {
      Game.creeps[name].runRole();
   }

   var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
   for (let tower of towers) {
      tower.run();
   }

   for (let spawnName in Game.spawns) {
      Game.spawns[spawnName].spawnCreepsIfNecessary();
   }
}