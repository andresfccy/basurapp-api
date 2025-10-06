import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { ConfirmEmailUseCase } from '../../application/use-cases/confirm-email.use-case';
import { RegisterUserRequestDto } from './dtos/register-user.dto';
import { ConfirmEmailRequestDto } from './dtos/confirm-email.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly confirmEmailUseCase: ConfirmEmailUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description:
      'Registra un nuevo usuario en el sistema y envía un código de verificación por email',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    schema: {
      example: {
        message:
          'Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.',
        userId: '123e4567-e89b-12d3-a456-426614174000',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'El email ya está registrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
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
      message:
        'Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.',
      userId: result.userId,
    };
  }

  @Post('confirm-email')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({
    summary: 'Confirmar email',
    description:
      'Confirma el email del usuario con el código de verificación de 6 dígitos recibido por correo',
  })
  @ApiResponse({
    status: 200,
    description: 'Email verificado exitosamente',
    schema: {
      example: {
        message: 'Email verificado exitosamente. Ya puedes iniciar sesión.',
        success: true,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Código de verificación inválido o expirado',
  })
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
