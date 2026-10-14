class interval {
    min;
    max;

    constructor(min = Infinity, max = -Infinity) {
        this.min = min;
        this.max = max;
    }

    size() {
        return this.max - this.min;
    }

    contains(x = 0) {
        return this.min <= x && x <= this.max;
    }

    surrounds(x = 0) {
        return this.min < x && x < this.max;
    }

    clamp(x) {
        if (x < this.min) return this.min;
        if (x > this.max) return this.max;
        return x;
    }
}