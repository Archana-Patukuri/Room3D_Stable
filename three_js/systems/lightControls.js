import 'use-spinner/assets/use-spinner.css';
import  hdriLoad  from "../components/hdri_loader/hdri_loader.js";
import * as THREE from 'three';
import elementFromHtmlString from '../utils/elementFromHtmlString';
import { Color } from 'three';
async function lightControls(
  scene,
  renderer,
  prompt,
  sunLight,
  ambientLight,
  camera,
  clock,
  stateList,
  gui,
  lightState,
  ceilingLight,
  wallWasherLightArray
) {
  // const lightState = new LightStore();
  const { background0,hdri0,hdri1 } = await hdriLoad(); 

  const controlsArray = [
    'pitchDark',
    'ceilingLight',
    'DesktopLight',
    'sunLight',
    'ambientLight',
    'wallWasherLight',
    'hdri',
  ];

  const LightControlsArray = [
    {
      id: 'pitchDark',
      innerText: 'Pitch Dark',
      helper: null,
      distance: null,
      decay: null,
      color: null,
      intensity: null,
      light: null,
    },
    {
      id: 'ceilingLight',
      innerText: 'Cieling Light',
      helper: true,
      distance: 4,
      decay: 2,
      color: '#ffffff',
      intensity: 50,
      light: ceilingLight,
    },
    {
      id: 'desktopLight',
      innerText: 'Desktop Light',
      helper: true,
      distance: 4,
      decay: 2,
      color: '#ffffff',
      intensity: 15,
      light: scene.getObjectByName('Desktop_Lamp_Light002'),
    },
    {
      id: 'wallWasherLight',
      innerText: 'Wall Washer Light',
      helper: true,
      distance: 1,
      decay: 2,
      color: '#ffffff',
      intensity: 2,
      light: wallWasherLightArray,
    },
    {
      id: 'sunLight',
      innerText: 'Sun Light',
      helper: true,
      distance: null,
      decay: null,
      color: '#ffffff',
      intensity: 30,
      light: sunLight,
    },
    {
      id: 'ambientLight',
      innerText: 'Ambient Light',
      helper: null,
      distance: null,
      decay: null,
      color: '#ffffff',
      intensity: 1,
      light: ambientLight,
    },    
    {
      id: 'hdri',
      innerText: 'HDRI',
      helper: null,
      distance: null,
      decay: null,
      color: null,
      intensity: 0.5,
      light: null,
    },
  ];

  const htmlArray = LightControlsArray.map((item) =>
    elementFromHtmlString(`
    <div calss="d-flex lightSettingContainer" style="display:flex; align-items:center; width:100%; gap:10px;">
      <div class="d-flex flex-row ml-0" style="display:flex; align-items:center; width:50%" >
        <label for="${
          item.id
        }" style="display:flex; align-items:center; gap:5px" >
          <input type="checkbox" width="24px" height="24px" data-type="${
            item.id
          }" name="lights" style="transform:scale(1.5)" class="lightActiveCheckbox" />
          ${item.innerText}
        </label>
      </div>
      ${
        item.intensity
          ? `
          <div class="slidecontainer" style=" width:25%">
          <input type="range" data-type="${item.id}" min="0" max="10" value="3" step="0.1"
          class="slider Slider_range intensity_slider" />
          </div>
      `
          : ''
      }
      ${
        item.color
          ? `
      <div class="colorPickerContainer" style="margin-left: 6px;">
        <input type="color" data-type="${item.id}" class="colorPicker" name="colorPicker"
        value="${item.color}" style="border:none;height: 20px;">
      </div>`
          : ''
      }
            
    </div>
  `
  )
  
  );
  const htmlArray1 = LightControlsArray.map((item) =>
  elementFromHtmlString(`
  <div calss="d-flex lightSettingContainer" style="display:flex; align-items:center; width:100%; gap:10px;">
    <div class="d-flex flex-row ml-0" style="display:flex; align-items:center; width:25%" >
      <label for="${
        item.id
      }" style="display:flex; align-items:center;gap:5px" >
        <input type="checkbox" width="24px" height="24px" data-type="${
          item.id
        }" name="lights" style="transform:scale(1.5)" class="lightActiveCheckbox" />
        ${item.innerText}
      </label>
    </div>
    ${
      item.intensity
        ? `
        <div class="slidecontainer">
        <input type="range" data-type="${item.id}" min="0" max="10" value="3" step="0.1"
        class="slider Slider_range intensity_slider" style="width:70px"/>
        </div>
    `
        : ''
    }
    ${
      item.color
        ? `
    <div class="colorPickerContainer" >
      <input type="color" data-type="${item.id}" class="colorPicker" name="colorPicker"
      value="${item.color}" style="border:none;height: 20px;width:30px">
    </div>`
        : ''
    }
    ${
      item.helper
        ? `
    <input type="radio" data-type="${item.id}" value="${item.helper}" name="helper"
    class="largerCheckbox helpers_controls">
    `
        : ''
    }
    ${
      item.distance
        ? `
    <input type="number" data-type="${item.id}" class="distance_class" name="distance_class" 
    value="${item.distance}" min="0" max="10" step="0.1"  style="width: 30px;height: 20px;">
    `
        : ''

    }
    ${
      item.decay
        ? `
    <input type="number" data-type="${item.id}" class="decay_class" name="decay_class" value="${item.decay}" min="0" max="10"
      step="0.1" style="width: 30px;height: 20px;">
      `
        : ''
    }      
  </div>
`
)

);
  // console.log(htmlArray);

  const controlsContianer = document.querySelector('.initialControlsContainer');

  htmlArray.forEach((item) => {    
    controlsContianer.appendChild(item);
  });

  const controlsContianer1 = document.querySelector('.initialControlsContainer1');

  htmlArray1.forEach((item) => {    
    controlsContianer1.appendChild(item);
  });

  const checkboxArray = document.querySelectorAll('.lightActiveCheckbox');
  const intensitySliderArray = document.querySelectorAll('.intensity_slider');  
  let colorPickerArray=document.querySelectorAll(".colorPicker")
  let distanceArray=document.querySelectorAll(".distance_class")
  let decayArray=document.querySelectorAll(".decay_class")
  let helpersArray=document.querySelectorAll(".helpers_controls");

  checkboxArray.forEach((checkbox) => {
    checkbox.addEventListener('change', (e) => {
      // console.time('toggler Checkbox');
      // console.log(e.target.dataset.type);
      if (e.target.dataset.type === 'pitchDark') {
        LightControlsArray.forEach((item) => {
          if (item.light) {
            if (item.light.length) {
              item.light.forEach((light) => {
                light.intensity = 0;
              });
            } else {
              item.light.intensity = 0;
            }
            renderer.toneMappingExposure = 0.1;
            renderer.needsUpdate = true;
            // console.log(item.light);
          }
        });

        return;
      }

      const lightToChangeData = LightControlsArray.find(
        (i) => i.id === e.target.dataset.type
      );
       
      const lightToChange = lightToChangeData.light;
      if (lightToChangeData.intensity && lightToChange) {
        // console.log(lightToChange);
        if (lightToChange.length) {
          // console.log('here');          
          lightToChange.forEach((item) => {
            item.intensity = e.target.checked ? lightToChangeData.intensity : 0;            
          });
        } else {
          lightToChange.intensity = e.target.checked
            ? lightToChangeData.intensity
            : 0;                                       
        }
        scene.environment=hdri0
      }
      if(lightToChangeData.id=="hdri"){
        scene.environment=hdri1        
      }  
      // console.log(lightToChange);
      // console.log(LightControlsArray);
      console.timeEnd('toggler Checkbox');
    });
  });

  intensitySliderArray.forEach((slider) => {
    slider.addEventListener('input', (e) => {      
      const lightToChangeData = LightControlsArray.find(
        (i) => i.id === e.target.dataset.type
      );
      const lightToChange = lightToChangeData.light;

      if (lightToChangeData.intensity && e.target.dataset.type === 'hdri') {        
        renderer.toneMappingExposure = e.target.value * 0.1;
        renderer.needsUpdate = true;
      }
      if (lightToChangeData.intensity && lightToChange) {
        if (lightToChange.length) {
          lightToChange.forEach((item) => {
            item.intensity = e.target.value;
          });
        } else {
          lightToChange.intensity = e.target.value;
        }
      }
      
    });    
    
  });
  
  colorPickerArray.forEach((colorPicker) => {
    colorPicker.addEventListener('input', (e) => {      
      const lightToChangeData = LightControlsArray.find(
        (i) => i.id === e.target.dataset.type
      );
      const lightToChange = lightToChangeData.light;      
      if (lightToChangeData.color && lightToChange) {
        if (lightToChange.length) {
          lightToChange.forEach((item) => {
            item.color = new Color(e.target.value);
          });
        } else {
          lightToChange.color = new Color(e.target.value);
        }
      }
    });
  });
  helpersArray.forEach((helpers_controls) => {
    helpers_controls.addEventListener('input', (e) => {      
      const lightToChangeData = LightControlsArray.find(
        (i) => i.id === e.target.dataset.type
      );
      const lightToChange = lightToChangeData.light;      
      if (lightToChangeData.helper && lightToChange) {        
        scene.traverse(function(child){
          if(child.name=="helper"){            
            scene.remove(child);
          }
        })
        if (lightToChange.length) {
          lightToChange.forEach((item) => {            
            const helper = new THREE.SpotLightHelper( item ); 
            helper.name="helper"
            scene.add( helper ); 
          });
        } else {          
          let helper;
          if(lightToChange.type=="SpotLight"){
           helper = new THREE.SpotLightHelper( lightToChange );  
           helper.name="helper"                    
          }else if(lightToChange.type=="PointLight"){
            helper= new THREE.PointLightHelper( lightToChange, 1 ); 
            helper.name="helper"
          }else{
            helper = new THREE.DirectionalLightHelper( lightToChange,1,0xFF0000 );
            helper.name="helper"
          }
          scene.add( helper );          
        }
      }
    });
  });
  distanceArray.forEach((distance_class) => {
    distance_class.addEventListener('input', (e) => {      
      const lightToChangeData = LightControlsArray.find(
        (i) => i.id === e.target.dataset.type
      );
      const lightToChange = lightToChangeData.light;      
      if (lightToChangeData.distance && lightToChange) {
        if (lightToChange.length) {
          lightToChange.forEach((item) => {
            item.distance = e.target.value;
          });
        } else {
          lightToChange.distance = e.target.value;
        }
      }
    });
  });
  decayArray.forEach((decay_class) => {
    decay_class.addEventListener('input', (e) => {      
      const lightToChangeData = LightControlsArray.find(
        (i) => i.id === e.target.dataset.type
      );
      const lightToChange = lightToChangeData.light;      
      if (lightToChangeData.decay && lightToChange) {
        if (lightToChange.length) {
          lightToChange.forEach((item) => {
            item.decay = e.target.value;
          });
        } else {
          lightToChange.decay = e.target.value;
        }
      }
    });
  });

}
export { lightControls };