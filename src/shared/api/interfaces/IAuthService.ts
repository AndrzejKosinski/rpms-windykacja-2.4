import { 
  LoginPayload, 
  RegisterPayload, 
  CheckEmailPayload, 
  AuthResponse,
  PasswordResetRequestPayload,
  PasswordResetPayload,
  AccountActivationPayload,
  ResendActivationPayload,
  ChangePasswordPayload
} from '../../types/auth';

export interface IAuthService {
  loginUser(payload: LoginPayload): Promise<AuthResponse>;
  registerUser(payload: RegisterPayload): Promise<AuthResponse>;
  checkEmailStatus(payload: CheckEmailPayload): Promise<AuthResponse>;
  
  // Autoryzacja 2.0
  requestPasswordReset(payload: PasswordResetRequestPayload): Promise<AuthResponse>;
  resetPassword(payload: PasswordResetPayload): Promise<AuthResponse>;
  activateAccount(payload: AccountActivationPayload): Promise<AuthResponse>;
  resendActivationEmail(payload: ResendActivationPayload): Promise<AuthResponse>;
  changePassword(payload: ChangePasswordPayload): Promise<AuthResponse>;
}
