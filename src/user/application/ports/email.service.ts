export interface EmailService {
  sendVerificationEmail(
    to: string,
    name: string,
    verificationCode: string,
  ): Promise<void>;
}

export const EMAIL_SERVICE = Symbol('EMAIL_SERVICE');
