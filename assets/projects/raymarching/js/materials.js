class material {
    constructor() {}
    
    scatter(rIn = new ray(), rec = new hitRecord(), attenuation = new Vector3(), scattered = new ray()) {
        return false;
    }

    toString() {
        return "Type: Unknown | Albedo: None";
    }

    color() {
        return new Vector3(0, 0, 0);
    }
}

class lambertian extends material {
    #albedo;
    constructor(albedo = new Vector3) {
        super();
        this.#albedo = vectorCopy(albedo);
    }

    color() {
        return this.#albedo;
    }

    scatter(rIn = new ray(), rec = new hitRecord(), attenuation = new Vector3(), scattered = new ray()) {
        let scatterDirection = rec.normal.Add(RandomUnitVector());
        if (scatterDirection.nearZero()) {
            scatterDirection = rec.normal;
        }
        scattered = vectorCopy(new ray(rec.p, scatterDirection));
        attenuation = vectorCopy(this.#albedo);
        return true;
    }

    toString() {
        return "Type: Lambertian | Albedo: "+this.#albedo.toString();
    }
}

class metal extends material {
    #albedo;
    #fuzz;
    constructor(albedo = new Vector3(), fuzz = 0.0) {
        super();
        this.#albedo = new Vector3();
        this.#albedo = vectorCopy(albedo);
        this.#fuzz = fuzz;
    }

    color() {
        return this.#albedo;
    }

    scatter(rIn = new ray(), rec = new hitRecord(), attenuation = new Vector3(), scattered = new ray()) {
        let reflected = Reflect(rIn.getDirection(), rec.normal);
        reflected = (reflected.unitVector()).Add(RandomUnitVector().MultiplyConst(this.#fuzz))
        scattered = rayCopy(new ray(rec.p, reflected));
        attenuation = vectorCopy(this.#albedo);
        return true;
    }

    toString() {
        return "Type: Metal | Albedo: "+this.#albedo.toString();
    }
}

class dielectric extends material {
    #refractionIndex
    constructor(refractionIndex = 0.0) {
        super();
        this.#refractionIndex = refractionIndex;
    }

    scatter(rIn = new ray(), rec = new hitRecord(), attenuation = new Vector3(), scattered = new ray()) {
        attenuation = vectorCopy(1, 1, 1);
        let ri = 0;
        if (rec.frontFace) {
            ri = 1.0/this.#refractionIndex;
        } else {
            ri = this.#refractionIndex;
        }

        const unitDirection = rIn.getDirection().unitVector();
        let direction;
        let cosTheta = (unitDirection.MultiplyConst(-1)).dot(rec.normal);
        const sinTheta = Math.sqrt(1.0 - cosTheta*cosTheta);
        if (cosTheta > 1) {
            cosTheta = 1;
        }

        if (ri*sinTheta > 1.0 || this.#reflectance(cosTheta, ri) > Math.random()) {
            direction = Reflect(unitDirection, rec.normal);
        }
        else {
            direction = Refract(unitDirection, rec.normal, ri);
        }
        
        scattered = rayCopy(rec.p, direction);
        return true;
    }

    #reflectance(cosine = 0.0, refractionIndex) {
        let r0 = (1-refractionIndex) / (1+refractionIndex);
        r0 = r0*r0;
        r0 = (1-r0)*Math.pow((1-cosine), 5);
        return r0;
    }
}