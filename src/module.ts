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
    .addBooleanSwitch({
      path: 'overwriteSpeedBucketBounds',
      name: 'Overwrite Speed Bucket Size',
      description: 'Allows user to overwrite speed buckets size. Default sizes are 7 buckets with bounds calculated based on max current wind speed.',
      defaultValue: false,
    })
    .addNumberInput({
      path: 'speedBucketsSize',
      name: 'Speed bucket size.',
      description: '-- SOON --.',
      defaultValue: 2,
      showIf: (config) => config.overwriteSpeedBucketBounds
    })
    .addStringArray({
      path: 'speedBucketSizeOverwrites',
      name: 'Speed bucket overwrite',
      description: '-- SOON --',
      defaultValue: [],
      showIf: (config) => config.overwriteSpeedBucketBounds
    });
});
