export interface User {
    id: string;
    phoneNumber: string;
    createdAt: Date;
}

export interface SoilData {
    id: string;
    userId: string;
    ph: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    createdAt: Date;
}

export interface RecommendationResponse {
    recommendations: string[];
}

export type Language = 'en' | 'hi' | 'ta';
