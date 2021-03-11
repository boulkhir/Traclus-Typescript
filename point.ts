class Point {

  dim : Number;
  coordinates : Number[];

  constructor() {
    this.dim = 2;
    this.coordinates = [0.0, 0.0];
  }

  constructor(dim : Number) {
    this.dim = dim;
    this.coordinates = new Array(dim);
    for (var i=0; i<dim ; i++) {
      this.coordinates[i] = 0.0;
    }
  }

  get_coord(i : Number) {
    return this.coordinates[i];
  } 

  get_dim() {
    return this.dim;
  }

  set_coord(i:Number, value:Number) {
    this.coordinates[i] = Number;
  }

}

export {Point};