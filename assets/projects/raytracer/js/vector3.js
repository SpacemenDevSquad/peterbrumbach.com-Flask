/**
 * Default Vector3 class for recording Vectors, Colors, and 3-dimensional objects, as well as additional functions to return different vectors
 * Created 2025
 * Peter Brumbach
 */
class Vector3 {
    constructor(e0 = 0.0, e1 = 0.0, e2 = 0.0) {
        this.e = [e0, e1, e2];
    }

    X() {
        return this.e[0];
    }
    Y() {
        return this.e[1];
    }
    Z() {
        return this.e[2];
    }

    Add(v = new Vector3()) {
        const rtVec3 = new Vector3();
        rtVec3.e[0] = this.e[0] + v.e[0];
        rtVec3.e[1] = this.e[1] + v.e[1];
        rtVec3.e[2] = this.e[2] + v.e[2];
        return rtVec3;
    }

    Subtract(v = new Vector3()) {
        const rtVec3 = new Vector3();
        rtVec3.e[0] = this.e[0] - v.e[0];
        rtVec3.e[1] = this.e[1] - v.e[1];
        rtVec3.e[2] = this.e[2] - v.e[2];
        return rtVec3;
    }

    MultiplyVec3(v = new Vector3()) {
        const rtVec3 = new Vector3();
        rtVec3.e[0] = this.e[0] * v.e[0];
        rtVec3.e[1] = this.e[1] * v.e[1];
        rtVec3.e[2] = this.e[2] * v.e[2];
        return rtVec3;
    }

    MultiplyConst(t = 1) {
        const rtVec3 = new Vector3();
        rtVec3.e[0] = this.e[0] * t;
        rtVec3.e[1] = this.e[1] * t;
        rtVec3.e[2] = this.e[2] * t;
        return rtVec3;
    }

    DivideConst(t = 1) {
        return this.MultiplyConst(1/t);
    }
    
    copy(v = new Vector3()) {
        this.e[0] = v.e[0];
        this.e[1] = v.e[1];
        this.e[2] = v.e[2];
    }

    length() {
        return Math.sqrt(this.lengthSquared())
    }

    lengthSquared() {
        return this.e[0]*this.e[0] + this.e[1]*this.e[1] + this.e[2]*this.e[2];
    }

    dot(v = new Vector3()) {
        return this.e[0] * v.e[0] + this.e[1] * v.e[1] + this.e[2] * v.e[2];
    }

    cross(v = new Vector3()) {
        return new Vector3(this.e[1] * v.e[2] - this.e[2] * v.e[1],
                this.e[2] * v.e[0] - this.e[0] * v.e[2],
                this.e[0] * v.e[1] - this.e[1] * v.e[0]);
    }

    unitVector() {
        return this.DivideConst(this.length());
    }

    nearZero() {
        const zero = 1e-8;
        return(this.X() < zero && this.Y() < zero && this.Z() < zero)
    }

    toString() {
        return "Vector3("+this.e[0].toString()+", "+this.e[1].toString()+", "+this.e[2].toString()+")";
    }
}

// Returns random Vector3
function Random(min = 0, max = 1) {
    return new Vector3(Math.random()*(max-min) + min, Math.random()*(max-min) + min, Math.random()*(max-min) + min);
}

// Returns random Unit Vector
function RandomUnitVector() {
    while (true) {
        p = Random(-1, 1);
        lensq = p.lengthSquared();
        if (1e-160 < lensq && lensq <= 1) {
            return p.DivideConst(Math.sqrt(lensq));
        }
    }
}

function RandomOnHemisphere(normal = new Vector3()) {
    const onUnitSphere = RandomUnitVector();
    if (onUnitSphere.dot(normal) > 0.0) {
        return onUnitSphere;
    }
    return onUnitSphere.MultiplyConst(-1);
}

function Reflect(v = new Vector3(), n = new Vector3()) {
    return v.Subtract(n.MultiplyConst(2*v.dot(n)));
}

// Refracting function for Snell's Law
function Refract(uv = new Vector3(), n = new Vector3(), etaiOverEtat = 0.0) {
    let cosTheta = (uv.MultiplyConst(-1)).dot(n);
    if (cosTheta > 1) {
        cosTheta = 1;
    }
    let rPerp = n.MultiplyConst(cosTheta);
    rPerp = (uv.Add(rPerp)).MultiplyConst(etaiOverEtat);
    let rPara = n.MultiplyConst(-1*Math.sqrt(Math.abs(1.0 - rPerp.lengthSquared())));
    return rPerp.Add(rPara);
}