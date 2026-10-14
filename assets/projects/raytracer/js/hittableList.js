/**
 * A list for hittable objects
 * Created 2025
 * Peter Brumbach
 */
class hittableList extends hittable{
    objects = new Array();

    constructor() {super()}

    clear() {
        this.objects = new Array();
    }

    Add(hittableObj = new hittable()) {
        this.objects.push(hittableObj)
    }

    hit(r = new ray(), rayT = new interval(), rec = new hitRecord()) {
        let tempRec = new hitRecord();
        let hitAnything = false;
        let closestSoFar = rayT.max;

        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i].hit(r, new interval(rayT.min, closestSoFar), tempRec)) {
                hitAnything = true;
                closestSoFar = tempRec.t;
                rec.copy(tempRec);
            }
        }

        return hitAnything;
    }
}