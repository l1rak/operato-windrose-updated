import React from 'react';
import { WindroseLegendProps } from 'types';
import { roundWindBracketLabel } from 'utils/labelUtils';
import { onMouseEnterDiv, onMouseLeaveDiv } from 'utils/stylesUtils';


export const WindroseLegend = ({ bucketsSize, bucketStyles, changeStyle, windSpeedUnit, anchor, position }: WindroseLegendProps) => {

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
        let speedLabel = roundWindBracketLabel(bucketStart) + " - " + roundWindBracketLabel(bucketStart + bucketsSize);
        if(bucketStyles.length-1 === i) {speedLabel = " > "+roundWindBracketLabel(bucketStart);}
        bucketStart += bucketsSize;
        legendItems.push(<div style={{ display: 'flex' }}>{icon} {speedLabel}</div>)
    }


    let positionStyle = {};
    if(position === "right"){
        positionStyle = {
            right: "8px"
        }
    }else {
        positionStyle = {
            left: "8px"
        }
    }

    let anchorStyle = {};
    if(anchor === "top"){
        positionStyle = {
            top: "8px",
        }
    }else if(anchor === "center"){
        anchorStyle = {
            top: "50%",
            transform: "translate(0%, -50%)",
        }
    }else {
        anchorStyle = {
            bottom: "8px",
        }
    }

    return (
        <div style={{
            position: "absolute",
            ...positionStyle,
            ...anchorStyle,
            width: "150px",
            border: "4px solid #4b4c50",
            borderRadius: "16px",
            padding: "8px",

            // DATK THEME
            //background: "#4b4c50",
            //color: "white",
            background: "#f2f2f2",
            color: "black",
        }}>
            <div style={{
                justifyContent: 'center'
            }}><b>Wind speed ({windSpeedUnit})</b></div>
            {legendItems}
        </div>

    );
};
