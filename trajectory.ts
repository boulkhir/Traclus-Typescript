import {Point} from "./point"

type Pointt = {
	isPoint: () => void;
}

class Trajectory {
	trajectory_id : Number;
	dim : Number;
	n_points : Number;
	n_partitionPoints : Number;
	points : Point[];
	partitionPoints : Point[];

	constructor () {
		this.trajectory_id = -1;
		this.dim = 2;
		this.n_points = 0;
		this.n_partitionPoints = 0;
		this.points = new Array();
		this.partitionPoints = new Array();
	}

	constructor (id:Number, dim:Number) {
		this.trajectory_id = id;
		this.dim = dim;
		this.n_points = 0;
		this.n_partitionPoints = 0;
		this.points = new Array();
		this.partitionPoints = new Array();
	}

	addPoint(point:Point) {
		this.partitionPoints.push(point);
		this.n_partitionPoints++;
	}

	setId(id:Number) {
		this.trajectory_id = id;
	}

	getId() {
		return this.trajectory_id;
	}

	getDim() {
		return this.dim;
	}

	setDim(dim:Number) {
		this.dim = dim;
	}

	getNumberPoints() {
		return this.n_points;
	}

	setNumberPoints(npoints:Number) {
		this.n_points = npoints;
	}

	getNumberPartitionPoints() {
		return this.n_partitionPoints;
	}

	setNumberPartitionPoints(npoints:Number) {
		this.n_partitionPoints = npoints;
	}

	getPointsArray () {
		return this.points;
	}

	setPointsArray (points:Point[]) {
		this.points = points;
	}

	getPartitionPointsArray () {
		return this.partitionPoints;
	}

	setPartitionPointsArray (points:Point[]) {
		this.partitionPoints = points;
	}


}

export {Trajectory};