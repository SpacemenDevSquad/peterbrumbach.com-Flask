/**
 * The main method function. Called when the webpage loads, and handles various HTML elements. Calls camera to start render function.
 * Created 2025
 * Peter Brumbach
 */

document.addEventListener("DOMContentLoaded", () => {
    world = new hittableList();
    initalize();
});

// Global Variables
let cam;

// Mutable Camera Variables
let imageWidth = 400;
let pixelSample = 10;
let position = new Vector3(0, 0, 0);
let fov = 90;

// Mutable World Objects
let worldSpheres = {};
let currentSphereNum = 2;

function initalize() {
    // Initalize Sliders

    // FOV Slider
    const fovSlider = document.getElementById("fovSlider");
    const fovText = document.getElementById("fovText");
    const FOV_DEFAULT_VALUE = 90;
    fovSlider.max = 150;
    fovSlider.min = 20;
    fovSlider.value = FOV_DEFAULT_VALUE; 
    fov = FOV_DEFAULT_VALUE;
    fovText.textContent = "Camera FOV: "+FOV_DEFAULT_VALUE.toString();

    // Width Slider
    const widthSlider = document.getElementById("qualitySlider");
    const widthText = document.getElementById("qualityText");
    const WIDTH_DEFAULT_VALUE = 400;
    widthSlider.max = 1000;
    widthSlider.min = 20;
    widthSlider.value = WIDTH_DEFAULT_VALUE; 
    imageWidth = WIDTH_DEFAULT_VALUE;
    widthText.textContent = "Image Quality: "+WIDTH_DEFAULT_VALUE.toString();

    // Text Field Functions
    const Xtext = document.getElementById("camXPos");
    const Ytext = document.getElementById("camYPos");
    const Ztext = document.getElementById("camZPos");
    Xtext.value = "";
    Ytext.value = "";
    Ztext.value = "";

    // Add the Ground to the World
    const materialGround = new lambertian(new Vector3(0.8, 0.8, 0.0));
    worldSpheres["ground"] = new Sphere(new Vector3( 0.0, -100.5, -1.0), 100.0, materialGround);

    // Add Default Sphere
    worldSpheres["sphere1"] = new Sphere(new Vector3( 0.0,    0.0, -1.2), 0.5, new lambertian(new Vector3(0.1, 0.2, 0.5)));

    // const leftBallMat = new dielectric(1.5);
}


// MAIN FUNCTION: The rest of the functions in this document are strictly for interacting with HTML elements. 
// This is the start button for the true algorithim
function startRender() {
    let timerText = document.getElementById("timer");
    let world = new hittableList();
    Object.entries(worldSpheres).forEach(sphere => {
        world.Add(sphere[1]);
    });
    console.log(world);
    cam = new Camera(16/9, imageWidth, pixelSample, position, fov);
    const startTime = new Date().valueOf();
    cam.render(world);
    timerText.textContent = "This Render Took "+((new Date().valueOf() - startTime)/1000).toString()+" Seconds";
}


// Slider Functions 
function setFov() {
    const slider = document.getElementById("fovSlider");
    const text = document.getElementById("fovText");
    fov = slider.value;
    text.textContent = "Camera FOV: "+fov.toString();
}

function setQuality() {
    const slider = document.getElementById("qualitySlider");
    const text = document.getElementById("qualityText");
    imageWidth = slider.value;
    text.textContent = "Image Quality: "+imageWidth.toString();
}

// Text Field Functions
function setPosition() {
    const UPPER_BOUND = 20;
    const LOWER_BOUND = -20;
    const Xtext = document.getElementById("camXPos");
    const Ytext = document.getElementById("camYPos");
    const Ztext = document.getElementById("camZPos");
    let x = 0;
    let y = 0;
    let z = 0;
    if (!isNaN(parseFloat(Xtext.value))) {
        x = parseFloat(Xtext.value);
        if (x > UPPER_BOUND) {
            Xtext.value = UPPER_BOUND;
            x = UPPER_BOUND;
        }
        if (x < LOWER_BOUND) {
            Xtext.value = LOWER_BOUND;
            x = LOWER_BOUND;
        }
    }
    if (!isNaN(parseFloat(Ytext.value))) {
        y = parseFloat(Ytext.value);
        if (y > UPPER_BOUND) {
            Ytext.value = UPPER_BOUND;
            y = UPPER_BOUND;
        }
        if (y < 0) {
            Ytext.value = LOWER_BOUND;
            y = LOWER_BOUND;
        }
    }
    if (!isNaN(parseFloat(Ztext.value))) {
        z = parseFloat(Ztext.value);
        if (z > UPPER_BOUND) {
            Ztext.value = UPPER_BOUND;
            z = UPPER_BOUND;
        }
        if (z < LOWER_BOUND) {
            Ztext.value = LOWER_BOUND;
            z = LOWER_BOUND;
        }
    }
    position = new Vector3(x, y, z);
    console.log(position.toString());
}

