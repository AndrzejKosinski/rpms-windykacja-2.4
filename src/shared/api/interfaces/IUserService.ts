export interface IUserService {
  /**
   * Weryfikuje status konta użytkownika na podstawie adresu e-mail.
   * Zapewnia izolację między logiką aplikacji a fizycznym źródłem danych (GAS / Baza danych).
   * 
   * @param email Adres e-mail do weryfikacji
   * @returns Obiekt zawierający informacje o istnieniu konta i jego aktywności (EmailVerified)
   */
  checkUserStatus(email: string): Promise<{
    exists: boolean;
    isActive: boolean;
  }>;
}
