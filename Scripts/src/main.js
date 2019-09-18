// import modules
require('prototype.creep');
require('prototype.spawn');

module.exports.loop = function () {

   // for each creeps
   for (let name in Game.creeps) {
      // run creep logic
      Game.creeps[name].runRole();
   }

   // for each spawn
   for (let spawnName in Game.spawns) {
      // run spawn logic
      Game.spawns[spawnName].spawnCreepsIfNecessary();
   }
}