
export function getWindSpeedUnitLabel(menuOption: string) {
    switch (menuOption) {
        case "ms": return "m/s";
        case "kmh": return "km/h";
        case "mps": return "mph";
        case "ftps": return "ft/s";
        case "kt": return "kt";    
        default: return "N/A";
    }
}

export function roundWindBracketLabel(speed: number) {
    return Math.round(speed*100)/100
}
