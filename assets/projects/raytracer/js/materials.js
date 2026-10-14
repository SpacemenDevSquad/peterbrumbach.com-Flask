/**
 * Different materials that can be applied to hittable objects to change how the rays scatter
 * Created 2025
 * Peter Brumbach
 */

// Default class
class material {
    constructor() {}
    
    // Returns if ray has been scattered and changes 'scattered' to show the new direction of the ray
    scatter(rIn = new ray(), rec = new hitRecord(), attenuation = new Vector3(), scattered = new ray()) {
        return false;
    }

    toString() {
        return "Type: Unknown | Albedo: None";
    }
}

// Lambertain: Standard material, looks like a solid object
// Albedo is color
class lambertian extends material {
    #albedo;
    constructor(albedo = new Vector3) {
        super();
        this.#albedo = new Vector3();
        this.#albedo.copy(albedo);
    }

    scatter(rIn = new ray(), rec = new hitRecord(), attenuation = new Vector3(), scattered = new ray()) {
        let scatterDirection = rec.normal.Add(RandomUnitVector());
        if (scatterDirection.nearZero()) {
            scatterDirection = rec.normal;
        }
        scattered.copy(new ray(rec.p, scatterDirection));
        attenuation.copy(this.#albedo);
        return true;
    }

    toString() {
        return "Type: Lambertian | Albedo: "+this.#albedo.toString();
    }
}

// Metal: Reflects different objects around it while having its own color
// Fuzz changes how well metal is able to reflect. (Lower is more reflective)
class metal extends material {
    #albedo;
    #fuzz;
    constructor(albedo = new Vector3(), fuzz = 0.0) {
        super();
        this.#albedo = new Vector3();
        this.#albedo.copy(albedo);
        this.#fuzz = fuzz;
    }

    scatter(rIn = new ray(), rec = new hitRecord(), attenuation = new Vector3(), scattered = new ray()) {
        let reflected = Reflect(rIn.direction(), rec.normal);
        reflected = (reflected.unitVector()).Add(RandomUnitVector().MultiplyConst(this.#fuzz))
        scattered.copy(new ray(rec.p, reflected));
        attenuation.copy(this.#albedo);
        return true;
    }

    toString() {
        return "Type: Metal | Albedo: "+this.#albedo.toString();
    }
}

// Dielectric: Allows rays to pass through or reflect off itself, but does not have a color
// Refraction Index changes how many rays are passed through hittable object (1 is nearly transparent)
class dielectric extends material {
    #refractionIndex
    constructor(refractionIndex = 0.0) {
        super();
        this.#refractionIndex = refractionIndex;
    }

    scatter(rIn = new ray(), rec = new hitRecord(), attenuation = new Vector3(), scattered = new ray()) {
        attenuation.copy(new Vector3(1, 1, 1));
        let ri = 0;
        if (rec.frontFace) {
            ri = 1.0/this.#refractionIndex;
        } else {
            ri = this.#refractionIndex;
        }

        // Snell's Law
        const unitDirection = rIn.direction().unitVector();
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
        
        scattered.copy(new ray(rec.p, direction));
        return true;
    }

    #reflectance(cosine = 0.0, refractionIndex) {
        let r0 = (1-refractionIndex) / (1+refractionIndex);
        r0 = r0*r0;
        r0 = (1-r0)*Math.pow((1-cosine), 5);
        return r0;
    }
}