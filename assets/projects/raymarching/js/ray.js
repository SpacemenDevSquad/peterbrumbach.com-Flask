// Unit ray specified by 2 vectors, origin and direction - normalizes vector

class ray {
    #orig
    #dir
    #length

    constructor(origin = new Vector3(), direction = new Vector3()) {
        this.#orig = new Vector3();
        this.#dir = new Vector3();

        this.#orig = vectorCopy(origin);
        this.#dir = vectorCopy((direction.Subtract(origin)).unitVector());
        this.#length = (this.#dir.Subtract(this.#orig)).length();

    }

    getOrigin() {
        return this.#orig;
    }

    getDirection() {
        return this.#dir;
    }

    // finds coord at length a given direction from array
    terminationPoint(length) {
        return vectorCopy((vectorCopy(this.#dir.MultiplyConst(length))).Add(vectorCopy(this.#orig)));
    }

    // get unit vector from ray origin to direction
    rayUnitVector() {
        return new ray(this.#orig, this.#dir.Subtract(this.#orig).DivideConst(this.#length).Add(this.#orig));
    }

    // get unit vector starting at global origin
    rayUnitVectorOrigin() {
        return this.#dir.Subtract(this.#orig).DivideConst(this.#length);
    }

    // get length of Ray
    length() {
        return this.#length;
    }

    // increase length of the ray
    updateLength(length = 1) {
        this.#dir = (this.#dir.Subtract(this.#orig)).DivideConst(this.#length).MultiplyConst(length);
        // update ray length
        this.#length = length;
    }

    // update dir with ideal length for shadow calc
    shadowLength() {
        this.#dir = this.#dir.Subtract(this.#orig).DivideConst(this.#length).DivideConst(10).Add(this.#orig);
        this.#length = 1/10;
    }

    toString() {
        return "Origin: "+this.#orig.toString()+" | Direction: "+this.#dir.toString();
    }
}

// deep copy
function rayCopy(obj = new ray()) {
    return new ray(vectorCopy(obj.getOrigin()), vectorCopy(obj.getDirection()));
}