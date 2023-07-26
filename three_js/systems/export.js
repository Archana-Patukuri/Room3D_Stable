import axios from 'axios';
import { GLTFExporter } from '../../node_modules/three/examples/jsm/exporters/GLTFExporter.js';

function exportScene(scene) {
    const params = {
        trs: true,
        binary: true,
        maxTextureSize: 4096,
    };

    // Define the Flask server URL
    const flaskURL = 'http://139.84.136.67:5000'; // Replace with your Flask server URL    

    // Click event listener for the export button
    const exportButton = document.getElementById("Export");
    exportButton.addEventListener("click", function () {
        const emailInput = document.getElementById("exampleInputEmail1");
        const email = emailInput.value.trim();

        if (email === "") {
            console.log("Email is required");
            return;
        }   
        
        // Export the scene with the provided email
        exportSceneFun(scene, email); 
        alert("Started rendering, check email after some time")
        /* let renderUI=document.getElementById("renderUI")
        email=""     
        renderUI.style.display="none" */
    });

    function exportSceneFun(scene, email) {
        const exporter = new GLTFExporter();
        const options = {
            trs: params.trs,
            binary: params.binary,
            maxTextureSize: params.maxTextureSize,
        };

        exporter.parse(
            scene,
            function (result) {
                if (result instanceof ArrayBuffer) {
                    const fileName = `${email}.glb`; // Use email as the file name

                    // Convert the ArrayBuffer to a Blob
                    const glbBlob = new Blob([result], { type: 'model/gltf-binary' });

                    // Create a FormData object to send the file to the server
                    const formData = new FormData();
                    formData.append('email', email);
                    formData.append('glbData', glbBlob, fileName);

                    // Send the GLB data to the server using Axios
                    axios.post(`${flaskURL}/upload_glb`, formData)
                        .then(function (response) {
                            console.log(response.data);                            
                        })
                        .catch(function (error) {
                            console.log("An error happened while uploading GLB");
                            console.error(error);
                        });
                } else {
                    // Handle if the result is not an ArrayBuffer (JSON format)
                    console.log("JSON format not supported for upload");
                }
            },
            function (error) {
                console.log("An error happened during GLTF export");
            },
            options
        );
        // return 1
    }
}

export { exportScene };