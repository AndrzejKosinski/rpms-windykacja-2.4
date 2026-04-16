import React from 'react';
import { X } from 'lucide-react';
import { LoggedInUser } from '../../../context/AppContext';
import { ModalType } from '../../../context/ModalContext';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

interface AuthModalsProps {
  activeModal: ModalType;
  onClose: () => void;
  onSwitch: (type: ModalType) => void;
  onLoginSuccess: (user: LoggedInUser) => void;
  authData: any;
}

const AuthModals: React.FC<AuthModalsProps> = ({ activeModal, onClose, onSwitch, onLoginSuccess, authData }) => {
  if (activeModal !== 'login' && activeModal !== 'register' && activeModal !== 'forgot-password') return null;

  const isLogin = activeModal === 'login';
  const isForgot = activeModal === 'forgot-password';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className={`bg-white w-full ${isLogin || isForgot ? 'max-w-[500px]' : 'max-w-5xl h-[720px]'} rounded-[var(--radius-brand-card)] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col lg:flex-row`}>
        <button 
          onClick={onClose}
          className={`absolute top-6 right-6 p-2 rounded-full transition-all z-20 shadow-sm border ${
            isLogin || isForgot
            ? 'bg-slate-50/50 border-slate-100 text-slate-400 hover:bg-slate-100 hover:text-brand-navy' 
            : 'bg-white/10 backdrop-blur-md border-white/20 text-white/60 hover:bg-white/20 hover:text-white'
          }`}
        >
          <X size={20} />
        </button>

        {isLogin && (
          <div className="w-full p-8 lg:p-12 relative flex flex-col h-full">
            <LoginForm onSwitch={onSwitch} onLoginSuccess={onLoginSuccess} authData={authData} />
          </div>
        )}

        {isForgot && (
          <div className="w-full p-8 lg:p-12 relative flex flex-col h-full">
            <ForgotPasswordForm onSwitch={onSwitch} />
          </div>
        )}

        {!isLogin && !isForgot && (
          <RegisterForm onSwitch={onSwitch} onLoginSuccess={onLoginSuccess} />
        )}
      </div>
    </div>
  );
};

export default AuthModals;
