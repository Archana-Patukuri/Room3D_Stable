import {GLTFExporter} from '../../node_modules/three/examples/jsm/exporters/GLTFExporter.js';
const params = {
    trs: true,
    binary: false,
    maxTextureSize: 4096,
  }; 
function exportScene(scene){     
     let Export=document.getElementById("Export");
     Export.onclick=function(){                
       exportGLTF(scene);
     } 
    function exportGLTF( input ) {
        const exporter = new GLTFExporter();
        const options = {
         trs: params.trs,
         binary: params.binary,
         maxTextureSize: params.maxTextureSize
       };
        exporter.parse(
         input,
         function ( result ) {     
           if ( result instanceof ArrayBuffer ) {     
             saveArrayBuffer( result, 'scene.glb' );                 
           }else {    
             const output = JSON.stringify( result, null, 2 );         
             saveString( output, 'scene.gltf' );     
           }
         },        
         function ( error ) {       
           console.log( 'An error happened' );       
         },options
         
       );
        }     
        const link = document.createElement( 'a' );
           link.style.display = 'none';
           document.body.appendChild( link ); 
     
       function save( blob, filename ) {     
             link.href = URL.createObjectURL( blob );
             link.download = filename;
             link.click();     
       }
       function saveString( text, filename ) {     
         save( new Blob( [ text ], { type: 'text/plain' } ), filename );     
       }
     
       function saveArrayBuffer( buffer, filename ) {     
         save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );     
       } 
}
export {exportScene};