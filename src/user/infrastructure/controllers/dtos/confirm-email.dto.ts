import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmailRequestDto {
  @ApiProperty({
    description: 'Email del usuario a verificar',
    example: 'usuario@example.com',
  })
  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @ApiProperty({
    description: 'Código de verificación de 6 dígitos recibido por email',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString({ message: 'El código debe ser un texto' })
  @Length(6, 6, { message: 'El código debe tener 6 dígitos' })
  verificationCode: string;
}
