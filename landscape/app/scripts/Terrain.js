class Terrain {
  constructor(detail){
    this.size = Math.pow(2, detail) + 1;
    this.max = this.size - 1;
    this.map = new Float32Array(this.size * this.size);
  }

  get(x, y) {
    if (x < 0 || x > this.max || y < 0 || y > this.max) return -1;
    return this.map[x + this.size * y];
    }

  set(x, y, val) {
    this.map[x + this.size * y] = val;
  }

  generate(roughness) {
    var self = this;

    this.set(0, 0, self.max);
    this.set(this.max, 0, self.max / 2);
    this.set(this.max, this.max, 0);
    this.set(0, this.max, self.max / 2);

    this.divide(this.max, self, roughness);
  }

  divide(size, self, roughness) {
    var x, y, half = size / 2;
    var scale = roughness * size;
    if (half < 1) return;

    for (y = half; y < self.max; y += size) {
        for (x = half; x < self.max; x += size) {
            this.square(x, y, half, (Math.random() + .1) * scale * 2 - scale, self);
        }
    }
    for (y = 0; y <= self.max; y += half) {
        for (x = (y + half) % size; x <= self.max; x += size) {
            this.diamond(x, y, half, (Math.random() + .1) * scale * 2 - scale, self);
        }
    }
    this.divide(size / 2, self, roughness);
  }


  average(values) {
    var valid = values.filter((val)=> {
        return val !== -1;
    });
    var total = valid.reduce((sum, val)=> {
        return sum + val;
    }, 0);
    return total / valid.length;
  }

  square(x, y, size, offset, self) {
    var ave = this.average([
        self.get(x - size, y - size), // upper left
        self.get(x + size, y - size), // upper right
        self.get(x + size, y + size), // lower right
        self.get(x - size, y + size) // lower left
    ]);
    self.set(x, y, ave + offset);
  }

  diamond(x, y, size, offset, self) {
    var ave = this.average([
        self.get(x, y - size), // top
        self.get(x + size, y), // right
        self.get(x, y + size), // bottom
        self.get(x - size, y) // left
    ]);
    self.set(x, y, ave + offset);
  }
}

export default Terrain;
