/**
 * Ray class for recording different rays' properties
 * Created 2025
 * Peter Brumbach
 */
class ray {
    #orig
    #dir

    constructor(origin = new Vector3(), direction = new Vector3()) {
        this.#orig = new Vector3();
        this.#dir = new Vector3();

        this.#orig.copy(origin);
        this.#dir.copy(direction);
    }

    origin() {
        return this.#orig
    }

    direction() {
        return this.#dir
    }

    at(t = 0) {
        let rtVec3 = new Vector3();
        rtVec3.copy(this.#dir);
        rtVec3 = rtVec3.MultiplyConst(t);
        rtVec3 = rtVec3.Add(this.#orig);
        return rtVec3;
    }

    copy(r = new ray()) {
        this.#orig = r.#orig;
        this.#dir = r.#dir;
    }

    toString() {
        return "Origin: "+this.#orig.toString()+" | Direction: "+this.#dir.toString()
    }
}