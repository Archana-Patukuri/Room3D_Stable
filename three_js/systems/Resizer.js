
const setSize = function (container, camera, renderer, composer) {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  let val = 1;

  //If Android/iPhone, Reduce the Pixel ratio for the performance
  if (/Android|iPhone/i.test(navigator.userAgent)) {
    val = 0.5;
    // loadingText.innerHTML = `mobiledevice`;
  }

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio * val);

  composer.setSize(container.clientWidth, container.clientHeight);
  composer.setPixelRatio(window.devicePixelRatio * val);

 // effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight )
};

class Resizer {
  constructor(container, camera, renderer, composer,labelRenderer,postprocessing) {
    // set initial size
    setSize(container, camera, renderer, composer);

    window.addEventListener("resize", () => {
      // set the size again if a resize occurs
      setSize(container, camera, renderer, composer);
      /* console.log(container.clientWidth);
      console.log(container.clientHeight);     */  
      // perform any custom actions   
    });
  }
}

export { Resizer };
