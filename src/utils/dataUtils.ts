import { PanelData } from "@grafana/data";
import { PetalBucket, SpeedBucket, WindData, WindroseData } from "types";

export function extractData(data: PanelData) {
    if(data.series.length === 0) {
        return { direction: [], speed: [] }
    }
    let weatherData = data.series[0];

    let speed: number[] = [];
    let direction: number[] = [];

    for (let i = 0; i < weatherData.fields[0].values.length; i++) {
        for (let j = 0; j < weatherData.fields.length; j++) {
            let field = weatherData.fields[j];
            if (field.name === 'wind_speed') { speed.push(field.values.get(i)); }
            if (field.name === 'wind_direction') { direction.push(field.values.get(i)); }
        }
    }

    const windDataFrame: { direction: number[], speed: number[] } = {
        direction: direction,
        speed: speed
    }
    return windDataFrame;
}

export function getUpperSpeedLimit(speedData: number[]) {
    if(speedData.length === 0) { return 0; }
    const max = speedData.reduce((a: number, b: number) => Math.max(a, b));
    return max;
}

export function sortToPetalBuckets(speedBucketSize: number, speedBucketCount: number, speedData: number[]): SpeedBucket[] {
    let buckets = new Array<SpeedBucket>(0);
    for (let i = 1; i <= speedBucketCount; i++) {
        buckets.push({ index: i-1, speedUpperBound: speedBucketSize * (i), totalRelativeSize: 0, petalRelativeSize: 0 });
    }

    speedData.forEach((item) => {
        let idx = Math.min(speedBucketCount - 1, (Math.floor(item / speedBucketSize)));
        buckets[idx].petalRelativeSize++;
    });

    let nonEmptyBuckets = new Array<SpeedBucket>(0);
    buckets.forEach((bucket) => {
        bucket.totalRelativeSize = bucket.petalRelativeSize;
        if (bucket.totalRelativeSize > 0) { nonEmptyBuckets.push(bucket); }
    });

    return nonEmptyBuckets;
}

export function calculateWindroseData(windData: WindData, bucketsPer90Deg: number, speedBucketCount: number, speedBucketSize: number): WindroseData {    
    /*windData = {
        speed: [.1,.3,.6,.8,1.1,1.3,1.6,1.8],
        direction: [0,0,0,0,90,90,45,45]
    }*/
    
    // Global bounds inital values
    let totalBucketsCount = bucketsPer90Deg * 4;
    let globalBound = -Infinity;
    let dataPointsCount = windData.speed.length;

    // Bucket array instantiation
    let buckets = new Array(totalBucketsCount);
    for (let i = 0; i < buckets.length; i++) { buckets[i] = []; }

    // Bucket filling
    let bucketSize = 360 / (totalBucketsCount);
    for (let i = 0; i < dataPointsCount; i++) {
        let speed = windData.speed[i];
        let direction = windData.direction[i];
        globalBound = Math.max(globalBound, direction);
        let idx = Math.floor(((direction + bucketSize / 2) % 360) / (bucketSize))
        buckets[idx].push(speed)
    }

    let windroseData = { petalBuckets: new Array<PetalBucket>(0), maxPetalPercent: 0 }
    let maxPetalSize = 0;
    for (let i = 0; i < buckets.length; i++) {
        if (buckets[i].length === 0) { continue; }
        maxPetalSize = Math.max(maxPetalSize, buckets[i].length);
        let speedBuckets = sortToPetalBuckets(speedBucketSize, speedBucketCount, buckets[i]);
        windroseData.petalBuckets.push({
            index: i, speedBuckets: speedBuckets, 
            centerAngle: bucketSize * i,
            petalValuesCount: buckets[i].length,
            containedDataRatio: buckets[i].length/dataPointsCount
        });
    }


    windroseData.petalBuckets.forEach((petalBucket) => {
        petalBucket.speedBuckets.forEach((speedBucket) => {
            speedBucket.petalRelativeSize /= maxPetalSize;
            speedBucket.totalRelativeSize /= windData.speed.length;
        })
    })
    windroseData.maxPetalPercent = maxPetalSize/dataPointsCount;

    return windroseData;
}  
