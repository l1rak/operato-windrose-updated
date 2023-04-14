type SeriesSize = 'sm' | 'md' | 'lg';

export interface SimpleOptions {
  text: string;
  showSeriesCount: boolean;
  seriesCountSize: SeriesSize;
}

export interface WindroseOptions {
  tooltipDecimalPlaces: number;
  petalsPer90Deg: number;
  overwriteSpeedBucketBounds: boolean;
  speedBucketsCount: number;
  speedBucketsSize: number;
  windroseLabels: string;
  cardinalLabels: string;
}

export interface SpeedBucketStyleValues {
  color: string;
  opacity: number;
}

export interface SpeedBucketStyle {
  idleBucketStyle: SpeedBucketStyleValues;
  selectedBucketStyle: SpeedBucketStyleValues;
  currentBucketStyle: SpeedBucketStyleValues;
}


export type Vector2 = {
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
  totalRelativeSize: number;
  petalRelativeSize: number;
}

export type PetalBucket = {
  speedBuckets: SpeedBucket[];
  index: number;
  centerAngle: number;
  petalValuesCount: number;
}

export type WindroseData = {
  petalBuckets: PetalBucket[];
}

export type WindData = {
  speed: number[];
  direction: number[];
}

export type SvgLabelCSS = {
  fill: string;
  font: string;
}

export type SvgLabelStyle = {
  css: SvgLabelCSS;
  radiusOffset: number;
}

export type DirectionLabel = {
  angle: number;
  text: string;
  style: SvgLabelStyle;
}

export type WindroseProps = {
  data: WindroseData;
  width: number;
  height: number;
  radius: number;
  center: Vector2;
  bucketsCount: number;
  styles: SpeedBucketStyle[];
  directionLinesCount: number;
  changeStyle: React.Dispatch<React.SetStateAction<SpeedBucketStyle[]>>;
  tooltipDecimalPlaces: number;
  directionLabels: DirectionLabel[]
};

export type WindroseLegendProps = {
  bucketsSize: number;
  bucketColors: string[];  
  changeStyle: React.Dispatch<React.SetStateAction<SpeedBucketStyle[]>>;
}
