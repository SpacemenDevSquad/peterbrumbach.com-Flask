/**
 * Hittable class for objects in scene that rays can interact with.
 * Created 2025
 * Peter Brumbach
 */
class hittable {
    hittable() {};
    hit(r = new ray(), rayT = new interval(), rec = new hitRecord()) {
        return false;
    }
    getMaterial() {
        return null;
    }
}

class hitRecord {
    p = new Vector3();
    normal = new Vector3();
    mat = new material();
    t = 0.0;
    frontFace = true;

    setFaceNormal(r = new ray(), outwardNormal = new Vector3()) {
        this.frontFace = r.direction().dot(outwardNormal) < 0;
        if (this.frontFace) {
            this.normal.copy(outwardNormal);
        } else {
            this.normal.copy(outwardNormal.MultiplyConst(-1));
        }
    }

    copy(rec = new hitRecord()) {
        this.p.copy(rec.p);
        this.normal.copy(rec.normal);
        this.t = rec.t;
        this.frontFace = rec.frontFace;
        this.mat = rec.mat;
    }
}