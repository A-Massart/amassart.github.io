document.addEventListener("DOMContentLoaded", function () {
    const gameArea = document.getElementById("game-area");
    const candleHealth = document.getElementById("candle-health");
    const scoreDisplay = document.getElementById("time");
    const gameOverScreen = document.getElementById("game-over");
    const waxContainer = document.getElementById("wax-container");
    const halo = document.getElementById("halo");
    const darkCover = document.getElementById("dark-cover");
    const windVideo = document.getElementById("wind-video");
    const wall = document.getElementById("wall");

    let monsters = [];
    let candleLife = 100;
    let score = 0;
    let isGameOver = false;

    const urlList = [
        "https://www.hellenic.org.au/post/let-there-be-light",
        "https://ptiteloi.blogspot.com/2014/02/un-conte-de-lumiere-la-bougie-et-lenfant.html",
        "https://books.google.fr/books?id=Lx-ODwAAQBAJ&pg=PA10&redir_esc=y#v=onepage&q&f=false",
        "https://www.candledelirium.com/blog/the-use-of-candles-in-china/",
        "https://en.wikipedia.org/wiki/History_of_candle_making#",
        "https://www.youtube.com/watch?v=4wddxha-v-w",
        "https://www.youtube.com/watch?v=Y2NVhA6i5kM",
        "https://www.symboliques.fr/symbolique-bougie"
    ];

    function createBlueCircles() {
        const maxCircles = 3;
        const existingCircles = document.querySelectorAll('.blue-circle');
        
        // Remove any existing circles if there are more than the max allowed
        if (existingCircles.length >= maxCircles) {
            existingCircles.forEach(circle => circle.remove());
        }

        // Create new blue circles
        for (let i = 0; i < maxCircles - existingCircles.length; i++) {
            const circle = document.createElement("button");
            circle.classList.add("blue-circle");

            // Position the circle randomly within the game area
            randomPosition(circle);

            // Assign a random link from the predefined list to the circle
            const randomLink = urlList[Math.floor(Math.random() * urlList.length)];
            circle.onclick = () => {
                window.open(randomLink, '_blank');
            };

            // Add the circle to the game area
            gameArea.appendChild(circle);
        }
    }

    function randomPosition(element) {
        let x = Math.random() * (gameArea.clientWidth - element.clientWidth);
        let y = Math.random() * (gameArea.clientHeight - element.clientHeight);
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
    }

    function createCire() {
        const cire = document.createElement("div");
        cire.classList.add("wax");
        waxContainer.appendChild(cire);
        randomPosition(cire);

        cire.addEventListener("mouseover", () => {
            if (!isGameOver) {
                candleLife = Math.min(100, candleLife + 10);
                candleHealth.style.width = `${candleLife}%`;
                cire.remove();
            }
        });
    }

    function createMonster() {
        let monster = document.createElement("div");
        monster.classList.add("monster");
        gameArea.appendChild(monster);
        randomPosition(monster);
        monsters.push(monster);
    }

    function startGame() {
        for (let i = 0; i < 3; i++) createMonster();
        setInterval(createCire, 10000);
        updateScore();
        
        // Wait 10 seconds before the first wind blow
        setTimeout(blowWind, 10000);
    }
    
    function updateScore() {
        if (!isGameOver) {
            score++;
            scoreDisplay.textContent = score;
            candleLife -= 1;
            candleHealth.style.width = `${candleLife}%`;

            if (candleLife <= 0) {
                gameOver();
            }
            setTimeout(updateScore, 1000);
        }
    }

    function gameOver() {
        isGameOver = true;
        gameOverScreen.style.display = "block";
    }

    function blowWind() {
        if (isGameOver) return;
    
        let windDuration = 8000; // Wind blows for 8 seconds
    
        // Define a random wind direction (left, right, top, bottom)
        let windDirections = ["la gauche", "la droite", "le haut", "le bas"];
        let windDirection = windDirections[Math.floor(Math.random() * windDirections.length)];
    
        let windWarning = document.createElement('div');
        windWarning.textContent = `💨 Le vent souffle depuis ${windDirection}. Cachez-vous ! `;
        windWarning.style.position = "absolute";
        windWarning.style.top = "50%";
        windWarning.style.left = "50%";
        windWarning.style.transform = "translate(-50%, -50%)";
        windWarning.style.background = "rgba(255, 255, 255, 0.8)";
        windWarning.style.padding = "10px";
        windWarning.style.borderRadius = "10px";
        windWarning.style.fontSize = "18px";
        windWarning.style.color = "black";
        windWarning.style.zIndex = "10";
        document.body.appendChild(windWarning);

        setTimeout(() => {
    
            // Play wind video
            windVideo.play().catch(error => console.log("Vidéo non jouée :", error));
        
            // Check if the mouse is protected behind the wall
            let windCheck = setInterval(() => {
                let mouseX = halo.getBoundingClientRect().left + halo.clientWidth / 2;
                let mouseY = halo.getBoundingClientRect().top + halo.clientHeight / 2;
                let wallRect = document.getElementById("wall").getBoundingClientRect();
        
                let isProtected = false;
        
                if (windDirection === "la gauche" && mouseX > wallRect.right) isProtected = true;
                if (windDirection === "la droite" && mouseX < wallRect.left) isProtected = true;
                if (windDirection === "le haut" && mouseY > wallRect.bottom) isProtected = true;
                if (windDirection === "le bas" && mouseY < wallRect.top) isProtected = true;
        
                if (isProtected) {
                    console.log("Le joueur est bien caché !");
                } else {
                    console.log("🚨 Game Over ! Pas caché !");
                    gameOver();
                }
            }, 100);
        
            setTimeout(() => {
                clearInterval(windCheck);
                windWarning.remove();
                windVideo.pause();
                windVideo.currentTime = 0;
        
                // Move wall and monsters after the wind
                setTimeout(() => {
                    randomPosition(document.getElementById("wall"));
                    monsters.forEach(monster => randomPosition(monster));
                    createBlueCircles();
                    setTimeout(blowWind, randomWindTime());
                }, 1000);
            }, windDuration);
        }, 3000);
    }
    
    function randomWindTime() {
        return Math.floor(Math.random() * 10000) + 10000;
    }

    document.addEventListener("mousemove", (event) => {
        if (!isGameOver) {
            let x = event.clientX;
            let y = event.clientY;

            halo.style.left = `${x}px`;
            halo.style.top = `${y}px`;

            let haloSize = 80; // Vous pouvez augmenter cette valeur pour un halo plus grand
            darkCover.style.maskImage = 
                `radial-gradient(circle at ${x}px ${y}px, rgba(0,0,0,0) ${haloSize}px, rgba(0,0,0,1) ${haloSize * 3}px)`;
            darkCover.style.webkitMaskImage = 
                `radial-gradient(circle at ${x}px ${y}px, rgba(0,0,0,0) ${haloSize}px, rgba(0,0,0,1) ${haloSize * 3}px)`;
        }

        let playerPos = { x: event.clientX, y: event.clientY };
        monsters.forEach((monster) => {
            let monsterPos = monster.getBoundingClientRect();
            if (
                playerPos.x > monsterPos.left &&
                playerPos.x < monsterPos.right &&
                playerPos.y > monsterPos.top &&
                playerPos.y < monsterPos.bottom
            ) {
                gameOver();
            }
        });
    });

    startGame();
});
