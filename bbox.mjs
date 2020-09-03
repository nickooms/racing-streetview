const X = 0;
const Y = 1;

export default class BBOX {
  min = [Infinity, Infinity];
  max = [-Infinity, -Infinity];

  constructor(...points) {
    this.add(...points);
    // points.forEach(([x, y]) => {
    //   this.min = [Math.min(this.min[X], x), Math.min(this.min[Y], y)];
    //   this.max = [Math.max(this.max[X], x), Math.max(this.max[Y], y)];
    // });
  }

  add(...points) {
    points.forEach(([x, y]) => {
      this.min = [Math.min(this.min[X], x), Math.min(this.min[Y], y)];
      this.max = [Math.max(this.max[X], x), Math.max(this.max[Y], y)];
    });
  }

  grow(size = 1) {
    this.min = [this.min[X] - size, this.min[Y] - size];
    this.max = [this.max[X] + size, this.max[Y] + size];
  }

  get width() {
    return this.max[X] - this.min[X];
  }

  get height() {
    return this.max[Y] - this.min[Y];
  }
}
