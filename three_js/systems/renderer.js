import {
  WebGLRenderer,
  ACESFilmicToneMapping,
  sRGBEncoding,
  PCFSoftShadowMap,  
} from "three";
function createRenderer() {
   const renderer = new WebGLRenderer({ antialias: true });
  renderer.toneMapping = ACESFilmicToneMapping;  
  renderer.outputEncoding = sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.physicallyCorrectLights = true;
  renderer.xr.enabled = true;  
  renderer.setPixelRatio( window.devicePixelRatio * 0.5 );
  renderer.precision="lowp"; 
  return renderer;
}
export { createRenderer };
