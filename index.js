import { World } from "./three_js/World.js";
async function main() {  
  const world = new World();
  world.createUI(); 
  world.loadBackground();       
  await Promise.all([    
    await world.loadRoomGLTF(),    
    await world.loadTableGLTF(),                 
    await world.loadLightsGLTF(),        
    await world.loadChairGLTF(),    
    await world.loadBlindsGLTF(),
    await world.loadPlants(),            
    await world.loadCylindricalLight(),
    await world.loadMirrorGLTF(),
  ]);
  world.lightPresets();
  world.createTransfromCtrls();
  world.createPostProcess();
  world.createMeasurements();  
  world.start();
}

main().catch((err) => {
  console.error(err);
});


