document.addEventListener("DOMContentLoaded", function () {
    const enterButton = document.getElementById("enterButton");
    const startScreen = document.querySelector(".computerScreen.start");
    const endScreen = document.querySelector(".computerScreen.end");
    const stormDiv = document.querySelector(".storm");
    const videoElement = document.getElementById("randomVideo");

    const videos = [
        "videos/jodi1.mp4",
        "videos/jodi2.mp4",
        "videos/ascii.mp4",
        "videos/chavenkids.mp4",
        "videos/oliailalina.mp4",
        "videos/mouchette.mp4"
    ];

    function getRandomVideo() {
        return videos[Math.floor(Math.random() * videos.length)];
    }

    function resetExperience() {   
        endScreen.classList.add("transitionInEnd");
 
        setTimeout(() => {
            videoElement.pause();
            videoElement.currentTime = 0;
            videoElement.src = ""; 
            videoElement.style.opacity = "0";
    
            stormDiv.style.display = "none";
            videoElement.style.display = "none";
    
            endScreen.classList.remove("transitionInEnd");
            endScreen.style.opacity = "0";
            endScreen.style.visibility = "hidden";
    
            startScreen.style.opacity = "1";
            startScreen.style.visibility = "visible";
    
            enterButton.classList.remove("hideButton");
            enterButton.style.opacity = "1";
            enterButton.style.visibility = "visible";
            enterButton.style.transform = "translate(-50%, -50%) scale(1)";
            console.log("position reset");


    
            startScreen.classList.remove("transitionIn");
        }, 2000);
    }
    
    enterButton.addEventListener("click", function () {
        enterButton.classList.add("hideButton");

        setTimeout(() => {
            startScreen.classList.add("transitionIn");

            videoElement.src = getRandomVideo();
            videoElement.load(); 
            stormDiv.style.display = "block";
            videoElement.style.display = "block";

            setTimeout(() => {
                videoElement.style.opacity = "1";
                videoElement.play();
            }, 100);
        }, 200);
    });

    videoElement.addEventListener("ended", function () {
        stormDiv.style.display = "none";
        endScreen.style.display = "flex";
        endScreen.style.opacity = "1";
        resetExperience();
    });

    
});
