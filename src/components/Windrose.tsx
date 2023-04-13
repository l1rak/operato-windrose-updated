import { Tooltip } from '@grafana/ui';
import React from 'react';

import { Svg } from './Svg'
import { SpeedBucketStyle, WindroseProps } from 'types';
import { constructCakeSlice, createPetalLine } from 'utils/svgUtils';

function onMouseEnter(event: React.MouseEvent<SVGPolygonElement, MouseEvent>, changeStyle: React.Dispatch<React.SetStateAction<SpeedBucketStyle[]>>, index: number) {
  changeStyle((styles)=>{
    let newStyles = [...styles]
    newStyles[index].currentBucketStyle = newStyles[index].selectedBucketStyle;
    return newStyles;
  })
  //let target = event.target as SVGElement;  
  //target.setAttribute("stroke", "#aaaaaa")
  //target.setAttribute("stroke-width", "2")
}
function onMouseLeave(event: React.MouseEvent<SVGPolygonElement, MouseEvent>, changeStyle: React.Dispatch<React.SetStateAction<SpeedBucketStyle[]>>, index: number) {
  changeStyle((styles)=>{
    let newStyles = [...styles]
    newStyles[index].currentBucketStyle = newStyles[index].idleBucketStyle;
    return newStyles;
  })
  //let target = event.target as SVGElement;
  //target.setAttribute("stroke", "")
  //target.setAttribute("stroke-width", "0")
}

export const Windrose = ({ data, width, height, center, radius, bucketsCount, styles, changeStyle }: WindroseProps) => {

  let ringRadius = 25;

  let petalNumber = bucketsCount;
  let ringNumber = Math.ceil(radius/ringRadius);

  let linePetals: JSX.Element[] = [];
  let circlesRings: JSX.Element[] = [];

  let angleDiff = Math.PI / petalNumber / 2;
  let oneDegreeInRad = Math.PI / 180;
  for (let i = 0; i < petalNumber * 2; i++) {
    let angle = angleDiff * i;

    let isBold = i === 0 || i === petalNumber
    linePetals.push(createPetalLine(angle, radius, center, isBold));
    linePetals.push(createPetalLine(angle + Math.PI, radius, center, isBold));
  }

  let currentRingRadius = .1 * radius;
  for (let i = 1; i <= ringNumber; i++) {
    //let ratio = .1 + (.9 * i / (ringNumber + 1));
    currentRingRadius += ringRadius;
    circlesRings.push(<circle cx={center.x} cy={center.y} r={currentRingRadius} strokeDasharray="5,5" fill="transparent" stroke='#222222' strokeWidth='1' />);
  }

  let cakeSlices: JSX.Element[] = [];
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
      cakeSlices.push(
        <Tooltip content={Math.round(speedBucket.totalRelativeSize*100)+"%"}>
          <polygon className={speedBucket.index.toString()} 
          onMouseEnter={(event)=>{onMouseEnter(event, changeStyle, index)}} onMouseLeave={(event)=>{onMouseLeave(event, changeStyle, index)}} 
          points={polypointString} 
          fill={styles[index].currentBucketStyle.color} fillOpacity={styles[index].currentBucketStyle.opacity}/>
        </Tooltip>
      );
    });

  }

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
              {cakeSlices}
            </Svg>
            <Svg>
              
            </Svg>
          </Svg>
        </svg>
      </div>
    </div>
  );
};
