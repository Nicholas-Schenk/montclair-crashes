export interface CrashData {
    position: CrashPosition;
    severity: string
    id: string
    date: string
    description: string
    placeDescription: string
    source?: string;
    newsLink?: string;
}

export interface CrashPosition {
    latitude: number;
    longitude: number
}