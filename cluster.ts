import {Trajectory} from "./trajectory";


class Cluster {
	clusterId : Number;
	dim : Number;
	n_traj : Number;
	n_points : Number;
	points : Point[];

	constructor() {
		this.clusterId = -1;
		this.dim = 2;
		this.n_traj = 0;
		this.n_points = 0;
		this.points = new Array();
	}

	constructor(id:Number, dim:Number) {
		this.clusterId = id;
		this.dim = dim;
		this.n_traj = 0;
		this.n_points = 0;
		this.points = new Array();
	}

	setId(id:Number) {
		this.clusterId = id;
	}

	getId() {
		return this.clusterId;
	}

	getNumberTrajectory() {
		return this.n_traj;
	}

	setNumberTrajectory(n_traj:Number) {
		this.n_traj = n_traj;
	}

	addPoint(point:Point) {
		this.points.push(point);
		this.n_points++;
	}

	getPoints() {
		return this.points;
	}
}

export {Cluster};