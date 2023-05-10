import { PanelPlugin } from '@grafana/data';
import { WindroseOptions } from './types';
import { WindrosePanel } from './components/WindrosePanel';

export const plugin = new PanelPlugin<WindroseOptions>(WindrosePanel).setPanelOptions((builder) => {
  return builder
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
    .addNumberInput({
      path: 'speedBucketsSize',
      name: 'Speed bucket size.',
      description: 'Sets the size of each speed bucket (in m/s).',
      defaultValue: 2
    })
    .addNumberInput({
      path: 'tooltipDecimalPlaces',
      name: 'Tooltip decimal places.',
      description: 'How many decimal places should be displayed in tooltip.',
      defaultValue: 1
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
