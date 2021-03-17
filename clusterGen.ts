import {Cluster} from "./cluster";


class ClusterGenerator {
	traClusDoc:TraClusDoc;
	// Parameters
	eps:Number;
	minLns:Number;
	totalLineSegments:Number;
	currComponentId:Number;
	//
	componentIds:Number[];
	lineSegments:TypeOfaLS[]; // Has to be put as a traj and it's order
	//
	startPoint1:Point;
	endPoint1:Point;
	startPoint2:Point;
	endPoint2:Point;

	vector1:Point;
	vector2:Point;
	projectionPoint:Point;
	coefficient:Number;
	// additional Classes s.a:
	/**
	 * LineSegmentId (traj+order)
	 * Candidate Point To Cluster
	 * Line segment cluster
	 * 
	 * 
	 */


	constructer() {
		// ?
	}

	constructer(traClusDoc:TraClusDoc) {
		this.traClusDoc = traClusDoc;

		this.startPoint1 = new Point(traClusDoc.dim);
		this.startPoint2 = new Point(traClusDoc.dim);
		this.endPoint1 = new Point(traClusDoc.dim);
		this.endPoint2 = new Point(traClusDoc.dim);

		this.vector1 = new Point(traClusDoc.dim);
		this.vector2 = new Point(traClusDoc.dim);
		this.projectionPoint = new Point(traClusDoc.dim);

		// Initialising/Clearing directories
	}

	partitionTrajectory() {
		for (let i = 0; i < trajectoryList.size(); i++) {		/// trajectoryListFromFeeds
			pTrajectory:Trajectory = this.traClusDoc.trajectoryList[i];

			findOptimalPartition(pTrajectory);	// Is this sufficient to change traj
			// Or this line in case			
			this.traClusDoc.trajectoryList[i] = pTrajectory;
		}
		// ...	
	}

	performDBSCAN(eps:Number, minLns:Number)  {
		
		this.eps = eps;
		this.minLns = minLns;

		this.currComponentId = 0;
				
		for (let i = 0; i < this.totalLineSegments; i++) {
			this.componentIds.push(-2); // Meaning it's unclassified
		}
		
		for (let i = 0; i < this.totalLineSegments; i++) {
			if (this.componentIds[i] == -2) {  // Unfinished conditioning neighbors as core points
				this.currComponentId++;
			}
		}
	}

	storeCluster() {
		dim:Number = this.traClusDoc.dim;
		startPoint:Point;
		endPoint:Point;

		n_totalLineSegments = 0; // Should be attributed to the class...
		for(let i=0; i<this.traClusDoc.trajectoryList.length;i++) {
			traj = traClusDoc.trajectoryList[i];
			for(let j=0; j<traj.getNumberPartitionPoints()-1;j++) {
				startPoint = traj.getPartitionPointsArray()[j];
				endPoint = traj.getPartitionPointsArray()[j + 1];
				if (measureDistanceFromPointToPoint(startPoint, endPoint) <MIN_LINESEGMENT_LENGTH) { // MIN_LINESEGMENT_LENGTH to define or take from user
					continue;
				}
				n_totalLineSegments++;
				lineSegmentPoint:Point = new Point(2*dim);
				for (let k = 0; k < dim; k++) {
					lineSegmentPoint.set_coord(k, startPoint.get_coord(k));
					lineSegmentPoint.set_coord(dim+k, endPoint.get_coord(k));
				}
				// Unfinished
			}
		}
	}

	log2(x:Number) {
		return log(x) / log(2);
	}

	computeModelCost(pTrajectory:Trajectory, startIndex:Number, endIndex:Number) {

		lineSegmentStart:Point = pTrajectory.getPointsArray()[startIndex];
		lineSegmentEnd:Point = pTrajectory.getPointsArray()[endIndex];
		
		distance:Number = measureDistanceFromPointToPoint(lineSegmentStart, lineSegmentEnd);  // à definir
		
		if (distance < 1.0) {
			distance = 1.0; 		// to take logarithm
		}
		
		return ceil(log2(distance));

	}

	measureDistanceFromPointToPoint(point1:Point, point2:Point) {
		dim:Number = point1.get_dim();
		sum:Number = 0.0;
		
		for (let i = 0; i < dim; i++) {
			sum += pow(point2.get_coord(i) - point1.get_coord(i), 2);
		}
		return sqrt(sum);	
	}

	measureDistanceFromPointToLineSegment() {}
	computeVectorLength(vector:Point) {}

	measurePerpendicularDistance(s1:Point, s2:Point, e1:Point, e2:Point) {
		distance1:Number;
		distance2:Number;
		distance1 = measureDistanceFromPointToLineSegment(s1, e1, s2);
		distance2 = measureDistanceFromPointToLineSegment(s1, e1, e2);
		// case segmants are normal (same segment)
		if (distance1 == 0.0 && distance2 == 0.0) return 0.0;
		// General case
		return (pow(distance1, 2) + pow(distance2, 2)) / (distance1 + distance2);
	}

	measureAngleDistance(s1:Point, s2:Point, e1:Point, e2:Point) {

	}

	measurePerpendicularDistance() {}

	computeInnerProduct(vector1:Point, vector2:Point) {
		dim:Number = vector1.get_dim();
		innerProduct:Number = 0.0;
		
		for (let i = 0; i < dim; i++) {
			innerProduct += (vector1.get_coord(i) * vector2.get_coord(i));
		}
		
		return innerProduct;
	}

	computeVectorLength(vector:Point) {
		
		dim:Number = vector.get_dim();
		squareSum:Number = 0.0;
		
		for (let i = 0; i < dim; i++) {
			squareSum += pow(vector.get_coord(i), 2);
		}
		
		return sqrt(squareSum);		
	}
}