type SeriesSize = 'sm' | 'md' | 'lg';

export interface SimpleOptions {
  text: string;
  showSeriesCount: boolean;
  seriesCountSize: SeriesSize;
}

export interface WindroseOptions {
  petalsPer90Deg: number;
  overwriteSpeedBucketBounds: boolean;
  speedBucketsCount: number;
  speedBucketsSize: number;
}
