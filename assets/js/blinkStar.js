/**
 * Background star functions
 */

// Asset URLs are resolved relative to this file (/assets/js/)
const star0 = new URL("../images/stars/star0.png", import.meta.url).href;
const star1 = new URL("../images/stars/star1.png", import.meta.url).href;
const star2 = new URL("../images/stars/star2.png", import.meta.url).href;
const star3 = new URL("../images/stars/star3.png", import.meta.url).href;
const star4 = new URL("../images/stars/star4.png", import.meta.url).href;

// Create the default blinking star
async function initalizeStars() {

    // Time interval to spawn a star (milliseconds)
    const time = 300;
    const starArray = [star0, star1, star2, star3, star4, star4, star3, star2, star1, star0];
    const defaultStar = new Image();
    defaultStar.className = "star";
    defaultStar.style.width = (window.innerHeight/20).toString()+"px";
    defaultStar.style.height = defaultStar.style.width;
    setInterval(() => {
        animateStar(defaultStar, starArray)
    }, time)
}

// Copies from default star, places on random spot on screen then animates
async function animateStar(star, frames) {
    // Create Star
    const currentStar = star.cloneNode(true);
    let position = 0;
    let totalRotate = 0;
    const time = 150;
    let rotateMult = Math.random()*5;
    currentStar.style.top = (Math.random() * 100).toString()+"%";
    currentStar.style.left = (Math.random() * 100).toString()+"%";
    if (Math.random() < 0.5) {
        rotateMult = -1*rotateMult;
    }
    document.body.appendChild(currentStar);

    // Animate Star
    let newInterval = setInterval(() => {
        if (position >= 10) {
            currentStar.style.visibility = "hidden";
        } 
        else if (position === 0) {
            currentStar.style.visibility = "visible";
            currentStar.src = frames[position];
        }
        else {
            currentStar.src = frames[position];
        }
        totalRotate += rotateMult;
        currentStar.style.transform = "rotate("+(totalRotate).toString()+"deg)";
        position += 1;
    }, time)

    // Delete Star
    setTimeout( ()=> {
        clearInterval(newInterval);
        document.body.removeChild(currentStar);
    }, time*12)   
}

export default initalizeStars;