function AddSphere(type = "") {
    // New HTML Element
    let newSphere = document.createElement("div");
    newSphere.id = "sphere"+currentSphereNum.toString();
    newSphere.classList.add("object");
    let setFunc;

    if (type==="lambertian") {
        setFunc = () => SetSphereLambertian(newSphere.id);
    } else if (type==="metal") {
        setFunc = () => SetSphereMetal(newSphere.id);
    } else {
        setFunc = () => SetSphereGlass(newSphere.id);
    }

    // posTitle
    let worldPosText = document.createElement("p");
    worldPosText.classList.add("settingsText");
    worldPosText.textContent = "World Position";
    newSphere.appendChild(worldPosText);

    // posTextBoxRow
    let positionRow = document.createElement("div");
    positionRow.classList.add("textBoxRow");

    // posXTextBox
    let posXBox = document.createElement("input");
    posXBox.type = "text";
    posXBox.classList.add("camPosTextBox");
    posXBox.id = "posX";
    posXBox.placeholder = "X"
    posXBox.oninput = setFunc;
    positionRow.appendChild(posXBox);

    // posYTextBox
    let posYBox = document.createElement("input");
    posYBox.type = "text";
    posYBox.classList.add("camPosTextBox");
    posYBox.id = "posY";
    posYBox.placeholder = "Y"
    posYBox.oninput = setFunc;
    positionRow.appendChild(posYBox);

    // posZTextBox
    let posZBox = document.createElement("input");
    posZBox.type = "text";
    posZBox.classList.add("camPosTextBox");
    posZBox.id = "posZ";
    posZBox.placeholder = "Z"
    posZBox.oninput = setFunc;
    positionRow.appendChild(posZBox);

    newSphere.appendChild(positionRow);

    // Radius Title
    let radPosText = document.createElement("p");
    radPosText.classList.add("settingsText");
    radPosText.textContent = "Radius";
    newSphere.appendChild(radPosText);

    // Radius Row
    let radRow = document.createElement("div");
    radRow.classList.add("textBoxRow");
    newSphere.appendChild(radRow);

    // Radius Text Box
    let radBox = document.createElement("input");
    radBox.type = "text";
    radBox.classList.add("camPosTextBox");
    radBox.id = "radius";
    radBox.placeholder = "m"
    radBox.oninput = setFunc;
    radRow.appendChild(radBox);

    switch(type) {
        case "metal":
            // Fuzz Factor Title Text
            let fuzzTitle = document.createElement("p");
            fuzzTitle.classList.add("settingsText");
            fuzzTitle.textContent = "Fuzz Factor";
            newSphere.appendChild(fuzzTitle);

            // Fuzz Factor Text Box Row
            let fuzzRow = document.createElement("div");
            fuzzRow.classList.add("textBoxRow");
            newSphere.appendChild(fuzzRow);

            // Fuzz Value
            let fuzzBox = document.createElement("input");
            fuzzBox.type = "text";
            fuzzBox.classList.add("camPosTextBox");
            fuzzBox.id = "fuzzFact";
            fuzzBox.placeholder = "Fz"
            fuzzBox.oninput = setFunc;
            fuzzRow.appendChild(fuzzBox);

        case "lambertian":
            // Color Title Text
            let colorTitleText = document.createElement("p");
            colorTitleText.classList.add("settingsText");
            colorTitleText.textContent = "Color";
            newSphere.appendChild(colorTitleText);

            // Color Text Box Row
            let colorRow = document.createElement("div");
            colorRow.classList.add("textBoxRow");
            newSphere.appendChild(colorRow);

            // R Value Color
            let rBox = document.createElement("input");
            rBox.type = "text";
            rBox.classList.add("camPosTextBox");
            rBox.id = "colorR";
            rBox.placeholder = "R"
            rBox.oninput = setFunc;
            colorRow.appendChild(rBox);

            // G Value Color
            let gBox = document.createElement("input");
            gBox.type = "text";
            gBox.classList.add("camPosTextBox");
            gBox.id = "colorG";
            gBox.placeholder = "G"
            gBox.oninput = setFunc;
            colorRow.appendChild(gBox);

            // B Value Color
            let bBox = document.createElement("input");
            bBox.type = "text";
            bBox.classList.add("camPosTextBox");
            bBox.id = "colorB";
            bBox.placeholder = "B"
            bBox.oninput = setFunc;
            colorRow.appendChild(bBox);

            if (type === "lambertian") {
                worldSpheres[newSphere.id] = new Sphere(new Vector3(0, 0, 0), 0, new lambertian(new Vector3(0, 0, 0)));
            } else {
                worldSpheres[newSphere.id] = new Sphere(new Vector3(0, 0, 0), 0, new metal(new Vector3(0, 0, 0), 0));
            }
            break;
        case "glass":
            // Refraction Title Text
            let refractTitle = document.createElement("p");
            refractTitle.classList.add("settingsText");
            refractTitle.textContent = "Refraction Factor";
            newSphere.appendChild(refractTitle);

            // Refraction Text Box Row
            let refractRow = document.createElement("div");
            refractRow.classList.add("textBoxRow");
            newSphere.appendChild(refractRow);

            // Refraction Value
            let refractBox = document.createElement("input");
            refractBox.type = "text";
            refractBox.classList.add("camPosTextBox");
            refractBox.id = "refract";
            refractBox.placeholder = "Rf"
            refractBox.oninput = setFunc;
            refractRow.appendChild(refractBox);
            break;
    }

    // Remove Button
    let rmButton = document.createElement("div");
    rmButton.classList.add("rmButton");
    let rmButtonText = document.createElement("p");
    rmButtonText.textContent = "Delete"
    rmButton.appendChild(rmButtonText);
    rmButton.addEventListener("click", () => RemoveSphere(newSphere.id));
    newSphere.appendChild(rmButton);

    // Spacer div
    let spacer = document.createElement("div");
    spacer.style = "height: 3vw;";
    newSphere.appendChild(spacer);

    currentSphereNum++;
    document.getElementById("objectsGrid").appendChild(newSphere);
}

