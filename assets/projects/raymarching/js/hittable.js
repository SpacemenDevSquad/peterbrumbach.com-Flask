// Abstract class

class hittable {
    hittable() {};

    // determines distance of coordinate to objects
    SDF(r = new Vector3()) {
        return 0;
    }

    getMaterial() {
        return null;
    }

    // return normal vector of a shape
    getNormal() {
        return null;
    }
}