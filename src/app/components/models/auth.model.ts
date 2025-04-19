// src/app/models/auth.model.ts
export interface LoginResponse {
    token: string;
    user?: {
      id: string;
      email: string;
      userType: string;
    };
}

export interface RegistrationResponse {
    success: boolean;
    message: string;
    userId?: string;
    token?: string;  // Added optional token property
}

export interface ApiError {
    status: number;
    message: string;
}