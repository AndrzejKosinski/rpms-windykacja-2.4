import { IAuthService } from '../interfaces/IAuthService';
import { callAppsScript } from '../appsScriptClient';
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

export class AppsScriptAuthAdapter implements IAuthService {
  async loginUser(payload: LoginPayload): Promise<AuthResponse> {
    return callAppsScript('LOGIN_USER', payload);
  }

  async registerUser(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }

  async checkEmailStatus(payload: CheckEmailPayload): Promise<AuthResponse> {
    return callAppsScript('CHECK_EMAIL_STATUS', payload);
  }

  async requestPasswordReset(payload: PasswordResetRequestPayload): Promise<AuthResponse> {
    const res = await fetch('/api/auth/request-password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }

  async resetPassword(payload: PasswordResetPayload): Promise<AuthResponse> {
    return callAppsScript('RESET_PASSWORD', payload);
  }

  async activateAccount(payload: AccountActivationPayload): Promise<AuthResponse> {
    return callAppsScript('ACTIVATE_ACCOUNT', payload);
  }

  async resendActivationEmail(payload: ResendActivationPayload): Promise<AuthResponse> {
    const res = await fetch('/api/auth/resend-activation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }

  async changePassword(payload: ChangePasswordPayload): Promise<AuthResponse> {
    return callAppsScript('CHANGE_PASSWORD', payload);
  }
}
