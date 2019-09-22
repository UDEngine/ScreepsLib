// import modules
require('prototype.creep');
require('prototype.spawn');
require('prototype.tower');
require('prototype.link');

module.exports.loop = function () {

   for (let name in Game.creeps) {
      Game.creeps[name].runRole();
   }

   var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
   for (let tower of towers) {
      tower.run();
   }

   var links = _.filter(Game.structures, s => s.structureType == STRUCTURE_LINK);
   for (let link of links) {
      link.run();
   }

   for (let spawnName in Game.spawns) {
      Game.spawns[spawnName].spawnCreepsIfNecessary();
   }
}