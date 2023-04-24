import { Tooltip } from '@grafana/ui';
import React from 'react';

import { Svg } from './Svg'
import { Vector2, WindroseData, WindroseProps } from 'types';
import { constructCakeSlice, createPetalLine } from 'utils/svgUtils';
import { onMouseEnterPolygon, onMouseLeavePolygon } from 'utils/stylesUtils';

function createCircleScale(data: WindroseData, radius: number, center: Vector2, percentLabelAngle: number) {
  // Create rings
  let circlesRings: JSX.Element[] = [];
  let topCirclesRings: JSX.Element[] = [];

  let ringsCount = 5;
  let subringsCount = 5;

  let minimumSubringRadius = 275;
  let ringRadius = radius * .9 / ringsCount;
  for (let i = 0; i < ringsCount; i++) {
    let currentRingRadius = radius * (.1 + .9 * i / ringsCount);
    if (i > 0) { circlesRings.push(<circle cx={center.x} cy={center.y} r={currentRingRadius} strokeDasharray="" fill="transparent" stroke='#222222' strokeWidth='.5' />); }
    //if (i > 0) { topCirclesRings.push(<circle cx={center.x} cy={center.y} r={currentRingRadius} strokeDasharray="" style={{ pointerEvents: 'none'}} fill="transparent" stroke='#222222' opacity={.1} strokeWidth='.5' />); }
    if (radius > minimumSubringRadius) {
      for (let j = 1; j < subringsCount; j++) {
        currentRingRadius = radius * (.1 + .9 * i / ringsCount) + ringRadius * j / subringsCount;
        circlesRings.push(<circle cx={center.x} cy={center.y} r={currentRingRadius} strokeDasharray="5,5" fill="transparent" stroke='#222222' strokeWidth='.25' />);
        //topCirclesRings.push(<circle cx={center.x} cy={center.y} r={currentRingRadius} strokeDasharray="5,5" style={{ pointerEvents: 'none'}} fill="transparent" stroke='#222222' opacity={.1} strokeWidth='.25' />);
      }
    }
  }

  // Create percent labels
  let percentLabels: JSX.Element[] = [];

  let sin = Math.sin(percentLabelAngle);
  let cos = Math.cos(percentLabelAngle);

  let fontSize = 15*radius/minimumSubringRadius;
  let adjustedFontSize = Math.min(15, fontSize);
  let labelFont = `normal ${adjustedFontSize}px sans-serif`;
  for (let i = 1; i < ringsCount; i++) {
    let centerDistance = radius * (i / ringsCount * .9 + .1);
    let x = center.x + cos * centerDistance;
    let y = center.y + sin * centerDistance;
    let percent = data.maxPetalPercent / ringsCount * i * 100;

    percentLabels.push(
      <text x={x} y={y} style={
        { 
          pointerEvents: 'none' ,
          font: labelFont
        }
      }
        dominantBaseline="auto" textAnchor="start"
      >{Math.round(percent * 10) / 10 + "%"}</text>
    );
  }

  return [circlesRings, topCirclesRings, percentLabels]
}

