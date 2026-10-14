// generates a Sphere in 3D space with given radius

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

    // normal ray from point slightly above surface outwards
    getNormal(coord = new Vector3()) {
        // some small value above surface; ideally more than any collision
        let surfaceHover = 0.005;

        // gets direction from center to point outside sphere, adds the radius plus a small factor, then sets point relative to center
        let direction = vectorCopy((coord.Subtract(this.#center)).unitVector())
        let origin = vectorCopy(direction.MultiplyConst(this.#radius+surfaceHover).Add(this.#center))

        // need unit vector from surface of sphere to 

        //return new Vector3((coord.X()-this.#center.X())/this.#radius, (coord.Y()-this.#center.Y())/this.#radius, (coord.Z()-this.#center.Z())/this.#radius).unitVector();
        return rayCopy(new ray(origin, direction));
    }

    // get SDF for a Sphere
    SDF(coord = new Vector3()) {
        //return Math.sqrt(Math.pow(coord.X() - this.#center.X(), 2) + Math.pow(coord.Y() - this.#center.Y(), 2) + Math.pow(coord.Z() - this.#center.Z(), 2)) - this.#radius;
        return (coord.Subtract(this.#center)).length() - this.#radius;
    }

    getMaterial() {
        return this.#mat;
    }
}