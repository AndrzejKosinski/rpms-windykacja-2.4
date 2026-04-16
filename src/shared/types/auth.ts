export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  email: string;
  password?: string;
  name?: string;
  role?: string;
  updateExistingCases?: boolean;
}

export interface CheckEmailPayload {
  email: string;
}

export interface AuthResponse {
  status: 'success' | 'error' | 'STATUS_ACTIVE' | 'STATUS_LEAD' | 'STATUS_NEW';
  message?: string;
  user?: Record<string, any>; // We can type this better later if needed
  token?: string;
  exists?: boolean;
  isRegistered?: boolean;
}

export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetPayload {
  token: string;
  newPassword: string;
}

export interface AccountActivationPayload {
  token: string;
}

export interface ResendActivationPayload {
  email: string;
}

export interface ChangePasswordPayload {
  email: string;
  currentPassword?: string;
  newPassword?: string;
}
