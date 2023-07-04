function resetAndHelp(camera){
    let reset=document.getElementById("Reload");
    async function reset_Fun(){
      let myPromise = new Promise(function(resolve) {
        window.location.reload(true);    
      });
      await myPromise;  
    }      
    reset.addEventListener("click",function(){
      reset_Fun()
    })
    async function ResetView_Fun(){
      let myPromise = new Promise(function(resolve) {        
        camera.position.set(0.479,2.165,4.633);                  
      });
      await myPromise;  
    }      
    let ResetView=document.getElementById("reset");
    ResetView.onclick = function() {
      ResetView_Fun()
    }
    document.addEventListener("keydown", onDocumentKeyDown, false);
    async function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 27) {
      ResetView_Fun()
    } 
  }
    async function Help_Fun(){
      let myPromise = new Promise(function(resolve) {
        window.open("../../help.html");   
      });
      await myPromise;  
    }      

    let Help=document.getElementById("Help");
    Help.addEventListener("click",function(){
      Help_Fun()
    })
   
    
}
export {resetAndHelp};