export const Windrose = ({ data, width, height, center, radius, bucketsCount, styles, changeStyle, tooltipDecimalPlaces, directionLabels, directionLinesCount }: WindroseProps) => {

  let petalNumber = bucketsCount;

  let linePetals: JSX.Element[] = [];

  let angleDiff = Math.PI / petalNumber / 2;
  for (let i = 0; i < petalNumber * 2; i++) {
    let angle = angleDiff * i;

    let isBold = i === 0 || i === petalNumber
    linePetals.push(createPetalLine(angle, radius, center, isBold, true));
    linePetals.push(createPetalLine(angle + Math.PI, radius, center, isBold, true));
  }

  let lineAngleDiff = Math.PI / directionLinesCount / 2;
  let oneDegreeInRad = Math.PI / 180;
  for (let i = 0; i < directionLinesCount * 2; i++) {
    let angle = lineAngleDiff * i;

    let isBold = i === 0 || i === directionLinesCount
    linePetals.push(createPetalLine(angle, radius, center, isBold, false));
    linePetals.push(createPetalLine(angle + Math.PI, radius, center, isBold, false));
  }


  tooltipDecimalPlaces = Math.max(0, Math.round(tooltipDecimalPlaces))

  let petalBuckets: JSX.Element[] = [];
  let petalBucketHighlights: JSX.Element[] = [];
  let normalizedRadius = radius * 0.9;
  let normalizedStartRadius = radius * 0.1;
  let deg2rad = Math.PI / 180;
  for (let i = 0; i < data.petalBuckets.length; i++) {
    let petalBucket = data.petalBuckets[i];
    let centerAngle = ((petalBucket.centerAngle + 270) % 360) * deg2rad;

    let prevBucketSize = normalizedStartRadius;
    petalBucket.speedBuckets.forEach((speedBucket, index) => {
      let startRadius = prevBucketSize;
      let endRadius = prevBucketSize + normalizedRadius * speedBucket.petalRelativeSize;
      prevBucketSize = endRadius;

      let polypointString = constructCakeSlice(centerAngle, angleDiff - oneDegreeInRad, center, startRadius - .05, endRadius + .05);
      let bucketStyle = styles[speedBucket.index];
      petalBuckets.push(
        <Tooltip content={Math.round(speedBucket.totalRelativeSize * 100 * Math.pow(10, tooltipDecimalPlaces)) / Math.pow(10, tooltipDecimalPlaces) + "%"}>
          <polygon className={speedBucket.index.toString()}
            onMouseEnter={(event) => { onMouseEnterPolygon(event, changeStyle, speedBucket.index) }} onMouseLeave={(event) => { onMouseLeavePolygon(event, changeStyle, speedBucket.index) }}
            points={polypointString}
            fill={bucketStyle.currentBucketStyle.color} fillOpacity={bucketStyle.currentBucketStyle.opacity}
            stroke={bucketStyle.bucketsStrokeStyle.stroke} strokeWidth={bucketStyle.bucketsStrokeStyle.strokeWidth} />
        </Tooltip>
      );
      petalBucketHighlights.push(
        <polygon className={speedBucket.index.toString()}
            stroke={bucketStyle.currentStrokeStyle.stroke} strokeWidth={bucketStyle.currentStrokeStyle.strokeWidth}
            style={{ pointerEvents: 'none' }}
            points={polypointString}
            fill="transparent"  />
      );
    });
  }


  let cardinalLabels: JSX.Element[] = [];
  for (let i = 0; i < directionLabels.length; i++) {
    let label = directionLabels[i];
    let angle = (label.angle - 90) * deg2rad;
    let cardinalOffset = radius + label.style.radiusOffset;
    let x = center.x + Math.cos(angle) * cardinalOffset
    let y = center.y + Math.sin(angle) * cardinalOffset
    cardinalLabels.push(
      <text x={x} y={y} style={label.style.css} dominantBaseline="middle" textAnchor="middle">
        {label.text}</text>);
  }

  let percentLabelAngle = angleDiff * 2 + angleDiff / 2 - 90 * deg2rad;
  let [circlesRings, topCirclesRings, percentLabels] = createCircleScale(data, radius, center, percentLabelAngle);

  return (
    <div>
      <div>
        <svg width={width} height={height}>
          <Svg>
            <circle cx={center.x} cy={center.y} r={radius} fill="#f0f0f0" />

            <circle cx={center.x} cy={center.y} r={radius * .1} fill="#dddddd" />
            <circle cx={center.x} cy={center.y} r={radius} fill="transparent" stroke='#222222' strokeWidth='1' />
            <circle cx={center.x} cy={center.y} r={radius * .1} fill="transparent" stroke='#222222' strokeWidth='1' />
            <Svg>
              {circlesRings}
            </Svg>
            <Svg>
              {linePetals}
            </Svg>
            <Svg>
              {petalBuckets}
            </Svg>
            <Svg>
              {petalBucketHighlights}
            </Svg>
            <Svg>
              {percentLabels}
            </Svg>
            <Svg>
              {cardinalLabels}
            </Svg>
            <Svg>
              {topCirclesRings}
            </Svg>
          </Svg>
        </svg>
      </div>
    </div>
  );
};