// Set Sphere Properties
function SetSphereLambertian(name = "") {
    const sphereElement = document.getElementById(name);
    const posX = parseFloat(sphereElement.querySelector("#posX").value) || 0;
    const posY = parseFloat(sphereElement.querySelector("#posY").value) || 0;
    const posZ = parseFloat(sphereElement.querySelector("#posZ").value) || 0;
    const radius = parseFloat(sphereElement.querySelector("#radius").value) || 0;
    const r = Math.min(parseFloat(sphereElement.querySelector("#colorR").value) || 0, 255);
    const g = Math.min(parseFloat(sphereElement.querySelector("#colorG").value) || 0, 255);
    const b = Math.min(parseFloat(sphereElement.querySelector("#colorB").value) || 0, 255);
    worldSpheres[name] = new Sphere(new Vector3(posX, posY, posZ), radius, new lambertian(new Vector3(r/255.0, g/255.0, b/255.0)));
}

function SetSphereMetal(name = "") {
    const sphereElement = document.getElementById(name);
    const posX = parseFloat(sphereElement.querySelector("#posX").value) || 0;
    const posY = parseFloat(sphereElement.querySelector("#posY").value) || 0;
    const posZ = parseFloat(sphereElement.querySelector("#posZ").value) || 0;
    const radius = parseFloat(sphereElement.querySelector("#radius").value) || 0;
    const r = Math.min(parseFloat(sphereElement.querySelector("#colorR").value) || 0, 255);
    const g = Math.min(parseFloat(sphereElement.querySelector("#colorG").value) || 0, 255);
    const b = Math.min(parseFloat(sphereElement.querySelector("#colorB").value) || 0, 255);
    const fuzz = parseFloat(sphereElement.querySelector("#fuzzFact").value) || 0
    worldSpheres[name] = new Sphere(new Vector3(posX, posY, posZ), radius, new metal(new Vector3(r/255.0, g/255.0, b/255.0), fuzz));
}

function SetSphereGlass(name = "") {
    const sphereElement = document.getElementById(name);
    const posX = parseFloat(sphereElement.querySelector("#posX").value) || 0;
    const posY = parseFloat(sphereElement.querySelector("#posY").value) || 0;
    const posZ = parseFloat(sphereElement.querySelector("#posZ").value) || 0;
    const radius = parseFloat(sphereElement.querySelector("#radius").value) || 0;
    const refract = parseFloat(sphereElement.querySelector("#refract").value) || 0;
    worldSpheres[name] = new Sphere(new Vector3(posX, posY, posZ), radius, new dielectric(refract));
}

// Delete Sphere from World List
function RemoveSphere(name = "") {
    delete worldSpheres[name];
    let deletedSphere = document.getElementById(name);
    document.getElementById("objectsGrid").removeChild(deletedSphere);
}