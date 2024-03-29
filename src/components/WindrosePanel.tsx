import React, { useEffect, useState } from 'react';
import { PanelProps } from '@grafana/data';
import { DirectionLabel, SpeedBucketStyle, WindroseOptions } from 'types';
import { Windrose } from './Windrose';
import { createColorMap, highlightColor } from '../utils/colorUtils'
import { calculateWindroseData, extractData, getUpperSpeedLimit } from 'utils/dataUtils';
import { WindroseLegend } from './WindroseLegend';
import { getWindSpeedUnitLabel } from 'utils/labelUtils';

interface WindrosePanelProps extends PanelProps<WindroseOptions> { }

function getPredefinedColorPalette(key: string) {
  switch (key) {
    case "operato": return ["#1b1c20", "#ffffff", "#e6a749"]
    case "greenred": return ["#4af244", "#ecf238", "#f23838"];
    case "bluered": return ["#5e74ff", "#d4d4d4", "#ed3e3e"];
    case "grayscale": return ["#bfbfbf", "#3b3b3b"];
    case "redscale": return ["#ff8f8f", "#400000"];
    case "bluescale": return ["#8fe5ff", "#002b38"];
    default: return ["#3844f2", "#44f2a7", "#ecf238", "#f23838"];
  }
}

function createDefaultStyles(colorPaleteId: string, speedBucketsCount: number) {
  let colorCheckpoints = getPredefinedColorPalette(colorPaleteId);
  let colorBar = createColorMap(colorCheckpoints, speedBucketsCount);

  let constructingSpeedBucketStyles = Array<SpeedBucketStyle>(speedBucketsCount);

  for (let i = 0; i < constructingSpeedBucketStyles.length; i++) {
    let highlightedColor = highlightColor(colorBar[i], -.5);
    let highlightedStrokeColor = highlightColor(colorBar[i], .5);
    let idleBucketStyle = {
      color: colorBar[i],
      opacity: 1,
    }
    let selectedBucketStyle = {
      color: highlightedColor,
      opacity: 1,
    }

    let idleStrokeStyle = {
      stroke: "transparent", strokeWidth: 0
    };

    constructingSpeedBucketStyles[i] = {
      idleBucketStyle: idleBucketStyle,
      selectedBucketStyle: selectedBucketStyle,
      currentBucketStyle: idleBucketStyle,
      bucketsStrokeStyle: {
        stroke: "black", strokeWidth: 1
      },
      idleStrokeStyle: idleStrokeStyle,
      highlightsStrokeStyle: {
        stroke: highlightedStrokeColor, strokeWidth: 4
      },
      currentStrokeStyle: idleStrokeStyle
    };
  }

  return constructingSpeedBucketStyles;
}

