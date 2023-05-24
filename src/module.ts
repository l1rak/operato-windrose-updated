import { PanelPlugin } from '@grafana/data';
import { WindroseOptions } from './types';
import { WindrosePanel } from './components/WindrosePanel';

export const plugin = new PanelPlugin<WindroseOptions>(WindrosePanel).setPanelOptions((builder) => {
  return builder 
    .addSelect({
      path: 'colorPalette',
      name: 'Color palette',
      description: 'Color palette of speed buckets.',
      defaultValue: 'default',
      settings: {
        options: [   
          {
            value: 'default',
            label: 'Default',
          },   
          {
            value: 'operato',
            label: 'Operato theme',
          },  
          {
            value: 'greenred',
            label: 'Green-red',
          },    
          {
            value: 'bluered',
            label: 'Blue-red',
          },    
          {
            value: 'grayscale',
            label: 'Gray scale',
          },    
          {
            value: 'redscale',
            label: 'Red scale',
          },     
          {
            value: 'bluescale',
            label: 'Blue scale',
          }
        ],
      }
    })
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
      path: 'windSpeedUnit',
      name: 'Wind speed unit',
      description: 'What measurement unit will be used in legend and tooltip. !IMPORTANT! This will not convert values.',
      defaultValue: 'ms',
      settings: {
        options: [
          {
            value: 'ms',
            label: 'Meters per second (m/s)',
          },          
          {
            value: 'kmh',
            label: 'Kilometers per hour (km/h)',
          },         
          {
            value: 'mps',
            label: 'Miles per hour (mph)',
          },         
          {
            value: 'ftps',
            label: 'Feet per second (ft/s)',
          },         
          {
            value: 'kt',
            label: 'Knots (kt)',
          },
        ],
      }
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
