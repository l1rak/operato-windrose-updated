import React from 'react';
import { PanelProps, PanelData } from '@grafana/data';
import { WindroseOptions } from 'types';
import { css, cx } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { PetalBucket, SpeedBucket, WindData, Windrose, WindroseData } from './Windrose';

interface WindrosePanelProps extends PanelProps<WindroseOptions> {}

const getStyles = () => {
  return {
    wrapper: css`
      font-family: Open Sans;
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
    windrose__background: css`
      color: white;
    `,
  };
};

function extractData(data: PanelData) {
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

function calculateSpeedBuckets(speedBucketSize: number, speedBucketCount: number, speedData: number[]): SpeedBucket[] {
  let buckets = new Array<SpeedBucket>(0);
  for(let i = 1; i <= speedBucketCount; i++) { 
    buckets.push({index: i, speedUpperBound: speedBucketSize*(i), size: 0}); 
  }

  return buckets;
}

function calculateWindroseData(windData: WindData, bucketsPer90Deg: number, speedBucketCount: number, speedBucketSize: number): WindroseData {
  /*bucketsPer90Deg = 2
  windData = {
    speed: [316, 360, 0, 44, 46, 90, 134, 136, 180, 224, 226, 270, 314],
    direction: [316, 360, 0, 44, 46, 90, 134, 136, 180, 224, 226, 270, 314]
  }
  windData = {
    speed: [],
    direction: []
  }
  for(let d = 0; d < 359; d++){
    windData.speed.push(d);
    windData.direction.push(d);
  }*/

  // Global bounds inital values
  let totalBucketsCount = bucketsPer90Deg*4;
  let globalBound = -Infinity;

  // Bucket array instantiation
  let buckets = new Array(totalBucketsCount);
  for(let i = 0; i < buckets.length; i++) { buckets[i] = []; }

  // Bucket filling
  let bucketSize = 360/(totalBucketsCount);
  for(let i = 0; i < windData.direction.length; i++){
    let speed = windData.speed[i];
    let direction = windData.direction[i];
    globalBound = Math.max(globalBound, direction);
    let idx = Math.floor(((direction+bucketSize/2)%360)/(bucketSize))
    buckets[idx].push(speed)
  }

  console.log("Size: "+speedBucketSize)
  console.log("Count: "+speedBucketCount)
  let windroseData = {petalBuckets: new Array<PetalBucket>(0)}
  for(let i = 0; i < buckets.length; i++){
    let speedBuckets = calculateSpeedBuckets(speedBucketSize, speedBucketCount, buckets[i]);
    windroseData.petalBuckets.push({speedBuckets: speedBuckets});
  }

  return windroseData;
}

export const WindrosePanel: React.FC<WindrosePanelProps> = ({ options, data, width, height }) => {
  const styles = useStyles2(getStyles);

  let windData = calculateWindroseData(extractData(data), options.petalsPer90Deg, options.speedBucketsCount, options.speedBucketsSize)

  console.log(windData)

  const windroseRadius = Math.min(height, width)/2-64;
  const windroseCenter = { x: width/2, y: height/2 }

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <Windrose width={width} height={height} data={windData} radius={windroseRadius} center={windroseCenter} bucketsCount={options.petalsPer90Deg} />
    </div>
  );
};
