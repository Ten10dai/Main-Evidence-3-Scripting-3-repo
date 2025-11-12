document.addEventListener("DOMContentLoaded", ()=>{
    console.log("Portfolio loaded!");
});

const form = document.getElementById("contactForm");
const formAlert = document.getElementById("formAlert");

if(form){
    form.addEventListener("submit",(e) => {
        e.preventDefault();

        const name =document.getElementById("name");
        const email = document.getElementById("email");
        const message = document.getElementById("message");

        let valid = true;

        [name,email,message].forEach((field)=> {
            if (!field.ariaValueMax.trim()){
                field.classList.add("is-invalid");
                valid=false;
            }
            else{
                field.classList.remove("is-invalid");
            }
        });
        if(valid){
            form.reset();
            formAlert.classList.remove("d-none");
            setTimeout(()=> formAlert.classList.add("d-none"),4000);
        }
    });
}

const soundButtons = document.querySelectorAll(".play-sound");
  let currentAudio = null;
  let currentButton = null;

  function resetButton(btn) {
    if (!btn) return;
    btn.classList.remove("btn-danger");
    btn.classList.add("btn-outline-success");
    btn.textContent = "🔈 Play Sound";
    btn.setAttribute("aria-pressed", "false");
  }

  function activateButton(btn) {
    if (!btn) return;
    btn.classList.remove("btn-outline-success");
    btn.classList.add("btn-danger");
    btn.textContent = "⏸ Stop";
    btn.setAttribute("aria-pressed", "true");
  }

  soundButtons.forEach((btn) => {
    
    btn.setAttribute("role", "button");
    btn.setAttribute("aria-pressed", "false");

    btn.addEventListener("click", () => {
      const soundSrc = btn.dataset.sound;
      if (!soundSrc) {
        console.warn("play-sound button missing data-sound attribute.", btn);
        return;
      }

      
      if (currentAudio && currentButton === btn) {
        if (!currentAudio.paused) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
        currentAudio = null;
        resetButton(btn);
        currentButton = null;
        return;
      }

      
      if (currentAudio) {
        try {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        } catch (e) {
          console.warn("Error stopping previous audio:", e);
        }
        resetButton(currentButton);
        currentAudio = null;
        currentButton = null;
      }

      
      const audio = new Audio(soundSrc);
      audio.preload = "auto";
      audio.volume = 0.6; 

    
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
    
          console.warn("Audio play was prevented:", err);
        });
      }

      
      activateButton(btn);
      currentAudio = audio;
      currentButton = btn;

      
      audio.addEventListener("ended", () => {
        resetButton(btn);
        currentAudio = null;
        currentButton = null;
      });

      
      audio.addEventListener("pause", () => {
        
        if (audio.currentTime < audio.duration) {
          resetButton(btn);
          currentAudio = null;
          currentButton = null;
        }
      });
    });
  });


  const nativeAudios = document.querySelectorAll("audio");
  nativeAudios.forEach((a) => {
    a.addEventListener("play", () => {
      nativeAudios.forEach((other) => {
        if (other !== a && !other.paused) {
          other.pause();
          other.currentTime = 0;
        }
      });

      
      if (currentAudio && !currentAudio.paused) {
        try {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        } catch (e) {
        }
        resetButton(currentButton);
        currentAudio = null;
        currentButton = null;
      }
    });
  });

 
