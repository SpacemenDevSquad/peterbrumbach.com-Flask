/**
 * The sphere class. Is a hittable object, can interfere with a ray's path.
 * Created 2025
 * Peter Brumbach
 */
class Sphere extends hittable {
    #center;
    #radius;
    #mat;

    constructor(center = new Vector3(), radius = 0.0, mat = new material()) {
        super();
        this.#center = center;
        this.#radius = radius;
        this.#mat = mat;
    }

    // Function to detect if sphere was in ray's path (Ray hit sphere)
    hit(r = new ray(), rayT = new interval(), rec = new hitRecord()) {
        const oc = this.#center.Subtract(r.origin());
        const a = r.direction().lengthSquared();
        const h = r.direction().dot(oc);
        const c = oc.lengthSquared(oc) - (this.#radius * this.#radius);
        const discriminant = h*h - a*c;
        if (discriminant < 0) return false;

        const sqrtd = Math.sqrt(discriminant);

        let root = (h - sqrtd) / a;
        if (!rayT.surrounds(root)) {
            root = (h + sqrtd) / a
            if (!rayT.surrounds(root)) return false;
        }

        rec.t = root;
        rec.p = r.at(rec.t);
        const outwardNormal = (rec.p.Subtract(this.#center)).DivideConst(this.#radius);
        rec.setFaceNormal(r, outwardNormal);
        rec.mat = this.#mat;

        return true;
    }

    getMaterial() {
        return this.#mat;
    }
}