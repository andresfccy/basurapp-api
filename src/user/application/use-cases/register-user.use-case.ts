import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { User, UserRole } from '../../domain/user.entity';
import { USER_REPOSITORY } from '../ports/user.repository';
import { EMAIL_SERVICE } from '../ports/email.service';
import type { UserRepository } from '../ports/user.repository';
import type { EmailService } from '../ports/email.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export class RegisterUserDto {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  role: UserRole;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(EMAIL_SERVICE)
    private readonly emailService: EmailService,
  ) {}

  async execute(dto: RegisterUserDto): Promise<{ userId: string }> {
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Generar código de verificación
    const verificationCode = this.generateVerificationCode();

    // Crear usuario
    const user = User.create(
      uuidv4(),
      dto.email,
      dto.firstName,
      dto.lastName,
      dto.phone,
      dto.role,
      passwordHash,
      verificationCode,
    );

    // Guardar usuario
    await this.userRepository.save(user);

    // Enviar email de verificación
    await this.emailService.sendVerificationEmail(
      user.email,
      user.displayName,
      verificationCode,
    );

    return { userId: user.id };
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
