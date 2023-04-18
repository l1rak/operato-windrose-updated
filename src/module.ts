import { PanelPlugin } from '@grafana/data';
import { WindroseOptions } from './types';
import { WindrosePanel } from './components/WindrosePanel';

export const plugin = new PanelPlugin<WindroseOptions>(WindrosePanel).setPanelOptions((builder) => {
  return builder
    /*.addTextInput({
      path: 'text',
      name: 'Simple text option',
      description: 'Description of panel option',
      defaultValue: 'Default value of text input option',
    })
    .addBooleanSwitch({
      path: 'showSeriesCount',
      name: 'Show series counter',
      defaultValue: false,
    })
    .addRadio({
      path: 'seriesCountSize',
      defaultValue: 'sm',
      name: 'Series counter size',
      settings: {
        options: [
          {
            value: 'sm',
            label: 'Small',
          },
          {
            value: 'md',
            label: 'Medium',
          },
          {
            value: 'lg',
            label: 'Large',
          },
        ],
      },
      //showIf: (config) => config.showSeriesCount,
    })*/
    .addNumberInput({
      path: 'petalsPer90Deg',
      name: 'Petals per 90 degree',
      description: 'How many petals should be per 90 degree. Total petals will be 4 times as many.',
      defaultValue: 4
    })
    .addNumberInput({
      path: 'speedBucketsCount',
      name: 'Buckets per each petal.',
      description: 'How many bucket should be per every direction bucket.',
      defaultValue: 8
    })
    /*.addBooleanSwitch({
      path: 'overwriteSpeedBucketBounds',
      name: 'Overwrite Speed Bucket Size',
      description: 'Allows user to overwrite speed buckets size. Default sizes are 7 buckets with bounds calculated based on max current wind speed.',
      defaultValue: false,
    })*/
    .addNumberInput({
      path: 'speedBucketsSize',
      name: 'Speed bucket size.',
      description: '-- SOON --.',
      defaultValue: 2
    })
    .addNumberInput({
      path: 'tooltipDecimalPlaces',
      name: 'Tooltip decimal places.',
      description: '-- SOON --.',
      defaultValue: 1
    })
    .addStringArray({
      path: 'speedBucketSizeOverwrites',
      name: 'Speed bucket overwrite',
      description: '-- SOON --',
      defaultValue: [],
      showIf: (config) => config.overwriteSpeedBucketBounds
    })
    .addSelect({
      path: 'windroseLabels',
      name: 'Windrose labels',
      defaultValue: 'compass',
      settings: {
        options: [
          {
            value: 'compass',
            label: 'Compass directions',
          },
          {
            value: 'degree',
            label: 'Degrees of rotation',
          }
        ],
      }
    })
    .addSelect({
      path: 'cardinalLabels',
      name: 'Cardinal labels',
      defaultValue: 'cardinal',
      settings: {
        options: [
          {
            value: 'cardinal',
            label: 'Cardinal directions (N,E,S,W)',
          },
          {
            value: 'ordinal',
            label: 'Ordinal directions (NE, SE, SW, NW)',
          },
          {
            value: 'intermediate',
            label: 'Intermediate directions (WNW, NNW, NNE ...)',
          },
        ],
      },
      showIf: (config) => config.windroseLabels === "compass"
    })
    .addBooleanSwitch({
      path: 'showLegend',
      name: 'Show Legend',
      defaultValue: true
    })
    .addBooleanSwitch({
      path: 'doesLegendOverlay',
      name: 'Does Legend Overlap',
      defaultValue: false,
      showIf: (config) => config.showLegend
    })
    ;
});
