import { GridHelper, AxesHelper, Group } from "three";
import Stats from "../../node_modules/three/examples/jsm/libs/stats.module.js";
import { GUI } from "../../node_modules/three/examples/jsm/libs/lil-gui.module.min.js"
import useSpinner from '../../use-spinner';
import '../../use-spinner/assets/use-spinner.css';
let container_3d=document.getElementById("3dcontainer");
let stats,
  gui,
  pixelRatio,
  drawCalls,
  guiStatsEl,
  width,
  height,
  memory,
  visibleTriangles;    
class Debug {
  createHelpers(scene) {
    const axexHelper = new AxesHelper(5);
    const gridHelper = new GridHelper(10, 10);

    const helperGroup = new Group();
    helperGroup.add(axexHelper);
    helperGroup.add(gridHelper);
    scene.add(helperGroup);
  }

  logSceneInfo(renderer) {
    console.log(renderer.info.render);
    console.log(renderer.info.memory);
    console.log(renderer.info.programs);
  }

  createGui(renderer) {
    //CREATE GUI FOR DEBUGGING
    gui = new GUI();

    const perfFolder = gui.addFolder("Performance");

    guiStatsEl = document.createElement("div");
    perfFolder.$children.appendChild(guiStatsEl);
    perfFolder.open();

    //PIXEL RATIO TEST FOR LOW END DEVICES
    let obj1 = { x: 1 };
    let pixelTest = function () {
      renderer.setPixelRatio(window.devicePixelRatio / obj1.x);
    };
  }
  

  displayStats() {
    //SHOW FPS
    stats = new Stats();  
    // let a=0;
    let stats_ui=document.getElementById("Stats");
    // let prompt=document.getElementById("ar-prompt");
    const stats_ui_fn = async () => {
      await new Promise(resolve => setTimeout(() => {        
        document.body.appendChild(stats.dom); 
        // a=a+1; 
        resolve();
      }, 10));
    }; 
    async function stats_ui_Fun() {                                      
      const spinnedFn = useSpinner(stats_ui_fn, {
       container: container_3d
     });      
     // execute with a loading spinner
     await spinnedFn();     
    /*  if(prompt.style.display=="block" || a>=2){
      prompt.style.display="none";
    }else{
      prompt.style.display="block";
    }  */
   }       
   const stats_ui_else_fn = async () => {
    await new Promise(resolve => setTimeout(() => {
      document.body.removeChild(stats.dom);
      resolve();
    }, 10));
  }; 
  async function stats_ui_else_Fun() {                                      
    const spinnedFn = useSpinner(stats_ui_else_fn, {
     container: container_3d
   });      
   // execute with a loading spinner
   await spinnedFn();
 }      
 stats_ui_Fun()  
    stats_ui.addEventListener("click",function(e){
      if(e.target.checked){
        stats_ui_Fun()   
      }else{
        stats_ui_else_Fun()
      }
    })
    
    
  }

  update(renderer) {
    //UPDATE
    stats.update();
    //   drawCalls = renderer.info.render.calls;
    //   visibleTriangles = renderer.info.render.triangles;

    //   width = window.screen.availWidth;
    //   height = window.screen.availHeight;

    //   guiStatsEl.innerHTML = [
    //     "<i>draw calls</i>: " + drawCalls,
    //     "<i>device pixel ratio</i>: " + pixelRatio,
    //     "<i>resolution</i>: " + width + "x" + height,
    //     "<i>visible triangles</i>: " + visibleTriangles,
    //   ].join("<br/>");
  }
}

export { Debug };
