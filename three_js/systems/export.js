import axios from 'axios';
import { GLTFExporter } from '../../node_modules/three/examples/jsm/exporters/GLTFExporter.js';

function exportScene(scene) {
    const params = {
        trs: true,
        binary: true,
        maxTextureSize: 4096,
    };

    // Define the Flask server URL
    const flaskURL = 'http://127.0.0.1:5000'; // Replace with your Flask server URL

    // Get the render button element
    const renderButton = document.getElementById("RenderButton");

    // Add a click event listener to the render button
    renderButton.addEventListener("click", function () {
        // Get the email input value
        const emailInput = document.getElementById("exampleInputEmail1");
        const email = emailInput.value.trim();

        if (email === "") {
            console.log("Email is required");
            return;
        }

        // Remove the word after @ from the email address
        const emailWithoutDomain = email.split("@")[0];

        // Make an HTTP POST request to trigger the Flask code
        axios.post(`${flaskURL}/send_email`, { email: emailWithoutDomain })
            .then(function (response) {
                console.log(response.data);
                // Export the scene
                exportSceneFun(scene, emailWithoutDomain);
            })
            .catch(function (error) {
                console.log("An error happened");
                console.error(error);
            });
    });

    // Click event listener for the export button
    const exportButton = document.getElementById("Export");
    exportButton.addEventListener("click", function () {
        const emailInput = document.getElementById("exampleInputEmail1");
        const email = emailInput.value.trim();

        if (email === "") {
            console.log("Email is required");
            return;
        }

        // Remove the word after @ from the email address
        const emailWithoutDomain = email.split("@")[0];

        // Export the scene with the provided email
        exportSceneFun(scene, emailWithoutDomain);
        exportButton.style.display="none"
        renderButton.style.display="block"
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
                    saveArrayBuffer(result, fileName);
                } else {
                    const output = JSON.stringify(result, null, 2);
                    const fileName = `${email}.gltf`; // Use email as the file name
                    saveString(output, fileName);
                }
            },
            function (error) {
                console.log("An error happened");
            },
            options
        );

        const link = document.createElement("a");
        link.style.display = "none";
        document.body.appendChild(link);

        function save(blob, filename) {
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        }

        function saveString(text, filename) {
            save(new Blob([text], { type: "text/plain" }), filename);
        }

        function saveArrayBuffer(buffer, filename) {
            save(new Blob([buffer], { type: "application/octet-stream" }), filename);
        }
    }
}

export { exportScene };
