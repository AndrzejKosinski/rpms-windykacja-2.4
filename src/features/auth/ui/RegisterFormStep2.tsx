import React from 'react';
import { motion } from 'motion/react';
import { Lock, CheckCircle2, Check } from 'lucide-react';
import { FormLabel } from '@/shared/ui/forms/FormLabel';
import { FormInput } from '@/shared/ui/forms/FormInput';

interface Requirement {
  id: string;
  label: string;
  met: boolean;
}

interface RegisterFormStep2Props {
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  requirements: Requirement[];
  allMet: boolean;
  passwordsMatch: boolean;
}

export const RegisterFormStep2: React.FC<RegisterFormStep2Props> = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  requirements,
  allMet,
  passwordsMatch
}) => {
  return (
    <motion.div
      key="reg2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5"
    >
      <div className="space-y-2">
        <FormLabel className="ml-1">Hasło</FormLabel>
        <div className="relative group">
          <FormInput 
            type="password" 
            name="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={<Lock className={`transition-colors ${password ? 'text-brand-blue' : 'text-slate-300 group-focus-within:text-brand-blue'}`} size={18} />}
            required
            rightElement={allMet ? (
              <div className="text-green-500 animate-in zoom-in duration-300">
                <CheckCircle2 size={18} />
              </div>
            ) : null}
          />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 px-1">
          {requirements.map(req => (
            <div key={req.id} className={`flex items-center gap-1.5 text-[10px] font-bold ${req.met ? 'text-emerald-500' : 'text-slate-400'}`}>
              {req.met ? <Check size={10} strokeWidth={3} className="shrink-0" /> : <div className="w-2.5 h-2.5 rounded-full border border-slate-300 shrink-0" />}
              {req.label}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <FormLabel className="ml-1">Powtórz hasło</FormLabel>
        <div className="relative group">
          <FormInput 
            type="password" 
            name="confirmPassword"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            icon={<Lock className={`transition-colors ${confirmPassword ? 'text-brand-blue' : 'text-slate-300 group-focus-within:text-brand-blue'}`} size={18} />}
            error={confirmPassword && !passwordsMatch ? 'Hasła nie są identyczne' : undefined}
            required
            rightElement={passwordsMatch ? (
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
