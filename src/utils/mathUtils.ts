
export function lerpNumber(n1: number, n2: number, t: number) {
    let diff = n2 - n1;
    return n1+diff*t;
}

export function clamp01(n: number){
    return Math.max(0, Math.min(1, n));
}
export function clamp255(n: number){
    return Math.max(0, Math.min(255, n));
}
