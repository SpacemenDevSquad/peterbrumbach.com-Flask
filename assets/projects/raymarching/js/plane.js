// generates a plane in 3d space specified by a point and normal vector
class plane extends hittable {
    #planeNormal;
    #mat;

    constructor(planeNormal = new ray(), mat = new material()) {
        super();
        this.#planeNormal = rayCopy(planeNormal.rayUnitVector()); // ensures normal vector
        this.#mat = mat;
    }

    // SDF calculated by taking dot product of normal and difference between target and origin
    SDF(coord = new Vector3()) {
        //console.log("Plane Normal origin: ", this.#planeNormal.getOrigin().toString());
        //console.log("Plane Normal direction: ", this.#planeNormal.getDirection().toString());
        //console.log("Coord: ", coord.toString());
        //console.log(this.#planeNormal.rayUnitVectorOrigin().dot(coord.Subtract(this.#planeNormal.getOrigin())))
        return this.#planeNormal.getDirection().dot(coord.Subtract(this.#planeNormal.getOrigin()))
    }
    
    getNormal(coord = new Vector3()) {
        let surfaceHover = 0.0011
        let direction = vectorCopy(this.#planeNormal.getDirection());
        let origin = vectorCopy(coord.Subtract(direction.MultiplyConst(this.#planeNormal.getDirection().dot(coord.Subtract(this.#planeNormal.getOrigin()))-surfaceHover)))
        return rayCopy(new ray(origin, direction))
    }

    getMaterial() {
        return this.#mat;
    }

}