import React from 'react';

import {Svg} from './Svg'

type Vector2 = {
  x: number,
  y: number;
}

export type Bounds = {
  min: number;
  max: number;
}

export type SpeedBucket = {
  index: number;
  speedUpperBound: number;
  size: number;
}

export type PetalBucket = {
  speedBuckets: SpeedBucket[];
}

export type WindroseData = {
  petalBuckets: PetalBucket[];
}

export type WindData = {
  speed: number[];
  direction: number[];
}

type WindroseProps = {
  data: WindroseData;
  width: number;
  height: number;
  radius: number;
  center: Vector2;
  bucketsCount: number;
};

function constructCakeSlice(centerAngle: number, angleOffset: number, circleCenter: Vector2, startRadius: number, endRadius: number): string{
  let polypoint = "";

  let leftAngle = centerAngle-angleOffset/2;
  let rightAngle = centerAngle+angleOffset/2;

  let leftLowX = Math.cos(leftAngle)*startRadius+circleCenter.x
  let leftLowY = Math.sin(leftAngle)*startRadius+circleCenter.y;
  let leftHighX = Math.cos(leftAngle)*endRadius+circleCenter.x
  let leftHighY = Math.sin(leftAngle)*endRadius+circleCenter.y;
  polypoint += leftLowX+","+leftLowY+" "
  polypoint += leftHighX+","+leftHighY+" "

  let degree = Math.PI/180;
  for(let i = degree; i < angleOffset; i += degree) {
    let pointX = Math.cos(i+leftAngle)*endRadius+circleCenter.x
    let pointY = Math.sin(i+leftAngle)*endRadius+circleCenter.y;
    polypoint += pointX+","+pointY+" "
  }

  let righttLowX = Math.cos(rightAngle)*startRadius+circleCenter.x;
  let righttLowY = Math.sin(rightAngle)*startRadius+circleCenter.y;
  let rightHighX = Math.cos(rightAngle)*endRadius+circleCenter.x;
  let rightHighY = Math.sin(rightAngle)*endRadius+circleCenter.y;
  polypoint += rightHighX+","+rightHighY+" "
  polypoint += righttLowX+","+righttLowY+" "

  for(let i = degree; i < angleOffset; i += degree) {
    let pointX = Math.cos(rightAngle-i)*startRadius+circleCenter.x
    let pointY = Math.sin(rightAngle-i)*startRadius+circleCenter.y;
    polypoint += pointX+","+pointY+" "
  }

  return polypoint;
}

function createPetalLine(angle: number, radius: number, center: Vector2, isBold: boolean) {
  let innerCircleX = center.x+Math.cos(angle)*radius*.1;
    let outerCircleX = center.x+Math.cos(angle)*radius;
    let innerCircleY = center.y+Math.sin(angle)*radius*.1;
    let outerCircleY = center.y+Math.sin(angle)*radius;
    return (<line x1={innerCircleX} y1={innerCircleY} x2={outerCircleX} y2={outerCircleY} strokeWidth={isBold ? 4:1} stroke='#222222' />);
    
}

export const Windrose = ({ data, width, height, center, radius, bucketsCount }: WindroseProps) => {
  let petalNumber = bucketsCount;
  let ringNumber = 4;
  
  let linePetals: JSX.Element[] = [];
  let circlesRings: JSX.Element[] = [];

  let angleDiff = Math.PI/petalNumber/2;
  for(let i = 0; i < petalNumber*2; i++){
    let angle = angleDiff*i;

    let isBold = i===0 || i === petalNumber
    linePetals.push(createPetalLine(angle, radius, center, isBold));
    linePetals.push(createPetalLine(angle+Math.PI, radius, center, isBold));
  }

  for(let i = 1; i <= ringNumber; i++){
    let ratio = .1 + (.9*i/(ringNumber+1));    
    circlesRings.push(<circle cx={center.x} cy={center.y} r={radius*ratio} strokeDasharray="5,5" fill="transparent" stroke='#222222' strokeWidth='1' />);
  }

  let anglePowers  = [1, 2, 4, 2, 1, 1, 2, 0, 1, 4, 3, 2, 4, 1, 2, 0]
  let cakeSlices: JSX.Element[] = [];
  for(let i = 0; i < anglePowers.length; i++){
    let centerAngle = (90/petalNumber)/180*Math.PI*i;
    let power = anglePowers[i];
    
    if(power > 0) {
      let polypoint1 = constructCakeSlice(centerAngle, angleDiff, center, radius*.1, radius*.2);
      linePetals.push(<polygon points={polypoint1} fill="blue" />);
      if(power > 1) {
        let polypoint2 = constructCakeSlice(centerAngle, angleDiff, center, radius*.2, radius*.4);
        linePetals.push(<polygon points={polypoint2} fill="lime" />);
        if(power > 2) {
          let polypoint3 = constructCakeSlice(centerAngle, angleDiff, center, radius*.4, radius*.7);
          linePetals.push(<polygon points={polypoint3} fill="yellow" />);
          if(power > 3) {
            let polypoint4 = constructCakeSlice(centerAngle, angleDiff, center, radius*.7, radius*1);
            linePetals.push(<polygon points={polypoint4} fill="red" />);        
          }
        }
      }
    }

  }

  return (
    <div>
      <div>
        <svg width={width} height={height}>
          <Svg>
            <circle cx={center.x} cy={center.y} r={radius} fill="#f0f0f0" />
            <Svg>
              {cakeSlices}
            </Svg>
            <circle cx={center.x} cy={center.y} r={radius*.1} fill="#dddddd" />
            <circle cx={center.x} cy={center.y} r={radius} fill="transparent" stroke='#222222' strokeWidth='1' />
            <circle cx={center.x} cy={center.y} r={radius*.1} fill="transparent" stroke='#222222' strokeWidth='1' />            
            <Svg>
              {circlesRings}
            </Svg>
            <Svg>
              {linePetals}
            </Svg>
          </Svg>
        </svg>        
      </div>
    </div>
  );
};
