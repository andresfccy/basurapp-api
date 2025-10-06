import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { ConfirmEmailUseCase } from '../../application/use-cases/confirm-email.use-case';
import { RegisterUserRequestDto } from './dtos/register-user.dto';
import { ConfirmEmailRequestDto } from './dtos/confirm-email.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly confirmEmailUseCase: ConfirmEmailUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() dto: RegisterUserRequestDto) {
    const result = await this.registerUserUseCase.execute({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      password: dto.password,
      role: dto.role,
    });

    return {
      message: 'Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.',
      userId: result.userId,
    };
  }

  @Post('confirm-email')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async confirmEmail(@Body() dto: ConfirmEmailRequestDto) {
    await this.confirmEmailUseCase.execute({
      email: dto.email,
      verificationCode: dto.verificationCode,
    });

    return {
      message: 'Email verificado exitosamente. Ya puedes iniciar sesión.',
      success: true,
    };
  }
}
