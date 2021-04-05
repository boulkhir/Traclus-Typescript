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

	ids:LineSegmentId[];
	lineSegmentPointArray:Point[];
	/////////////////////////////////////
	//////    ADDITIONAL CLASSES	/////
	/////////////////////////////////////
	enum PointLocation {
		HEAD , TAIL		
	}

	class LineSegmentId {
		trajectoryId:Number;
		order:Number;
	}

	class CandidateClusterPoint {
		orderingValue:Number;
		lineSegmentId:Number;
		startPointFlag:boolean;
		
	}

	class LineSegmentCluster {
		lineSegmentClusterId:Number;
		nLineSegments:Number;
		avgDirectionVector:Point;
		cosTheta:Number, sinTheta:Number;
		ArrayList<CandidateClusterPoint> candidatePointList = new ArrayList<ClusterGen.CandidateClusterPoint>();
		int nClusterPoints;
		ArrayList<CMDPoint> clusterPointArray = new ArrayList<CMDPoint>();
		int nTrajectories;
		ArrayList<Integer> trajectoryIdList = new ArrayList<Integer>();
		boolean enabled;
	}

	/////////////////////////////////////
	//////    Main Class Generator	/////
	/////////////////////////////////////

	// Default not to be used constructor
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
		this.id
	}

	constructCluster() {
		if (!constructLineSegmentCluster()) {
			return false;
		}
		if (!storeLineSegmentCluster()) {
			return false;
		}
		return true;
	}

	partitionTrajectory() {
		for (let i = 0; i < trajectoryList.size(); i++) {
			pTrajectory:Trajectory = this.traClusDoc.trajectoryList[i];

			findOptimalPartition(pTrajectory);

			this.traClusDoc.trajectoryList[i] = pTrajectory;
		}
		if (!storeCluster()) {
			return false;
		}
		return true;
	}

	performDBSCAN(eps:Number, minLns:Number)  {
		
		this.eps = eps;
		this.minLns = minLns;

		this.currComponentId = 0;
				
		for (let i = 0; i < this.totalLineSegments; i++) {
			this.componentIds.push(-2); // Meaning it's unclassified
		}
		
		for (let i = 0; i < this.totalLineSegments; i++) {
			if (this.componentIds[i] == -2 && expandDenseComponent(i, this.currComponentId, eps, minLns)) {
				this.currComponentId++;
			}
		}
		return true;
	}

	storeCluster() {
		dim:Number = this.traClusDoc.dim;
		startPoint:Point;
		endPoint:Point;

		this.totalLineSegments = 0;

		for(let i=0; i<this.traClusDoc.trajectoryList.length;i++) {
			traj = traClusDoc.trajectoryList[i];
			for(let j=0; j<traj.getNumberPartitionPoints()-1;j++) {
				startPoint = traj.getPartitionPointsArray()[j];
				endPoint = traj.getPartitionPointsArray()[j + 1];
				if (measureDistanceFromPointToPoint(startPoint, endPoint) <50.0) {
					continue;
				}
				this.totalLineSegments++;
				lineSegmentPoint:Point = new Point(2*dim);
				for (let k = 0; k < dim; k++) {
					lineSegmentPoint.set_coord(k, startPoint.get_coord(k));
					lineSegmentPoint.set_coord(dim+k, endPoint.get_coord(k));
				}
				id:LineSegmentId = new LineSegmentId()
				id.trajectoryId = traj.getId();
				id.order = j;

				this.ids.push(id)
				this.lineSegmentPointArray.push(lineSegmentPoint);
			}
		}

		return true;
	}

	optimalPartition() {

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

	computeEncodingCost() {

	}

	measureDistanceFromPointToPoint(point1:Point, point2:Point) {
		dim:Number = point1.get_dim();
		sum:Number = 0.0;
		
		for (let i = 0; i < dim; i++) {
			sum += pow(point2.get_coord(i) - point1.get_coord(i), 2);
		}
		return sqrt(sum);	
	}

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

	measureDistanceFromPointToLineSegment(s:Point, e:Point, p:Point) {
		dim:Number = p.get_dim();
		for (let i = 0; i<dim; i++) {
			this.vector1.set_coord(i, p.get_coord(i)-s.get_coord(i));
			this.vector2.set_coord(i, e.get_coord(i)-s.get_coord(i));
		}
		this.coefficient = computeInnerProduct(vector1, vector2) / computeInnerProduct(vector2, vector2);
		for (let i = 0; i<dim; i++) {
			this.projectionPoint.set_coord(i, s.get_coord(i)+this.coefficient*this.vector2.get_coord(i));
		}
		return measureDistanceFromPointToPoint(p, this.projectionPoint);
	}

	computeDistanceBetweenTwoLineSegments(s1:Point, e1:Point, s2:Point, e2:Point) {
		perpendicularDistance:Number = 0;
		parallelDistance:Number =0;
		angleDistance:Number = 0;

		return subComputeDistanceBetweenTwoLineSegments(startPoint1, endPoint1, startPoint2, endPoint2, perpendicularDistance, parallelDistance, angleDistance);
	}

	subComputeDistanceBetweenTwoLineSegments(s1:Point, e1:Point, s2:Point, e2:Point, perpendicularDistance:Number, parallelDistance:Number, angleDistance:Number) {
		perDist1:Number, perDist2:Number, parDist2:Number, parDist2:Number, len1:Number, len2:Number;
		len1 = measureDistanceFromPointToPoint(s1, e1);
		len2 = measureDistanceFromPointToPoint(s2, e2);

		if (len1>len2) {
			perDist1 = measureDistanceFromPointToLineSegment(s1,e1,s2)
			if (this.coefficient<0.5) parDist1 = measureDistanceFromPointToPoint(s1, this.projectionPoint);
			else parDist1 = measureDistanceFromPointToPoint(e1, this.projectionPoint);

			perDist2 = measureDistanceFromPointToLineSegment(s1,e1,e2)
			if (this.coefficient<0.5) parDist1 = measureDistanceFromPointToPoint(s1, this.projectionPoint);
			else parDist2 = measureDistanceFromPointToPoint(e1, this.projectionPoint);
		} else {
			perDist1 = measureDistanceFromPointToLineSegment(s2,e2,s1)
			if (this.coefficient<0.5) parDist1 = measureDistanceFromPointToPoint(s2, this.projectionPoint);
			else parDist1 = measureDistanceFromPointToPoint(e2, this.projectionPoint);

			perDist2 = measureDistanceFromPointToLineSegment(s2,e2,e1)
			if (this.coefficient<0.5) parDist1 = measureDistanceFromPointToPoint(s2, this.projectionPoint);
			else parDist2 = measureDistanceFromPointToPoint(e2, this.projectionPoint);
		}

		if (!(perDist1 == 0.0 && perDist2 == 0.0)) {
			perDist:Number = (pow(perDist1, 2) + pow(perDist2, 2))/(perDist1+perDist2);
		} else {
			perDist:Number = 0.0;
		}
		if (parDist1<parDist2) {
			parDist:Number = parDist1;
		} else {
			parDist:Number = parDist2;
		}

		if (len1>len2) {
			angleDist:Number = measureAngleDisntance(s1, e1, s2, e2);
		} else {
			angleDist:Number = measureAngleDisntance(s2, e2, s1, e1);
		}
		return perDist + parDist + angleDist;		
	}


	measureAngleDistance(s1:Point, s2:Point, e1:Point, e2:Point) {
		dim:Number = s1.get_dim();

		for (let i = 0; i<dim; i++) {
			this.vector1.set_coord(i, e1.get_coord(i) - s1.get_coord(i));
			this.vector2.set_coord(i, e2.get_coord(i) - s2.get_coord(i));
		}
		// Assume vector1.length>vector2.length
		vLen1:Number = computeVectorLength(this.vector1);
		vLen2:Number = computeVectorLength(this.vector2);

		if (vLen1 == 0.0 || vLen2 == 0.0) return 0.0;

		innerProd:Number = computeInnerProduct(this.vector1, this.vector2);

		cosTheta:Number = innerProd/(vLen1*vLen2);

		if (cosTheta>1.0) cosTheta = 1.0;
		if (cosTheta<-1.0) cosTheta = -1.0;

		sinTheta:Number = sqrt(1-pow(cosTheta,2));

		return vLen2*sinTheta;
	}

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
		sum:Number = 0.0;

		for (let i = 0; i<dim;i++) {
			sum += pow(vector.get_coord(i), 2);
		}

		return sqrt(sum);
	}

	expandDenseComponent()
	constructLineSegmentCluster()
	computeRepresentativeLines()
	computeAndRegisterClusterPoint()

	getSweepPointOfLineSegment() {

	}

	GET_X_ROTATION(x:Number, y:Number, cos:Number, sin:Number) {
		return x*cos + y*sin;
	}

	GET_Y_ROTATION(x:Number, y:Number, cos:Number, sin:Number) {
		return -x*sin + y*cos;
	}

	GET_X_REV_ROTATION(x:Number, y:Number, cos:Number, sin:Number) {
		return x*cos - y*sin;
	}

	GET_Y_REV_ROTATION(x:Number, y:Number, cos:Number, sin:Number) {
		return x*sin + y*cos;
	}

	RegisterAndUpdateLineSegmentCluster()
	computeEPSNeighborhood()
	extractStartAndEndPoints()
	estimateParameterValue()
}