import React, {useState} from 'react';
import { PanelProps } from '@grafana/data';
import { SpeedBucketStyle, WindroseOptions } from 'types';
import { css, cx } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { Windrose } from './Windrose';
import {createColorMap, highlightColor} from '../utils/colorUtils'
import { calculateWindroseData, extractData } from 'utils/dataUtils';

interface WindrosePanelProps extends PanelProps<WindroseOptions> { }

const getStyles = () => {
  return {
    wrapper: css`
      font-family: Open Sans;
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
    windrose__background: css`
      color: white;
    `,
  };
};

export const WindrosePanel: React.FC<WindrosePanelProps> = ({ options, data, width, height }) => {
  const styles = useStyles2(getStyles);

  let colorCheckpoints = [
    "#193e61", "#5c0615"
  ]
  let colorBar = createColorMap(colorCheckpoints, options.speedBucketsCount);


  let constructingSpeedBucketStyles = Array<SpeedBucketStyle>(options.speedBucketsCount);
  for (let i = 0; i < constructingSpeedBucketStyles.length; i++) {
    let highlightedColor = highlightColor(colorBar[i], 3);
    let idleBucketStyle = {
      color: colorBar[i],
      opacity: 1
    }
    let selectedBucketStyle = {
      color: highlightedColor,
      opacity: 1
    }
    constructingSpeedBucketStyles[i] = {
      idleBucketStyle: idleBucketStyle,
      selectedBucketStyle: selectedBucketStyle,
      currentBucketStyle: idleBucketStyle      
    };    
  }
  const [bucketStyles, setBucketStyles] = useState(constructingSpeedBucketStyles);

  let windData = calculateWindroseData(extractData(data), options.petalsPer90Deg, options.speedBucketsCount, options.speedBucketsSize)

  const windroseRadius = Math.min(height, width) / 2 - 64;
  const windroseCenter = { x: width / 2, y: height / 2 }

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <Windrose 
        width={width} height={height} radius={windroseRadius} center={windroseCenter} 
          data={windData} bucketsCount={options.petalsPer90Deg} 
          styles={bucketStyles} changeStyle={setBucketStyles}/>

    </div>
  );
};
