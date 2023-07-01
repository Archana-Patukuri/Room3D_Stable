import { shadows } from "../shadows";
import { Clock } from "three";
const furnitureTypesUI = function (
  assetsList,
  UIContainer,
  category,
  loadModel,
  initialModelID,
  scene,  
  renderer,
  clock
) {
  for (let i = 0; i < assetsList.length; i++) {
    let input = document.createElement("input");

    let spinnerContainer = document.createElement("div");
    spinnerContainer.className =
      "position-absolute top-50 start-50 translate-middle";
    spinnerContainer.id = `spinner${assetsList[i].Name}`;

    let spinner = document.createElement("div");
    spinner.className = "spinner-border text-light";
    spinner.role = "status";

    if (initialModelID == i) {
      input.checked = true;
    }

    input.type = "radio";
    input.value = assetsList[i].URL;
    input.className = "btn-check";
    input.name = category;
    input.id = assetsList[i].Name;
    input.autocomplete = "off";
    input.addEventListener("click", function (event) {
      loadModel(event.target.value, i, spinnerContainer);       
    });

    let label = document.createElement("label");
    label.className = "btn px-0 py-0 position-relative border-2";    
    label.setAttribute("for", assetsList[i].Name);    

    let img = document.createElement("img");
    img.src = assetsList[i].thumbnail;
    img.className = "img-thumbnail p-0 img-max-width-1 thumbnailsHover";
    img.alt = "chair_1";
    img.style.background="#ffffff";
    

    spinnerContainer.appendChild(spinner);

    spinnerContainer.style.display = "none";    
    // spinnerContainer.style.display = "block";

    label.appendChild(img);

    UIContainer.appendChild(input);
    UIContainer.appendChild(label);

    let container_3d=document.getElementById("3dcontainer");        
    //On Click Show the Toast(animation buttons and material variations)
    const liveToast = document.getElementById(`${UIContainer.id}Toast`); 
    
    input.addEventListener("click", function () {      
      let lamp=scene.getObjectByName("Lamp0_Selectable");
      let FlowerPot=scene.getObjectByName("FlowerPot"); 
      let laptop=scene.getObjectByName("Laptop_Selectable");
      let lamp_light=scene.getObjectByName("Desktop_Lamp_Light002");  
      laptop.position.set(0,0.1757,0);                 
      let tableTop=scene.getObjectByName("Table_Top")   
            
      if(input.id.slice(0,9)=="Motarized"){                                      
        tableTop.position.set(0.162, 0.800, 0.344)          
        FlowerPot.position.set(-0.4898,1.01,0.301)
        lamp.position.set(1.16595,-0.2,0.5)        
        lamp_light.position.set(0.9,1.3,0.3)                                   
      }
      if(input.id.slice(0,5)=="Small"){                               
        FlowerPot.position.set(-0.3,1,0.1)        
        lamp.position.set(0.75,-0.185,0.2)
        lamp_light.position.set(0.38,1.3,0);                   
        tableTop.position.set(0.162, 0.80, 0.33)               
      }      
      if(input.id.slice(0,6)=="Manual"){        
        tableTop.position.set(0, 0, 0)        
        FlowerPot.position.set(-0.4898,1.05,0.301)
        lamp.position.set(1.16,-0.15,0.3)        
        lamp_light.position.set(0.9,1.4,0.2)                                        
      }
     /* 
     Table_Automatic_01_v01
Table_Manual_01_v01
Table_Small_01_v01
 */
      liveToast.classList.add("show");
      liveToast.getElementsByClassName("furnitureName")[0].innerHTML =assetsList[i].Name; 
     
        container_3d.appendChild(spinnerContainer);                                 
    });
  }
};

export { furnitureTypesUI };
