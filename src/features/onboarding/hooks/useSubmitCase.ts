import { useOnboardingContext } from '../ui/OnboardingContext';
import { logCustomEvent } from '../../../utils/customLogger';
import { authService } from '@/shared/api/apiClientFactory';

export const useSubmitCase = (onComplete: (user: any) => void) => {
  const { 
    data, setData, 
    fileQueue, 
    setIsSubmitting, 
    setLoginError, 
    setUserStatus, 
    setStep 
  } = useOnboardingContext();

  const handleSubmitCase = async (e: React.FormEvent) => {
    e.preventDefault();
    const completedItems = fileQueue.filter(it => it.status === 'completed');
    
    if (!data.isManual && completedItems.length === 0) {
      alert("Brak poprawnie zweryfikowanych dokumentów.");
      return;
    }

    setIsSubmitting(true);
    setLoginError(null);
    try {
      if (data.password) {
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: data.email, 
            password: data.password 
          })
        });

        if (!loginRes.ok) {
          setLoginError("Nieprawidłowy e-mail lub hasło. Spróbuj ponownie.");
          setData(prev => ({ ...prev, password: '' }));
          setIsSubmitting(false);
          return;
        }
        
        await loginRes.json();
        setUserStatus('AUTHENTICATED');
        logCustomEvent({ event_name: 'onboarding_login_success', user_email: data.email });
      }

      let itemsToSubmit = data.isManual ? [{
        nip: data.debtorName.replace(/\D/g, ''),
        debtorName: data.debtorName,
        amount: data.amount,
        dueDate: data.dueDate,
        issueDate: "",
        invoiceNumber: "",
        description: "",
        address: "Dane wprowadzone ręcznie",
        fileData: null,
        fileType: null,
        fileName: null
      }] : completedItems.map(it => it.extractedData);

      const resultRes = await fetch('/api/cases/batch-init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: data.email,
          userName: data.email.split('@')[0],
          items: itemsToSubmit,
          isManual: data.isManual
        })
      });

      const result = await resultRes.json();

      if (result.status === 'success') {
        if (data.password) setUserStatus('AUTHENTICATED');
        setStep('thanks');
      } else {
        alert(result.message || "Błąd wysyłki zgłoszenia.");
      }
    } catch (err: any) {
      console.error("Błąd wysyłki:", err);
      alert(err.message || "Wystąpił nieoczekiwany błąd podczas przetwarzania zgłoszenia.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalizeAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const nip = formData.get('nip') as string;
    const password = formData.get('password') as string;
    try {
      await authService.registerUser({ 
        email: data.email, 
        password: password, 
        name: nip, 
        role: 'Konto Aktywne', 
        updateExistingCases: true 
      });

      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: password, name: nip, role: 'Konto Aktywne' })
      });
    } catch (err) {
      console.error("Błąd rejestracji:", err);
    }
    setIsSubmitting(false);
    onComplete({ email: data.email, name: nip, role: 'Konto Aktywne' });
  };

  return { handleSubmitCase, handleFinalizeAccount };
};
