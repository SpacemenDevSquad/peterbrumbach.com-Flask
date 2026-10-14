/**
 * Created 2025
 * Peter Brumbach
 * 
 * Adds a looping background song to html page using specified url
 * Can be toggled/paused using onscreen button
 */

// Asset URLs are resolved relative to this file (/assets/js/)
const volume0 = new URL("../images/volume/volume0.webp", import.meta.url).href;
const volume1 = new URL("../images/volume/volume1.webp", import.meta.url).href;
const blipSelectURL = new URL("../sfx/blipSelect.wav", import.meta.url).href;

async function audioButtonMain(url) {
    // Inital Functions
    makeAudioButton();
    let makeLooper = initalizeLooper(url);


    // Resize elements when window size is changed
    window.addEventListener("resize", makeAudioButton);

    // Adds hover listeners to audio button
    document.getElementById("musicButton").addEventListener("mouseover", audioButtonHover);
    document.getElementById("musicButton").addEventListener("mouseout", makeAudioButton);

    // Creates audio looper, must wait
    await makeLooper;

    // Starts audio when screen is clicked
    document.addEventListener("click", firstPlay);

    // Adds click listener to audio button
    document.getElementById("musicButton").addEventListener("click", playAudio);
}

/**
 * Audio Related actions and Audio Button
 */
let audioLoop = null;
let startTime = 0.0;
let audioTime = 0.0;
let audioContext = null;
let audioBuffer = null;

// Create the audioContext and audioBuffer objects
async function initalizeLooper(url) {
    audioContext = new(window.AudioContext || window.webkitAudioContext);

    // Fetch Audio
    const source = await fetch(url);
    const arrayBuffer = await source.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
}

// Create audio loop
function loopPlay() {
    // Create volume control
    let gainNode = audioContext.createGain();
    gainNode.gain.value = 0.3;
    gainNode.connect(audioContext.destination)

    // Create audioLoop
    if (audioLoop !== null) {
        audioLoop.stop()
    }
    audioLoop = audioContext.createBufferSource();
    audioLoop.loop = true;
    audioLoop.buffer = audioBuffer;
    audioLoop.connect(gainNode);
    audioLoop.start(0, audioTime % audioBuffer.duration);
    startTime = audioContext.currentTime;
}

async function firstPlay() {
    // Start audio when user clicks the screen
    const button = document.getElementById("musicButton");
    button.querySelector("img").src = volume0;
    loopPlay();
    document.removeEventListener("click", firstPlay);
    console.clear();
    console.log("Audio Currently Enabled")
}

async function playAudio() {
    // Toggleable audio with provided button
    const button = document.getElementById("musicButton");
    if (audioLoop === null) {
        await loopPlay();
        button.querySelector("img").src = volume0;
    } else {
        audioTime += (audioContext.currentTime - startTime) % audioBuffer.duration;
        audioLoop.stop();
        audioLoop = null;
        button.querySelector("img").src = volume1;
    }
}

async function audioButtonHover() {
    // Changes audio button when cursor hovers over
    const hoverAudio = new Audio(blipSelectURL);
    hoverAudio.volume = 0.05;
    try {
        await hoverAudio.play(); 
    } catch {
        console.log("Audio Currently Disabled")
    }
    const audioButton = document.getElementById("musicButton");
    if (window.innerHeight < window.innerWidth) {
        audioButton.style.height = (window.innerHeight/9).toString()+"px";
    } else {
        audioButton.style.height = (window.innerWidth/9).toString()+"px";
    }
    audioButton.style.right = (window.innerHeight*0.03 - (window.innerHeight/9 - window.innerHeight/10)/2)+'px';
    audioButton.style.top = audioButton.style.right;
    audioButton.style.width = audioButton.style.height;
}

async function makeAudioButton() {
    // Resizes the audio buutton to fit the screen
    const audioButton = document.getElementById("musicButton");
    if (window.innerHeight < window.innerWidth) {
        audioButton.style.height = (window.innerHeight/10).toString()+"px";
    } else {
        audioButton.style.height = (window.innerWidth/10).toString()+"px";
    }
    audioButton.style.right = (window.innerHeight*0.03).toString()+'px';
    audioButton.style.top = audioButton.style.right;
    audioButton.style.width = audioButton.style.height;
}

export default audioButtonMain;