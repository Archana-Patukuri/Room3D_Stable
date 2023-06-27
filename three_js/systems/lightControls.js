import {
  Color,
  Vector3,
  RepeatWrapping,
  ShaderMaterial,
  TextureLoader,
  UniformsUtils,   
} from "three";
import * as THREE from 'three';
import { hdriLoad } from "../components/hdri_loader/hdri_loader.js";
import useSpinner from '../../use-spinner';
import '../../use-spinner/assets/use-spinner.css';
let container_3d=document.getElementById("3dcontainer");
import { SubsurfaceScatteringShader } from "three/examples/jsm/shaders/SubsurfaceScatteringShader.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { Pass } from "postprocessing";
var delta;

async function lightControls(scene,renderer,prompt,sunLight,ambientLight,camera,clock,stateList,gui,start){  
  const { background1,hdri0, hdri1 } = await hdriLoad();            

   let slider_l=document.querySelectorAll(".Slider_range");  
   let slider_CL=slider_l[0]
   let slider_DL=slider_l[1]
   let slider_FL=slider_l[2]
   let slider_WL=slider_l[3]
   let slider_SL=slider_l[4]
   let slider_CWL=slider_l[6]
   let slider_AL=slider_l[5]
   let slider_HDRI=slider_l[7]

   let helpers_controls=document.querySelectorAll(".helpers_controls");
   let helpers_CL=helpers_controls[0];
   let helpers_DL=helpers_controls[1];
   let helpers_FL=helpers_controls[2];
   let helpers_WL=helpers_controls[3];
   let helpers_SL=helpers_controls[4];
   let helpers_CWL=helpers_controls[5];

   let colorPicker=document.querySelectorAll(".colorPicker");    
   let colorPicker_CL=colorPicker[0]
   let colorPicker_DL=colorPicker[1]
   let colorPicker_FL=colorPicker[2]
   let colorPicker_WL=colorPicker[3]
   let colorPicker_SL=colorPicker[4]
   let colorPicker_CWL=colorPicker[6]
   let colorPicker_AL=colorPicker[5]       

  let floor_lamp=document.getElementById("floor_lamp");
  let wall_lamp=document.getElementById("wall_lamp");  
  let Cylindrical_Light=document.getElementById("Cylindrical_Light");  
        
    helpers_CL.addEventListener("change",(e)=>{
      let fanLight=scene.getObjectByName("fanLight")
      const pointLightHelper_fanLight = new THREE.PointLightHelper( fanLight, 1 ); 
      if(e.target.checked){        
        scene.add( pointLightHelper_fanLight );  
        console.log("ceiling light helpers added")                    
      }else{        
        scene.traverse(function(child){          
          if(child.type=="PointLightHelper" && child.light.name=="fanLight"){
            scene.remove(child);
          }
        })         
        console.log("ceiling light helpers removed")                       
      }
    }) 
    helpers_DL.addEventListener("change",(e)=>{
      let Light=scene.getObjectByName("Desktop_Lamp_Light002")      
      if(e.target.checked){        
        const pointLightHelper = new THREE.PointLightHelper( Light, 1 );
        scene.add( pointLightHelper );  
        console.log("desktop light helpers added") 
      }else{        
        scene.traverse(function(child){
          if(child.type=="PointLightHelper" && child.light.name=="Desktop_Lamp_Light002"){
            scene.remove(child);
          }
        })              
        console.log("desktop light helpers removed")  
      }
    }) 
    helpers_SL.addEventListener("change",(e)=>{      
      if(e.target.checked){        
        const dir_helper = new THREE.DirectionalLightHelper( sunLight,1,0xFF0000 );
        scene.add( dir_helper ); 
        console.log("sun light helpers added")  
      }else{
        scene.traverse(function(child){
          if(child.type=="DirectionalLightHelper"){
            scene.remove(child);
          }
        })        
       console.log("sun light helpers removed") 
      }
    }) 
    helpers_CWL.addEventListener("change",(e)=>{
      let cylindricalLampSpotLight_1 = scene.getObjectByName("Cylindrical_spot_light_1");
      let cylindricalLampSpotLight_2 = scene.getObjectByName("Cylindrical_spot_light_2");    
      let cylindricalLampSpotLight_3 = scene.getObjectByName("Cylindrical_spot_light_3");
      let cylindricalLampSpotLight_4 = scene.getObjectByName("Cylindrical_spot_light_4");  
      
      if(e.target.checked){  
        const CWl_helper1 = new THREE.SpotLightHelper( cylindricalLampSpotLight_1 ); 
        const CWl_helper2 = new THREE.SpotLightHelper( cylindricalLampSpotLight_2 ); 
        const CWl_helper3 = new THREE.SpotLightHelper( cylindricalLampSpotLight_3 ); 
        const CWl_helper4 = new THREE.SpotLightHelper( cylindricalLampSpotLight_4 );       
        scene.add( CWl_helper1 );  
        scene.add( CWl_helper2 );  
        scene.add( CWl_helper3 );  
        scene.add( CWl_helper4 );  
        console.log("wall lamp light helpers added")                    
      }else{        
        //console.log(scene)        
        scene.traverse(function(child){          
          if(child.type=="SpotLightHelper"){
            scene.remove(child);
          }
        })         
        console.log("wall light helpers removed")                       
      }
    })   
       
   let distance_DL=document.getElementById("distance_DL")
   let distance_CL=document.getElementById("distance_CL")
   let distance_FL=document.getElementById("distance_FL")
   let distance_WL=document.getElementById("distance_WL")
   let distance_WWL=document.getElementById("distance_WWL")
   let decay_DL=document.getElementById("decay_DL");
   let decay_CL=document.getElementById("decay_CL");
   let decay_FL=document.getElementById("decay_FL");
   let decay_WL=document.getElementById("decay_WL");
   let decay_WWL=document.getElementById("decay_WWL");
   let angle_WWL=document.getElementById("angle_WWL");

   const config = {
    spotlightRadius: 4,
    spotlightSamples: 8,
    dirlightRadius: 4,
    dirlightSamples: 8,
    desktoplightRadius: 4,
    desktoplightSamples: 8,
    ceilinglightRadius: 4,
    ceilinglightSamples: 8,

    sunlight_mapsize_width:2048,
    sunlight_mapsize_height:2048,

    ceilinglight_mapsize_width:2048,
    ceilinglight_mapsize_height:2048,

    desktoplight_mapsize_width:2048,
    desktoplight_mapsize_height:2048,

    sunlight_camera_near:0.1,
    sunlight_camera_far:1000,
    ceilinglight_camera_near:0.1,
    ceilinglight_camera_far:1000,
    desktoplight_camera_near:0.1,
    desktoplight_camera_far:1000,
  };

const sun_fn = async () => {
  await new Promise(resolve => setTimeout(() => { 
    delta = clock.getDelta();
       
    if(!localStorage.sunLight_Intensity || localStorage.saveStateVal=="false"){
      localStorage.sunLight_Intensity=30; 
      sunLight.intensity=Number(localStorage.sunLight_Intensity); 
    }else{
      sunLight.intensity=Number(localStorage.sunLight_Intensity);       
    }
        
    scene.background = new Color(0xffffff);
     scene.environment = hdri1;        
    renderer.toneMappingExposure = 0.5;    
    stateList.Pitch_Dark.checked=false;     
    sunLight.castShadow = true;                    
    slider_SL.oninput = function() {   
      localStorage.sunLight_Intensity=this.value           
      sunLight.intensity=Number(localStorage.sunLight_Intensity)                  
    }   
    colorPicker_SL.oninput = function() {                                                  
     sunLight.color.setHex("0x"+this.value.slice(1,7), 1);          
    }      
    sunLight.shadow.mapSize.width = 2048; 
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.1; 
    sunLight.shadow.camera.far = 1000;
    sunLight.shadow.autoUpdate = true;
    sunLight.shadow.camera.updateProjectionMatrix();
    resolve();
  }, 10));
};         
let gui_sun=document.getElementById("gui_sun");
gui_sun.addEventListener("click",function(e){
  if(e.target.checked){
    if(gui)gui.destroy()                 
    gui = new GUI();
    const sunlightFolder = gui.addFolder( 'Sun Light' );
    sunlightFolder.add( config, 'dirlightRadius' ).name( 'radius' ).min( 0 ).max( 25 ).onChange( function ( value ) {

					sunLight.shadow.radius = value;

				} );        
				sunlightFolder.add( config, 'dirlightSamples', 1, 25, 1 ).name( 'samples' ).onChange( function ( value ) {

					sunLight.shadow.blurSamples = value;

				} ); 
        sunlightFolder.add( config, 'sunlight_mapsize_width' ).name( 'mapsize_width' ).min( 0 ).max( 2500 ).onChange( function ( value ) {
          sunLight.shadow.mapSize.width = value; 
				} );
				sunlightFolder.add( config, 'sunlight_mapsize_height', 0, 2500, 1 ).name( 'mapsize_height' ).onChange( function ( value ) {					
          sunLight.shadow.mapSize.height = value; 
				} );   
        sunlightFolder.add( config, 'sunlight_camera_near' ).name( 'camera_near' ).min( 0 ).max( 1 ).onChange( function ( value ) {
          sunLight.shadow.camera.near = value; 
				} );
				sunlightFolder.add( config, 'sunlight_camera_far', 0, 1000, 1 ).name( 'camera_far' ).onChange( function ( value ) {					
          sunLight.shadow.camera.far = value; 
				} );                  
  }else{
    gui.hide();
  }
})
async function SunLight_Fun() {                                      
   const spinnedFn = useSpinner(sun_fn, {
    container: container_3d
  });      
  // execute with a loading spinner
  await spinnedFn(); 
    delta = clock.getDelta();
    console.log("sunlight enabled",delta.toPrecision(1),"seconds")       
}  
const sun_else_fn = async () => {
  await new Promise(resolve => setTimeout(() => {
    delta = clock.getDelta();                                         
    sunLight.intensity=0;
    scene.background = new Color(0x000000);
    sunLight.castShadow = false;  
    localStorage.SunLightEle="false"          
    resolve();
  }, 10));
}; 
async function sunLight_Else_Fun() {                                      
  const spinnedFn = useSpinner(sun_else_fn, {
   container: container_3d
 });      
 // execute with a loading spinner
 await spinnedFn();
 delta = clock.getDelta();
 console.log("sunlight disabled",delta.toPrecision(3),"seconds")  
}    
//SunLight_Fun();
stateList.SunLightEle.addEventListener("change",(e)=>{                               
  if(e.target.checked){                       
    SunLight_Fun()  
    if(sunLight.intensity>0){
      ambientLight.intensity=0;
    }                                                 
  }else{      
    sunLight_Else_Fun();                    
  }                                       
}) 

          const ambient_light_fn = async () => {
              await new Promise(resolve => setTimeout(() => {
                console.log("ambient light added")
                renderer.toneMappingExposure = 1;
                scene.background = new Color(0x0d0d0d);
                scene.environment = hdri0;      
                stateList.Pitch_Dark.checked=false;                
                if(!localStorage.ambientLight_Intensity){                 
                  localStorage.ambientLight_Intensity=1;                
                }
                ambientLight.intensity=Number(localStorage.ambientLight_Intensity);                
                 
                scene.add(ambientLight);            
                  slider_AL.oninput = function() {                              
                    localStorage.ambientLight_Intensity=this.value
                    ambientLight.intensity=Number(localStorage.ambientLight_Intensity)                                  
                  }
                  colorPicker_AL.oninput = function() {                                             
                    ambientLight.color.setHex("0x"+this.value.slice(1,7), 1);          
                  }    
                  /* if(stateList.desktopLight.checked==false){
                    let Light=scene.getObjectByName("Desktop_Lamp_Light002")
                    Light.intensity = 0;  
                  }                                                                                  
                  if(stateList.CeilingLight.checked==false){
                    let fanLight=scene.getObjectByName("fanLight")
                    fanLight.intensity=0;
                  } */
                  
                  localStorage.mild_ambient_light=true;
                resolve();
              }, 10));
            }; 
            async function mild_ambient_light_Fun() {                                      
              const spinnedFn = useSpinner(ambient_light_fn, {
               container: container_3d
             });      
             // execute with a loading spinner
             await spinnedFn();
           }        
            const ambient_light_Else_fn = async () => {
              await new Promise(resolve => setTimeout(() => {
                console.log("ambient light disabled")                
                ambientLight.intensity = 0;
               // renderer.toneMappingExposure = 0;  
               /*  scene.background = new Color(0x0d0d0d);
                scene.environment = hdri1;    */
                if(stateList.SunLightEle.checked==true){
                  scene.environment = hdri1; 
                  renderer.toneMappingExposure = 0.1;
                }
                localStorage.mild_ambient_light="false";
                resolve();
              }, 10));
            }; 
            async function mild_ambient_light_Else_Fun() {                                      
              const spinnedFn = useSpinner(ambient_light_Else_fn, {
               container: container_3d
             });      
             // execute with a loading spinner
             await spinnedFn();
           }    
                 
    stateList.mild_ambient_light.addEventListener("change", (e) => {      
      if (e.target.checked) {            
        mild_ambient_light_Fun();                             
      }else{
        mild_ambient_light_Else_Fun();                                          
      }       
    }) 
    const Cylindrical_Light_fn = async () => {
      await new Promise(resolve => setTimeout(() => {
        console.log("cylindrical light added")
        renderer.toneMappingExposure = 0.5;
        scene.background = new Color(0x0d0d0d);
        scene.environment = hdri1;          
        let cylindricalLampSpotLight_1 = scene.getObjectByName("Cylindrical_spot_light_1");
        let cylindricalLampSpotLight_2 = scene.getObjectByName("Cylindrical_spot_light_2");    
        let cylindricalLampSpotLight_3 = scene.getObjectByName("Cylindrical_spot_light_3");
        let cylindricalLampSpotLight_4 = scene.getObjectByName("Cylindrical_spot_light_4");        

        if(!localStorage.cylindricalLampSpotLight_1_Intensity){
        localStorage.cylindricalLampSpotLight_1_Intensity=2;          
        localStorage.cylindricalLampSpotLight_2_Intensity=2;  
        localStorage.cylindricalLampSpotLight_3_Intensity=2; 
        localStorage.cylindricalLampSpotLight_4_Intensity=2; 
        }        
       
        cylindricalLampSpotLight_1.intensity=Number(localStorage.cylindricalLampSpotLight_1_Intensity)            
        cylindricalLampSpotLight_2.intensity=Number(localStorage.cylindricalLampSpotLight_2_Intensity)                      
        cylindricalLampSpotLight_3.intensity=Number(localStorage.cylindricalLampSpotLight_3_Intensity)                      
        cylindricalLampSpotLight_4.intensity=Number(localStorage.cylindricalLampSpotLight_4_Intensity)   
        
        cylindricalLampSpotLight_1.distance = 1;
        cylindricalLampSpotLight_2.distance = 1;
        cylindricalLampSpotLight_3.distance = 1;
        cylindricalLampSpotLight_4.distance = 1;
              
          slider_CWL.oninput = function() { 
            localStorage.cylindricalLampSpotLight_1_Intensity=this.value;
            localStorage.cylindricalLampSpotLight_2_Intensity=this.value;
            localStorage.cylindricalLampSpotLight_3_Intensity=this.value;
            localStorage.cylindricalLampSpotLight_4_Intensity=this.value;
            cylindricalLampSpotLight_1.intensity=Number(localStorage.cylindricalLampSpotLight_1_Intensity)            
            cylindricalLampSpotLight_2.intensity=Number(localStorage.cylindricalLampSpotLight_2_Intensity)                      
            cylindricalLampSpotLight_3.intensity=Number(localStorage.cylindricalLampSpotLight_3_Intensity)                      
            cylindricalLampSpotLight_4.intensity=Number(localStorage.cylindricalLampSpotLight_4_Intensity)            
            
          }
          colorPicker_CWL.oninput = function() {                                             
            cylindricalLampSpotLight_1.color.setHex("0x"+this.value.slice(1,7), 1);          
            cylindricalLampSpotLight_2.color.setHex("0x"+this.value.slice(1,7), 1);          
            cylindricalLampSpotLight_3.color.setHex("0x"+this.value.slice(1,7), 1);          
            cylindricalLampSpotLight_4.color.setHex("0x"+this.value.slice(1,7), 1);          
          }  
          distance_WWL.oninput = function() {   
            cylindricalLampSpotLight_1.distance=this.value;                
            cylindricalLampSpotLight_2.distance=this.value; 
            cylindricalLampSpotLight_3.distance=this.value; 
            cylindricalLampSpotLight_4.distance=this.value; 
          }   
          decay_WWL.oninput=function(){
            cylindricalLampSpotLight_1.decay=this.value;
            cylindricalLampSpotLight_2.decay=this.value;
            cylindricalLampSpotLight_3.decay=this.value;
            cylindricalLampSpotLight_4.decay=this.value;
          } 
          angle_WWL.oninput=function(){
            cylindricalLampSpotLight_1.decay=this.value;
            cylindricalLampSpotLight_2.decay=this.value;
            cylindricalLampSpotLight_3.decay=this.value;
            cylindricalLampSpotLight_4.decay=this.value;
          }    
                   
        resolve();
      }, 10));
    }; 
    async function Cylindrical_Light_Fun() {                                      
      const spinnedFn = useSpinner(Cylindrical_Light_fn, {
       container: container_3d
     });      
     // execute with a loading spinner
     await spinnedFn();
   }   
   const Cylindrical_Light_Else_fn = async () => {
    await new Promise(resolve => setTimeout(() => {
      let cylindricalLampSpotLight_1 = scene.getObjectByName("Cylindrical_spot_light_1");
        let cylindricalLampSpotLight_2 = scene.getObjectByName("Cylindrical_spot_light_2");    
        let cylindricalLampSpotLight_3 = scene.getObjectByName("Cylindrical_spot_light_3");
        let cylindricalLampSpotLight_4 = scene.getObjectByName("Cylindrical_spot_light_4");    
      cylindricalLampSpotLight_1.intensity=0;
      cylindricalLampSpotLight_2.intensity=0;
      cylindricalLampSpotLight_3.intensity=0;
      cylindricalLampSpotLight_4.intensity=0;            
      resolve();
    }, 10));
  }; 
  async function Cylindrical_Light_Else_Fun() {                                      
    const spinnedFn = useSpinner(Cylindrical_Light_Else_fn, {
     container: container_3d
   });      
   // execute with a loading spinner
   await spinnedFn();
 }   
//  Cylindrical_Light_Fun();    
    Cylindrical_Light.addEventListener("change", (e) => {      
      if (e.target.checked) {            
        Cylindrical_Light_Fun();                             
      }else{
        Cylindrical_Light_Else_Fun();                                          
      }       
    }) 
    /* let fanLight=scene.getObjectByName("fanLight")                
        fanLight.intensity=10;
        fanLight.castShadow=true;
        console.log("fanlight") */
        
    const CeilingLight_fn = async () => {
      await new Promise(resolve => setTimeout(() => {
        console.log("ceiling light enabled")                                        
                  
        stateList.Pitch_Dark.checked=false;                               
        let fanLight=scene.getObjectByName("fanLight")        
        fanLight.castShadow=true;
        
                                                
          scene.environment = hdri0; 
          renderer.toneMappingExposure = 1; 
          scene.background = new Color(0x0d0d0d);          
        
        if(!localStorage.fanLight_Intensity){      
          localStorage.fanLight_Intensity=3;        
        }
        fanLight.intensity=Number(localStorage.fanLight_Intensity);
        
        slider_CL.oninput = function() {                  
        localStorage.fanLight_Intensity=this.value;
        fanLight.intensity=Number(localStorage.fanLight_Intensity)              
        }  
        colorPicker_CL.oninput = function() {                              
          fanLight.color.setHex("0x"+this.value.slice(1,7), 1);                                                                             
        } 
        distance_CL.oninput = function() {   
          fanLight.distance=this.value;                
        }   
        decay_CL.oninput=function(){
          fanLight.decay=this.value;
        }           
        
      /*   if(gui)gui.destroy()                 
        gui = new GUI();
        const ceilinglightFolder = gui.addFolder( 'Ceiling Light' );
        ceilinglightFolder.add( config, 'ceilinglightRadius' ).name( 'radius' ).min( 0 ).max( 25 ).onChange( function ( value ) {
          fanLight.shadow.radius = value;
				} );
				ceilinglightFolder.add( config, 'ceilinglightSamples', 1, 25, 1 ).name( 'samples' ).onChange( function ( value ) {
					fanLight.shadow.blurSamples = value;
				} );

        ceilinglightFolder.add( config, 'ceilinglight_mapsize_width' ).name( 'mapsize_width' ).min( 0 ).max( 2500 ).onChange( function ( value ) {
          fanLight.shadow.mapSize.width = value; 
				} );
				ceilinglightFolder.add( config, 'ceilinglight_mapsize_height', 0, 2500, 1 ).name( 'mapsize_height' ).onChange( function ( value ) {					
          fanLight.shadow.mapSize.height = value; 
				} );        
        
        ceilinglightFolder.add( config, 'ceilinglight_camera_near' ).name( 'camera_near' ).min( 0 ).max( 1 ).onChange( function ( value ) {
          fanLight.shadow.camera.near = value; 
				} );
				ceilinglightFolder.add( config, 'ceilinglight_camera_far', 0, 1000, 1 ).name( 'camera_far' ).onChange( function ( value ) {					
          fanLight.shadow.camera.far = value; 
				} );       */

        resolve();
      }, 10));
    }; 
    async function CeilingLight_Fun() {                                      
      const spinnedFn = useSpinner(CeilingLight_fn, {
       container: container_3d
     });      
     // execute with a loading spinner
     await spinnedFn();
     
   }    
   
   const CeilingLight_Else_fn = async () => {
    await new Promise(resolve => setTimeout(() => {
      let fanLight=scene.getObjectByName("fanLight")
      fanLight.intensity=0;
      fanLight.castShadow=false;       
      if(stateList.SunLightEle.checked==true){
        scene.environment = hdri1; 
        renderer.toneMappingExposure = 0.1;
      }
      localStorage.CeilingLight="false"
     console.log("ceiling light disabled")                                                   
      resolve();
    }, 10));
  }; 
  async function CeilingLight_Else_Fun() {                                      
    const spinnedFn = useSpinner(CeilingLight_Else_fn, {
     container: container_3d
   });      
   // execute with a loading spinner
   await spinnedFn();
 }    
//  CeilingLight_Fun();         
 stateList.CeilingLight.addEventListener("change",(e)=>{       
      if(e.target.checked){                   
        CeilingLight_Fun();                            
      }else{         
        CeilingLight_Else_Fun();          
      }           
    })    
    const desktopLight_fn = async () => {
      await new Promise(resolve => setTimeout(() => {
        console.log("desktop light enabled") 
        let Light=scene.getObjectByName("Desktop_Lamp_Light002")                        
        renderer.toneMappingExposure = 1;      
        stateList.Pitch_Dark.checked=false;                                     
        Light.castShadow=true;  

        if(!localStorage.Light_Intensity){
          localStorage.Light_Intensity=7;        
        }
        
        Light.intensity=Number(localStorage.Light_Intensity);

        scene.background = new Color(0x0d0d0d);
        scene.environment = hdri0;           
 //sss..........
          let tableLampTop = scene.getObjectByName("TableStand006");
        let texLoader = new TextureLoader();
        let subTexture = texLoader.load("textures/subSurface.jpg");
        subTexture.wrapS = RepeatWrapping;
        subTexture.wrapT = RepeatWrapping;
        subTexture.repeat.set(4, 4);

        const shader = SubsurfaceScatteringShader;
        const uniforms = UniformsUtils.clone(shader.uniforms);
        uniforms["diffuse"].value = new Vector3(0.8, 0.3, 0.2);
        uniforms["shininess"].value = 10;

        uniforms["thicknessMap"].value = subTexture;
        uniforms["thicknessColor"].value = new Vector3(0.1, 0, 0);
        uniforms["thicknessDistortion"].value = 0.1;
        uniforms["thicknessAmbient"].value = 0.4;
        uniforms["thicknessAttenuation"].value = 0.7;
        uniforms["thicknessPower"].value = 10.0;
        uniforms["thicknessScale"].value = 1;

        var subMaterial = new ShaderMaterial({
          uniforms: uniforms,
          vertexShader: shader.vertexShader,
          fragmentShader: shader.fragmentShader,
          lights: true,
        });

        tableLampTop.material = subMaterial;
 
 //sss.......... 
        slider_DL.oninput = function() {                  
          localStorage.Light_Intensity=this.value;
          Light.intensity=Number(localStorage.Light_Intensity);   
                
        }
        colorPicker_DL.oninput = function() {                                             
          Light.color.setHex("0x"+this.value.slice(1,7), 1);          
        } 
        distance_DL.oninput = function() {   
          Light.distance=this.value;                
        }   
        decay_DL.oninput=function(){
          Light.decay=this.value;
        }    
        if(gui)gui.destroy()                 
        gui = new GUI();    

        const desktoplightFolder = gui.addFolder( 'Desktop Light' );
        desktoplightFolder.add( config, 'desktoplightRadius' ).name( 'radius' ).min( 0 ).max( 25 ).onChange( function ( value ) {
          Light.shadow.radius = value;
				} );
				desktoplightFolder.add( config, 'desktoplightSamples', 1, 25, 1 ).name( 'samples' ).onChange( function ( value ) {
					Light.shadow.blurSamples = value;
				} );
        desktoplightFolder.add( config, 'desktoplight_mapsize_width' ).name( 'mapsize_width' ).min( 0 ).max( 2500 ).onChange( function ( value ) {
          Light.shadow.mapSize.width = value; 
				} );
				desktoplightFolder.add( config, 'desktoplight_mapsize_height', 0, 2500, 1 ).name( 'mapsize_height' ).onChange( function ( value ) {					
          Light.shadow.mapSize.height = value; 
				} );    
        desktoplightFolder.add( config, 'desktoplight_camera_near' ).name( 'camera_near' ).min( 0 ).max( 1 ).onChange( function ( value ) {
          Light.shadow.camera.near = value; 
				} );
				desktoplightFolder.add( config, 'desktoplight_camera_far', 0, 1000, 1 ).name( 'camera_far' ).onChange( function ( value ) {					
          Light.shadow.camera.far = value; 
				} );        
        resolve();
      }, 10));
    }; 
    async function desktopLight_Fun() {                                      
      const spinnedFn = useSpinner(desktopLight_fn, {
       container: container_3d
     });      
     // execute with a loading spinner
     await spinnedFn();
   }       
   const desktopLight_Else_fn = async () => {
    await new Promise(resolve => setTimeout(() => {
      let Light=scene.getObjectByName("Desktop_Lamp_Light002")
      Light.intensity = 0;   
      Light.castShadow=false;  
      //renderer.toneMappingExposure = 0; 
      if(stateList.SunLightEle.checked==true){
        scene.environment = hdri1; 
        renderer.toneMappingExposure = 0.1;
      } 
      localStorage.desktopLight="false"
      console.log("desktop light disabled")  
      resolve();
    }, 10));
  }; 
  async function desktopLight_Else_Fun() {                                      
    const spinnedFn = useSpinner(desktopLight_Else_fn, {
     container: container_3d
   });      
   // execute with a loading spinner
   await spinnedFn();
 }      
//  desktopLight_Fun();
 stateList.desktopLight.addEventListener("change",(e)=>{       
      if(e.target.checked){
        desktopLight_Fun();                             
      }else{
        desktopLight_Else_Fun();                       
      }
      
    })    

   const floor_lamp_fn = async () => {
    await new Promise(resolve => setTimeout(() => {
      console.log("floor lamp enabled")      
      let floor_lamp_Ele=scene.getObjectByName("Point");      
      renderer.toneMappingExposure = 1;      
      stateList.Pitch_Dark.checked=false;        
      ambientLight.intensity = 0;        
      scene.environment = hdri0;      
      
      if(!localStorage.floorLamp_Intensity){
        localStorage.floorLamp_Intensity=5;
      }
      
      floor_lamp_Ele.intensity=Number(localStorage.floorLamp_Intensity);
      
      floor_lamp_Ele.castShadow=true
      slider_FL.oninput = function() {        
        localStorage.floorLamp_Intensity=this.value;
        floor_lamp_Ele.intensity=Number(localStorage.floorLamp_Intensity);                             
      }  
      colorPicker_FL.oninput = function() {                                             
        floor_lamp_Ele.color.setHex("0x"+this.value.slice(1,7), 1);          
      }   
      const pointLightHelper_FL = new THREE.PointLightHelper( floor_lamp_Ele, 1 ,0x000000 );
      helpers_FL.addEventListener("change",(e)=>{
        if(e.target.checked){        
          scene.add( pointLightHelper_FL );  
        }else{
          scene.remove( pointLightHelper_FL ); 
        }
      })
      distance_FL.oninput = function() {   
        floor_lamp_Ele.distance=this.value;                
      }   
      decay_FL.oninput=function(){
        floor_lamp_Ele.decay=this.value;
      }    
      resolve();
    }, 10));
  }; 
  async function floor_lamp_Fun() {                                      
    const spinnedFn = useSpinner(floor_lamp_fn, {
     container: container_3d
   });      
   // execute with a loading spinner
   await spinnedFn();
 }      
 const floor_lamp_else_fn = async () => {
  await new Promise(resolve => setTimeout(() => {
    let floor_lamp_Ele=scene.getObjectByName("Point");     
    floor_lamp_Ele.intensity=0;      
    floor_lamp_Ele.castShadow=false
    resolve();
  }, 10));
}; 
async function floor_lamp_else_Fun() {                                      
  const spinnedFn = useSpinner(floor_lamp_else_fn, {
   container: container_3d
 });      
 // execute with a loading spinner
 await spinnedFn();
}              
    floor_lamp.addEventListener("change",(e)=>{
      if(e.target.checked){
        floor_lamp_Fun();                             
      }else{
        floor_lamp_else_Fun();              
      }
    })  
    let Point_Light,Point_Light1;
    const wall_lamp_fn = async () => {
      await new Promise(resolve => setTimeout(() => {        
        renderer.toneMappingExposure = 1;      
        stateList.Pitch_Dark.checked=false;        
        ambientLight.intensity = 0;        
        scene.environment = hdri0;        
        let arr=[];
        scene.traverse(function (child) {            
          if (child.isLight && child.name=="Point_Light") {                                      
              arr.push(child);                                                           
         }    
         });            
         Point_Light=arr[0]       
         Point_Light1=arr[1]        
        if(!localStorage.WL1_Intensity){
          localStorage.WL1_Intensity=2;
          localStorage.WL2_Intensity=2;
        }
        
        Point_Light.intensity=Number(localStorage.WL1_Intensity);       
        Point_Light1.intensity=Number(localStorage.WL2_Intensity);

        Point_Light.castShadow=true;
        Point_Light1.castShadow=true;        
        
        slider_WL.oninput = function() {        
          localStorage.WL1_Intensity=this.value;
          localStorage.WL2_Intensity=this.value;
          Point_Light.intensity=Number(localStorage.WL1_Intensity);       
          Point_Light1.intensity=Number(localStorage.WL2_Intensity);                         
        }
        colorPicker_WL.oninput = function() {                                             
          Point_Light.color.setHex("0x"+this.value.slice(1,7), 1);          
          Point_Light1.color.setHex("0x"+this.value.slice(1,7), 1);          
        }  
        distance_WL.oninput = function() {   
          Point_Light.distance=this.value;                
          Point_Light1.distance=this.value;
        }   
        decay_WL.oninput=function(){
          Point_Light.decay=this.value;
          Point_Light1.decay=this.value;
        }    
        const pointLightHelper_WL = new THREE.PointLightHelper( Point_Light, 1 );
        const pointLightHelper_WL1 = new THREE.PointLightHelper( Point_Light1, 1 );
        helpers_WL.addEventListener("change",(e)=>{
          if(e.target.checked){        
            scene.add( pointLightHelper_WL );  
            scene.add( pointLightHelper_WL1 ); 
          }else{
            scene.remove( pointLightHelper_WL ); 
            scene.remove( pointLightHelper_WL1 ); 
          }
        }) 
     
        resolve();
      }, 10));
    }; 
    async function wall_lamp_Fun() {                                      
      const spinnedFn = useSpinner(wall_lamp_fn, {
       container: container_3d
     });      
     // execute with a loading spinner
     await spinnedFn();
   }        
    const wall_lamp_Else_fn = async () => {
      await new Promise(resolve => setTimeout(() => {
        let arr=[]
        scene.traverse(function (child) {            
          if (child.isLight) {             
            if(child.name=="Point_Light"){              
              arr.push(child);
            }                                               
         }    
         });   
         Point_Light=arr[0]       
         Point_Light1=arr[1]
         Point_Light.castShadow=false;
         Point_Light1.castShadow=false;
        Point_Light.intensity=0;       
        Point_Light1.intensity=0;          
        let wallLamp_emissive=scene.getObjectByName("Mesh011_1");
        wallLamp_emissive.material.emissive=new Color(0,0,0);
        resolve();
      }, 10));
    }; 
    async function wall_lamp_Else_Fun() {                                      
      const spinnedFn = useSpinner(wall_lamp_Else_fn, {
       container: container_3d
     });      
     // execute with a loading spinner
     await spinnedFn();
   }            
    wall_lamp.addEventListener("change",(e)=>{
      if(e.target.checked){
        wall_lamp_Fun();                             
      }else{
        wall_lamp_Else_Fun();              
      }
    })            
    const Pitch_Dark_fn = async () => {
      await new Promise(resolve => setTimeout(() => {
        console.log("pitch dark enabled")                                     
        renderer.toneMappingExposure = 0;
        scene.background=new Color(0x000000);
        stateList.SunLightEle.checked=false;
        stateList.mild_ambient_light.checked=false;
        stateList.CeilingLight.checked=false;
        stateList.desktopLight.checked=false;
        stateList.Pitch_Dark.checked=true;
        stateList.HDRI.checked=false;
        stateList.Emissive.checked=false;  
             
        resolve();
      }, 10));
    }; 
    async function Pitch_Dark_Fun() {                                      
      const spinnedFn = useSpinner(Pitch_Dark_fn, {
       container: container_3d
     });      
     // execute with a loading spinner
     await spinnedFn();
   }   
   const Pitch_Dark_else_fn = async () => {
    await new Promise(resolve => setTimeout(() => {
      console.log("pitch dark disabled")                                       
      renderer.toneMappingExposure = 1;
      scene.background=new Color(0x0d0d0d);
      scene.environment = hdri1;  
      resolve();
    }, 10));
  }; 
   async function Pitch_Dark_Else_Fun() {                                      
    const spinnedFn = useSpinner(Pitch_Dark_else_fn, {
     container: container_3d
   });      
   // execute with a loading spinner
   await spinnedFn();
 }    
   stateList.Pitch_Dark.addEventListener("change",(e)=>{      
        if(e.target.checked){
          Pitch_Dark_Fun();                                              
        }else{
          Pitch_Dark_Else_Fun();                   
        }      
    })  
    const Emissive_fn = async () => {
      await new Promise(resolve => setTimeout(() => {
        let emissive_Obj=scene.getObjectByName("Mesh_Walls001");  
        emissive_Obj.material.emissive=new Color(1, 1, 1);    
        let Motor_emissive=scene.getObjectByName("Motor_emissive");        
        let table_emissive=scene.getObjectByName("TableStand006_2");
              
        Motor_emissive.material.emissive=new Color(1, 1, 1);         
        table_emissive.material.emissive=new Color(1, 1, 1);     
        resolve();
      }, 10));
    }; 
    async function Emissive_Fun() {                                      
      const spinnedFn = useSpinner(Emissive_fn, {
       container: container_3d
     });      
     // execute with a loading spinner
     await spinnedFn();
   }    
   
   const Emissive_else_fn = async () => {
    await new Promise(resolve => setTimeout(() => {
    let emissive_Obj=scene.getObjectByName("Mesh_Walls001");   
    let emissive_Obj_fan=scene.getObjectByName("Motor");  
    let table_emissive=scene.getObjectByName("TableStand006_2");
    let Motor_emissive=scene.getObjectByName("Motor_emissive");
      emissive_Obj.material.emissive=new Color(0, 0, 0);
      emissive_Obj_fan.material.emissive=new Color(0, 0, 0);
      table_emissive.material.emissive=new Color(0, 0, 0);     
      Motor_emissive.material.emissive=new Color(0, 0, 0); 
      resolve();
    }, 10));
  }; 
  async function Emissive_else_Fun() {                                      
    const spinnedFn = useSpinner(Emissive_else_fn, {
     container: container_3d
   });      
   // execute with a loading spinner
   await spinnedFn();
  }    
    Emissive.addEventListener("change", (e) => {    
      if (e.target.checked) {            
        Emissive_Fun()
      }else{           
        Emissive_else_Fun()       
      }
    }) 
    const HDRI_fn = async () => {
      await new Promise(resolve => setTimeout(() => {
        delta = clock.getDelta();
        scene.environment = hdri1;           
        slider_HDRI.oninput = function() {          
          renderer.toneMappingExposure=this.value;                     
        }    
        resolve();
      }, 10));
    }; 
    async function HDRI_Fun() {                                      
      const spinnedFn = useSpinner(HDRI_fn, {
       container: container_3d
     });      
     // execute with a loading spinner
     await spinnedFn();
     console.log("HDRI loaded",delta.toPrecision(1),"seconds")
   }    
   const HDRI_Else_fn = async () => {
    await new Promise(resolve => setTimeout(() => {
      scene.environment = hdri0;
      localStorage.HDRI="false"
      resolve();
    }, 10));
  }; 
  async function HDRI_Else_Fun() {                                      
    const spinnedFn = useSpinner(HDRI_Else_fn, {
     container: container_3d
   });      
   // execute with a loading spinner
   await spinnedFn();
  }    
 // HDRI_Fun();

  stateList.HDRI.addEventListener("change",(e)=>{
    if(e.target.checked){
      HDRI_Fun()
    }else{
      HDRI_Else_Fun()
    }
  })            
  


}
export { lightControls };
