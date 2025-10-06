import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { USER_REPOSITORY } from '../ports/user.repository';
import type { UserRepository } from '../ports/user.repository';

export class ConfirmEmailDto {
  email: string;
  verificationCode: string;
}

@Injectable()
export class ConfirmEmailUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(dto: ConfirmEmailDto): Promise<{ success: boolean }> {
    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar si ya está verificado
    if (user.isEmailVerified()) {
      throw new BadRequestException('El email ya está verificado');
    }

    // Validar código
    if (!user.isVerificationCodeValid(dto.verificationCode)) {
      throw new BadRequestException(
        'Código de verificación inválido o expirado',
      );
    }

    // Marcar como verificado
    const verifiedUser = user.markAsVerified();
    await this.userRepository.update(verifiedUser);

    return { success: true };
  }
}
