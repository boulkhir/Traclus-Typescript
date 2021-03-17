import {Cluster} from "./cluster";
import * as fs from 'fs';
import * as rd from 'readline';


class TraClusterDoc {
	dim : Number;
	n_traj : Number;
	n_clus : Number;
	cluster_ratio : Number;
	maxNumPoints : Number;
	trajectoryList : Trajectory[];
	clusterList : Cluster[];

	constructor() {
		this.n_traj = 0;
		this.n_clus = 0;
		this.cluster_ratio = 0.0;
		this.trajectoryList = new Array();
		this.clusterList = new Array();
	}

	class Parameters {
		eps : Number;
		minLns : Number;
	}

	OpenDocument(inputFile : string) {
		// Setting all variables to their default value
		dim : Number = 2;
		n_traj : Number = 0
		trajId : Number;
		n_points : Number;
		value : Number;
		lines : string[];
		var reader = rd.createInterface(fs.createReadStream("./trajectories/"+inputFile));
		reader.on("line", (l:string) => {
			lines.push(l);
		})
		// As we are wanting a specific structure to our files:
		index:Number = 0;
		n_dim = +lines[index];
		n_traj = +lines[index+1];
		for(index; index<n_traj;index++) {
			// each line has n components
			line:string[] = lines[index+2].split();
			trajId = +line[0];
			n_points= +line[1];
			if(n_points > this.maxNumPoints) {
				this.maxNumPoints = n_points;
			}
			traj:Trajectory = new Trajectory(trajId, n_dim);
			for(j:Number=0; j<n_points;j++) {
				point:Point = new Point(n_dim);
				for(k:Number=0; k<n_dim;k++) {
					value = line[2];
					point.set_coord(k, value);
				}
				traj.addPoint(point);
			}
			this.trajectoryList.push(traj);
		}
		return true;
	}

	clusterGenerator(filename:string, esp:Number, minLns:Number) {
		generator:clusterGen = new clusterGen(this);
		if(this.n_traj == 0) {
			console.log("Load a trajectory data set first");
		}
		
		// FIRST STEP: Trajectory Partitioning
		if (!generator.partitionTrajectory()) {
			console.log("Unable to partition a trajectory\n");
			return false;
		}

		// SECOND STEP: Density-based Clustering
		if (!generator.performDBSCAN(epsParam, minLnsParam)) {
			console.log("Unable to perform the DBSCAN algorithm\n");
			return false;
		}

		// THIRD STEP: Cluster Construction
		if (!generator.constructCluster()) {
			console.log( "Unable to construct a cluster\n");
			return false;
		}

		// Clusters

	}
}