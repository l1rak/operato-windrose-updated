import { clamp255, lerpNumber } from "./mathUtils";

export function rgbToHsv(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, v = max;

    let d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return [h, s, v];
}


export function hsvToRgb(h: number, s: number, v: number) {
    let r = 0, g = 0, b = 0;

    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }

    return [r * 255, g * 255, b * 255];
}

export function rgbToHex(r: number, g: number, b: number) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function hexToRgb(hex: string, result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)) {
    return result ? result.map(i => parseInt(i, 16)).slice(1) : [0,0,0]
}

export function highlightColor(color: string, percentHighlight: number){
    let [r,g,b] = hexToRgb(color);
    let [h,s,v] = rgbToHsv(r,g,b);
    v = Math.max(0, Math.min(1, v*(1+percentHighlight/2)))
    s = Math.max(0, Math.min(1, s*(1+percentHighlight)))
    let [_r,_g,_b] = hsvToRgb(h,s,v);
    return rgbToHex(
        clamp255(Math.floor(_r)),
        clamp255(Math.floor(_g)),
        clamp255(Math.floor(_b)));
}

export function colorLerp(c1: number[], c2: number[], t: number) {
    return [
        Math.floor(lerpNumber(c1[0], c2[0], t)),
        Math.floor(lerpNumber(c1[1], c2[1], t)),
        Math.floor(lerpNumber(c1[2], c2[2], t))
    ];
}

export function createColorMap(colorCheckpointHexes: string[], numberOfBuckets: number) {
    let colorCheckpoints = new Array<number[]>(0);
    colorCheckpointHexes.forEach((hexValue) =>{ colorCheckpoints.push(hexToRgb(hexValue)); })
    let lerpedColorHashes = new Array<string>(0);
    
    let checkpointCount = colorCheckpointHexes.length;
    let t_diff = 1/(checkpointCount-1)
    for(let i = 0; i < numberOfBuckets-1; i++){
        let t = i/(numberOfBuckets-1);
        let idx1 = Math.floor(t/t_diff);
        let idx2 = Math.min(idx1+1, (checkpointCount-1));
        let t1 = (t%t_diff)/t_diff;
        let lerpedColor = colorLerp(colorCheckpoints[idx1], colorCheckpoints[idx2], t1);
        lerpedColorHashes.push(rgbToHex(lerpedColor[0],lerpedColor[1],lerpedColor[2]));
    }
    lerpedColorHashes.push(colorCheckpointHexes[colorCheckpointHexes.length-1])
    return lerpedColorHashes;
}