export const WindrosePanel: React.FC<WindrosePanelProps> = ({ options, data, width, height }) => {
  let [colorPaleteId, _] = useState(options.colorPalette);

  let speedBucketsCount = options.speedBucketsCount || 8;
  let petalsPer90Deg = options.petalsPer90Deg || 4;

  let constructingSpeedBucketStyles = createDefaultStyles(colorPaleteId, speedBucketsCount);
  const [bucketStyles, setBucketStyles] = useState(constructingSpeedBucketStyles);

  useEffect(() => {
    let constructingSpeedBucketStyles = createDefaultStyles(options.colorPalette, speedBucketsCount);
    setBucketStyles(constructingSpeedBucketStyles);    
  }, [options.colorPalette, speedBucketsCount]);

  const extractedData = extractData(data);

  let calculatedBucketsSize = options.speedBucketsSize || 2;
  if(options.speedBucketsSizeAuto) {
    let limit = getUpperSpeedLimit(extractedData.speed);
    calculatedBucketsSize = limit/speedBucketsCount;
  }
  const finalBucketsSize = calculatedBucketsSize;

  let windData = calculateWindroseData(extractedData, petalsPer90Deg, speedBucketsCount, finalBucketsSize)

  let padding = 32;

  let legendOffset = !options.doesLegendOverlay && options.showLegend ? 150 : 0;
  const windroseRadius = Math.min(height, width - legendOffset) / 2 - padding;
  const windrosePositionX = windroseRadius + padding + (options.legendPosition === 'left' ? legendOffset : 0);
  const windroseCenter = { x: windrosePositionX, y: height / 2 }

  let directionLabels: DirectionLabel[] = [];
  let directionLinesCount = Math.max(0, petalsPer90Deg)

  if (options.windroseLabels === "compass") {
    const cardinalLabelStyle = { css: { font: "bold 20px sans-serif", fill: "white" }, radiusOffset: 16 }
    const ordinalLabelStyle = { css: { font: "normal 15px sans-serif", fill: "white" }, radiusOffset: 16 }
    const intermediateLabelStyle = { css: { font: "italic 10px sans-serif", fill: "white" }, radiusOffset: 16 }

    directionLabels.push({ angle: 0, text: "N", style: cardinalLabelStyle });
    directionLabels.push({ angle: 90, text: "E", style: cardinalLabelStyle });
    directionLabels.push({ angle: 180, text: "S", style: cardinalLabelStyle });
    directionLabels.push({ angle: 270, text: "W", style: cardinalLabelStyle });

    directionLinesCount = 1;

    if (options.cardinalLabels !== "cardinal") {
      directionLabels.push({ angle: 45, text: "NE", style: ordinalLabelStyle });
      directionLabels.push({ angle: 135, text: "SE", style: ordinalLabelStyle });
      directionLabels.push({ angle: 225, text: "SW", style: ordinalLabelStyle });
      directionLabels.push({ angle: 315, text: "NW", style: ordinalLabelStyle });
      directionLinesCount = 2
    }
    if (options.cardinalLabels === "intermediate") {
      directionLabels.push({ angle: 22.5, text: "NNE", style: intermediateLabelStyle });
      directionLabels.push({ angle: 67.5, text: "ENE", style: intermediateLabelStyle });
      directionLabels.push({ angle: 112.5, text: "ESE", style: intermediateLabelStyle });
      directionLabels.push({ angle: 157.5, text: "SSE", style: intermediateLabelStyle });
      directionLabels.push({ angle: 202.5, text: "SSW", style: intermediateLabelStyle });
      directionLabels.push({ angle: 247.5, text: "WSW", style: intermediateLabelStyle });
      directionLabels.push({ angle: 292.5, text: "WNW", style: intermediateLabelStyle });
      directionLabels.push({ angle: 337.5, text: "NNW", style: intermediateLabelStyle });
      directionLinesCount = 4
    }
  } else if (options.windroseLabels === "degree") {
    const degreeLableStyle = { css: { font: "normal 12px sans-serif", fill: "white" }, radiusOffset: 16 }
    let totalPetals = petalsPer90Deg * 4;
    let angleDiff = 360 / totalPetals;
    for (let i = 0; i < totalPetals; i++) {
      let angle = angleDiff * i;
      directionLabels.push({ angle: angle, text: angle + "°", style: degreeLableStyle });
    }
  }

  let windSpeedUnit = getWindSpeedUnitLabel(options.windSpeedUnit);
  let windroseLegend = <WindroseLegend bucketsSize={finalBucketsSize} bucketStyles={bucketStyles} changeStyle={setBucketStyles} windSpeedUnit={windSpeedUnit} anchor={options.legendAnchor} position={options.legendPosition} />

  let tooltipDecimalPlaces = options.tooltipDecimalPlaces;
  if(tooltipDecimalPlaces == null) { tooltipDecimalPlaces = 1; }

  return (
    <div>
      <Windrose
        width={width} height={height} radius={windroseRadius} center={windroseCenter}
        data={windData} bucketsCount={petalsPer90Deg} directionLabels={directionLabels}
        styles={bucketStyles} changeStyle={setBucketStyles} tooltipDecimalPlaces={tooltipDecimalPlaces}
        directionLinesCount={directionLinesCount} windSpeedUnit={windSpeedUnit} legendPosition={options.legendPosition} />
      {options.showLegend && windroseLegend}
    </div>

  );
};
