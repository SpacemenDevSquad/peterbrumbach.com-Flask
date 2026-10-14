class Camera {
    // Public Variables & Functions
    aspectRatio;
    imageWidth;
    canvasID = "viewport";
    pixelSample;
    maxDepth = 1000;
    fov = 90;
    cameraPos = new Vector3();
    lookAt = new Vector3(0, 0, -1);
    vup = new Vector3(0, 1, 0);

    // Private Variables & Functions
    #ctx;
    #imageHeight;
    #center;
    #pixelSampleScale;
    #pixel00Location;
    #pixelDeltaU;
    #pixelDeltaV;
    #camU;
    #camV;
    #camW;

    constructor(aspectRatio = 16/9, imageWidth = 400, pixelSample = 10, cameraPos = new Vector3(), fov = 90) {
        this.aspectRatio = aspectRatio;
        this.imageWidth = imageWidth;
        this.pixelSample = pixelSample;
        this.cameraPos = vectorCopy(cameraPos);
        this.fov = fov;
    }

    render(world = new hittableList()) {
        this.#initialize()

        // ray will be considered as "Hit" if SDF is less than this value
        const collisionProx = 0.001
        // stores which object is hit
        let objHit = -1;

        // use
        let lightDir = new Vector3()

        let startTime = Date.now();


        // Ray for every pixel
        for (let i = 0; i < this.#imageHeight; i++) {
            // console.log("Scanlines remaining:"+(this.#imageHeight-i).toString());
            for (let j = 0; j < this.imageWidth; j++) {

                // get ray for a pixel
                let r = this.#getRay(j, i);

                // find collision by determining if stepSize is very small; 

                // reset marching parameters
                let marchDist = 0
                let marchSteps = 0
                let hitPoint = new Vector3();
                let hitObjectIndex = -1;
                let collisions = new Array();
                let stepSize = 1;

                // terminates after ray reaches significant length (free space), 
                // after a set number of steps, or after hitting an object
                while(marchDist < this.maxDepth && marchSteps < 1000 && stepSize > collisionProx) {
                    // how much to march
                    if(marchSteps == 0) {
                        collisions = world.minSDF(r.getOrigin());
                    } else {
                        collisions = world.minSDF(r.terminationPoint(marchDist))
                    }

                    // collisions stores both step size and closest object
                    stepSize = collisions[0];
                    
                    // hit something, get index of thing we hit
                    if(stepSize < collisionProx) {
                        hitObjectIndex = collisions[1];
                        hitPoint = r.terminationPoint(marchDist)
                        objHit = collisions[1];
                    } else {
                    // increase length of ray in vector direction
                        marchDist += stepSize;
                    }
                    marchSteps++;
                }

                // variables for lighting and shadows
                const lightSource = new Vector3(1, 1, 0.5);
                let rNormalRay = new Vector3();
                let shadowVal = 1;
                let closestToLight = 0;
                let distFromClosest = new Vector3();
                let lightVal = 0;

                // calculate lighting on objects; only necessary if we hit something
                if (hitObjectIndex > -1) {
                    // get normal for diffuse lighting calculation
                    rNormalRay = world.getHittable(collisions[1]).getNormal(hitPoint);
                    // ray towards the light
                    lightDir = new ray(rNormalRay.getOrigin(), lightSource);

                    let lightLength = lightSource.Subtract(lightDir.getOrigin()).length()

                    // reset marching variables
                    let marchDist = 0;
                    let marchSteps = 0;
                    let stepSize = 1;

                    // for penumbra of shadow
                    let res = 1;

                    // March from our hitpoint towards the light; similar to above marching
                    while(marchDist < lightLength && marchSteps < 1000 && stepSize > collisionProx) {
                        // how much to march
                        if(marchSteps == 0) {
                            collisions = world.minSDF(lightDir.getOrigin());
                        } else {
                            collisions = world.minSDF(lightDir.terminationPoint(marchDist))
                        }
                        stepSize = collisions[0];
                        // hit an object; we must be in the shade
                        if(stepSize < collisionProx) {
                            shadowVal = 0
                        } else {
                            // increase length of ray in vector direction
                            marchDist += stepSize;
                            // If we're close to a shadow calculate its penumbra
                            res = Math.min(res, 8*stepSize/marchDist);
                        }
                        marchSteps++;
                    }

                    // determine if we're in a shadow or a penumbra
                    shadowVal = Math.min(shadowVal, res)

                    // lighting on sphere
                    closestToLight = world.getHittable(objHit).SDF(lightSource)
                    //console.log(closestToLight)
                    //console.log(lightSource.Subtract(hitPoint).length())

                    // use distance from light to artificially create a brighter spot
                    distFromClosest = lightSource.Subtract(rNormalRay.getOrigin()).length() / closestToLight;
                    // add a highlight using math I mostly understand (works best for spheres)
                    lightVal = Math.pow(Math.max(0, -Math.pow(0.9*distFromClosest,5) + 1),2);
                }

                // calculate color of pixel
                // used for a sky based on Y coordinate
                let skyGradient = 0.25*(r.getDirection().Y());

                let currColor = this.color(world, skyGradient, hitObjectIndex, shadowVal, lightVal)

                // write to scene
                this.#ctx.fillStyle = this.#WriteColor(currColor)//.MultiplyConst(this.#pixelSampleScale));
                this.#ctx.fillRect(j, i, 1, 1);
            }
        }
        
        console.log(Date.now() - startTime);
    }

    

    color(world = new hittableList(), skyGradient, hitObjectIndex = -1, shadowVal = 1, lightVal = 0) {
        // returns the color of the sky
        if(hitObjectIndex == -1) {
            return new Vector3(0.0, 0.0, 1.0).MultiplyConst(1-skyGradient).Add(new Vector3(0.0, 0.0, 1.0).MultiplyConst(skyGradient));
        } else {
            // adjust color of material with shadows and light
            return world.getHittable(hitObjectIndex).getMaterial().color().MultiplyConst(Math.max(0.1,shadowVal)).Add(new Vector3(1, 1, 1).MultiplyConst(lightVal));
        }
    }

    #initialize() {
        // Initalize Canvas, define canvas width & height
        const canvas = document.getElementById(this.canvasID);
        this.#ctx = canvas.getContext("2d");
        this.#imageHeight = Math.round(this.imageWidth/this.aspectRatio);
        if (this.#imageHeight < 1) {this.#imageHeight = 1};
        canvas.width = this.imageWidth;
        canvas.height = this.#imageHeight;

        // Pixel sample scale calculation
        this.#pixelSampleScale = 1.0/this.pixelSample;

        // Camera Center
        this.#center = this.cameraPos;

        // Viewport Dimensions
        const focalLength = (this.cameraPos.Subtract(this.lookAt)).length();
        const theta = this.fov * (Math.PI/180);
        const h = Math.tan(theta/2);
        const viewportHeight = 2 * h * focalLength;
        const viewportWidth = viewportHeight * (this.imageWidth/this.#imageHeight);

        // Calculate camU, camV, camW
        this.#camW = (this.cameraPos.Subtract(this.lookAt)).unitVector();
        this.#camU = (this.vup.cross(this.#camW)).unitVector();
        this.#camV = this.#camW.cross(this.#camU);

        // Canvas Edge Vectors
        const viewportU = this.#camU.MultiplyConst(viewportWidth);
        const viewportV = (this.#camV.MultiplyConst(viewportHeight)).MultiplyConst(-1);

        // Distance from pixel to pixel on canvas
        this.#pixelDeltaU = viewportU.DivideConst(this.imageWidth);
        this.#pixelDeltaV = viewportV.DivideConst(this.#imageHeight);

        // Calculate the position of the upper left pixel
        let viewportUpperLeft = new Vector3();
        viewportUpperLeft = vectorCopy(this.#center);
        viewportUpperLeft = viewportUpperLeft.Subtract(this.#camW.MultiplyConst(focalLength));
        viewportUpperLeft = viewportUpperLeft.Subtract(viewportU.MultiplyConst(0.5)).Subtract(viewportV.MultiplyConst(0.5));
        this.#pixel00Location = new Vector3();
        this.#pixel00Location = vectorCopy(viewportUpperLeft);
        this.#pixel00Location = this.#pixel00Location.Add(this.#pixelDeltaU.DivideConst(2)).Add(this.#pixelDeltaV.DivideConst(2));
    }

    // color mapping helper
    #linearToGamma(x = 0) {
        if (x > 0) {
            return Math.sqrt(x);
        }
        return 0;
    }

    // color mapping - implementation borrowed from "Ray Tracing in One Weekend"
    #WriteColor(pixelColor = new Vector3()) {
        const intensity = new interval(0, 1);
        let r = pixelColor.X();
        let g = pixelColor.Y();
        let b = pixelColor.Z();

        r = this.#linearToGamma(r);
        g = this.#linearToGamma(g);
        b = this.#linearToGamma(b);

        r = intensity.clamp(r)*256;
        g = intensity.clamp(g)*256;
        b = intensity.clamp(b)*256;

        return "rgb("+r.toString()+" "+g.toString()+" "+b.toString()+")";
    }

    // get direction of a ray
    #getRay(i, j) {
        let pixelSample = this.#pixel00Location.Add(this.#pixelDeltaU.MultiplyConst(i));
        pixelSample = pixelSample.Add(this.#pixelDeltaV.MultiplyConst(j));
        const rayDirection = pixelSample.Subtract(this.#center);
        return new ray(this.#center, rayDirection);
    }
}