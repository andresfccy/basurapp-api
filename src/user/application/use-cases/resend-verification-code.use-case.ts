import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { USER_REPOSITORY } from '../ports/user.repository';
import type { UserRepository } from '../ports/user.repository';
import { EMAIL_SERVICE } from '../ports/email.service';
import type { EmailService } from '../ports/email.service';
import { UserStatus } from '../../domain/user.entity';

export interface ResendVerificationCodeDto {
  email: string;
}

@Injectable()
export class ResendVerificationCodeUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(EMAIL_SERVICE)
    private readonly emailService: EmailService,
  ) {}

  async execute(dto: ResendVerificationCodeDto): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.status === UserStatus.ACTIVE) {
      throw new BadRequestException('El usuario ya está verificado');
    }

    // Generar nuevo código de verificación
    const newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Actualizar el código en la base de datos
    await this.userRepository.updateVerificationCode(user.id, newVerificationCode);

    // Enviar email con el nuevo código
    await this.emailService.sendVerificationEmail(
      user.email,
      `${user.firstName} ${user.lastName}`,
      newVerificationCode,
    );

    return {
      message: 'Código de verificación enviado exitosamente',
    };
  }
}
