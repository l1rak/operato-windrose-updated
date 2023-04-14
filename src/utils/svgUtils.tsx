import React from "react";
import { Vector2 } from "types";



export function constructCakeSlice(centerAngle: number, angleOffset: number, circleCenter: Vector2, startRadius: number, endRadius: number): string {
    let polypoint = "";

    let leftAngle = centerAngle - angleOffset / 2;
    let rightAngle = centerAngle + angleOffset / 2;

    let leftLowX = Math.cos(leftAngle) * startRadius + circleCenter.x
    let leftLowY = Math.sin(leftAngle) * startRadius + circleCenter.y;
    let leftHighX = Math.cos(leftAngle) * endRadius + circleCenter.x
    let leftHighY = Math.sin(leftAngle) * endRadius + circleCenter.y;
    polypoint += leftLowX + "," + leftLowY + " "
    polypoint += leftHighX + "," + leftHighY + " "

    let degree = Math.PI / 180;
    for (let i = degree; i < angleOffset; i += degree) {
        let pointX = Math.cos(i + leftAngle) * endRadius + circleCenter.x
        let pointY = Math.sin(i + leftAngle) * endRadius + circleCenter.y;
        polypoint += pointX + "," + pointY + " "
    }

    let righttLowX = Math.cos(rightAngle) * startRadius + circleCenter.x;
    let righttLowY = Math.sin(rightAngle) * startRadius + circleCenter.y;
    let rightHighX = Math.cos(rightAngle) * endRadius + circleCenter.x;
    let rightHighY = Math.sin(rightAngle) * endRadius + circleCenter.y;
    polypoint += rightHighX + "," + rightHighY + " "
    polypoint += righttLowX + "," + righttLowY + " "

    for (let i = degree; i < angleOffset; i += degree) {
        let pointX = Math.cos(rightAngle - i) * startRadius + circleCenter.x
        let pointY = Math.sin(rightAngle - i) * startRadius + circleCenter.y;
        polypoint += pointX + "," + pointY + " "
    }

    return polypoint;
}

export function createPetalLine(angle: number, radius: number, center: Vector2, isBold: boolean, isDashed: boolean) {
    let innerCircleX = center.x + Math.cos(angle) * radius * .1;
    let outerCircleX = center.x + Math.cos(angle) * radius;
    let innerCircleY = center.y + Math.sin(angle) * radius * .1;
    let outerCircleY = center.y + Math.sin(angle) * radius;
    return (<line x1= { innerCircleX } y1 = { innerCircleY } x2 = { outerCircleX } y2 = { outerCircleY } strokeWidth = { isBold? 4: 1 } stroke = '#222222' strokeDasharray={isDashed ? "2,5" : "" }/>);
}
