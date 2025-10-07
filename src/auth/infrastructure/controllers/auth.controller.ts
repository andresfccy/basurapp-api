import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LoginRequestDto } from './dtos/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y devuelve un token JWT',
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'usuario@example.com',
          firstName: 'Juan',
          lastName: 'Pérez',
          role: 'basic',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas o usuario no verificado',
  })
  async login(@Body() dto: LoginRequestDto) {
    return this.loginUseCase.execute({
      email: dto.email,
      password: dto.password,
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cerrar sesión',
    description:
      'Cierra la sesión del usuario (el cliente debe eliminar el token)',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout exitoso',
    schema: {
      example: {
        message: 'Sesión cerrada exitosamente',
      },
    },
  })
  logout() {
    // En una implementación con JWT, el logout se maneja en el cliente
    // El cliente simplemente elimina el token
    // Aquí solo confirmamos que el token era válido
    return {
      message: 'Sesión cerrada exitosamente',
    };
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Validar token',
    description:
      'Valida el token JWT actual y devuelve la información del usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Token válido',
    schema: {
      example: {
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'usuario@example.com',
          firstName: 'Juan',
          lastName: 'Pérez',
          role: 'basic',
        },
      },
    },
  })
  validate(@Req() req: AuthenticatedRequest) {
    return {
      user: req.user,
    };
  }
}
