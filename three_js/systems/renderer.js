import {
  WebGLRenderer,
  ACESFilmicToneMapping,
  sRGBEncoding,
  PCFSoftShadowMap,  
} from "three";
/* import * as THREE from 'three';
import {  toneMapping} from 'three/nodes';
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js'; */
function createRenderer() {
   const renderer = new WebGLRenderer({ antialias: true });

  renderer.toneMapping = ACESFilmicToneMapping;
  // renderer.toneMappingExposure = 1;
  renderer.outputEncoding = sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.physicallyCorrectLights = true;
  renderer.xr.enabled = true;
  //Lower résolution
  renderer.setPixelRatio( window.devicePixelRatio * 0.5 );
  renderer.precision="lowp"; 
/*  let renderer = new WebGPURenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				// renderer.setAnimationLoop( animate );
				renderer.toneMappingNode = toneMapping( THREE.LinearToneMapping, .15 );	 */			
  return renderer;
}
export { createRenderer };
