<<<<<<< HEAD
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
=======
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
>>>>>>> 8148079b180250d0bca48214da621ca2b89d5e1a
}