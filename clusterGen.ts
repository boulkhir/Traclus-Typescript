import {Cluster} from "./cluster"

class ClusterGenerator {
	eps:Number;
	minLnsParam:Number;
	totalLineSegments:Number;
	currComponentId:Number;
	//
	componentIds:Number[];
	lineSegments:Trajectory[]; //
	//
	startPoint1:Point;
	endPoint1:Point;
	startPoint2:Point;
	endPoint2:Point;

	vector1:Point;
	vector2:Point;
	projectionPoint:Point;
	coefficient:Number;

	// constructer

	partitionTrajectory() {
		pTrajectory:Trajectory;	
		for (let i = 0; i < trajectoryList.size(); i++) {		/// trajectoryListFromFeeds
			pTrajectory = trajectoryList[i];

			findOptimalPartition(pTrajectory);	// porbably optimal partition ptrajetory
			
			trajectoryList[i] = pTrajectory;
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

	log2(x:Number) {
		return log(x) / log(2);
	}

	computeModelCost(pTrajectory:Trajectory, startIndex:Number, endIndex:Number) {

		lineSegmentStart:Point = pTrajectory.getPointsArray()[startPIndex];
		lineSegmentEnd:Point = pTrajectory.getPointsArray()[endPIndex];
		
		distance:Number = measureDistanceFromPointToPoint(lineSegmentStart, lineSegmentEnd);  // à definir
		
		if (distance < 1.0) {
			distance = 1.0; 		// to take logarithm
		}
		
		return ceil(LOG2(distance));

	}

	measureDistanceFromPointToPoint(point1:Point, point2:Point) {
		dim:Number = point1.getM_nDimensions();
		sum:Number = 0.0;
		
		for (let i = 0; i < dim; i++) {
			sum += pow(point2.get_coord(i) - point1.get_coord(i), 2);
		}
		return sqrt(sum);	
	}

	measureDistanceFromPointToLineSegment() {}
	computeVectorLength(vector:Point) {}

	measurePerpendicularDistance() {}
	measureAngleDisntance() {}
	measurePerpendicularDistance() {}

}