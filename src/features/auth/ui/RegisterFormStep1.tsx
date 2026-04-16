import React from 'react';
import { motion } from 'motion/react';
import { Mail, Building2, CheckCircle2 } from 'lucide-react';
import { FormLabel } from '@/shared/ui/forms/FormLabel';
import { FormInput } from '@/shared/ui/forms/FormInput';

interface RegisterFormStep1Props {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  isEmailValid: boolean;
}

export const RegisterFormStep1: React.FC<RegisterFormStep1Props> = ({
  name,
  setName,
  email,
  setEmail,
  isEmailValid
}) => {
  return (
    <motion.div
      key="reg1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5"
    >
      <div className="space-y-2">
        <FormLabel className="ml-1">NIP firmy</FormLabel>
        <div className="relative group">
          <FormInput 
            type="text" 
            value={name}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').substring(0, 10);
              let formatted = val;
              if (val.length > 3) formatted = val.substring(0, 3) + '-' + val.substring(3);
              if (val.length > 6) formatted = val.substring(0, 3) + '-' + val.substring(3, 6) + '-' + val.substring(6);
              if (val.length > 8) formatted = val.substring(0, 3) + '-' + val.substring(3, 6) + '-' + val.substring(6, 8) + '-' + val.substring(8);
              setName(formatted);
            }}
            placeholder="897-123-45-67"
            icon={<Building2 className={`transition-colors ${name ? 'text-brand-blue' : 'text-slate-300 group-focus-within:text-brand-blue'}`} size={18} />}
            required
            rightElement={name.replace(/\D/g, '').length >= 10 ? (
              <div className="text-green-500 animate-in zoom-in duration-300">
                <CheckCircle2 size={18} />
              </div>
            ) : null}
          />
        </div>
      </div>

      <div className="space-y-2">
        <FormLabel className="ml-1">Adres Email</FormLabel>
        <div className="relative group">
          <FormInput 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@twojafirma.pl"
            icon={<Mail className={`transition-colors ${email ? 'text-brand-blue' : 'text-slate-300 group-focus-within:text-brand-blue'}`} size={18} />}
            required
            rightElement={isEmailValid ? (
              <div className="text-green-500 animate-in zoom-in duration-300">
                <CheckCircle2 size={18} />
              </div>
            ) : null}
          />
        </div>
      </div>
    </motion.div>
  );
};
