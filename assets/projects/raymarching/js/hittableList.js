// Collection of all objects in the world

class hittableList extends hittable{
    objects = new Array();

    constructor() {
        super()
    }

    // calculate the SDF for everything in the world
    // returns min SDF and index of min object
    minSDF(coord) {
        let sdfObjects = this.objects.map(thingy => thingy.SDF(coord));
        let temp = Math.min(...sdfObjects)
        return [temp, sdfObjects.indexOf(temp)];
    }

    // smooth min for fun shapes
    smin(coord = new Vector3()) {
        let k = 0.4;
        k *= Math.log10(2.0);
        let sdfObjects = this.objects.map(thingy => thingy.SDF(coord));
        //console.log(sdfObjects)
        //console.log(sdfObjects)
        //let sdfObjectsExp = sdfObjects.map(thingy => Math.log10(thingy*k));
        let x = sdfObjects[1] - sdfObjects[0]
        //console.log(sdfObjects[0] + x/(1-2**(x/k)))
        return [sdfObjects[0] + x/(1-2**(x/k)), sdfObjects.indexOf(Math.min(...sdfObjects))]
        //let smoothie = 0
        //sdfObjectsExp.forEach(number => {
        //    smoothie -= number;
        //});
        //console.log(sdfObjectsExp)
        //sdfObjectsExp.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        return smoothie/k
    }

    Add(hittableObj = new hittable()) {
        this.objects.push(hittableObj)
    }

    getHittable(num) {
        return this.objects[num];
    }
}