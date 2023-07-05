import NS1Assets from "../dataBase/NS1Assets.json" assert {type:"json"};
import intial_Shadow_Assets from "../dataBase/intial_shadows.json" assert {type:"json"};
import useSpinner from '../../use-spinner';
import '../../use-spinner/assets/use-spinner.css';
let container_3d=document.getElementById("3dcontainer");
var delta;
let receiversArrIn,castersArrIn, castersArrNSL1, receiversArrNSL1, castersArrNSL2, receiversArrNSL2;                                  
        
receiversArrNSL1=NS1Assets.receivers;
castersArrNSL1=NS1Assets.casters; 
receiversArrIn=intial_Shadow_Assets.receivers;        
castersArrIn=intial_Shadow_Assets.casters;  

let nls2=castersArrNSL1.length,nls3=receiversArrNSL1.length;
let Is3=receiversArrIn.length;   
let Is3_2=castersArrIn.length;  
function shadows(scene,clock,shadowLight) {              
       let n=[]
        scene.traverse(function (child) {              
          if (child.isMesh) {                        
            n.push(child)                          
          }   
        });             
        
        //SUN LIGHT
        const Shadows_SunLightOn_fn = async () => {
          await new Promise(resolve => setTimeout(() => {                                                                
                scene.traverse(function (child) {              
                if (child.isMesh) {
                  child.castShadow = true; 
                  child.receiveShadow = true;                               
                }      
              });                                                                             
            resolve();
          }, 10));
        }; 
        async function Shadows_SunLightOn() {                                      
          const spinnedFn = useSpinner(Shadows_SunLightOn_fn, {
           container: container_3d
         });      
         // execute with a loading spinner
         await spinnedFn();                 
       }               
        const Shadows_SunLightOf_fn = async () => {
          await new Promise(resolve => setTimeout(() => {                     
              scene.traverse(function (child) {              
                if (child.isMesh) {
                  child.castShadow = false; 
                  child.receiveShadow = false;                               
                }      
              });    
            resolve();
          }, 10));
        }; 
        async function Shadows_SunLightOf() {                                      
          const spinnedFn = useSpinner(Shadows_SunLightOf_fn, {
           container: container_3d
         });      
         // execute with a loading spinner
         await spinnedFn();
//         console.log("shadows sunlight turned off",delta.toPrecision(1),"seconds")
       }            
       
    let Shadows_SunLight=document.getElementById("Shadows_SunLight");
    Shadows_SunLight.addEventListener("change",(e)=>{
        if(e.target.checked){               
          Shadows_SunLightOn();          
        }else{                         
          Shadows_SunLightOf();          
        }
      })

      //NIGHT LIGHT 1
      const Shadows_NightLight1On_fn = async () => {        
        await new Promise(resolve => setTimeout(() => {                 
           for(let j=0;j<n.length;j++){                          
           for(let i = 0; i < nls2; i++) {
            if(n[j].name==castersArrNSL1[i]){
              n[j].castShadow=true;              
            }
          }
          for(let i = 0; i < nls3; i++) {
            if(n[j].name==receiversArrNSL1[i]){
              n[j].receiveShadow=true;                                  
            }    
          } 
        }                      
          resolve();
        }, 10));
      }; 
      async function Shadows_NightLight1On() {                                      
        const spinnedFn = useSpinner(Shadows_NightLight1On_fn, {
         container: container_3d
       });      
       // execute with a loading spinner
       await spinnedFn();       
     }    
     
     const Shadows_NightLight1Of_fn = async () => {
      await new Promise(resolve => setTimeout(() => {        
        for(let i = 0; i < nls3; i++) {
          for(let j=0;j<n.length;j++){            
            if(n[j].name==receiversArrNSL1[i]){
              n[j].receiveShadow=false;                                          
            }         
          }                  
         } 
        resolve();
      }, 10));
    }; 
    async function Shadows_NightLight1Of() {                                      
      const spinnedFn = useSpinner(Shadows_NightLight1Of_fn, {
       container: container_3d
     });      
     // execute with a loading spinner
     await spinnedFn();     
   }    
   let Shadows_NightLight1=document.getElementById("Shadows_NightLight1");
    Shadows_NightLight1.addEventListener("change",(e)=>{
      if(e.target.checked){     
        Shadows_NightLight1On();
      }else{                         
        Shadows_NightLight1Of();                  
      }
  })         
  
function intial_shadowsOn(){  
  for(let j=0;j<n.length;j++){                          
    for(let i = 0; i < Is3_2; i++) {
     if(n[j].name==castersArrIn[i]){
       n[j].castShadow=true;              
     }
   }
   for(let i = 0; i < Is3; i++) {
     if(n[j].name==receiversArrIn[i]){
       n[j].receiveShadow=true;                               
     }    
   } 
 }    
}
function intial_shadowsOf(){
  for(let i = 0; i < Is3_2; i++) {
    for(let j=0;j<n.length;j++){            
      if(n[j].name==receiversArrIn[i]){
        n[j].receiveShadow=false;                                          
      }         
    }                  
   } 
}
 let intial_shadows=document.getElementById('intial_shadows');
 intial_shadows.addEventListener("change",(e)=>{
  if(e.target.checked){     
    intial_shadowsOn();   
  }else{                         
    intial_shadowsOf();
              
  }
}) 

 if(shadowLight==0){ 
  Shadows_SunLightOn();   
 }else if(shadowLight==1){
  Shadows_NightLight1On();  
 }else{  
  intial_shadowsOn(); 
 }
}

export { shadows };