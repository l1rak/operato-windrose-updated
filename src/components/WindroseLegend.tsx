import React from 'react';
import { WindroseLegendProps } from 'types';
import { onMouseEnterDiv, onMouseLeaveDiv } from 'utils/stylesUtils';


export const WindroseLegend = ({ bucketsSize, bucketStyles, changeStyle }: WindroseLegendProps) => {

    let legendItems: Array<React.ReactElement<any>> = []

    let bucketStart = 0;

    for (let i = 0; i < bucketStyles.length; i++) {
        let icon = <div style={{
            width: "20px",
            height: "10px",
            background: bucketStyles[i].currentBucketStyle.color,
            opacity: bucketStyles[i].currentBucketStyle.opacity,
            outline: bucketStyles[i].currentStrokeStyle.strokeWidth+"px solid "+bucketStyles[i].currentStrokeStyle.stroke,
            borderRadius: "4px",
            margin: "auto",
            marginRight: "6px",
            marginLeft: "0"
        }} 
        onMouseEnter={(event)=>{onMouseEnterDiv(event, changeStyle, i)}} onMouseLeave={(event)=>{onMouseLeaveDiv(event, changeStyle, i)}} 
        />
        let speedLabel = bucketStart + " - " + (bucketStart + bucketsSize);
        if(bucketStyles.length-1 === i) {speedLabel = " > "+bucketStart;}
        bucketStart += bucketsSize;
        legendItems.push(<div style={{ display: 'flex' }}>{icon} {speedLabel}</div>)
    }

    return (
        <div style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            width: "150px",
            border: "3px solid #dddddd",
            borderRadius: "4px",
            padding: "4px",

            background: "white",
            color: "black",
        }}>
            <div style={{
                justifyContent: 'center'
            }}>Wind speed (m/s)</div>
            {legendItems}
        </div>

    );
};
