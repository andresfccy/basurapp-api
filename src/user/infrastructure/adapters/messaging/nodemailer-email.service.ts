import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailService } from '../../../application/ports/email.service';

@Injectable()
export class NodemailerEmailService implements EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE', false),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendVerificationEmail(
    to: string,
    name: string,
    verificationCode: string,
  ): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>(
        'SMTP_FROM',
        'noreply@basurapp.com',
      ),
      to,
      subject: 'Verificación de correo electrónico - BasurApp',
      html: this.getVerificationEmailTemplate(name, verificationCode),
    };

    await this.transporter.sendMail(mailOptions);
  }

  private getVerificationEmailTemplate(
    name: string,
    verificationCode: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #22c55e; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .code { background-color: #fff; border: 2px dashed #22c55e; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Bienvenido a BasurApp!</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${name}</strong>,</p>
              <p>Gracias por registrarte en BasurApp. Para completar tu registro, por favor verifica tu correo electrónico usando el siguiente código:</p>
              <div class="code">${verificationCode}</div>
              <p>Este código es válido por <strong>24 horas</strong>.</p>
              <p>Si no solicitaste este registro, puedes ignorar este correo.</p>
              <p>Saludos,<br>El equipo de BasurApp</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} BasurApp. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
