/*
    Doodle Jump Game - JavaScript Implementation
    Developed by: RSK World
    Founder: Molla Samser
    Designer & Tester: Rima Khatun
    Website: https://rskworld.in
    Contact: +91 93305 39277 | hello@rskworld.in
    Location: Nutanhat, Mongolkote, Purba Burdwan, West Bengal, India
    License: Free for educational and commercial use
    Copyright 2026 RSK World. All rights reserved.
*/

//board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

//doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth/2 - doodlerWidth/2;
let doodlerY = boardHeight*7/8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler = {
    img : null,
    x : doodlerX,
    y : doodlerY,
    width : doodlerWidth,
    height : doodlerHeight
}

//physics
let velocityX = 0; 
let velocityY = 0;
let initialVelocityY = -8;
let gravity = 0.4;

//sound system
let soundEnabled = true;
let sounds = {
    background: null,
    jump: null,
    gameOver: null,
    score: null
};

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let maxScore = 0;
let gameOver = false;

function initializeSounds() {
    // Load all sound files
    sounds.background = new Audio("./assets/Sound/bg.mp3");
    sounds.jump = new Audio("./assets/Sound/shot 1.wav");
    sounds.gameOver = new Audio("./assets/Sound/explosion.wav");
    sounds.score = new Audio("./assets/Sound/hit.wav");
    
    // Configure background music
    sounds.background.loop = true;
    sounds.background.volume = 0.3;
    
    // Configure sound effects
    sounds.jump.volume = 0.5;
    sounds.gameOver.volume = 0.6;
    sounds.score.volume = 0.4;
    
    // Start background music
    if (soundEnabled) {
        sounds.background.play().catch(e => console.log("Background music play failed:", e));
    }
}

function playSound(soundName) {
    if (soundEnabled && sounds[soundName]) {
        sounds[soundName].currentTime = 0;
        sounds[soundName].play().catch(e => console.log("Sound play failed:", e));
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
        sounds.background.play().catch(e => console.log("Background music play failed:", e));
    } else {
        sounds.background.pause();
    }
    return soundEnabled;
}

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    doodlerRightImg = new Image();
    doodlerRightImg.src = "./assets/doodler-right.png";
    doodler.img = doodlerRightImg;
    doodlerRightImg.onload = function() {
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    }

    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "./assets/doodler-left.png";

    platformImg = new Image();
    platformImg.src = "./assets/platform.png";

    // Initialize sounds
    initializeSounds();

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);
    
    // Add sound toggle functionality
    const soundToggleBtn = document.getElementById("soundToggle");
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener("click", function() {
            const isEnabled = toggleSound();
            this.textContent = isEnabled ? "Sound: ON" : "Sound: OFF";
            this.className = isEnabled ? "sound-btn" : "sound-btn sound-off";
        });
    }
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //doodler
    doodler.x += velocityX;
    if (doodler.x > boardWidth) {
        doodler.x = 0;
    }
    else if (doodler.x + doodler.width < 0) {
        doodler.x = boardWidth;
    }

    velocityY += gravity;
    doodler.y += velocityY;
    if (doodler.y > board.height) {
        gameOver = true;
        playSound("gameOver"); // Play game over sound effect
    }
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    //platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && doodler.y < boardHeight*3/4) {
            platform.y -= initialVelocityY; //slide platform down
        }
        if (detectCollision(doodler, platform) && velocityY >= 0) {
            velocityY = initialVelocityY; //jump
            playSound("jump"); // Play jump sound effect
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    // clear platforms and add new platform
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift(); //removes first element from the array
        newPlatform(); //replace with new platform on top
    }

    //score
    updateScore();
    context.fillStyle = "#537188";
    context.font = "20px 'Cedarville Cursive', cursive";
    context.fillText("Score:", 5, 35);
    context.fillText(score, 70, 35);

    if (gameOver) {
        context.fillStyle = "#537188";
        context.font = "22px 'Cedarville Cursive', cursive";
        context.fillText("Your Score is ", 80, 300);
        context.fillText(score, 240, 300);
        context.fillText("Game Over: Press 'Space' to Restart", 10, 330);
    }
}

function moveDoodler(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") { //move right
        velocityX = 4;
        doodler.img = doodlerRightImg;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") { //move left
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    }
    else if (e.code == "Space" && gameOver) {
        //reset
        doodler = {
            img : doodlerRightImg,
            x : doodlerX,
            y : doodlerY,
            width : doodlerWidth,
            height : doodlerHeight
        }

        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();
    }
}

function placePlatforms() {
    platformArray = [];

    //starting platforms
    let platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth*3/4);
        let platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platformWidth,
            height : platformHeight
        }
    
        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth*3/4);
    let platform = {
        img : platformImg,
        x : randomX,
        y : -platformHeight,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left doesn't reach b's top right 
           a.x + a.width > b.x &&   //a's top right passes b's top left 
           a.y < b.y + b.height &&  //a's top left doesn't reach b's bottom left 
           a.y + a.height > b.y;    //a's bottom left passes b's top left 
}

function updateScore() {
    let points = Math.floor(50*Math.random()); //(0-1) *50 --> (0-50)
    if (velocityY < 0) { //negative going up
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
            playSound("score"); // Play score sound effect when earning points
        }
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}